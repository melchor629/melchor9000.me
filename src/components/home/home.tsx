import * as React from 'react';
import * as toast from 'src/lib/toast';
import { Cheat } from 'src/lib/cheat';
import Player from 'src/lib/player';
import Visualizer from 'src/components/visualizer';
import Tapable from 'src/components/tapable';
import { IndexDispatchToProps, IndexStateToProps } from 'src/containers/home';
const Parallax = require('parallax-js');

import './home.css';

const images = [
    'img/Pixel Art.png',
    'https://pbs.twimg.com/media/CERI-yNW0AIwIA6.jpg:large',
    'https://pbs.twimg.com/media/CDGwAolWIAA-xkF.jpg:large',
    'https://pbs.twimg.com/media/CEe1sRkWYAE0Wiy.jpg:large',
    'https://pbs.twimg.com/media/CGGc8fnWMAA0GnY.jpg:large',
    'https://pbs.twimg.com/media/CeBLo6ZWIAQE_Qn.jpg:large',
    'https://pbs.twimg.com/media/Cgf7-IEUEAAgWk5.jpg:large',
    'https://pbs.twimg.com/media/Ci-4rIQWgAABok3.jpg:large',
    'https://pbs.twimg.com/media/Cx9ZotYXUAAhih5.jpg:large',
    'https://pbs.twimg.com/media/CyiKCaAXgAAfp84.jpg:large',
];

const specialDatesImages: { day: number, month: number, image: string | string[] }[] = [
    { day: 14, month: 4, image: 'data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" standalone="no"?>' +
        '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" ' +
        'xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" ' +
        'xmlns="http://www.w3.org/2000/svg" width="450" height="450" viewBox="0 0 3 3" version="1.1" ' +
        'id="svg4562"><metadata id="metadata4568"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml' +
        '</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title></dc:title>' +
        '</cc:Work></rdf:RDF></metadata><defs id="defs4566"/><path d="m -1.6819011,1.4986118 3.179204,' +
        '-3.179204 3.1819804,3.1819805 -3.1792039,3.1792039 z" id="path4556" style="fill:#630b57;' +
        'stroke-width:1.16138792"/><path d="M -1.6819011,1.4986118 1.4973029,-1.6805922 3.6186231,' +
        '0.44072813 0.43941923,3.619932 Z" id="path4558" style="fill:#fcdd09;stroke-width:1.16138792"/>' +
        '<path d="m -1.6819011,1.4986118 3.179204,-3.179204 1.06066,1.06066016 -3.17920384,3.17920384 z" ' +
        'id="path4560" style="fill:#da121a;stroke-width:1.16138792"/></svg>' },
    { day: 1, month: 5, image: [
        'https://upload.wikimedia.org/wikipedia/commons/d/d4/Manifestacio_barcelona_primer_de_maig_alternatiu_2009.JPG',
        'https://images-na.ssl-images-amazon.com/images/I/61km35u8M1L._SL1500_.jpg',
        'http://noticias.universia.com.ar/net/images/cultura/p/po/por/por-que-celebra-1-mayo-dia-trabajador.jpg',
    ]},
    { day: 24, month: 12, image: 'https://www.euroresidentes.com/imagenes/dulce-navidad-euroresidentes.jpg' },
];

specialDatesImages
    .filter(({ day, month }) => new Date().getUTCDate() === day && new Date().getUTCMonth() === month - 1)
    .forEach(({ image }) => {
        while(images.pop() !== undefined) {
            images.entries();
        }
        if(Array.isArray(image)) {
            images.push(...image);
            for (let i = images.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [images[i], images[j]] = [images[j], images[i]];
            }
        } else {
            images.push(image);
        }
    });

const playSoundError = function(this: string, error: Error) {
    toast.error(() => (
        <div>
            No se pudo reproducir ${this} <br/>
            <span className="text-muted">{ error.message }</span>
        </div>
    ));
};

const cheats = new Map([
    [ '↑ ↑ ↓ ↓ ← → ← → b a', function(this: Home) {
        this.setState({
            image: (this.state.image + 1) % images.length
        });
    } ],
    [ 'f i l l space d e space p u t a', function(this: Home) {
        toast.normal(<span><b>Com goses insultarme?</b> Fill de meuca, al infern aniràs...</span>);
    } ],
    [ 'a r o u n d space t h e space w o r l d', function(this: Home) {
        this.player.playSound('atw').then(audioSource => {
            this.setState({ audioSource });
            audioSource.onended = () => this.setState({ audioSource: null });
        }).catch(playSoundError.bind('Around The World'));
    } ],
    [ 'i n t e r s t e l l a r', function(this: Home) {
        this.player.playSound('stay').then(audioSource => {
            this.setState({ audioSource });
            audioSource.onended = () => this.setState({ audioSource: null });
        }).catch(playSoundError.bind('Stay'));
    } ],
    [ 's a t u r d a y space n i g h t space f e v e r', function(this: Home) {
        let sound: string;
        if(Math.round(Math.random())) {
            sound = 'staying alive';
        } else {
            sound = 'staying alive2';
        }
        this.player.playSound(sound).then(audioSource => {
            this.setState({ audioSource });
            audioSource.onended = () => this.setState({ audioSource: null });
        }).catch(playSoundError.bind(sound));
    } ],
    [ 'd o space a space b a r r e l space r o l l', function(this: Home) {
        this.props.doABarrelRoll();
    } ],
    [ 'f l i p space i t', function(this: Home) {
        this.props.flipIt(this.props.flipItValue);
    } ],
    [ 'w t f s t b', function(this: Home) {
        this.player.playSound('when-the-fire-starts-to-burn').then(audioSource => {
            this.setState({ audioSource });
            audioSource.onended = () => this.setState({ audioSource: null });
        }).catch(playSoundError.bind('When the Fire Starts to Burn'));
    } ],
    [ 'o s c u r o', function(this: Home) {
        this.props.toggleDarkMode();
    } ],
    [ 'f l o a t i n g space p o i n t s', function(this: Home) {
        let name = '';
        switch(Math.trunc(Math.random() * 10000) % 4) {
            case 0: name = 'k&g beat'; break;
            case 1: name = 'nuits sonores'; break;
            case 2: name = 'for marmish 2'; break;
            case 3: name = 'peoples potential'; break;
            default: break;
        }
        this.player.playSound(name).then(audioSource => {
            this.setState({ audioSource });
            audioSource.onended = () => this.setState({ audioSource: null });
        }).catch(playSoundError.bind(name));
    } ],
    [ 'v i s u a l i z a d o r', function(this: Home) {
        this.props.changeVisualizationMode();
    } ],
    [ 'c o l d p l a y', function(this: Home) {
        let name = '';
        switch(Math.trunc(Math.random() * 10000) % 4) {
            case 0: name = 'violet hill'; break;
            case 1: name = 'talk'; break;
            case 2: name = 'brothers & sisters'; break;
            case 3: name = 'every teardrop is a waterfall'; break;
            default: break;
        }
        this.player.playSound(name).then(audioSource => {
            this.setState({ audioSource });
            audioSource.onended = () => this.setState({ audioSource: null });
        }).catch(playSoundError.bind(name));
    } ],
    [ 'c y d o n i a', function(this: Home) {
        let name = '';
        switch(Math.trunc(Math.random() * 10000) % 5) {
            case 0: name = 'apocalypse please'; break;
            case 1: name = 'uprising'; break;
            case 2: name = 'the globalist'; break;
            case 3: name = 'knights of cydonia1'; break;
            case 4: name = 'knights of cydonia2'; break;
            default: break;
        }
        this.player.playSound(name).then(audioSource => {
            this.setState({ audioSource });
            audioSource.onended = () => this.setState({ audioSource: null });
        }).catch(playSoundError.bind(name));
    } ],
    [ 'a n d r e s', function(this: Home) {
        if(document.querySelector('iframe') === null) {
            let iframe = document.createElement('iframe');
            iframe.setAttribute('width', String(window.innerWidth));
            iframe.setAttribute('height', String(window.innerHeight));
            iframe.setAttribute('src', 'https://www.youtube.com/embed/8arKaFFTFGo?autoplay=1' +
                '&controls=0&disablekb=1&fs=0&rel=0&showinfo=0&color=white&iv_load_policy=3');
            iframe.setAttribute('id', 'background');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', 'true');
            document.body.appendChild(iframe);
        }
    } ]
]);

type IndexProps = IndexStateToProps & IndexDispatchToProps;

interface StateProps {
    image: number;
    keys: string[];
    disappearTimeout: NodeJS.Timer | null;
    audioSource: AudioBufferSourceNode | null;
}

export default class Home extends React.Component<IndexProps, StateProps> {
    player = new Player();
    private cheat = new Cheat();
    private parallax: any;

    constructor(props: IndexProps) {
        super(props);
        this.state = {
            image: 0,
            keys: [],
            disappearTimeout: null,
            audioSource: null,
        };

        this.cheat.onfail = () => {
            if(this.state.disappearTimeout) { clearTimeout(this.state.disappearTimeout); }
            this.setState({
                disappearTimeout: setTimeout(() => this.setState({ keys: [], disappearTimeout: null }), 200)
            });
        };

        this.cheat.onnext = (key, str) => {
            if(str === 'space') { str = ' '; }
            if(this.state.disappearTimeout) { return this.cheat.reset(); }
            this.setState({
                keys: [ ...this.state.keys, str ],
                disappearTimeout: null
            });
        };

        this.cheat.ondone = () => {
            this.setState({
                disappearTimeout: setTimeout(() => this.setState({ keys: [], disappearTimeout: null }), 1000)
            });
        };

        cheats.forEach((value, key) => this.cheat.add(key).then(value.bind(this)));

        this.player.loadSound('atw', 'mp3', 'ogg');
        this.player.loadSound('stay', 'm4a', 'ogg');
        this.player.loadSound('staying alive', 'm4a', 'ogg');
        this.player.loadSound('staying alive2', 'm4a', 'ogg');
        this.player.loadSound('when-the-fire-starts-to-burn', 'm4a', 'ogg');
        this.player.loadSound('k&g beat', 'm4a', 'ogg');
        this.player.loadSound('nuits sonores', 'm4a', 'ogg');
        this.player.loadSound('for marmish 2', 'm4a', 'ogg');
        this.player.loadSound('peoples potential', 'm4a', 'ogg');
        this.player.loadSound('every teardrop is a waterfall', 'm4a', 'ogg');
        this.player.loadSound('violet hill', 'm4a', 'ogg');
        this.player.loadSound('brothers & sisters', 'm4a', 'ogg');
        this.player.loadSound('talk', 'm4a', 'ogg');
        this.player.loadSound('apocalypse please', 'm4a', 'ogg');
        this.player.loadSound('uprising', 'm4a', 'ogg');
        this.player.loadSound('the globalist', 'm4a', 'ogg');
        this.player.loadSound('knights of cydonia1', 'm4a', 'ogg');
        this.player.loadSound('knights of cydonia2', 'm4a', 'ogg');

        this.onWindowKeyDown = this.onWindowKeyDown.bind(this);
        this.onWindowBlur = this.onWindowBlur.bind(this);
        this.changeImage = this.changeImage.bind(this);
    }

    static get _year() {
        let d = new Date();
        let n = new Date(830037600000);
        if(d.getMonth() > n.getMonth() || (d.getMonth() === n.getMonth() && d.getDate() >= n.getDate())) {
            return d.getFullYear() - n.getFullYear();
        } else {
            return d.getFullYear() - n.getFullYear() - 1;
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onWindowKeyDown);
        window.addEventListener('blur', this.onWindowBlur);
        this.parallax = new Parallax(document.querySelector('.profile_img'), { pointerEvents: true });
        this.props.changeTitle('Home');
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onWindowKeyDown);
        window.removeEventListener('blur', this.onWindowBlur);
        this.player.destroy();
        this.parallax.destroy();
        if(this.state.disappearTimeout) {
            clearTimeout(this.state.disappearTimeout);
        }
    }

    componentDidUpdate(prevProps: IndexProps) {
        if(prevProps.darkMode !== this.props.darkMode) {
            if(this.props.darkMode) {
                const mensajes = [
                    'I\'m Batman!',
                    '¿Ya es de noche?',
                    'Ahora te dolerán menos los ojos',
                    'Darkness...',
                    'Se fué la luz',
                    'Madona, que has fet amb es mistos? No puc veure res...',
                    'Modo noche, para los noctámbulos',
                    '🌚'
                ];
                toast.info(mensajes[Math.trunc(Math.random() * mensajes.length)]);
            } else {
                const mensajes = [
                    '¿Cansado de la noche?',
                    'Eh ja he trobat ets mistos, que bo',
                    'Supongo que es de día ahora...',
                    'Volvió la luz',
                    'Modo de día, para los diurnos',
                    '🌞'
                ];
                toast.info(mensajes[Math.trunc(Math.random() * mensajes.length)]);
            }
        }

        if(prevProps.visualizationMode !== this.props.visualizationMode) {
            toast.info(`Visualizador cambiado a '${this.props.visualizationMode || 'nada'}'`);
        }
    }

    onWindowKeyDown(event: KeyboardEvent) {
        event.preventDefault();
        this.cheat.keydown(event.code);
    }

    onWindowBlur() {
        this.cheat.reset();
    }

    render() {
        const { image, keys, disappearTimeout } = this.state;

        const keysDiv = (
            <div className="keys">
                { keys.map((key, i) => <div className={`key ${disappearTimeout ? 'bye' : ''}`}
                                                      key={`${key}-${i}`}>{ key }</div>) }
            </div>
        );

        return (
            <div>
                <div className="d-flex justify-content-center align-items-center">
                    <div className="profile">
                        <div className="profile_name">
                            <h1>melchor9000</h1>
                            <h3>Melchor Garau Madrigal</h3>
                        </div>

                        <div className="profile_img">
                            <div className="layer" data-depth="0.3">
                                <div className="image-wrapper">
                                    <div className="image-wrapper-inner">
                                        <Tapable onLongTap={ this.changeImage }>
                                            <img src={ images[image] } alt="Me" />
                                        </Tapable>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="profile_description">
                            <p className="lead">
                                <span id="año">{ Home._year }</span>&nbsp;
                                Años<br />Estudiante de Ingenería del Software en la Universidad de Málaga
                                <br />Programador...
                            </p>
                        </div>
                    </div>
                </div>

                { keys.length > 0 || disappearTimeout ? keysDiv : null }

                <Visualizer audioContext={ this.player.audioContext }
                            audioSource={ this.state.audioSource }
                            visualizationMode={ this.props.visualizationMode }
                            theme={ this.props.darkMode ? 'dark' : 'light' } />
            </div>
        );
    }

    private changeImage() {
        this.setState({
            image: (this.state.image + 1) % images.length
        });
    }

}
