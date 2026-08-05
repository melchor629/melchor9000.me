import { AudioFile, Close } from '@mui/icons-material'
import { Button, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import { type ChangeEvent, type DragEvent, useCallback, useRef, useState } from 'react'
import HiddenInput from '@/components/hidden-input'
import AudioContextHelper from './audio-context-helper'

type VisualizerFilePickerProps = Readonly<{
  helper: AudioContextHelper
  setBuffer: (buffer: AudioBuffer | null) => void
}>

const Container = styled('div')(({ theme }) =>
  theme.unstable_sx({
    px: 1,
    mb: 1,
    border: '1px dashed',
    borderColor: 'transparent',
    borderRadius: 1,
    transition: theme.transitions.create('border-color', {
      duration: theme.transitions.duration.short,
    }),

    '&.dragging': {
      borderColor: 'primary.main',
    },
  }),
)

export default function VisualizerFilePicker({ helper, setBuffer }: VisualizerFilePickerProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadBuffer = useCallback(
    (file: File) => {
      setLoading(true)
      helper
        .load('s', file)
        .then(setBuffer)
        .catch(() => {})
        .finally(() => setLoading(false))
    },
    [helper, setBuffer],
  )

  return (
    <Container
      className={dragging ? 'dragging' : ''}
      onDragOver={useCallback((e: DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
        setDragging(true)
      }, [])}
      onDragLeave={useCallback((e: DragEvent) => {
        e.preventDefault()
        setDragging(false)
      }, [])}
      onDrop={useCallback(
        (e: DragEvent) => {
          e.preventDefault()
          setDragging(false)
          if (e.dataTransfer.files.length > 0) {
            if (e.dataTransfer.files[0].type.startsWith('audio/')) {
              setFile(e.dataTransfer.files[0])
              loadBuffer(e.dataTransfer.files[0])
            }
          }
        },
        [loadBuffer],
      )}
    >
      <Button
        color="inherit"
        startIcon={<AudioFile />}
        loading={loading}
        sx={{ textTransform: 'initial' }}
        onClick={useCallback(() => {
          const input = document.querySelector<HTMLInputElement>('input[name="sound-file"]')!
          input.click()
        }, [])}
      >
        {file?.name ?? 'Select file...'}
      </Button>
      <IconButton
        disabled={!file || loading}
        onClick={useCallback(() => {
          setFile(null)
          setBuffer(null)
          inputRef.current!.value = ''
        }, [setBuffer])}
      >
        <Close />
      </IconButton>
      <HiddenInput
        ref={inputRef}
        type="file"
        name="sound-file"
        accept="audio/*"
        onChange={useCallback(
          (e: ChangeEvent<HTMLInputElement>) => {
            const { files } = e.currentTarget
            if (files?.length) {
              setFile(files[0])
              loadBuffer(files[0])
            }
          },
          [loadBuffer],
        )}
      />
    </Container>
  )
}
