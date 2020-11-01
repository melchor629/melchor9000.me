import React, { memo } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { GalleryPhotosetPhoto } from '../../../redux/gallery/reducers'
import { runOnEnter } from '../../../lib/aria-utils'

interface PhotoItemProps {
  photo: GalleryPhotosetPhoto
}

const PhotoItemImpl = ({ photo }: PhotoItemProps) => {
  const history = useHistory()
  const match = useRouteMatch<{ photosetId: string }>()
  const photoImageStyles = { backgroundImage: `url(${photo.url})` }
  const openImage = () => history.push(`/gallery/${match.params.photosetId}/${photo.id}`)
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
  PhotoItemImpl,
  ({ photo: oldPhoto }, { photo }) => oldPhoto.id === photo.id && oldPhoto.url === photo.url,
)

export default PhotoItem
