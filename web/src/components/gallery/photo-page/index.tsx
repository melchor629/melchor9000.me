import React, {
  useCallback, useEffect, useRef, useState,
} from 'react'
import { EventData, useSwipeable } from 'react-swipeable'
import { WithTranslation, withTranslation } from 'react-i18next'
import { Link, RouteComponentProps } from 'react-router-dom'

import ZoomImageView from './zoom-image-view'
import ImageInfoView from './image-info-view'
import ImageView from './image-view'
import { usePhotoActions, usePhotoState } from './redux-connector'
import LoadSpinner from '../../load-spinner'
import { GalleryPhoto, GalleryPhotoSizes } from '../../../redux/gallery/reducers'
import { runOnEnter } from '../../../lib/aria-utils'

type OverlayProps = RouteComponentProps<{ id: string }> & WithTranslation & {
  userId: string
  photosetId: string
  perPage: number
}

const requestIdleCallback = (window as any).requestIdleCallback || setTimeout

const findImageSuitableForScreen = (sizes: GalleryPhotoSizes): string => {
  let dimensionValue = Math.max(window.document.body.clientWidth, window.document.body.clientHeight)
  dimensionValue *= window.devicePixelRatio
  // Allow smaller images, it won't get noticed by the users in general :)
  dimensionValue *= 3 / 4
  const sortedSizes = Object.entries(sizes)
  // Discard original size, never is a good idea
    .filter((a) => a[0] !== 'Original')
    .sort((a, b) => Math.max(a[1].width, a[1].height) - Math.max(b[1].width, b[1].height))
  const goodSizes = sortedSizes.filter((a) => Math.max(a[1].width, a[1].height) >= dimensionValue)
  if (goodSizes.length > 0) {
    // The first is the smaller and suitable one
    return goodSizes[0][1].url
  }

  // Return the bigger one, there's no suitable
  return sortedSizes[sortedSizes.length - 1][1].url
}

interface SwipingState {
  dir: 'l' | 'r'
  xi: number
  yi: number
  x: number
  y: number
}

const PhotoImpl = ({
  userId, photosetId, match, history,
}: OverlayProps) => {
  const photoId = match.params.id
  const [topOrBottom, setTopOrBottom] = useState<'top' | 'bottom'>('top')
  const [zoomOpenStatus, setZoomOpenStatus] = useState<[ number, number ] | false>(false)
  const [swipingState, setSwipingState] = useState<SwipingState | null>(null)
  const imagePageContainerRef = useRef<HTMLDivElement | null>(null)
  const imageViewRef = useRef<HTMLDivElement | null>(null)
  const imageInfoRef = useRef<HTMLDivElement | null>(null)
  const {
    currentPhoto: photo,
    directionOfChange,
    previousPhoto,
    nextPhoto,
    prevPhoto,
    imageIsLoading,
    imageInfoIsLoading,
    imageSwitcher,
  } = usePhotoState()
  const {
    close,
    loadFullInfoForPhoto,
    photoIsLoaded,
    next,
    prev,
    enableHideNavbarOnTopMode,
    disableHideNavbarOnTopMode,
  } = usePhotoActions(userId, photosetId)

  useEffect(() => {
    enableHideNavbarOnTopMode()
    return () => {
      disableHideNavbarOnTopMode()
      close()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadFullInfoForPhoto(photoId)
  }, [photoId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (zoomOpenStatus === false) {
      const onKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight' && nextPhoto) {
          next()
          requestIdleCallback(() => history.push(`/gallery/${nextPhoto.id}`))
        } else if (e.key === 'ArrowLeft' && prevPhoto) {
          prev()
          requestIdleCallback(() => history.push(`/gallery/${prevPhoto.id}`))
        }
      }

      window.addEventListener('keydown', onKeyPress)
      return () => window.removeEventListener('keydown', onKeyPress)
    }

    return () => undefined
    }, [ prevPhoto, nextPhoto, zoomOpenStatus ]); //eslint-disable-line

  useEffect(() => {
    const onScroll = () => {
      const imageInfoElement = imageInfoRef.current
      if (imageInfoElement === null) {
        return
      }

      const windowHeight = window.innerHeight
      const verticalScroll = window.scrollY
      const imageInfoVerticalPosition = (
        imageInfoElement.getBoundingClientRect()!.top + verticalScroll
      )
      const limit = imageInfoVerticalPosition - windowHeight * 0.5
      if (limit > verticalScroll && topOrBottom === 'bottom') {
        setTopOrBottom('top')
      } else if (limit < verticalScroll && topOrBottom === 'top') {
        setTopOrBottom('bottom')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [topOrBottom, imageInfoRef])

  useEffect(() => {
    if (imagePageContainerRef.current) {
      imageViewRef.current = imagePageContainerRef.current.querySelector('.image-view')! as HTMLDivElement
    } else {
      imageViewRef.current = null
    }
  }, [imagePageContainerRef.current]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSwipedHorizontal = useCallback((newPhoto: GalleryPhoto | null, n: () => void) => () => {
    setSwipingState(null)
    if (newPhoto) {
      n()
      // For some reason, requestIdleCallback here caused a big delay in the transition
      setTimeout(() => history.push(`/gallery/${newPhoto.id}`))
    } else if (window.navigator.vibrate) {
      window.navigator.vibrate(150)
    }
  }, [history])

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

  const onSwiping = useCallback((e: EventData) => {
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
    onSwipedLeft: onSwipedHorizontal(nextPhoto, next),
    onSwipedRight: onSwipedHorizontal(prevPhoto, prev),
    onSwiping,
  })

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
  const currentPhotoUrl = imageIsLoading || !photo.sizes
    ? photo.url!
    : findImageSuitableForScreen(photo.sizes)
  const currentPhotoBigUrl = photo.sizes ? findImageSuitableForScreen(photo.sizes) : photo.url!
  const imageUrl1 = imageSwitcher ? previousPhotoUrl : currentPhotoUrl
  const imageUrl2 = imageSwitcher ? currentPhotoUrl : previousPhotoUrl

  return (
    <div className="image-page">
      <div className={`load-spinner-container ${(imageIsLoading || imageInfoIsLoading) && 'show'}`}>
        <LoadSpinner />
      </div>

      <div className="image-page-container" role="document" ref={imagePageContainerRef}>
        <div
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...handlers}
          className={`image-view ${photo.sizes ? '' : 'disable-zoom'}`}
          onClick={(e) => (e.target as HTMLElement).classList.contains('img') && openZoomModal(e as any)}
          onKeyUp={runOnEnter((e) => (e.target as HTMLElement).classList.contains('img') && openZoomModal(e as any))}
          role="button"
          tabIndex={0}
        >
          <img
            src={currentPhotoBigUrl}
            onLoad={photoIsLoaded}
            style={{ display: 'none' }}
            // eslint-disable-next-line no-underscore-dangle
            alt={typeof photo.title === 'string' ? photo.title : photo.title._content}
          />
          { nextPhoto && nextPhoto.url
              && <img src={nextPhoto.url} className="d-none" alt="preload next" /> }
          { prevPhoto && prevPhoto.url
              && <img src={prevPhoto.url} className="d-none" alt="preload prev" /> }

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
            <Link to={`/gallery/${nextPhoto && nextPhoto.id}`} onClick={next}>
              <i className="fas fa-chevron-right" />
            </Link>
          </div>
          <div
            className={`nav-button prev-button ${prevPhoto || 'hide'}`}
            style={swipeZoom('r')}
          >
            <Link to={`/gallery/${prevPhoto && prevPhoto.id}`} onClick={prev}>
              <i className="fas fa-chevron-left" />
            </Link>
          </div>
          <div className="nav-button secondary back-to-gallery">
            <Link to="/gallery">
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

        { photo.sizes && zoomOpenStatus
          && (
            <ZoomImageView
              photo={photo}
              currentSizeImageUrl={currentPhotoUrl}
              initialMousePosition={zoomOpenStatus}
              onClose={() => setZoomOpenStatus(false)}
              imageViewRef={imageViewRef}
            />
          ) }

        <ImageInfoView photo={photo} loading={imageInfoIsLoading} rootRef={imageInfoRef} />
      </div>
    </div>
  )
}

const PhotoPage = withTranslation()(PhotoImpl)
export default PhotoPage
