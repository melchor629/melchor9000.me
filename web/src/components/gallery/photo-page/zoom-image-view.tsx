import React, {
  memo, useEffect, useRef, useState,
} from 'react'
import { animated, useSpring } from 'react-spring'
import { GalleryPhoto } from '../../../redux/gallery/reducers'

interface ZoomImageOverlayProps {
  photo: GalleryPhoto
  currentSizeImageUrl: string
  initialMousePosition?: [number, number]
  onClose: () => void
  imageViewRef: React.MutableRefObject<HTMLDivElement | null>
}

type Coords = [ number, number ]

const normalizeMouseCoordinates = (coords: Coords): Coords => [
  coords[0] / window.innerWidth,
  coords[1] / window.innerHeight,
]

const calculateTranslation = (
  imageSize: { width: number, height: number },
  normCoords: Coords,
): Coords => {
  const margin = 100
  const imageSizeWithMargin: Coords = [
    imageSize.width + 2 * margin,
    imageSize.height + 2 * margin,
  ]

  return [
    normCoords[0] * (window.innerWidth - imageSizeWithMargin[0]),
    normCoords[1] * (window.innerHeight - imageSizeWithMargin[1]),
  ]
}

const translate = (coords: Coords, scale?: number) => `translate3d(${coords[0]}px, ${coords[1]}px, 0px) scale(${scale || 1})`
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max))

const calculateInitialTranslation = (
  imageSize: { width: number, height: number },
  imageView: HTMLDivElement,
) => {
  const width = imageView.clientWidth
  const height = imageView.clientHeight

  const ratioImage = imageSize.height / imageSize.width
  const ratioWindow = height / width
  let scale: number
  const position: Coords = [0, 0]
  if (ratioImage > ratioWindow) {
    scale = height / imageSize.height
    position[0] = (width - imageSize.width * scale) / 2 - 100
    position[1] = -100 - window.scrollY
  } else {
    scale = width / imageSize.width
    position[0] = -100 - window.scrollX
    position[1] = (height - imageSize.height * scale) / 2 - 100
  }

  return translate(position, scale)
}

const ZoomImageView = ({
  currentSizeImageUrl,
  onClose,
  initialMousePosition,
  photo,
  imageViewRef,
}: ZoomImageOverlayProps) => {
  const bestQualityImage = photo.sizes
    // Original give us tons of problems with rotation
    .filter(({ label }) => label !== 'Original')
    .sort((a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height))[0]
  const currentPositionRef = useRef<Coords>(
    initialMousePosition
      ? calculateTranslation(bestQualityImage, normalizeMouseCoordinates(initialMousePosition))
      : [0, 0],
  )
  const touchRef = useRef<Coords | null>(null)
  const [isClosing, setIsClosing] = useState(false)

  const [containerStyles, setContainerStyles] = useSpring(() => ({
    width: bestQualityImage.width,
    height: bestQualityImage.height,
    transform: translate(currentPositionRef.current),
    from: { transform: calculateInitialTranslation(bestQualityImage, imageViewRef.current!) },
  }))
  const modalStyles = useSpring({
    backgroundColor: isClosing ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.5)',
    from: { backgroundColor: 'rgba(0, 0, 0, 0)' },
  })

  useEffect(() => {
    window.document.body.style.overflow = 'hidden'
    return () => {
      // TODO disable this after animation ended
      window.document.body.style.overflow = ''
    }
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isClosing) {
      return
    }

    const mouseCoords: Coords = [
      e.pageX - window.pageXOffset,
      e.pageY - window.pageXOffset,
    ]
    const normalizedCoordinates = normalizeMouseCoordinates(mouseCoords)
    const imageTranslation = calculateTranslation(bestQualityImage, normalizedCoordinates)

    currentPositionRef.current = imageTranslation
    setContainerStyles({ transform: translate(imageTranslation) })
  }

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (e.cancelable) {
      e.preventDefault()
    }

    if (isClosing) {
      return
    }

    const ne: WheelEvent & { wheelDeltaX?: number, wheelDeltaY?: number } = e.nativeEvent
    const wheelDiffCoords: Coords = [
      ne.wheelDeltaX === undefined ? (-e.deltaX || 0) * 2 : ne.wheelDeltaX,
      ne.wheelDeltaY === undefined ? (-e.deltaY || 0) * 2 : ne.wheelDeltaY,
    ]

    const minTranslationPossible = calculateTranslation(bestQualityImage, [0, 0])
    const maxTranslationPossible = calculateTranslation(bestQualityImage, [1, 1])
    const newPosition = [
      currentPositionRef.current[0] + wheelDiffCoords[0],
      currentPositionRef.current[1] + wheelDiffCoords[1],
    ]
    const imageTranslation: Coords = [
      clamp(newPosition[0], maxTranslationPossible[0], minTranslationPossible[0]),
      clamp(newPosition[1], maxTranslationPossible[1], minTranslationPossible[1]),
    ]

    currentPositionRef.current = imageTranslation
    setContainerStyles({ transform: translate(imageTranslation) })
  }

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isClosing) {
      return
    }

    if (e.touches.length === 1) {
      touchRef.current = [e.touches[0].clientX, e.touches[0].clientY]
    } else if (e.touches.length > 1) {
      touchRef.current = null
    }
  }

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (e.cancelable) {
      e.preventDefault()
    }

    if (isClosing) {
      return
    }

    if (e.changedTouches.length === 1 && touchRef.current) {
      const touchDiffCoords: Coords = [
        e.changedTouches[0].clientX - touchRef.current[0],
        e.changedTouches[0].clientY - touchRef.current[1],
      ]

      const minTranslationPossible = calculateTranslation(bestQualityImage, [0, 0])
      const maxTranslationPossible = calculateTranslation(bestQualityImage, [1, 1])
      const newPosition = [
        currentPositionRef.current[0] + touchDiffCoords[0] * 2,
        currentPositionRef.current[1] + touchDiffCoords[1] * 2,
      ]
      const imageTranslation: Coords = [
        clamp(newPosition[0], maxTranslationPossible[0], minTranslationPossible[0]),
        clamp(newPosition[1], maxTranslationPossible[1], minTranslationPossible[1]),
      ]

      touchRef.current = [e.touches[0].clientX, e.touches[0].clientY]
      currentPositionRef.current = imageTranslation
      setContainerStyles({ transform: translate(imageTranslation) })
    }
  }

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isClosing) {
      return
    }

    if (e.touches.length === 0) {
      touchRef.current = null
    } else if (e.touches.length === 1) {
      touchRef.current = [e.touches[0].clientX, e.touches[0].clientY]
    }
  }

  const onWantToClose = () => {
    setContainerStyles({
      transform: calculateInitialTranslation(bestQualityImage, imageViewRef.current!),
    })
    setIsClosing(true)
    setTimeout(onClose, 666)
  }

  return (
    <animated.div
      className="zoom-modal"
      style={modalStyles}
      onMouseMove={onMouseMove}
      onClick={onWantToClose}
      onWheel={onWheel}
      onScroll={(e) => e.preventDefault()}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <animated.div className="zoom-container" style={containerStyles}>
        <img
          src={currentSizeImageUrl}
          className="img-small"
          alt={photo.description || 'Zoomed image'}
        />
        <img
          src={bestQualityImage.source}
          className="img-big"
          alt={photo.description || 'Zoomed image'}
        />
      </animated.div>
    </animated.div>
  )
}

ZoomImageView.defaultProps = {
  initialMousePosition: undefined,
}

const ZoomImageViewMemo = memo(
  ZoomImageView,
  (a, b) => a.photo.id === b.photo.id,
)

export default ZoomImageViewMemo
