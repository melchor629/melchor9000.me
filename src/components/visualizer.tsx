import React from 'react'

interface VisualizerProp {
    audioContext: AudioContext
    audioSource: AudioBufferSourceNode | null
    visualizationMode: null | 'bars' | 'wave' | 'random'
    theme: 'dark' | 'light'
}

interface VisualizerState {
    width: number
    height: number
    hide: boolean
    hiding: boolean
}

class Visualizer extends React.Component<VisualizerProp, VisualizerState> {
    private readonly audioAnalyser: AnalyserNode
    private redrawRequest: number | null
    private readonly pixelRatio: number
    private readonly canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef()
    private canvasContext: CanvasRenderingContext2D = null as any

    private static _pixelRatio() {
        const ctx = document.createElement('canvas').getContext('2d')!
        const dpr = window.devicePixelRatio || 1
        // @ts-ignore
        const bsr: number = ctx.webkitBackingStorePixelRatio ||
            // @ts-ignore
            ctx.mozBackingStorePixelRatio ||
            // @ts-ignore
            ctx.msBackingStorePixelRatio ||
            // @ts-ignore
            ctx.oBackingStorePixelRatio ||
            // @ts-ignore
            ctx.backingStorePixelRatio || 1

        return dpr / bsr
    }

    constructor(props: VisualizerProp) {
        super(props)
        this.audioAnalyser = this.props.audioContext.createAnalyser()
        this.audioAnalyser.maxDecibels = -5
        this.redrawRequest = null
        this.audioAnalyser.connect(this.props.audioContext.destination)
        this.pixelRatio = Visualizer._pixelRatio()

        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            hide: true,
            hiding: false,
        }

        this.onResize = this.onResize.bind(this)
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize)
        this.canvasContext = this.canvasRef.current!.getContext('2d')!
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
        if(this.props.audioSource) {
            this.props.audioSource.stop()
        }
        if(this.redrawRequest) {
            cancelAnimationFrame(this.redrawRequest)
        }
    }

    onResize() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    }

    componentDidUpdate(prevProps: VisualizerProp) {
        if(prevProps.audioSource === null && this.props.audioSource !== null) {
            this.props.audioSource.connect(this.audioAnalyser)
            this.setState({ hide: false })
            setTimeout(() => {
                this.props.audioSource!.start(0)
                switch(this.props.visualizationMode) {
                    case 'bars': this.drawBars(); break
                    case 'wave': this.drawWave(); break
                    case 'random':
                        if(Math.round(Math.random() * 1000) % 2) {
                            this.drawBars()
                        } else {
                            this.drawWave()
                        }
                        break
                    default: break
                }
            }, 100)
        } else if(prevProps.audioSource !== null && this.props.audioSource === null) {
            if(this.redrawRequest) {
                this.setState({ hiding: true })
                setTimeout(() => {
                    cancelAnimationFrame(this.redrawRequest!)
                    this.redrawRequest = null
                    this.setState({ hide: true, hiding: false })
                }, 500)
            }
        }

        if(prevProps.visualizationMode !== this.props.visualizationMode) {
            if(this.redrawRequest) {
                cancelAnimationFrame(this.redrawRequest)
            }
            switch(this.props.visualizationMode) {
                case 'bars': this.drawBars(); break
                case 'wave': this.drawWave(); break
                case 'random':
                    if(Math.round(Math.random() * 1000) % 2) {
                        this.drawBars()
                    } else {
                        this.drawWave()
                    }
                    break
                default:
                    this.canvasContext!.fillStyle = this.props.theme === 'light' ? 'white' : '#282828'
                    this.canvasContext!.fillRect(0,
                        0,
                        this.state.width * this.pixelRatio,
                        this.state.height * this.pixelRatio)
                    break
            }
        }
    }

    render() {
        const { width, height, hide, hiding } = this.state
        const style = { width, height }
        const classes = []
        if(hide) {
            classes.push('nope')
        }
        if(hiding) {
            classes.push('noping')
        }
        return (
            <canvas id="background"
                className={classes.join(' ')}
                width={width * this.pixelRatio}
                height={height * this.pixelRatio}
                style={style}
                ref={this.canvasRef} />
        )
    }

    private drawBars(): void {
        const width = () => this.state.width * this.pixelRatio
        const height = () => this.state.height * this.pixelRatio
        this.audioAnalyser.fftSize = 512
        const bufferLength = this.audioAnalyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        this.canvasContext.clearRect(0, 0, width(), height())
        const draw = () => {
            this.redrawRequest = requestAnimationFrame(draw)
            this.audioAnalyser.getByteFrequencyData(dataArray)

            this.canvasContext.fillStyle = this.props.theme === 'light' ? 'white' : '#282828'
            this.canvasContext.fillRect(0, 0, width(), height())

            const barWidth = width() / bufferLength * 2.5
            let x = 0

            for(let i = 0; i < bufferLength; i++) {
                const barHeight = height() * dataArray[i] / 256

                this.canvasContext.fillStyle = '#3f51b5'
                this.canvasContext.fillRect(x, height() - barHeight, barWidth, barHeight)

                x += barWidth + 1
            }
        }

        this.redrawRequest = requestAnimationFrame(draw)
    }

    private drawWave(): void {
        const width = () => this.state.width * this.pixelRatio
        const height = () => this.state.height * this.pixelRatio
        this.audioAnalyser.fftSize = 4096
        const bufferLength = this.audioAnalyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        this.canvasContext.clearRect(0, 0, width(), height())
        const draw = () => {
            this.redrawRequest = requestAnimationFrame(draw)
            this.audioAnalyser.getByteTimeDomainData(dataArray)

            this.canvasContext.fillStyle = this.props.theme === 'light' ? 'white' : '#282828'
            this.canvasContext.fillRect(0, 0, width(), height())

            this.canvasContext.lineWidth = 4
            this.canvasContext.strokeStyle = '#3f51b5'
            this.canvasContext.beginPath()

            const sliceWidth = width() / bufferLength
            let x = 0

            for(let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0
                const y = v * height() / 2

                if(i === 0) {
                    this.canvasContext.moveTo(x, y)
                } else {
                    this.canvasContext.lineTo(x, y)
                }

                x += sliceWidth
            }

            this.canvasContext.lineTo(width(), height() / 2)
            this.canvasContext.stroke()
        }

        this.redrawRequest = requestAnimationFrame(draw)
    }
}

export default Visualizer
