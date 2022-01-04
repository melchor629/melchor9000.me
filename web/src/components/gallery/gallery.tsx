import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router'

import GalleryListPage from './gallery-list-page'
import PhotoPage from './photo-page'
import { withDefaultContainer } from '../default-container'

import './gallery.scss'

const photosetId = '72157667134867210'

const GalleryListPageComponent = withDefaultContainer(GalleryListPage)

const TempRedirect = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(photosetId)
  }, [navigate])

  return null
}

const Gallery = () => (
  <Routes>
    <Route
      index
      element={<TempRedirect />}
    />
    <Route
      path=":photosetId/*"
      element={(
        <Routes>
          <Route
            index
            element={<GalleryListPageComponent />}
          />
          <Route
            path=":id"
            element={<PhotoPage />}
          />
        </Routes>
      )}
    />
  </Routes>
)

export default Gallery
