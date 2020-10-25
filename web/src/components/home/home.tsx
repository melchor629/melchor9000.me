import React from 'react'
import { WithTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

import * as toast from '../../lib/toast'
import { Cheat } from '../../lib/cheat'
import Player from '../../lib/player'
import Visualizer from '../visualizer'
import Tapable from '../tapable'
import type { IndexDispatchToProps, IndexStateToProps } from '../../containers/home'
import { getAssetUrl } from '../../lib/url'

import './home.scss'

const Parallax = require('parallax-js')

const images = [
  getAssetUrl('img/Pixel Art.png'),
  getAssetUrl('img/home/CERI-yNW0AIwIA6.jpg'),
  getAssetUrl('img/home/CDGwAolWIAA-xkF.jpg'),
  getAssetUrl('img/home/CEe1sRkWYAE0Wiy.jpg'),
  getAssetUrl('img/home/CGGc8fnWMAA0GnY.jpg'),
  getAssetUrl('img/home/CeBLo6ZWIAQE_Qn.jpg'),
  getAssetUrl('img/home/Cgf7-IEUEAAgWk5.jpg'),
  getAssetUrl('img/home/Ci-4rIQWgAABok3.jpg'),
  getAssetUrl('img/home/Cx9ZotYXUAAhih5.jpg'),
  getAssetUrl('img/home/CyiKCaAXgAAfp84.jpg'),
  getAssetUrl('img/home/Ch71hdog06jqm31.jpg'),
]

const specialDatesImages: Array<{ day: number, month: number, image: string | string[] }> = [
  { day: 14, month: 4, image: getAssetUrl('img/home/re.svg') },
  {
    day: 1,
    month: 5,
    image: [
      'https://upload.wikimedia.org/wikipedia/commons/d/d4/Manifestacio_barcelona_primer_de_maig_alternatiu_2009.JPG',
      'https://images-na.ssl-images-amazon.com/images/I/61km35u8M1L._SL1500_.jpg',
      'http://noticias.universia.com.ar/net/images/cultura/p/po/por/por-que-celebra-1-mayo-dia-trabajador.jpg',
    ],
  },
  { day: 24, month: 12, image: 'https://www.euroresidentes.com/imagenes/dulce-navidad-euroresidentes.jpg' },
]

const today = new Date()
specialDatesImages
  .filter(({ day, month }) => today.getUTCDate() === day && today.getUTCMonth() === month - 1)
  .forEach(({ image }) => {
    while (images.pop() !== undefined) {
      images.entries()
    }
    if (Array.isArray(image)) {
      images.push(...image)
      for (let i = images.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [images[i], images[j]] = [images[j], images[i]]
      }
    } else {
      images.push(image)
    }
  })

const playSoundCheat = (self: Home, sounds: string | string[]) => {
  let sound: string
  if (Array.isArray(sounds)) {
    const rand = Math.trunc(Math.random() * 10000) % sounds.length
    sound = sounds[rand]
  } else {
    sound = sounds
  }

  self.player.playSound(sound)
    .then((audioSource) => {
      self.setState({ audioSource })
      // eslint-disable-next-line no-param-reassign
      audioSource.onended = () => self.setState({ audioSource: null })
    })
    .catch((e) => (
      toast.error(() => (
        <div>
          { self.props.t('cheatCannotPlay') }
          {' '}
          <i>
            $
            {sound}
          </i>
          {' '}
          <br />
          <span className="text-muted">{e.message}</span>
        </div>
      ))
    ))
}

const cheats = new Map([
  ['↑ ↑ ↓ ↓ ← → ← → b a', (self: Home) => (
    self.setState({ image: (self.state.image + 1) % images.length })
  )],
  ['f i l l space d e space p u t a', () => {
    toast.normal((
      <span>
        <b>Com goses insultarme?</b>
        {' '}
        Fill de meuca, al infern aniràs...
      </span>
    ))
  }],
  ['a r o u n d space t h e space w o r l d', (self: Home) => playSoundCheat(self, 'atw')],
  ['i n t e r s t e l l a r', (self: Home) => playSoundCheat(self, 'stay')],
  ['s a t u r d a y space n i g h t space f e v e r', (self: Home) => (
    playSoundCheat(self, ['staying alive', 'staying alive2'])
  )],
  ['d o space a space b a r r e l space r o l l', ({ props }: Home) => (
    props.doABarrelRoll()
  )],
  ['f l i p space i t', ({ props }: Home) => (
    props.flipIt()
  )],
  ['w t f s t b', (self: Home) => (
    playSoundCheat(self, 'when-the-fire-starts-to-burn')
  )],
  ['o s c u r o', ({ props }: Home) => (
    props.toggleDarkMode()
  )],
  ['f l o a t i n g space p o i n t s', (self: Home) => (
    playSoundCheat(self, [
      'k&g beat',
      'nuits sonores',
      'for marmish 2',
      'peoples potential',
    ])
  )],
  ['v i s u a l i z a d o r', ({ props }: Home) => (
    props.changeVisualizationMode()
  )],
  ['c o l d p l a y', (self: Home) => (
    playSoundCheat(self, [
      'violet hill',
      'talk',
      'brothers & sisters',
      'every teardrop is a waterfall',
    ])
  )],
  ['c y d o n i a', (self: Home) => (
    playSoundCheat(self, [
      'apocalypse please',
      'uprising',
      'the globalist',
      'knights of cydonia1',
      'knights of cydonia2',
    ])
  )],
  ['a n d r e s', () => {
    if (document.querySelector('iframe.andres') === null) {
      const iframe = document.createElement('iframe')
      iframe.setAttribute('width', String(window.innerWidth))
      iframe.setAttribute('height', String(window.innerHeight))
      iframe.setAttribute('src', 'https://www.youtube.com/embed/8arKaFFTFGo?autoplay=1'
                + '&controls=0&disablekb=1&fs=0&rel=0&showinfo=0&color=white&iv_load_policy=3')
      iframe.setAttribute('id', 'background')
      iframe.classList.add('andres')
      iframe.setAttribute('frameborder', '0')
      iframe.setAttribute('allowfullscreen', 'true')
      document.body.appendChild(iframe)
    }
  }],
])

type IndexProps = IndexStateToProps & IndexDispatchToProps & WithTranslation

interface StateProps {
  image: number
  keys: string[]
  disappearTimeout: NodeJS.Timer | null
  audioSource: AudioBufferSourceNode | null
}

export default class Home extends React.Component<IndexProps, StateProps> {
  player = new Player()

  private readonly cheat = new Cheat()

  private parallax: any

  constructor(props: IndexProps) {
    super(props)
    this.state = {
      image: 0,
      keys: [],
      disappearTimeout: null,
      audioSource: null,
    }

    this.cheat.onfail = () => {
      const { disappearTimeout } = this.state
      if (disappearTimeout) {
        clearTimeout(disappearTimeout)
      }
      this.setState({
        disappearTimeout: setTimeout(() => {
          this.setState({ keys: [], disappearTimeout: null })
        }, 200),
      })
    }

    this.cheat.onnext = (_, str) => {
      const { disappearTimeout, keys } = this.state
      if (disappearTimeout) {
        this.cheat.reset()
        return
      }

      this.setState({
        keys: [...keys, str === 'space' ? ' ' : str],
        disappearTimeout: null,
      })
    }

    this.cheat.ondone = () => {
      this.setState({
        disappearTimeout: setTimeout(() => {
          this.setState({ keys: [], disappearTimeout: null })
        }, 1000),
      })
    }

    cheats.forEach((value, key) => this.cheat.add(key).then(value.bind(null, this)))

    this.player.loadSound('atw', 'mp3', 'ogg')
    this.player.loadSound('stay', 'm4a', 'ogg')
    this.player.loadSound('staying alive', 'm4a', 'ogg')
    this.player.loadSound('staying alive2', 'm4a', 'ogg')
    this.player.loadSound('when-the-fire-starts-to-burn', 'm4a', 'ogg')
    this.player.loadSound('k&g beat', 'm4a', 'ogg')
    this.player.loadSound('nuits sonores', 'm4a', 'ogg')
    this.player.loadSound('for marmish 2', 'm4a', 'ogg')
    this.player.loadSound('peoples potential', 'm4a', 'ogg')
    this.player.loadSound('every teardrop is a waterfall', 'm4a', 'ogg')
    this.player.loadSound('violet hill', 'm4a', 'ogg')
    this.player.loadSound('brothers & sisters', 'm4a', 'ogg')
    this.player.loadSound('talk', 'm4a', 'ogg')
    this.player.loadSound('apocalypse please', 'm4a', 'ogg')
    this.player.loadSound('uprising', 'm4a', 'ogg')
    this.player.loadSound('the globalist', 'm4a', 'ogg')
    this.player.loadSound('knights of cydonia1', 'm4a', 'ogg')
    this.player.loadSound('knights of cydonia2', 'm4a', 'ogg')

    this.onWindowKeyDown = this.onWindowKeyDown.bind(this)
    this.onWindowBlur = this.onWindowBlur.bind(this)
    this.changeImage = this.changeImage.bind(this)
  }

  static get year() {
    const d = new Date()
    const n = new Date(830037600000)
    if (
      d.getMonth() > n.getMonth()
        || (d.getMonth() === n.getMonth() && d.getDate() >= n.getDate())
    ) {
      return d.getFullYear() - n.getFullYear()
    }
    return d.getFullYear() - n.getFullYear() - 1
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onWindowKeyDown)
    window.addEventListener('blur', this.onWindowBlur)
    this.parallax = new Parallax(document.querySelector('.profile_img'), { pointerEvents: true })
  }

  componentDidUpdate({
    darkMode: prevDarkMode,
    visualizationMode: prevVisualizationMode,
  }: IndexProps) {
    const { darkMode, t, visualizationMode } = this.props
    if (prevDarkMode !== darkMode) {
      if (darkMode) {
        const mensajes = t('.darkMode', { returnObjects: true })
        toast.info(mensajes[Math.trunc(Math.random() * mensajes.length)])
      } else {
        const mensajes = t('.lightMode', { returnObjects: true })
        toast.info(mensajes[Math.trunc(Math.random() * mensajes.length)])
      }
    }

    if (prevVisualizationMode !== visualizationMode) {
      toast.info(`Visualizador cambiado a '${visualizationMode || 'nada'}'`)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onWindowKeyDown)
    window.removeEventListener('blur', this.onWindowBlur)
    this.player.destroy()
    this.parallax.destroy()

    const { disappearTimeout } = this.state
    if (disappearTimeout) {
      clearTimeout(disappearTimeout)
    }
  }

  onWindowKeyDown(event: KeyboardEvent) {
    this.cheat.keydown(event.code)
  }

  onWindowBlur() {
    this.cheat.reset()
  }

  private changeImage() {
    this.setState(({ image }) => ({ image: (image + 1) % images.length }))
  }

  render() {
    const {
      audioSource,
      image,
      keys,
      disappearTimeout,
    } = this.state
    const { darkMode, t, visualizationMode } = this.props

    const keysDiv = (
      <div className="keys">
        { keys.map((key, i) => (
          <div
            className={`key ${disappearTimeout ? 'bye' : ''}`}
            // eslint-disable-next-line react/no-array-index-key
            key={`${key}-${i}`}
          >
            { key }
          </div>
        )) }
      </div>
    )

    return (
      <>

        <Helmet>
          <title>Home</title>
        </Helmet>

        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: 'calc(100vh - 130px)' }}
        >
          <div className="profile">
            <div className="profile_name">
              <h1>melchor9000</h1>
              <h3>Melchor Garau Madrigal</h3>
            </div>

            <div className="profile_img">
              <div className="layer" data-depth="0.3">
                <div className="image-wrapper">
                  <div className="image-wrapper-inner">
                    <Tapable onLongTap={this.changeImage}>
                      <img src={images[image]} alt="Me" />
                    </Tapable>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile_description">
              <p className="lead">
                { t('.bio.year', { count: Home.year }) }
                <br />
                { t('.bio.text1') }
                <br />
                { t('.bio.text2') }
              </p>
            </div>
          </div>
        </div>

        { keys.length > 0 || disappearTimeout ? keysDiv : null }

        <Visualizer
          audioContext={this.player.audioContext}
          audioSource={audioSource}
          visualizationMode={visualizationMode}
          theme={darkMode ? 'dark' : 'light'}
        />
      </>
    )
  }
}
