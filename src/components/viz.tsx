import React from 'react';
import { WithNamespaces, Trans } from 'react-i18next';
import { Spring } from 'react-spring';
import * as toast from '../lib/toast';
import Visualizer from './visualizer';
import Player from '../lib/player';
import { VizDispatchToProps, VizStateToProps } from '../containers/viz';

type VizProps = VizStateToProps & VizDispatchToProps & WithNamespaces;
//TODO terminar

interface VizState {
    audioSource: AudioBufferSourceNode | null;
    visualizationMode: 'bars' | 'wave';
    errorMessage: string | null;
    fileName: string | null;
    timePosition: number | null;
    timeDuration: number;
    dragging: boolean;
    seeking: boolean;
    startPos: number;
}

export default class Viz extends React.Component<VizProps, VizState> {
    private player = new Player();
    private startTime: number = 0;
    private positionTimer: number | null = null;

    private static showError(errorMessage: string) {
        toast.error(errorMessage);
    }

    constructor(props: VizProps) {
        super(props);
        this.state = {
            audioSource: null,
            visualizationMode: 'bars',
            errorMessage: null,
            fileName: null,
            timePosition: null,
            timeDuration: 1,
            dragging: false,
            seeking: false,
            startPos: 0,
        };

        this.visualizationModeChanged = this.visualizationModeChanged.bind(this);
        this.seekBarChange = this.seekBarChange.bind(this);
        this.seekBarStart = this.seekBarStart.bind(this);
        this.playPressed = this.playPressed.bind(this);
        this.stopPressed = this.stopPressed.bind(this);
        this.fileChanged = this.fileChanged.bind(this);
        this.seekBarEnd = this.seekBarEnd.bind(this);
        this.enterDrag = this.enterDrag.bind(this);
        this.exitDrag = this.exitDrag.bind(this);
        this.dropped = this.dropped.bind(this);
    }

    componentDidMount() {
        this.props.changeTitle('Viz');
    }

    componentWillUnmount() {
        if(this.positionTimer) {
            cancelAnimationFrame(this.positionTimer);
        }
        this.player.destroy();
    }

    render() {
        const { audioSource, visualizationMode, fileName, timePosition, timeDuration, dragging, seeking,
        startPos } = this.state;
        const { t } = this.props;

        return (
            <div onDragOver={ this.enterDrag } onDragLeave={ this.exitDrag } onDrop={ this.dropped }>
                <div className="row">
                    <p className="lead">
                        <Trans i18nKey="viz.description">
                        Arrastra (hasta aquí) o busca (con el botón de abajo) una canción compatible con tu navegador y
                        deja que la magia actúe.
                        Con cualquier mp3 o wav debería ir, puedes probar con m4a (aac (<i>alac tambien, si usas
                        Safari</i>)) o con ogg (vorbis).
                        Ultimamente flac también va.
                        </Trans>
                    </p>
                </div>

                <div className="row">
                    <div className="col-sm-6 col-12">
                        <label className="custom-file">
                            <input type="file" id="cancion" name="cancion" accept="audio/*"
                                   onChange={ this.fileChanged }
                                   className="custom-file-input" />
                                <span className="custom-file-label">
                                    { fileName || t('viz.selectFile') }
                                </span>
                        </label>
                    </div>
                    <div className="col-sm-6 col-12">
                        <select id="visualizador"
                                className="form-control"
                                value={ visualizationMode }
                                onChange={ this.visualizationModeChanged }>
                            <option value="bars">{ t('viz.bars') }</option>
                            <option value="wave">{ t('viz.wave') }</option>
                        </select>
                    </div>
                </div>

                <div className="d-flex justify-content-center btn-group mt-2" role="group"
                     aria-label="Botones de reproducir y pausa">
                    <input type="button" className="btn btn-secondary" value={ t('viz.play') } id="play"
                           onClick={ this.playPressed } disabled={ !fileName || !!audioSource || seeking } />
                    <input type="button" className="btn btn-secondary" value={ t('viz.pause') } id="stop"
                           onClick={ this.stopPressed } disabled={ !audioSource } />
                </div>

                <div className="row mt-2">
                    <input type="range" id="pos" min={0} max={ timeDuration + startPos }
                           value={ startPos + (timePosition || 0) }
                           step={0.1} style={{ width: '100%' }} disabled={ !timePosition && !seeking }
                           onChange={ this.seekBarChange }
                           onMouseDown={ this.seekBarStart }
                           onMouseUp={ this.seekBarEnd } />
                </div>

                <Visualizer audioContext={ this.player.audioContext }
                            audioSource={ audioSource }
                            visualizationMode={ visualizationMode }
                            theme={ this.props.darkMode ? 'dark' : 'light' } />

                <Spring from={{ opacity: 0, zIndex: -1 }}
                        to={{ opacity: dragging ? 1 : 0, zIndex: dragging ? 1 : -1 }}>
                    { (style: React.CSSProperties) =>
                        <div
                            style={{
                                opacity: 0,
                                position: 'fixed',
                                width: '100%',
                                height: '100%',
                                top: 0,
                                left: 0,
                                zIndex: -1,
                                backgroundColor: 'rgb(200, 200, 200, 0.4)',
                                ...style
                            }}
                            className="arrastrar d-flex justify-content-center align-items-center">
                            <div className="text-center">
                                { t('viz.drop') }
                            </div>
                        </div>
                    }
                </Spring>
            </div>
        );
    }

    private fileChanged(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        this.player.unloadSong('song');
        if(event.target.files && event.target.files.length > 0) {
            this.player.loadFile('song', event.target.files![0]).then(() => {
                this.play();
            }).catch(error => Viz.showError(error.toString()));
            this.setState({ fileName: event.target.files![0].name });
        } else {
            this.setState({ fileName: null });
        }
    }

    private visualizationModeChanged(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ visualizationMode: (event.target.value as 'bars' | 'wave') });
    }

    private playPressed() {
        if(!this.state.audioSource) {
            this.play();
        }
    }

    private stopPressed() {
        if(this.state.audioSource) {
            this.state.audioSource.stop();
        }
    }

    private enterDrag(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
        this.setState({ dragging: true });
    }

    private exitDrag(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ dragging: false });
    }

    private dropped(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        this.player.loadFile('song', event.dataTransfer.files![0]).then(() => {
            this.play();
        }).catch(error => Viz.showError(error.toString()));
        this.setState({ fileName: event.dataTransfer!.files[0].name, dragging: false });
    }

    private play(startPos?: number) {
        if(this.state.audioSource) {
            this.state.audioSource.stop();
        }
        this.player.playSound('song', startPos).then((audioSource) => {
            this.startTime = this.player.audioContext.currentTime;
            this.setState({
                audioSource, timePosition: 0,
                timeDuration: audioSource.buffer!.duration,
                startPos: startPos || 0
            });
            audioSource.onended = () => {
                if(!this.state.seeking) {
                    this.setState({ audioSource: null, timePosition: null });
                }
                cancelAnimationFrame(this.positionTimer!);
                this.positionTimer = null;
            };
            const self = () => {
                this.setState({ timePosition: this.player.audioContext.currentTime - this.startTime });
                this.positionTimer = requestAnimationFrame(self);
            };
            this.positionTimer = requestAnimationFrame(self);
        }).catch(error => Viz.showError(this.props.t('viz.cannotPlay') + error.toString()));
    }

    private seekBarStart() {
        if(this.state.audioSource) {
            this.setState({
                seeking: true,
                audioSource: null,
                startPos: 0,
                timeDuration: this.state.startPos + this.state.timeDuration,
                timePosition: this.state.timePosition! + this.state.startPos
            });
            this.state.audioSource.stop();
        }
    }

    private seekBarChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ timePosition: Number(event.target.value) });
    }

    private seekBarEnd() {
        this.play(this.state.timePosition!);
        this.setState({ seeking: false });
    }

}