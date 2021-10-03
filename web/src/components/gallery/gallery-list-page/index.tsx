import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import Header from './header'
import PhotoItem from './photo-item'
import { useGalleryListActions, useGalleryListState } from './redux-connector'
import LoadSpinner from '../../load-spinner'

const GalleryListPage = ({ match }: RouteComponentProps<{ photosetId: string }>) => {
  const { photosetId } = match.params
  const [page, setPage] = useState(0)
  const photoset = useGalleryListState(photosetId)
  const { loadFirstPhotos, loadMorePhotos } = useGalleryListActions(photosetId)
  const spinnerRef = useRef<HTMLDivElement>(null)
  const loadEntriesRef = useRef<() => void>()

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadEntriesRef.current?.()
      }
    }, { rootMargin: '100px 0px' })
    if (spinnerRef.current) {
      observer.observe(spinnerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  })

  useEffect(() => {
    if (!photoset) {
      loadFirstPhotos()
    }
  }, [photoset]) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    loading,
    photos,
    primary,
    totalPhotos,
  } = photoset ?? { photos: [], totalPhotos: 0, primary: null }
  const perPage = 15
  const photosLoaded = photos.length
  const morePhotosToLoad = page < Math.floor(totalPhotos / perPage) + 1

  loadEntriesRef.current = useCallback(() => {
    if (loading) {
      return
    }

    if (page * perPage >= photosLoaded) {
      loadMorePhotos()
    } else {
      setPage(page + 1)
    }
  }, [loading, loadMorePhotos, photosLoaded, page, perPage])

  if (photoset?.error) {
    return (
      <div className="text-center pt-5">
        <h1>
          {photoset.error.kind === 'not-found'
            ? 'This photoset does not exist'
            : 'Something bad happened :('}
        </h1>
        <p>{photoset.error.message}</p>
        <Link to="/gallery">Go to gallery</Link>
      </div>
    )
  }

  const spinnerClasses = !morePhotosToLoad
    ? ['d-none']
    : ['d-flex', 'justify-content-center']

  return (
    <div style={{ paddingTop: 300 }} className="mb-4">
      <Helmet>
        <title>Gallery</title>
        <meta
          name="Description"
          content="Gallery of photos taken by melchor9000"
        />
      </Helmet>

      <Header photo={primary} />

      <div className="gallery">
        {photos.slice(0, page * perPage).map((photo) => <PhotoItem photo={photo} key={photo.id} />)}
      </div>

      <div className={spinnerClasses.join(' ')} ref={spinnerRef}>
        <LoadSpinner />
      </div>
    </div>
  )
}

export default GalleryListPage
