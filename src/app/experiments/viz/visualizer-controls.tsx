import { BarChart, Pause, PlayArrow, ShowChart, Stop } from '@mui/icons-material'
import { Box, FormControlLabel, IconButton, Radio, RadioGroup, Slider } from '@mui/material'
import { type ChangeEvent, type SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react'

type VisualizerControlsProps = Readonly<{
  buffer: AudioBuffer | null
  context: AudioContext
  mode: 'bars' | 'wave' | 'spectogram'
  setMode: (mode: 'bars' | 'wave' | 'spectogram') => void
  setSource: (source: AudioBufferSourceNode | null) => void
  source: AudioBufferSourceNode | null
}>

const BarIcon = <BarChart />
const WaveIcon = <ShowChart />

export default function VisualizerControls({ buffer, context, mode, setMode, setSource, source }: VisualizerControlsProps) {
  const [startPosition, setStartPosition] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [changingPosition, setChangingPosition] = useState(false)
  const gainNode = useMemo(() => {
    const node = new GainNode(context, { gain: -0.2 })
    node.connect(context.destination)
    return node
  }, [context])

  const play = useCallback((otherStartPosition?: number | SyntheticEvent) => {
    if (!buffer) return

    const source = new AudioBufferSourceNode(context, { buffer })
    const startPos = typeof otherStartPosition === 'number' ? otherStartPosition : startPosition ?? 0
    source.connect(gainNode)
    source.start(0, startPos)
    setSource(source)
    setStartPosition(startPos)
    setCurrentPosition(startPos)
    setStartTime(context.currentTime)
  }, [buffer, context, gainNode, setSource, startPosition])

  const stop = useCallback(() => {
    if (source) {
      source.stop(0)
      source.disconnect()
      setSource(null)
    }
    setStartPosition(null)
    setStartTime(null)
    setCurrentPosition(0)
  }, [setSource, source])

  const pause = useCallback(() => {
    if (!source) return

    setStartPosition((s) => s! + context.currentTime - startTime!)
    setStartTime(null)
    setSource(null)
    source.stop(0)
    source.disconnect()
  }, [context, setSource, source, startTime])

  const duringChangePosition = useCallback((_: Event | SyntheticEvent, value: number) => {
    setChangingPosition(true)
    setCurrentPosition(value)
  }, [])

  const changePosition = useCallback((_: Event | SyntheticEvent, value: number) => {
    setChangingPosition(false)
    setCurrentPosition(value)
    source?.stop(0)
    play(value)
  }, [play, source])

  useEffect(() => {
    if (startTime == null || startPosition == null || changingPosition) {
      return () => {}
    }

    const updater = () => {
      setCurrentPosition((context.currentTime - startTime) + startPosition)
    }

    const id = setInterval(updater, 100)
    return () => clearInterval(id)
  }, [context, startTime, startPosition, changingPosition])

  if (!source && startTime) {
    stop()
  }

  return (
    <div>
      <Box sx={{ display: 'flex', gap: 2.5, mx: 1 }}>
        <Slider
          value={currentPosition}
          step={0.1}
          max={buffer?.duration ?? 1}
          valueLabelDisplay="auto"
          valueLabelFormat={useCallback((x: number) => `${x.toFixed(1)}s`, [])}
          disabled={buffer == null}
          onChange={duringChangePosition}
          onChangeCommitted={changePosition}
        />
        <Slider
          defaultValue={gainNode.gain.value + 1}
          step={0.01}
          min={0}
          max={1.5}
          marks={[{ value: 1 }]}
          valueLabelDisplay="auto"
          valueLabelFormat={useCallback((x: number) => `${Math.trunc(x * 100)}%`, [])}
          sx={{ width: '20%', minWidth: 100 }}
          onChange={useCallback((_: Event, value: number) => {
            gainNode.gain.exponentialRampToValueAtTime(value - 1 || 0.01, context.currentTime + 0.1)
          }, [gainNode, context])}
          disabled={buffer == null}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        {startTime == null && (
          <IconButton onClick={play} disabled={buffer == null}>
            <PlayArrow />
          </IconButton>
        )}
        {startTime != null && (
          <IconButton onClick={pause} disabled={buffer == null}>
            <Pause />
          </IconButton>
        )}
        <IconButton onClick={stop} disabled={buffer == null}>
          <Stop />
        </IconButton>
        <RadioGroup
          value={mode}
          onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setMode(e.target.value as never), [setMode])}
          sx={{ flexDirection: 'row', gap: 1, '& > label': { margin: 0 } }}
        >
          <FormControlLabel value="bars" control={<Radio icon={BarIcon} checkedIcon={BarIcon} />} label="" />
          <FormControlLabel value="wave" control={<Radio icon={WaveIcon} checkedIcon={WaveIcon} />} label="" />
          <FormControlLabel value="spectogram" control={<Radio icon={WaveIcon} checkedIcon={WaveIcon} />} label="" />
        </RadioGroup>
      </Box>
    </div>
  )
}
