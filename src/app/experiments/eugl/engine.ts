import { easings } from '@react-spring/web'
import {
  BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  RawShaderMaterial,
  Scene,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three'

const DEFAULT_VERTEX_SHADER = `
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;

varying vec2 uvFrag;
varying float zVal;

void main() {
  vec3 pos = offset + position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  uvFrag = uv;
  zVal = gl_Position.z;
}
`

const DEFAULT_FRAGMENT_SHADER = `
precision highp float;

uniform float opacity;
uniform sampler2D texture;

varying vec2 uvFrag;
varying float zVal;

void main() {
  gl_FragColor = texture2D(texture, uvFrag);
  gl_FragColor.a *= opacity * clamp((110.0 - zVal) / 20.0, 0.0, 1.0);
}
`

const calculateMax = (width: number, height: number) => width + height

const prepareGeometry = (width: number, height: number) => {
  const max = calculateMax(width, height)
  const geometry = new InstancedBufferGeometry()
  const nEucl = max * 5
  geometry.name = 'da-geometry'
  geometry.instanceCount = nEucl

  // Plano compuesto por dos caras triangulares
  const vertices = new BufferAttribute(new Float32Array([
    -1,
    1,
    0,
    -1,
    -1,
    0,
    1,
    1,
    0,
    -1,
    -1,
    0,
    1,
    -1,
    0,
    1,
    1,
    0,
  ]), 3)
  geometry.setAttribute('position', vertices)

  // Las coordenadas UV para texturas
  const uv = new BufferAttribute(new Float32Array([
    0,
    1,
    0,
    0,
    1,
    1,
    0,
    0,
    1,
    0,
    1,
    1,
  ]), 2)
  geometry.setAttribute('uv', uv)

  // Creamos nEucl posiciones aleatorias
  const positions = new InstancedBufferAttribute(new Float32Array(nEucl * 3), 3, true, 1)
  let espacio = []
  for (let i = 0; i < nEucl; i += 1) {
    espacio.push(new Vector3(
      Math.random() * (width / 20) - width / 40,
      Math.random() * (height / 20) - height / 40,
      -Math.random() * max,
    ))
  }

  // Los ordenamos de lejos a cerca para evitar un mal rendering
  espacio = espacio.toSorted((a, b) => Math.sign(Math.round(b.lengthSq() - a.lengthSq())))
  // Los guardamos en la GPU
  for (let i = 0; i < nEucl; i += 1) {
    positions.setXYZ(i, espacio[i].x, espacio[i].y, espacio[i].z)
  }
  geometry.setAttribute('offset', positions)

  return geometry
}

const prepareMaterial = (defaultTexture: Texture) => {
  const material = new RawShaderMaterial({
    name: 'da-material',
    uniforms: {
      opacity: { value: 1.0 },
      texture: { value: defaultTexture },
    },
    transparent: true,
    vertexShader: DEFAULT_VERTEX_SHADER,
    fragmentShader: DEFAULT_FRAGMENT_SHADER,
  })
  return material
}

const prepareMesh = (geometry: InstancedBufferGeometry, material: RawShaderMaterial) => {
  const plane = new Mesh(geometry, material)
  plane.name = 'da-mesh'
  // Asi no desaparece el tema
  plane.frustumCulled = false
  return plane
}

const textureLoader = new TextureLoader()
const prepareTextures = async () => {
  const [
    euklid,
    doge,
    melchor,
    pato,
    falloutPipboy,
    thincc,
  ] = await Promise.all([
    textureLoader.loadAsync('/img/eu/euklid.png'),
    textureLoader.loadAsync('/img/eu/doge.png'),
    textureLoader.loadAsync('/img/eu/melchor.png'),
    textureLoader.loadAsync('/img/eu/pato.png'),
    textureLoader.loadAsync('/img/eu/fallout-pipboy.png'),
    textureLoader.loadAsync('/img/eu/thincc.png'),
  ])

  euklid.name = 'euklid'
  doge.name = 'doge'
  melchor.name = 'melchor'
  pato.name = 'pato'
  falloutPipboy.name = 'falloutPipboy'
  thincc.name = 'thincc'

  const textures = {
    euklid,
    doge,
    melchor,
    pato,
    falloutPipboy,
    thincc,
    custom: null as Texture | null,
  }
  return textures
}

const prepareContext = (container: HTMLElement) => {
  const renderer = new WebGLRenderer({
    alpha: true,
    depth: true,
    powerPreference: 'low-power',
    precision: 'mediump',
  })

  // configure opengl context
  const gl = renderer.getContext()
  gl.enable(gl.CULL_FACE)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  // configure canvas
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.top = '0'
  renderer.domElement.style.left = '0'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'

  // add canvas into container
  container.appendChild(renderer.domElement)

  return renderer
}

const prepareScene = (width: number, height: number, defaultTexture: Texture) => {
  const scene = new Scene()

  const geometry = prepareGeometry(width, height)
  const material = prepareMaterial(defaultTexture)
  const mesh = prepareMesh(geometry, material)
  scene.add(mesh)

  return scene
}

const prepareCamera = (width: number, height: number) => (
  new PerspectiveCamera(45, width / height, 0.1, 110)
)

const prepareResizeObserver = (
  container: HTMLElement,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
) => {
  const resizeObserver = new ResizeObserver(([el]) => {
    const { height, width } = el.contentRect
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  })
  resizeObserver.observe(container, { box: 'content-box' })
  return resizeObserver
}

const registerEventHandlers = (
  canvas: HTMLCanvasElement,
  start: () => void,
  stop: () => void,
  setTexture: (name: keyof PromiseResolvedType<ReturnType<typeof prepareTextures>>) => void,
  setMoveSpeed: (moveSpeed: number) => void,
) => {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'KeyW' || e.code === 'ArrowUp') {
      setMoveSpeed(-25 * ((+e.shiftKey + 1) / (+e.ctrlKey + 1)))
    } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
      setMoveSpeed(25 * ((+e.shiftKey + 1) / (+e.ctrlKey + 1)))
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Digit1') {
      setTexture('euklid')
    } else if (e.code === 'Digit2') {
      setTexture('falloutPipboy')
    } else if (e.code === 'Digit3') {
      setTexture('pato')
    } else if (e.code === 'Digit4') {
      setTexture('melchor')
    } else if (e.code === 'Digit5') {
      setTexture('thincc')
    } else if (e.code === 'Digit6') {
      setTexture('doge')
    } else if (e.code === 'Digit7') {
      setTexture('euklid')
    } else if (e.code === 'Digit8') {
      setTexture('euklid')
    } else if (e.code === 'Digit9') {
      setTexture('custom')
    } else if (e.code === 'Digit0') {
      setTexture('euklid')
    } else if (e.code === 'KeyF') {
      if (document.fullscreenElement) {
        void document.exitFullscreen()
      } else {
        const container = canvas.parentElement!
        void container.requestFullscreen({ navigationUI: 'hide' })
      }
    } else if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'KeyS' || e.code === 'ArrowDown') {
      setMoveSpeed(0)
    }
  }

  window.addEventListener('blur', stop, false)
  window.addEventListener('focus', start, false)
  window.addEventListener('keydown', onKeyDown, false)
  window.addEventListener('keyup', onKeyUp, false)
  return () => {
    window.removeEventListener('blur', stop, false)
    window.removeEventListener('focus', start, false)
    window.removeEventListener('keydown', onKeyDown, false)
    window.removeEventListener('keyup', onKeyUp, false)
  }
}

const moveStuff = (
  delta: number,
  scene: Scene,
  camera: PerspectiveCamera,
  width: number,
  height: number,
  speed: number = -25,
) => {
  const z = -camera.position.z
  const max = calculateMax(width, height)
  const mesh = scene.getObjectByName('da-mesh') as ReturnType<typeof prepareMesh>

  let opacity = 1

  if (z >= -5 && z < 50) {
    opacity = easings.easeInCubic(z / 50)
  } else if (z > max - 50 && z <= width + height + 50) {
    opacity = easings.easeOutCubic((max - z) / 50)
  } else if (z > max + 50) {
    camera.position.z = 5
    opacity = 0
  } else if (z < -5) {
    camera.position.z = -(max + 50)
  }

  mesh.material.uniforms.opacity.value = Math.max(0, opacity)
  mesh.material.uniformsNeedUpdate = true
  camera.position.z += delta * speed
}

const createEngine = async (container: HTMLElement, manual: boolean) => {
  const width = container.clientWidth
  const height = container.clientHeight

  const textures = await prepareTextures()
  const scene = prepareScene(width, height, textures.euklid)
  const camera = prepareCamera(width, height)
  const renderer = prepareContext(container)
  const resizeObserver = prepareResizeObserver(container, camera, renderer)

  let loopHandle: ReturnType<typeof requestAnimationFrame> | null = null
  let lastTime: number | null = null
  let moveSpeed = 0

  const loop = (time: number) => {
    if (lastTime === null) {
      lastTime = time - 1 / 60
    }

    const delta = (time - lastTime) / 1000
    lastTime = time

    moveStuff(
      delta,
      scene,
      camera,
      width,
      height,
      manual ? moveSpeed : undefined,
    )

    renderer.render(scene, camera)

    if (loopHandle != null) {
      loopHandle = requestAnimationFrame(loop)
    }
  }

  const start = () => {
    loopHandle = requestAnimationFrame(loop)
  }

  const stop = () => {
    if (loopHandle != null) {
      cancelAnimationFrame(loopHandle)
      loopHandle = null
      lastTime = null
    }
  }

  const setCustomTexture = async (url: string) => {
    const texture = await textureLoader.loadAsync(url)
    textures.custom = texture
    setTexture('custom')
  }

  const setTexture = (name: keyof typeof textures) => {
    const mesh = scene.getObjectByName('da-mesh') as ReturnType<typeof prepareMesh> | undefined
    if (mesh) {
      mesh.material.uniforms.texture.value = textures[name]
      mesh.material.uniformsNeedUpdate = true
    }
  }

  const setMoveSpeed = (speed: number) => {
    moveSpeed = speed
  }

  const unregisterEventHandler = registerEventHandlers(
    renderer.domElement,
    start,
    stop,
    setTexture,
    setMoveSpeed,
  )

  const destroy = () => {
    unregisterEventHandler()
    stop()
    resizeObserver.disconnect()
    container.removeChild(renderer.domElement)
    renderer.dispose()
  }

  // compile shaders in background
  await renderer.compileAsync(scene, camera)

  // do not start immediatly, rather wait a bit
  setTimeout(start)

  return Object.freeze({
    destroy,
    setCustomTexture,
  })
}

export default createEngine
