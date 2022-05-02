import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  ChangeEventHandler,
  DragEventHandler,
} from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { shallowEqual } from 'react-redux'
import { Spring, animated } from '@react-spring/web'
import { Helmet } from 'react-helmet-async'
import * as toast from '../lib/toast'
import Visualizer from './visualizer'
import Player from '../lib/player'
import { useSelector } from '../redux'

// TODO terminar
interface VizState {
  audioSource: AudioBufferSourceNode | null
  visualizationMode: 'bars' | 'wave'
  fileName: string | null
  timePosition: number | null
  timeDuration: number
  dragging: boolean
  seeking: boolean
  startPos: number
}

const vizReducer = (state: VizState, action: Partial<VizState>): VizState => ({
  ...state,
  ...action,
})

const initialState: VizState = {
  audioSource: null,
  visualizationMode: 'bars',
  fileName: null,
  timePosition: null,
  timeDuration: 1,
  dragging: false,
  seeking: false,
  startPos: 0,
}

const Viz = () => {
  const darkMode = useSelector(({ effects }) => effects.darkMode, shallowEqual)
  const [t] = useTranslation()
  const playerRef = useRef<Player>()
  const positionTimerRef = useRef<number>()
  const [{
    audioSource,
    visualizationMode,
    fileName,
    timePosition,
    timeDuration,
    dragging,
    seeking,
    startPos,
  }, setState] = useReducer(vizReducer, initialState)

  if (!playerRef.current) {
    // init must be done as fast as possible (cannot be placed inside an useEffect)
    playerRef.current = new Player()
  }

  useEffect(() => () => {
    if (positionTimerRef.current) {
      cancelAnimationFrame(positionTimerRef.current)
    }

    playerRef.current!.destroy()
  }, [])

  useEffect(() => {
    if (audioSource) {
      const ended = () => {
        if (!seeking) {
          setState({ audioSource: null, timePosition: null })
        }

        if (positionTimerRef.current) {
          cancelAnimationFrame(positionTimerRef.current)
          positionTimerRef.current = undefined
        }
      }

      audioSource.addEventListener('ended', ended)
      return () => audioSource.removeEventListener('ended', ended)
    }

    return () => undefined
  }, [audioSource, seeking])

  const play = useCallback((startPosition?: number) => {
    audioSource?.stop()
    playerRef.current!.playSound('song', startPosition).then((newAudioSource) => {
      const startTime = playerRef.current!.audioContext.currentTime
      setState({
        audioSource: newAudioSource,
        timePosition: 0,
        timeDuration: newAudioSource.buffer!.duration,
        startPos: startPosition || 0,
      })

      const updateTimePosition = () => {
        setState({
          timePosition: playerRef.current!.audioContext.currentTime - startTime,
        })
        positionTimerRef.current = requestAnimationFrame(updateTimePosition)
      }
      positionTimerRef.current = requestAnimationFrame(updateTimePosition)
    }).catch((error) => toast.error(`${t('viz.cannotPlay')}${error}`))
  }, [t, audioSource])

  const fileChanged: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    event.preventDefault()
    playerRef.current!.unloadSong('song')
    if (event.target.files?.length) {
      playerRef.current!.loadFile('song', event.target.files[0]).then(() => {
        play()
      }).catch((error) => toast.error(error.toString()))
      setState({ fileName: event.target.files[0].name })
    } else {
      setState({ fileName: null })
    }
  }, [play])

  const visualizationModeChanged: ChangeEventHandler<HTMLSelectElement> = useCallback((event) => {
    setState({
      visualizationMode: event.target.value as 'bars' | 'wave',
    })
  }, [])

  const playPressed = useCallback(() => {
    if (!audioSource) {
      play()
    }
  }, [audioSource, play])

  const stopPressed = useCallback(() => {
    audioSource?.stop()
  }, [audioSource])

  const enterDrag: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'copy'
    setState({ dragging: true })
  }, [])

  const exitDrag: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()
    setState({ dragging: false })
  }, [])

  const dropped: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()

    playerRef.current!.unloadSong('song')
    playerRef.current!.loadFile('song', event.dataTransfer.files[0]).then(() => {
      play()
    }).catch((error) => toast.error(error.toString()))

    setState({
      fileName: event.dataTransfer.files[0].name,
      dragging: false,
    })
  }, [play])

  const seekBarStart = useCallback(() => {
    if (audioSource) {
      setState({
        seeking: true,
        audioSource: null,
        startPos: 0,
        timeDuration: startPos + timeDuration,
        timePosition: timePosition! + startPos,
      })
      audioSource.stop()
      if (positionTimerRef.current) {
        cancelAnimationFrame(positionTimerRef.current)
        positionTimerRef.current = undefined
      }
    }
  }, [audioSource, startPos, timeDuration, timePosition])

  const seekBarChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setState({
      timePosition: parseInt(event.target.value, 10),
    })
  }, [])

  const seekBarEnd = useCallback(() => {
    play(timePosition!)
    setState({ seeking: false })
  }, [play, timePosition])

  return (
    <div onDragOver={enterDrag} onDragLeave={exitDrag} onDrop={dropped}>

      <Helmet>
        <title>Viz</title>
        <meta
          name="Description"
          content="Experiment: Audio vizualizer in the browser"
        />
      </Helmet>

      <div className="row">
        <p className="lead">
          <Trans i18nKey="viz.description">
            Arrastra (hasta aquí) o busca (con el botón de abajo) una canción compatible con tu
            navegador y deja que la magia actúe.
            Con cualquier mp3 o wav debería ir, puedes probar con m4a (aac (
            <i>
              alac tambien, si usas
              Safari
            </i>
            )) o con ogg (vorbis).
            Ultimamente flac también va.
          </Trans>
        </p>
      </div>

      <div className="row">
        <div className="col-sm-6 col-12">
          <input
            type="file"
            id="cancion"
            name="cancion"
            accept="audio/*"
            onChange={fileChanged}
            className="form-control"
          />
        </div>
        <div className="col-sm-6 col-12">
          <select
            id="visualizador"
            className="form-select"
            aria-label="Select form of wave"
            value={visualizationMode}
            onChange={visualizationModeChanged}
          >
            <option value="bars">{t('viz.bars')}</option>
            <option value="wave">{t('viz.wave')}</option>
          </select>
        </div>
      </div>

      <div
        className="d-flex justify-content-center btn-group mt-2"
        role="group"
        aria-label="Botones de reproducir y pausa"
      >
        <input
          type="button"
          className="btn btn-secondary"
          value={t<string>('viz.play')}
          id="play"
          onClick={playPressed}
          disabled={!fileName || !!audioSource || seeking}
        />
        <input
          type="button"
          className="btn btn-secondary"
          value={t<string>('viz.pause')}
          id="stop"
          onClick={stopPressed}
          disabled={!audioSource}
        />
      </div>

      <div className="row mt-2">
        <input
          type="range"
          className="form-range"
          id="pos"
          min={0}
          max={timeDuration + startPos}
          value={startPos + (timePosition || 0)}
          step={0.1}
          style={{ width: '100%' }}
          disabled={!timePosition && !seeking}
          onChange={seekBarChange}
          onMouseDown={seekBarStart}
          onMouseUp={seekBarEnd}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1,
          display: 'flex',
        }}
      >
        <Visualizer
          audioContext={playerRef.current!.audioContext}
          audioSource={audioSource}
          visualizationMode={visualizationMode}
          theme={darkMode ? 'dark' : 'light'}
        />
      </div>

      <Spring
        from={{ opacity: 0, zIndex: -1 }}
        to={{ opacity: dragging ? 1 : 0, zIndex: dragging ? 1 : -1 }}
      >
        {(style) => (
          <animated.div
            style={{
              position: 'fixed',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              backgroundColor: 'rgb(200, 200, 200, 0.4)',
              ...style,
            }}
            className="arrastrar d-flex justify-content-center align-items-center"
          >
            <div className="text-center">
              { t('viz.drop') }
            </div>
          </animated.div>
        )}
      </Spring>
    </div>
  )
}

export default Viz
