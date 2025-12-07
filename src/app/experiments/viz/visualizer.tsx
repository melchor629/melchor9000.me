/* eslint-disable react-hooks/immutability */
'use client'

import { styled } from '@mui/material/styles'
import { animated, useTransition } from '@react-spring/web'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Color } from 'three'

type VisualizerProps = Readonly<{
  audioContext: AudioContext
  audioSource: AudioBufferSourceNode | null
  mode: 'bars' | 'wave' | 'spectogram' | 'random' | null
}>

const VisualizerRoot = styled('div', {
  name: 'Visualizer',
  slot: 'root',
})({
  position: 'relative',
  width: '100%',
  height: '100%',
})

const VisualizerCanvas = styled(animated.canvas, {
  name: 'Visualizer',
  slot: 'canvas',
})({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
})

const Visualizer = ({ audioContext, audioSource, mode }: VisualizerProps) => {
  const audioAnalyzer = useMemo(() => {
    const a = audioContext.createAnalyser()
    a.maxDecibels = -5
    a.connect(audioContext.destination)
    return a
  }, [audioContext])
  const ready = audioSource != null
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const redrawRef = useRef<number>(null)

  const transitions = useTransition(ready, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const getCanvasSize = useCallback((): [number, number] =>
    container
      ? [container.clientWidth * window.devicePixelRatio, container.clientHeight * window.devicePixelRatio]
      : [0, 0]
  , [container])

  const drawBars = useCallback(() => {
    audioAnalyzer.fftSize = 512
    audioAnalyzer.smoothingTimeConstant = 0.7
    const bufferLength = audioAnalyzer.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const canvasContext = canvasRef.current!.getContext('2d')!
    const draw = () => {
      const [width, height] = getCanvasSize()
      const computedStyle = getComputedStyle(canvasRef.current!)
      canvasContext.clearRect(0, 0, width, height)

      audioAnalyzer.getByteFrequencyData(dataArray)
      canvasContext.fillStyle = computedStyle.getPropertyValue('--me-palette-primary-500')
      const barWidth = width / bufferLength
      for (let i = 0; i < bufferLength; i += 1) {
        const barHeight = height * dataArray[i] / 256
        canvasContext.fillRect(i * (barWidth + 1), height - barHeight, barWidth, barHeight)
      }

      redrawRef.current = requestAnimationFrame(draw)
    }

    redrawRef.current = requestAnimationFrame(draw)
  }, [audioAnalyzer, getCanvasSize])

  const drawWave = useCallback(() => {
    audioAnalyzer.fftSize = 4096
    audioAnalyzer.smoothingTimeConstant = 0.9
    const bufferLength = audioAnalyzer.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const canvasContext = canvasRef.current!.getContext('2d')!
    const draw = () => {
      const [width, height] = getCanvasSize()
      const computedStyle = getComputedStyle(canvasRef.current!)
      audioAnalyzer.getByteTimeDomainData(dataArray)
      canvasContext.clearRect(0, 0, width, height)

      canvasContext.lineWidth = 2 * window.devicePixelRatio
      canvasContext.strokeStyle = computedStyle.getPropertyValue('--me-palette-primary-500')
      canvasContext.beginPath()

      const sliceWidth = width / bufferLength
      let x = 0
      for (let i = 0; i < bufferLength; i += 1) {
        const v = dataArray[i] / 128.0
        const y = (v * height) / 2
        if (i === 0) {
          canvasContext.moveTo(x, y)
        } else {
          canvasContext.lineTo(x, y)
        }

        x += sliceWidth
      }

      canvasContext.lineTo(width, height / 2)
      canvasContext.stroke()
      redrawRef.current = requestAnimationFrame(draw)
    }

    redrawRef.current = requestAnimationFrame(draw)
  }, [audioAnalyzer, getCanvasSize])

  const drawSpectrogram = useCallback(() => {
    audioAnalyzer.fftSize = 4096
    audioAnalyzer.smoothingTimeConstant = 0.8
    const maxFrames = 30
    const bufferLength = audioAnalyzer.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const accumulatedData: Uint8Array[] = []
    const canvasContext = canvasRef.current!.getContext('2d')!
    const draw = () => {
      const [width, height] = getCanvasSize()
      const computedStyle = getComputedStyle(canvasRef.current!)
      audioAnalyzer.getByteFrequencyData(dataArray)
      accumulatedData.push(new Uint8Array(dataArray))
      if (accumulatedData.length > maxFrames) accumulatedData.shift()
      canvasContext.clearRect(0, 0, width, height)

      const byteWidth = width / maxFrames
      const byteHeight = height / bufferLength
      const baseColour = new Color(computedStyle.getPropertyValue('--me-palette-primary-500'))
      const it = Iterator.from(accumulatedData).map((value, index) => [value, index] as const)
      for (const [data, index] of it) {
        const x = width - (index + 1) * byteWidth
        for (let byte = 0; byte < bufferLength; byte += 1) {
          const byteValue = data[byte]
          const value = byteValue / 256.0
          const scale = byte ? Math.log(byte) / Math.log(bufferLength) : 0
          canvasContext.fillStyle = `rgba(${baseColour.r * 255}, ${baseColour.g * 255}, ${baseColour.b * 255}, ${value})`
          canvasContext.fillRect(x, scale * height, byteWidth, scale * byteHeight)
        }
      }

      redrawRef.current = requestAnimationFrame(draw)
    }

    redrawRef.current = requestAnimationFrame(draw)
  }, [audioAnalyzer, getCanvasSize])

  const draw = useCallback(() => {
    if (redrawRef.current) {
      cancelAnimationFrame(redrawRef.current)
      redrawRef.current = null
    }

    const finalMode = mode === 'random'
      ? (['bars', 'wave', 'spectogram'] as const)[Math.trunc(Math.random() * 2)]
      : mode
    if (finalMode === 'bars' || mode == null) {
      drawBars()
    } else if (finalMode === 'wave') {
      drawWave()
    } else if (finalMode === 'spectogram') {
      drawSpectrogram()
    }
  }, [drawBars, drawSpectrogram, drawWave, mode])

  const fillCanvasRef = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas
    if (canvas && container) {
      canvas.width = container.clientWidth * window.devicePixelRatio
      canvas.height = container.clientHeight * window.devicePixelRatio
    }
  }, [container])

  useLayoutEffect(() => {
    return () => {
      if (redrawRef.current) {
        cancelAnimationFrame(redrawRef.current)
      }
    }
  }, [])

  useLayoutEffect(() => {
    if (!container) {
      return () => {}
    }

    const resizeObserver = new ResizeObserver(() => {
      const { current: canvas } = canvasRef
      if (canvas) {
        canvas.width = container.clientWidth * window.devicePixelRatio
        canvas.height = container.clientHeight * window.devicePixelRatio
      }
    })
    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [container])

  useLayoutEffect(() => {
    audioSource?.connect(audioAnalyzer)
  }, [audioSource, audioAnalyzer])

  useLayoutEffect(() => {
    if (!audioSource) {
      return () => {}
    }

    draw()
    return () => {
      if (redrawRef.current) {
        cancelAnimationFrame(redrawRef.current)
        redrawRef.current = null
      }
    }
  }, [audioSource, draw])

  return (
    <VisualizerRoot ref={setContainer}>
      {transitions((style, value) => value && (
        <VisualizerCanvas
          ref={fillCanvasRef}
          style={style}
        />
      ))}
    </VisualizerRoot>
  )
}

export default Visualizer
