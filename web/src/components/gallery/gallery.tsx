import React from 'react'
import { Redirect, Route } from 'react-router'

import GalleryListPage from './gallery-list-page'
import PhotoPage from './photo-page'
import { withDefaultContainer } from '../default-container'

import './gallery.scss'

const photosetId = '72157667134867210'

const GalleryListPageComponent = withDefaultContainer(GalleryListPage)

const Gallery = () => (
  <>
    <Route
      exact
      path="/gallery"
      render={() => <Redirect to={`/gallery/${photosetId}`} />}
    />
    <Route
      exact
      path="/gallery/:photosetId"
      component={GalleryListPageComponent}
    />
    <Route
      path="/gallery/:photosetId/:id"
      component={PhotoPage}
    />
  </>
)

export default Gallery
