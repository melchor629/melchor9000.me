import React from 'react';
import * as THREE from 'three';
import * as toast from '../lib/toast';

const Cropper = require('react-cropper').default;
import 'cropperjs/dist/cropper.css';

async function sleep(time: number) {
    return new Promise(accept => setTimeout(() => accept(), time * 1000));
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
`;

const DEFAULT_FRAGMENT_SHADER = `
precision highp float;

uniform float opacity;
uniform sampler2D texture;

varying vec2 uvFrag;
varying float zVal;

void main() {
    gl_FragColor = texture2D(texture, uvFrag);
    gl_FragColor.a *= opacity;
    if(zVal >= 90.0) {
        gl_FragColor.a *= (100.0 - zVal) / 10.0;
    }
}
`;

interface EuglState {
    z: number;
    opacity: number;
    fps: number;
    someDataZIndex: number;
    imageToCrop: string | null;
    videoFromCamera: MediaStream | null;
    videoCaptureText: string;
}

export default class EuglPage extends React.Component<any, EuglState> {
    private width: number;
    private height: number;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private textureLoader: THREE.TextureLoader;
    private geometry: THREE.InstancedBufferGeometry;
    private material: THREE.RawShaderMaterial;
    private containerRef = React.createRef<HTMLDivElement>();
    private cropperRef = React.createRef<any>();
    private videoRef = React.createRef<HTMLVideoElement>();
    private textures = new Map<string, THREE.Texture>();
    private loopHandle: number | null = null;
    private lastTime: number | null = null;
    private get max() { return this.width + this.height; }

    private readonly someDataStyle: React.CSSProperties = {
        position: 'fixed',
        top: 40,
        left: 0,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        color: 'black',
    };

    private static get manualMove() { return window.location.hash.indexOf('manualMove') !== -1; }
    private static get debugInfo() { return window.location.hash.indexOf('debug') !== -1; }

    constructor(props: any) {
        super(props);
        this.state = {
            z: 0,
            opacity: 0,
            fps: 60,
            someDataZIndex: 0,
            imageToCrop: null,
            videoFromCamera: null,
            videoCaptureText: '',
        };

        this.startCapturing = this.startCapturing.bind(this);
        this.selectedImage = this.selectedImage.bind(this);
        this.croppedImage = this.croppedImage.bind(this);
        this.resized = this.resized.bind(this);
        this.focused = this.focused.bind(this);
        this.blurred = this.blurred.bind(this);
        this.keyUp = this.keyUp.bind(this);
        this.loop = this.loop.bind(this);
    }

    componentDidMount() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });

        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x121212);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        const gl = this.renderer.context;
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this.containerRef.current!.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.zIndex = '-1';

        this.textureLoader = new THREE.TextureLoader();
        this.prepareGeometry();
        this.prepareShaders();
        this.prepareTextures();
        this.startLoop();

        window.addEventListener('focus', this.focused);
        window.addEventListener('blur', this.blurred);
        window.addEventListener('keyup', this.keyUp);
    }

    componentWillUnmount() {
        window.removeEventListener('focus', this.focused);
        window.removeEventListener('blur', this.blurred);
        window.removeEventListener('keyup', this.keyUp);

        cancelAnimationFrame(this.loopHandle!);
        if(this.state.videoFromCamera) {
            this.state.videoFromCamera!.getTracks()[0].stop();
        }
    }

    render() {
        const { z, opacity, fps, someDataZIndex, imageToCrop, videoFromCamera, videoCaptureText } = this.state;
        return (
            <div style={{ width: '100%', height: '100%' }} ref={ this.containerRef }>
                <div className="someData backdrop"
                     style={{...this.someDataStyle, zIndex: someDataZIndex, top: 40 - 40 * someDataZIndex }}>
                    { EuglPage.debugInfo && <div>
                    <p className="mb-0">nº instances: <span id="nEucl">{ this.max * 5 }</span></p>
                    <p className="mb-0">
                        Z Camera: <span id="zpos">{ z.toFixed(2) }</span> [<span id="maxzpos">{ this.max + 50 }</span>]
                    </p>
                    <p className="mb-0">Opacity: <span id="opacity">{ opacity.toFixed(2) }</span></p>
                    <p className="mb-0">FPS: <span id="fps">{ fps.toFixed(2) }</span></p>
                    <hr/>
                    </div> }
                    <p className="mb-0">Custom Image [9]:</p>
                    <input type="file" onChange={ this.selectedImage }
                           style={{ display: imageToCrop ? 'none' : 'block' }} />
                    <p className="mb-0">Your camera [9]:</p>
                    { !videoFromCamera && <button type="button" className="btn btn-sm btn-success"
                                                onClick={ this.startCapturing }>Capture</button> }
                    { videoCaptureText && <p className="lead">{ videoCaptureText }</p> }
                    <video width="400" height="225" onCanPlay={() => this.captureFromCamera() }
                           ref={ this.videoRef } style={{ display: videoFromCamera ? 'block' : 'none' }} />
                    <hr style={{ display: imageToCrop ? 'block' : 'none' }} />
                    { imageToCrop && <Cropper src={ imageToCrop } aspectRatio={ 1 }
                                              style={{ width: '400px', height: '225px' }} ref={ this.cropperRef } /> }
                    <input type="button" className="btn btn-sm btn-success mt-2" onClick={ this.croppedImage }
                           style={{ display: imageToCrop ? 'block' : 'none' }} value="Show my image!" />
                </div>
            </div>
        );
    }

    private focused() {
        this.startLoop();
    }

    private blurred() {
        this.stopLoop();
    }

    private resized() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    private prepareGeometry() {
        this.geometry = new THREE.InstancedBufferGeometry();
        const nEucl = this.geometry.maxInstancedCount = this.max * 5;

        //Plano compuesto por dos caras triangulares
        const vertices = new THREE.BufferAttribute(new Float32Array([
            -1,  1, 0,
            -1, -1, 0,
            1,  1, 0,
            -1, -1, 0,
            1, -1, 0,
            1,  1, 0
        ]),                                        3);
        this.geometry.addAttribute('position', vertices);

        //Las coordenadas UV para texturas
        const uv = new THREE.BufferAttribute(new Float32Array([
            0, 1,
            0, 0,
            1, 1,
            0, 0,
            1, 0,
            1, 1
        ]),                                  2);
        this.geometry.addAttribute('uv', uv);

        //Creamos nEucl posiciones aleatorias
        const positions = new THREE.InstancedBufferAttribute(new Float32Array(nEucl * 3), 3, 1);
        let espacio = [];
        for(let i = 0; i < nEucl; i++) {
            espacio.push(new THREE.Vector3(
                Math.random() * this.width / 20 - this.width / 40,
                Math.random() * this.height / 20 - this.height / 40,
                -Math.random() * this.max)
            );
        }

        //Los ordenamos de lejos a cerca para evitar un mal rendering
        espacio = espacio.sort((a, b) => {
            return Math.sign(Math.round(b.lengthSq() - a.lengthSq()));
        });
        //Los guardamos en la GPU
        for(let i = 0; i < nEucl; i++) {
            positions.setXYZ(i, espacio[i].x, espacio[i].y, espacio[i].z);
        }
        this.geometry.addAttribute('offset', positions);
    }

    private prepareShaders() {
        //Cargamos el shader
        this.material = new THREE.RawShaderMaterial({
            uniforms: {
                opacity: { value: 1.0 },
                texture: { value: null }
            },
            transparent: true,
            vertexShader: DEFAULT_VERTEX_SHADER,
            fragmentShader: DEFAULT_FRAGMENT_SHADER
        });
        const plane = new THREE.Mesh(this.geometry, this.material);
        plane.frustumCulled = false; //Asi no desaparece el tema
        this.scene.add(plane); //_Todo listo
    }

    private prepareTextures() {
        //Cargamos las texturas
        this.textureLoader.load('/img/eu/euklid.png', (texture: THREE.Texture) => {
            this.textures.set('euklid', texture);
            this.material.uniforms.texture.value = texture;
            this.material.needsUpdate = true;
        });
        this.textureLoader.load('/img/eu/doge.png', (texture) => this.textures.set('doge', texture));
        this.textureLoader.load('/img/eu/melchor.png', (texture) => this.textures.set('melchor', texture));
        this.textureLoader.load('/img/eu/pato.png', (texture) => this.textures.set('pato', texture));
        this.textureLoader.load('/img/eu/fallout-pipboy.png',
                                (texture) => this.textures.set('fallout_pipboy', texture));
        this.textureLoader.load('/img/eu/thincc.png', (texture) => this.textures.set('thincc', texture));
    }

    private startLoop() {
        this.loopHandle = requestAnimationFrame(this.loop);
    }

    private stopLoop() {
        if(this.loopHandle) {
            cancelAnimationFrame(this.loopHandle);
            this.loopHandle = null;
            this.lastTime = null;
        }
    }

    private loop(time: number) {
        if(this.lastTime === null) {
            this.lastTime = time - 1 / 60;
        }

        const delta = (time - this.lastTime) / 1000;
        const z = -this.camera.position.z;
        this.lastTime = time;

        if(-5 <= z && z < 50) {
            this.material.uniforms.opacity.value = z / 50;
        } else if(z > this.max - 50 && z <= this.width + this.height + 50) {
            this.material.uniforms.opacity.value = (this.max - z) / 50;
        } else if(z > this.max + 50) {
            this.camera.position.z = 5;
        } else if(z < -5) {
            this.camera.position.z = -(this.max + 50);
        } else if(this.material.uniforms.opacity.value !== 1) {
            this.material.uniforms.opacity.value = 1;
        }

        this.material.uniforms.opacity.value = Math.max(0, this.material.uniforms.opacity.value);
        this.camera.position.z += delta * (EuglPage.manualMove ? 0 : -25);

        this.renderer.render(this.scene, this.camera);
        if(EuglPage.debugInfo) {
            this.setState({
                z: this.camera.position.z,
                opacity: this.material.uniforms.opacity.value,
                fps: (1 / delta),
            });
        }

        if(this.loopHandle !== null) {
            this.loopHandle = requestAnimationFrame(this.loop);
        }
    }

    private keyUp(event: KeyboardEvent) {
        const key = event.code;
        if(key === 'Digit1') {
            this.material.uniforms.texture.value = this.textures.get('euklid');
        } else if(key === 'Digit2') {
            this.material.uniforms.texture.value = this.textures.get('fallout_pipboy');
        } else if(key === 'Digit3') {
            this.material.uniforms.texture.value = this.textures.get('pato');
        } else if(key === 'Digit4') {
            this.material.uniforms.texture.value = this.textures.get('melchor');
        } else if(key === 'Digit5') {
            this.material.uniforms.texture.value = this.textures.get('thincc');
        } else if(key === 'Digit6') {
            this.material.uniforms.texture.value = this.textures.get('doge');
        } else if(key === 'Digit7') {
            this.material.uniforms.texture.value = this.textures.get('euklid');
        } else if(key === 'Digit8') {
            this.material.uniforms.texture.value = this.textures.get('euklid');
        } else if(key === 'Digit9') {
            this.material.uniforms.texture.value = this.textures.get('custom');
        } else if(key === 'KeyF') {
            const fe = document.fullscreenElement ||  document.webkitFullscreenElement;
            if(fe !== null) {
                if(document.exitFullscreen ) {
                    document.exitFullscreen ();
                } else if(document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if(document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            } else {
                const c = this.containerRef.current!;
                if(c.requestFullscreen) {
                    c.requestFullscreen();
                } else if(c.webkitRequestFullScreen) {
                    c.webkitRequestFullScreen();
                } else if(c.webkitRequestFullscreen) {
                    c.webkitRequestFullscreen();
                }
                this.renderer.domElement.style.zIndex = '0';
                this.setState({ someDataZIndex: 1 });
                document.onwebkitfullscreenchange = document.onfullscreenchange = () => {
                    if(document.fullscreenElement || document.webkitFullscreenElement) {
                        return;
                    }
                    document.onwebkitfullscreenchange = document.onfullscreenchange = null;
                    this.renderer.domElement.style.zIndex = '-1';
                    this.setState({ someDataZIndex: 0 });
                };
            }
        } else {
            console.log(key);
        }
    }

    private selectedImage(event: React.ChangeEvent<HTMLInputElement>) {
        if(event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                this.setState({ imageToCrop: reader.result });
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    private croppedImage() {
        this.textureLoader.load(this.cropperRef.current!.getCroppedCanvas().toDataURL(), (texture) => {
            this.setState({ imageToCrop: null });
            if(this.textures.has('custom')) {
                this.textures.get('custom')!.dispose();
            }

            this.textures.set('custom', texture);
            this.material.uniforms.texture.value = texture;
        });
    }

    private startCapturing() {
        this.setState({ videoCaptureText: 'Wait...' });
        if(!navigator.getUserMedia) {
            toast.error('Este navegador no es capaz de usar tu cámara :(');
            return;
        }
        navigator['getUserMedia'](
            {
                audio: false,
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            }, (stream) => {
                this.setState({ videoFromCamera: stream });
                this.videoRef.current!.srcObject = stream;
                this.videoRef.current!.play().catch();
            },
            (error) => toast.error('No pudimos capturar su cámara por lo siguiente: ' + error.message)
        );
    }

    private async captureFromCamera() {
        this.setState({ videoCaptureText: 'Look at the camera! - 3s' });
        await sleep(1);
        this.setState({ videoCaptureText: 'Prepare yourself - 2s' });
        await sleep(1);
        this.setState({ videoCaptureText: 'Get ready - 1s' });
        await sleep(1);

        const videocanvas = document.createElement('canvas');
        const settings = this.state.videoFromCamera!.getVideoTracks()[0].getSettings();
        if(screen.width < screen.height) {
            videocanvas.width = settings.height!;
            videocanvas.height = settings.width!;
        } else {
            videocanvas.width = settings.width!;
            videocanvas.height = settings.height!;
        }
        videocanvas.getContext('2d')!.drawImage(this.videoRef.current!, 0, 0, videocanvas.width, videocanvas.height);
        this.state.videoFromCamera!.getTracks()[0].stop();
        this.setState({
            imageToCrop: videocanvas.toDataURL('image/png'),
            videoFromCamera: null,
            videoCaptureText: '',
        });
    }
}
