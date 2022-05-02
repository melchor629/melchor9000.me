import React, {
  useCallback, useEffect, useRef, useState,
} from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { SwipeEventData, useSwipeable } from 'react-swipeable'

import ZoomImageView from './zoom-image-view'
import ImageInfoViewMemo from './image-info-view'
import ImageView from './image-view'
import { usePhotoActions, usePhotoState } from './redux-connector'
import LoadSpinner from '../../load-spinner'
import { GalleryPhoto } from '../../../redux/gallery/state'
import { runOnEnter } from '../../../lib/aria-utils'

const requestIdleCallback = (window as any).requestIdleCallback || setTimeout

const findImageSuitableForScreen = (sizes: GalleryPhoto['sizes']): string => {
  let dimensionValue = Math.max(window.document.body.clientWidth, window.document.body.clientHeight)
  dimensionValue *= window.devicePixelRatio
  // Allow smaller images, it won't get noticed by the users in general :)
  dimensionValue *= 3 / 4
  const sortedSizes = sizes
    // Discard original size, never is a good idea
    .filter((a) => a.label !== 'Original')
    .sort((a, b) => Math.max(a.width, a.height) - Math.max(b.width, b.height))
  const goodSizes = sortedSizes.filter((a) => Math.max(a.width, a.height) >= dimensionValue)
  if (goodSizes.length > 0) {
    // The first is the smaller and suitable one
    return goodSizes[0].source
  }

  // Return the bigger one, there's no suitable
  return sortedSizes[sortedSizes.length - 1].source
}

interface SwipingState {
  dir: 'l' | 'r'
  xi: number
  yi: number
  x: number
  y: number
}

const PhotoPage = () => {
  const { id: photoId, photosetId } = useParams()
  const navigate = useNavigate()
  const [topOrBottom, setTopOrBottom] = useState<'top' | 'bottom'>('top')
  const [zoomOpenStatus, setZoomOpenStatus] = useState<[ number, number ] | false>(false)
  const [swipingState, setSwipingState] = useState<SwipingState | null>(null)
  const imageViewRef = useRef<HTMLDivElement | null>(null)
  const imageInfoRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver>()
  const {
    currentPhoto: photo,
    directionOfChange,
    previousPhoto,
    nextPhoto,
    prevPhoto,
    imageIsLoading,
    imageInfoIsLoading,
    imageSwitcher,
    error,
    photosetError,
  } = usePhotoState(photosetId!)
  const {
    close,
    loadFullInfoForPhoto,
    photoIsLoaded,
    next,
    prev,
    enableHideNavbarOnTopMode,
    disableHideNavbarOnTopMode,
  } = usePhotoActions(photosetId!)

  useEffect(() => {
    enableHideNavbarOnTopMode()
    return () => {
      disableHideNavbarOnTopMode()
      close()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadFullInfoForPhoto(photoId!)
  }, [photoId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (zoomOpenStatus === false) {
      const onKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' && nextPhoto) {
          next()
          requestIdleCallback(() => navigate(`../${nextPhoto.id}`))
        } else if (e.key === 'ArrowLeft' && prevPhoto) {
          prev()
          requestIdleCallback(() => navigate(`../${prevPhoto.id}`))
        }
      }

      window.addEventListener('keydown', onKeyPress)
      return () => window.removeEventListener('keydown', onKeyPress)
    }

    return () => undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevPhoto, nextPhoto, zoomOpenStatus, photosetId])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setTopOrBottom('bottom')
      } else {
        setTopOrBottom('top')
      }
    }, { threshold: 0.5 })
    observerRef.current = observer

    return () => {
      observer.disconnect()
    }
  }, [])

  const hasPhoto = !error && !photosetError && !!photo
  useEffect(() => {
    if (hasPhoto) {
      observerRef.current!.observe(imageInfoRef.current!)
    }
  }, [hasPhoto])

  const setRefs = useCallback((ref: HTMLDivElement | null) => {
    if (ref) {
      imageViewRef.current = ref.querySelector('.image-view') as HTMLDivElement
    } else {
      imageViewRef.current = null
    }
  }, [])

  const onSwipedHorizontal = useCallback((newPhoto: { id: string } | null, n: () => void) => () => {
    setSwipingState(null)
    if (newPhoto) {
      n()
      // For some reason, requestIdleCallback here caused a big delay in the transition
      setTimeout(() => navigate(`../${newPhoto.id}`))
    } else if (window.navigator.vibrate) {
      window.navigator.vibrate(150)
    }
  }, [navigate])

  const scrollToInfo = useCallback(() => {
    if (topOrBottom === 'top') {
      const imageInfoElement = imageInfoRef.current!
      window.scrollTo({
        behavior: 'smooth',
        // 40 is for the navbar
        top: imageInfoElement.getBoundingClientRect()!.top + window.scrollY - 40,
      })
    } else {
      window.scrollTo({ behavior: 'smooth', top: 0 })
    }
  }, [topOrBottom, imageInfoRef])

  const openZoomModal = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const initialPosition: [ number, number ] = [e.pageX, e.pageY]
    setZoomOpenStatus(initialPosition)
  }, [setZoomOpenStatus])

  const onSwiping = useCallback((e: SwipeEventData) => {
    if (e.dir !== 'Left' && e.dir !== 'Right') {
      return
    }

    const dir = e.dir === 'Left' ? 'l' : 'r'
    if (!swipingState) {
      setSwipingState({
        dir,
        xi: e.initial[0],
        yi: e.initial[1],
        x: e.absX,
        y: e.absY,
      })
    } else {
      setSwipingState({
        ...swipingState,
        dir,
        x: e.absX,
        y: e.absY,
      })
    }
  }, [swipingState, setSwipingState])

  const swipeZoom = (dir: 'l' | 'r') => {
    if (swipingState && swipingState.dir === dir) {
      const length = Math.sqrt(
        (swipingState.x - swipingState.xi) ** 2
          + (swipingState.y - swipingState.yi) ** 2,
      )
      const scale = Math.max(0, Math.min(length / 10 + 1, 2))
      return { transform: `scale(${scale})` }
    }
    return undefined
  }

  const handlers = useSwipeable({
    onSwipedLeft: onSwipedHorizontal(nextPhoto || null, next),
    onSwipedRight: onSwipedHorizontal(prevPhoto || null, prev),
    onSwiping,
  })

  if (error) {
    let text: string
    if (error.kind === 'not-found') {
      text = 'This image does not exist'
    } else if (error.kind === 'api') {
      text = 'There was a problem in the servers'
    } else {
      text = 'Something unknown happened...'
    }

    return (
      <div className="photo-overlay">
        <div className="image-page-container" role="document">
          <div className="text-center pt-5">
            <h1>{text}</h1>
            <p>{error.message}</p>
            <Link to="..">Go to photoset gallery</Link>
          </div>
        </div>
      </div>
    )
  }

  if (photosetError) {
    let text: string
    if (photosetError.kind === 'not-found') {
      text = 'This photoset does not exist'
    } else if (photosetError.kind === 'api') {
      text = 'There was a problem in the servers'
    } else {
      text = 'Something unknown happened...'
    }

    return (
      <div className="photo-overlay">
        <div className="image-page-container" role="document">
          <div className="text-center pt-5">
            <h1>{text}</h1>
            <p>{photosetError.message}</p>
            <Link to="../..">Go to gallery</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!photo) {
    return (
      <div className="photo-overlay">
        <div className="load-spinner-container show">
          <LoadSpinner />
        </div>
      </div>
    )
  }

  const previousPhotoUrl = (previousPhoto?.sizes
    ? findImageSuitableForScreen(previousPhoto.sizes)
    : previousPhoto?.url) ?? ''
  const currentPhotoUrl = imageIsLoading || !('sizes' in photo) || !photo.sizes
    ? photo.url
    : findImageSuitableForScreen(photo.sizes)
  const currentPhotoBigUrl = 'sizes' in photo && photo.sizes
    ? findImageSuitableForScreen(photo.sizes)
    : photo.url!
  const imageUrl1 = imageSwitcher ? previousPhotoUrl : currentPhotoUrl
  const imageUrl2 = imageSwitcher ? currentPhotoUrl : previousPhotoUrl

  return (
    <div className="image-page">
      <div className={`load-spinner-container ${(imageIsLoading || imageInfoIsLoading) && 'show'}`}>
        <LoadSpinner />
      </div>

      <div className="image-page-container" role="document" ref={setRefs}>
        <div
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...handlers}
          className={`image-view ${'sizes' in photo ? '' : 'disable-zoom'}`}
          onClick={(e) => (e.target as HTMLElement).classList.contains('img') && openZoomModal(e as any)}
          onKeyUp={runOnEnter((e) => (e.target as HTMLElement).classList.contains('img') && openZoomModal(e as any))}
          role="button"
          tabIndex={0}
        >
          <img
            src={currentPhotoBigUrl}
            // do not sent the onload event if bigger sizes are not loaded yet
            onLoad={'sizes' in photo && photo.sizes ? photoIsLoaded : undefined}
            style={{ display: 'none' }}
            alt={photo.title}
          />
          {nextPhoto?.url && <img src={nextPhoto.url} className="d-none" alt="preload next" />}
          {prevPhoto?.url && <img src={prevPhoto.url} className="d-none" alt="preload prev" />}

          <ImageView
            imageSwitcher={imageSwitcher}
            imageUrl1={imageUrl1}
            imageUrl2={imageUrl2}
            changeDirection={directionOfChange}
          />

          <div
            className={`nav-button next-button ${nextPhoto || 'hide'}`}
            style={swipeZoom('l')}
          >
            <Link to={`../${nextPhoto && nextPhoto.id}`} onClick={next}>
              <i className="fas fa-chevron-right" />
            </Link>
          </div>
          <div
            className={`nav-button prev-button ${prevPhoto || 'hide'}`}
            style={swipeZoom('r')}
          >
            <Link to={`../${prevPhoto && prevPhoto.id}`} onClick={prev}>
              <i className="fas fa-chevron-left" />
            </Link>
          </div>
          <div className="nav-button secondary back-to-gallery">
            <Link to="..">
              <i className="fas fa-arrow-left mr-2" />
              <i className="fas fa-images" />
            </Link>
          </div>
          <div className="nav-button secondary info" onClick={scrollToInfo} onKeyUp={runOnEnter(scrollToInfo)} role="button" tabIndex={0}>
            <i className={`fas fa-arrow-down ${topOrBottom}`} />
            <i />
          </div>
          <div className="nav-button secondary zoom d-block d-lg-none" onClick={openZoomModal} onKeyUp={runOnEnter(scrollToInfo)} role="button" tabIndex={0}>
            <i className="fas fa-expand" />
            <i />
          </div>
        </div>

        {'sizes' in photo && zoomOpenStatus && (
          <ZoomImageView
            photo={photo}
            currentSizeImageUrl={currentPhotoUrl}
            initialMousePosition={zoomOpenStatus}
            onClose={() => setZoomOpenStatus(false)}
            imageViewRef={imageViewRef}
          />
        )}

        <ImageInfoViewMemo photo={photo} loading={imageInfoIsLoading} rootRef={imageInfoRef} />
      </div>
    </div>
  )
}

export default PhotoPage
