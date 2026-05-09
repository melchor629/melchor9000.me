'use client'

import { styled } from '@mui/material/styles'
import { useCallback, useLayoutEffect, useState } from 'react'
import Container from '@/components/container'
import PageHeader from '@/components/page-header'
import AudioContextHelper from './audio-context-helper'
import Visualizer from './visualizer'
import VisualizerControls from './visualizer-controls'
import VisualizerFilePicker from './visualizer-file-picker'

const VisualizerContentContainer = styled('div', { name: 'VisualizerContent', slot: 'container' })({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100dvw',
  height: '100dvh',
  zIndex: -1,
})

export default function VisualizerContent() {
  const [helper, setHelper] = useState<AudioContextHelper | null>(null)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null)
  const [mode, setMode] = useState<'bars' | 'wave' | 'spectogram'>('bars')

  const setBuffer = useCallback((buffer: AudioBuffer | null) => {
    setAudioBuffer(buffer)
    setAudioSource(as => {
      as?.stop()
      as?.disconnect()
      return null
    })
  }, [])

  useLayoutEffect(() => {
    const helper = new AudioContextHelper()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHelper(helper)
    return () => {
      void helper[Symbol.asyncDispose]()
    }
  }, [])

  return (
    <Container>
      <PageHeader
        title="Viz"
        subtitle="Drag (to here) or select (using the below button) a compatible song and let the magic happen. Any mp3 or wav file should work fine. mp4/m4a files depend on the platform but should work fine. opus should work too. ogg/oga and flac might be work on Chrome/Firefox. m4a with ALAC should work on Safari."
      />

      {helper && <VisualizerFilePicker helper={helper} setBuffer={setBuffer} />}

      {helper && (
        <VisualizerControls
          buffer={audioBuffer}
          context={helper.context}
          mode={mode}
          setMode={setMode}
          source={audioSource}
          setSource={setAudioSource}
        />
      )}

      {helper && (
        <VisualizerContentContainer>
          <Visualizer audioContext={helper.context} audioSource={audioSource} mode={mode} />
        </VisualizerContentContainer>
      )}
    </Container>
  )
}
