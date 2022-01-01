import React from 'react'
import Cropper from 'react-cropper'
import { Helmet } from 'react-helmet'
import { withTranslation, WithTranslation } from 'react-i18next'
import * as THREE from 'three'

import * as toast from '../lib/toast'
import { getAssetUrl } from '../lib/url'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'cropperjs/dist/cropper.css'

function sleep(time: number) {
  return new Promise<void>((accept) => {
    setTimeout(() => accept(), time * 1000)
  })
}

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

interface EuglState {
  z: number
  opacity: number
  fps: number
  someDataZIndex: number
  imageToCrop: string | null
  videoFromCamera: MediaStream | null
  videoCaptureText: string
}

class EuglPage extends React.Component<WithTranslation, EuglState> {
  private width: number = NaN

  private height: number = NaN

  private readonly scene: THREE.Scene

  private camera: THREE.PerspectiveCamera

  private readonly renderer: THREE.WebGLRenderer

  private readonly textureLoader: THREE.TextureLoader

  private readonly geometry: THREE.InstancedBufferGeometry

  private material: THREE.RawShaderMaterial

  private readonly containerRef = React.createRef<HTMLDivElement>()

  private readonly cropperRef = { current: null as any }

  private readonly videoRef = React.createRef<HTMLVideoElement>()

  private readonly textures = new Map<string, THREE.Texture>()

  private loopHandle: number | null = null

  private lastTime: number | null = null

  private resizeObserver?: ResizeObserver

  private manualMoveSpeed = 0

  private readonly someDataStyle: React.CSSProperties = {
    position: 'fixed',
    top: 40,
    left: 0,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    color: 'black',
  }

  private static get manualMove() {
    return window.location.hash.includes('manualMove')
  }

  private static get debugInfo() {
    return window.location.hash.includes('debug')
  }

  constructor(props: any) {
    super(props)
    this.state = {
      z: 0,
      opacity: 0,
      fps: 60,
      someDataZIndex: 0,
      imageToCrop: null,
      videoFromCamera: null,
      videoCaptureText: '',
    }

    this.startCapturing = this.startCapturing.bind(this)
    this.selectedImage = this.selectedImage.bind(this)
    this.croppedImage = this.croppedImage.bind(this)
    this.resized = this.resized.bind(this)
    this.focused = this.focused.bind(this)
    this.blurred = this.blurred.bind(this)
    this.keyDown = this.keyDown.bind(this)
    this.keyUp = this.keyUp.bind(this)
    this.loop = this.loop.bind(this)

    this.width = window.innerWidth
    this.height = window.innerHeight
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 110)
    this.renderer = new THREE.WebGLRenderer({ alpha: true })

    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(0x121212)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    const gl = this.renderer.getContext()
    gl.enable(gl.CULL_FACE)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    this.renderer.domElement.style.position = 'absolute'
    this.renderer.domElement.style.top = '0'
    this.renderer.domElement.style.left = '0'
    this.renderer.domElement.style.width = '100%'
    this.renderer.domElement.style.height = '100%'
    this.renderer.domElement.style.zIndex = '-1'

    this.geometry = this.prepareGeometry()
    this.material = this.prepareShaders(this.geometry)
    this.textureLoader = this.prepareTextures()
    this.startLoop()
  }

  componentDidMount() {
    this.containerRef.current!.appendChild(this.renderer.domElement)
    if (typeof window.ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(([body]) => {
        this.resized(body.target.clientWidth, body.target.clientHeight)
      })
      this.resizeObserver.observe(document.body)
    }

    window.addEventListener('focus', this.focused)
    window.addEventListener('blur', this.blurred)
    window.addEventListener('keyup', this.keyUp)
    window.addEventListener('keydown', this.keyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('focus', this.focused)
    window.removeEventListener('blur', this.blurred)
    window.removeEventListener('keyup', this.keyUp)
    window.removeEventListener('keydown', this.keyDown)

    cancelAnimationFrame(this.loopHandle!)
    const { videoFromCamera } = this.state
    if (videoFromCamera) {
      videoFromCamera!.getTracks()[0].stop()
    }

    this.resizeObserver?.disconnect()
  }

  private get max() {
    return this.width + this.height
  }

  private blurred() {
    this.stopLoop()
  }

  private async captureFromCamera() {
    const { t } = this.props
    this.setState({ videoCaptureText: t('eugl.captureSteps.0') })
    await sleep(1)
    this.setState({ videoCaptureText: t('eugl.captureSteps.1') })
    await sleep(1)
    this.setState({ videoCaptureText: t('eugl.captureSteps.2') })
    await sleep(1)

    const { videoFromCamera } = this.state
    const videocanvas = document.createElement('canvas')
    const settings = videoFromCamera!.getVideoTracks()[0].getSettings()
    if (window.screen.width < window.screen.height) {
      videocanvas.width = settings.height!
      videocanvas.height = settings.width!
    } else {
      videocanvas.width = settings.width!
      videocanvas.height = settings.height!
    }
    videocanvas.getContext('2d')!.drawImage(this.videoRef.current!, 0, 0, videocanvas.width, videocanvas.height)
    videoFromCamera!.getTracks()[0].stop()
    this.setState({
      imageToCrop: videocanvas.toDataURL('image/png'),
      videoFromCamera: null,
      videoCaptureText: '',
    })
  }

  private croppedImage() {
    this.textureLoader.load(this.cropperRef.current!.getCroppedCanvas().toDataURL(), (texture) => {
      this.setState({ imageToCrop: null })
      if (this.textures.has('custom')) {
        this.textures.get('custom')!.dispose()
      }

      this.textures.set('custom', texture)
      this.material.uniforms.texture.value = texture
    })
  }

  private focused() {
    this.startLoop()
  }

  private keyUp(event: KeyboardEvent) {
    const key = event.code
    if (key === 'Digit1') {
      this.material.uniforms.texture.value = this.textures.get('euklid')
    } else if (key === 'Digit2') {
      this.material.uniforms.texture.value = this.textures.get('fallout_pipboy')
    } else if (key === 'Digit3') {
      this.material.uniforms.texture.value = this.textures.get('pato')
    } else if (key === 'Digit4') {
      this.material.uniforms.texture.value = this.textures.get('melchor')
    } else if (key === 'Digit5') {
      this.material.uniforms.texture.value = this.textures.get('thincc')
    } else if (key === 'Digit6') {
      this.material.uniforms.texture.value = this.textures.get('doge')
    } else if (key === 'Digit7') {
      this.material.uniforms.texture.value = this.textures.get('euklid')
    } else if (key === 'Digit8') {
      this.material.uniforms.texture.value = this.textures.get('euklid')
    } else if (key === 'Digit9') {
      this.material.uniforms.texture.value = this.textures.get('custom')
    } else if (key === 'KeyF') {
      // @ts-ignore
      const fe = document.fullscreenElement || document.webkitFullscreenElement
      if (fe !== null) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        }
      } else {
        const c = this.containerRef.current!
        if (c.requestFullscreen) {
          c.requestFullscreen()
        } else if (c.webkitRequestFullScreen) {
          c.webkitRequestFullScreen()
        } else if (c.webkitRequestFullscreen) {
          c.webkitRequestFullscreen()
        }
        this.renderer.domElement.style.zIndex = '0'
        this.setState({ someDataZIndex: 1 })
        const onFullscreenChange = () => {
          if (document.fullscreenElement || document.webkitFullscreenElement) {
            return
          }
          document.onwebkitfullscreenchange = null
          document.onfullscreenchange = null
          this.renderer.domElement.style.zIndex = '-1'
          this.setState({ someDataZIndex: 0 })
        }
        document.onwebkitfullscreenchange = onFullscreenChange
        document.onfullscreenchange = onFullscreenChange
      }
    } else if (EuglPage.manualMove) {
      if (key === 'KeyW' || key === 'ArrowUp' || key === 'KeyS' || key === 'ArrowDown') {
        this.manualMoveSpeed = 0
      }
    }
  }

  private keyDown(event: KeyboardEvent) {
    const key = event.code
    if (EuglPage.manualMove) {
      if (key === 'KeyW' || key === 'ArrowUp') {
        this.manualMoveSpeed = -25 * ((+event.shiftKey + 1) / (+event.ctrlKey + 1))
      } else if (key === 'KeyS' || key === 'ArrowDown') {
        this.manualMoveSpeed = 25 * ((+event.shiftKey + 1) / (+event.ctrlKey + 1))
      }
    }
  }

  private loop(time: number) {
    if (this.lastTime === null) {
      this.lastTime = time - 1 / 60
    }

    const delta = (time - this.lastTime) / 1000
    const z = -this.camera.position.z
    this.lastTime = time

    if (z >= -5 && z < 50) {
      this.material.uniforms.opacity.value = z / 50
    } else if (z > this.max - 50 && z <= this.width + this.height + 50) {
      this.material.uniforms.opacity.value = (this.max - z) / 50
    } else if (z > this.max + 50) {
      this.camera.position.z = 5
    } else if (z < -5) {
      this.camera.position.z = -(this.max + 50)
    } else if (this.material.uniforms.opacity.value !== 1) {
      this.material.uniforms.opacity.value = 1
    }

    this.material.uniforms.opacity.value = Math.max(0, this.material.uniforms.opacity.value)
    this.camera.position.z += delta * (EuglPage.manualMove ? this.manualMoveSpeed : -25)

    this.renderer.render(this.scene, this.camera)
    if (EuglPage.debugInfo) {
      this.setState({
        z: this.camera.position.z,
        opacity: this.material.uniforms.opacity.value,
        fps: (1 / delta),
      })
    }

    if (this.loopHandle !== null) {
      this.loopHandle = requestAnimationFrame(this.loop)
    }
  }

  private prepareGeometry(): THREE.InstancedBufferGeometry {
    const geometry = new THREE.InstancedBufferGeometry()
    const nEucl = this.max * 5
    geometry.instanceCount = nEucl

    // Plano compuesto por dos caras triangulares
    const vertices = new THREE.BufferAttribute(new Float32Array([
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
    const uv = new THREE.BufferAttribute(new Float32Array([
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
    const positions = new THREE.InstancedBufferAttribute(new Float32Array(nEucl * 3), 3, true, 1)
    let espacio = []
    for (let i = 0; i < nEucl; i += 1) {
      espacio.push(new THREE.Vector3(
        Math.random() * (this.width / 20) - this.width / 40,
        Math.random() * (this.height / 20) - this.height / 40,
        -Math.random() * this.max,
      ))
    }

    // Los ordenamos de lejos a cerca para evitar un mal rendering
    espacio = espacio.sort((a, b) => Math.sign(Math.round(b.lengthSq() - a.lengthSq())))
    // Los guardamos en la GPU
    for (let i = 0; i < nEucl; i += 1) {
      positions.setXYZ(i, espacio[i].x, espacio[i].y, espacio[i].z)
    }
    geometry.setAttribute('offset', positions)

    return geometry
  }

  private prepareShaders(geometry: THREE.InstancedBufferGeometry): THREE.RawShaderMaterial {
    // Cargamos el shader
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        opacity: { value: 1.0 },
        texture: { value: null },
      },
      transparent: true,
      vertexShader: DEFAULT_VERTEX_SHADER,
      fragmentShader: DEFAULT_FRAGMENT_SHADER,
    })
    const plane = new THREE.Mesh(geometry, material)
    // Asi no desaparece el tema
    plane.frustumCulled = false
    this.scene.add(plane)
    return material
  }

  private prepareTextures(): THREE.TextureLoader {
    const textureLoader = new THREE.TextureLoader()
    // Cargamos las texturas
    textureLoader.load(getAssetUrl('img/eu/euklid.png'), (texture: THREE.Texture) => {
      this.textures.set('euklid', texture)
      this.material.uniforms.texture.value = texture
      this.material.needsUpdate = true
    })
    textureLoader.load(getAssetUrl('img/eu/doge.png'), (texture) => this.textures.set('doge', texture))
    textureLoader.load(getAssetUrl('img/eu/melchor.png'), (texture) => this.textures.set('melchor', texture))
    textureLoader.load(getAssetUrl('img/eu/pato.png'), (texture) => this.textures.set('pato', texture))
    textureLoader.load(
      getAssetUrl('img/eu/fallout-pipboy.png'),
      (texture) => this.textures.set('fallout_pipboy', texture),
    )
    textureLoader.load(getAssetUrl('img/eu/thincc.png'), (texture) => this.textures.set('thincc', texture))
    return textureLoader
  }

  private resized(width?: number, height?: number) {
    this.width = width || window.innerWidth
    this.height = height || window.innerHeight
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  private startLoop() {
    this.loopHandle = requestAnimationFrame(this.loop)
  }

  private stopLoop() {
    if (this.loopHandle) {
      cancelAnimationFrame(this.loopHandle)
      this.loopHandle = null
      this.lastTime = null
    }
  }

  private selectedImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader()
      reader.onload = () => {
        this.setState({ imageToCrop: reader.result as string })
      }
      reader.readAsDataURL(event.target.files[0])
    }
  }

  private startCapturing() {
    const { t } = this.props
    this.setState({ videoCaptureText: t('eugl.wait') })
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error(t('eugl.unsuppoertedNavigator'))
      return
    }
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    })
      .then((stream) => {
        this.setState({ videoFromCamera: stream })
        this.videoRef.current!.srcObject = stream
        this.videoRef.current!.play().catch()
      })
      .catch((error) => toast.error(t('eugl.cannotCapture') + error.message))
  }

  render() {
    const {
      z, opacity, fps, someDataZIndex, imageToCrop, videoFromCamera, videoCaptureText,
    } = this.state
    const { t } = this.props
    return (
      <div style={{ width: '100%', height: '100%' }} ref={this.containerRef}>

        <Helmet>
          <title>Espacio Euclideo</title>
          <meta
            name="Description"
            content="An experiment with OpenGL, Euclides and star field (the screensaver)"
          />
        </Helmet>

        <div
          className="someData backdrop"
          style={{
            ...this.someDataStyle,
            zIndex: someDataZIndex,
            top: 40 - 40 * someDataZIndex,
            borderRadius: '0 0 5px 0',
          }}
        >
          { EuglPage.debugInfo && (
          <div>
            <p className="mb-0">
              nº instances:
              <span id="nEucl">{ this.max * 5 }</span>
            </p>
            <p className="mb-0">
              Z Camera:
              {' '}
              <span id="zpos">{ z.toFixed(2) }</span>
              {' '}
              [
              <span id="maxzpos">{ this.max + 50 }</span>
              ]
            </p>
            <p className="mb-0">
              Opacity:
              <span id="opacity">{ opacity.toFixed(2) }</span>
            </p>
            <p className="mb-0">
              FPS:
              <span id="fps">{ fps.toFixed(2) }</span>
            </p>
            <hr />
          </div>
          ) }
          <p className="mb-0">
            { t('eugl.customImage') }
            {' '}
            [9]:
          </p>
          <input
            type="file"
            onChange={this.selectedImage}
            style={{ display: imageToCrop ? 'none' : 'block' }}
          />
          <p className="mb-0">
            { t('eugl.yourCamera') }
            {' '}
            [9]:
          </p>
          { !videoFromCamera && (
          <button
            type="button"
            className="btn btn-sm btn-success"
            onClick={this.startCapturing}
          >
            { t('eugl.capture') }
          </button>
          ) }
          { videoCaptureText && <p className="lead">{ videoCaptureText }</p> }
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            width="400"
            height="225"
            onCanPlay={() => this.captureFromCamera()}
            ref={this.videoRef}
            style={{ display: videoFromCamera ? 'block' : 'none' }}
          />
          <hr style={{ display: imageToCrop ? 'block' : 'none' }} />
          { imageToCrop && (
          <Cropper
            src={imageToCrop}
            aspectRatio={1}
            style={{ width: '400px', height: '225px' }}
            onInitialized={(c) => {
              this.cropperRef.current = c
            }}
          />
          ) }
          <input
            type="button"
            className="btn btn-sm btn-success mt-2"
            onClick={this.croppedImage}
            style={{ display: imageToCrop ? 'block' : 'none' }}
            value={t<string>('eugl.showMyImage')}
          />
        </div>
      </div>
    )
  }
}

export default withTranslation('translations')(EuglPage)
