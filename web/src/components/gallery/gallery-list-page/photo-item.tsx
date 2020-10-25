import React, { memo } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { GalleryPhoto } from '../../../redux/gallery/reducers'
import { runOnEnter } from '../../../lib/aria-utils'

interface PhotoItemProps {
  photo: GalleryPhoto
}

const PhotoItemImpl = ({ photo, history }: PhotoItemProps & RouteComponentProps) => {
  const photoImageStyles = { backgroundImage: `url(${photo.url})` }
  const openImage = () => history.push(`/gallery/${photo.id}`)
  return (
    <div className="photo-item">
      <div className="photo-item-container">
        <div
          onClick={openImage}
          onKeyUp={runOnEnter(openImage)}
          style={photoImageStyles}
          className="photo-image"
          role="button"
          tabIndex={0}
        >
          <div className="square" />
        </div>
      </div>
    </div>
  )
}

const PhotoItem = memo(
  withRouter(PhotoItemImpl),
  ({ photo: oldPhoto }, { photo }) => oldPhoto.id === photo.id && oldPhoto.url === photo.url,
)

export default PhotoItem
