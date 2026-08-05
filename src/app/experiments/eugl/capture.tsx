'use client'

import { Button, CircularProgress, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { type ChangeEvent, useCallback, useRef, useState } from 'react'
import { type CropperRef, Cropper } from 'react-advanced-cropper'
import HiddenInput from '@/components/hidden-input'
import 'react-advanced-cropper/dist/style.css'

const CaptureRoot = styled(Paper, {
  name: 'Capture',
  slot: 'root',
  shouldForwardProp: (prop) => prop !== 'small',
})<{ small?: true }>(({ small, theme }) => ({
  position: 'absolute',
  top: `calc(48px + ${theme.spacing(0.75)})`,
  left: theme.spacing(1),
  width: small ? '224px' : `calc(400px + 2 * ${theme.vars.spacing})`,
  height: small ? '52px' : `calc(268px + 2 * ${theme.vars.spacing})`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  paddingBlock: theme.spacing(1),
  paddingInline: theme.spacing(1),

  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.short,
  }),
}))

const CaptureVideo = styled('video', {
  name: 'Capture',
  slot: 'video',
  shouldForwardProp: (prop) => prop !== 'show',
})<{ show: boolean }>(({ show, theme }) => ({
  width: 400,
  height: 225,
  cursor: 'pointer',
  display: show ? 'block' : 'none',
  borderRadius: theme.shape.borderRadius,
}))

const CaptureCropper = styled(Cropper, {
  name: 'Capture',
  slot: 'cropper',
})(({ theme }) => ({
  width: 400,
  height: 225,
  borderRadius: theme.shape.borderRadius,
}))

const CaptureButtons = styled('div', {
  name: 'Capture',
  slot: 'buttons',
})(({ theme }) => ({
  display: 'inline-flex',
  gap: theme.spacing(0.5),
  color: theme.vars.palette.text.secondary,
}))

type Props = Readonly<{
  onImageChange?: (imageUrl: string) => void
}>

export default function Capture({ onImageChange }: Props) {
  const [initial, setInitial] = useState(true)
  const [loading, setLoading] = useState(false)
  const streamRef = useRef<MediaStream>(undefined)
  const videoRef = useRef<HTMLVideoElement>(null)
  const cropperRef = useRef<CropperRef>(null)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)

  const capture = useCallback(() => {
    const { current: video } = videoRef
    const { current: stream } = streamRef
    if (!video || !stream) {
      return
    }

    const videocanvas = document.createElement('canvas')
    const settings = stream.getVideoTracks()[0].getSettings()
    videocanvas.width = settings.width!
    videocanvas.height = settings.height!
    videocanvas.getContext('2d')?.drawImage(video, 0, 0, videocanvas.width, videocanvas.height)
    video.pause()
    video.srcObject = null
    stream.getTracks()[0].stop()
    streamRef.current = undefined
    setImageToCrop(videocanvas.toDataURL('image/png'))
  }, [])

  const cancel = useCallback(() => {
    setInitial(true)
    setLoading(false)
    setImageToCrop(null)
    streamRef.current = undefined
  }, [])

  const crop = useCallback(() => {
    if (!cropperRef.current) {
      return
    }

    const croppedImageUrl = cropperRef.current.getCanvas()!.toDataURL()
    onImageChange?.(croppedImageUrl)
    cancel()
  }, [cancel, onImageChange])

  const startCapture = useCallback(() => {
    setInitial(false)
    setLoading(true)
    new Promise((resolve) => setTimeout(resolve, 225))
      .then(() =>
        navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: 'user',
            backgroundBlur: { ideal: true },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        }),
      )
      .then((stream) => {
        streamRef.current = stream
        videoRef.current!.srcObject = stream
        return videoRef.current!.play()
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const selectedFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target.files?.[0]) {
      setLoading(true)
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setLoading(false)
        if (typeof reader.result === 'string') {
          setInitial(false)
          setImageToCrop(reader.result)
        }
      })
      reader.addEventListener('error', () => setLoading(false))
      reader.readAsDataURL(e.target.files[0])
    }
  }, [])

  if (initial) {
    return (
      <CaptureRoot elevation={4} small>
        <CaptureButtons>
          <Button onClick={startCapture}>Take a snap!</Button>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <Button component="label" tabIndex={-1} loading={loading} color="inherit">
            Select file
            <HiddenInput type="file" accept="image/*" onChange={selectedFile} />
          </Button>
        </CaptureButtons>
      </CaptureRoot>
    )
  }

  if (!imageToCrop) {
    return (
      <CaptureRoot elevation={4}>
        {loading && <CircularProgress variant="indeterminate" color="primary" />}
        <CaptureVideo ref={videoRef} show={!loading} onClick={capture} />
        {!loading && (
          <CaptureButtons>
            <Button color="primary" onClick={capture}>
              Capture!
            </Button>
            <Button color="inherit" onClick={cancel}>
              Cancel
            </Button>
          </CaptureButtons>
        )}
      </CaptureRoot>
    )
  }

  return (
    <CaptureRoot elevation={4}>
      <CaptureCropper
        ref={cropperRef}
        src={imageToCrop}
        stencilProps={{
          aspectRatio: 1,
          grid: true,
        }}
        aspectRatio={{ minimum: 1, maximum: 1 }}
      />
      <CaptureButtons>
        <Button color="primary" onClick={crop}>
          Use it!
        </Button>
        <Button color="inherit" onClick={cancel}>
          Cancel
        </Button>
      </CaptureButtons>
    </CaptureRoot>
  )
}
