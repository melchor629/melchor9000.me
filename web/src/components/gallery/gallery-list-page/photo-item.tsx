import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { GalleryPhotosetPhoto } from '../../../redux/gallery/reducers'
import { runOnEnter } from '../../../lib/aria-utils'

interface PhotoItemProps {
  photo: GalleryPhotosetPhoto
}

const PhotoItemImpl = ({ photo }: PhotoItemProps) => {
  const navigate = useNavigate()
  const photoImageStyles = { backgroundImage: `url(${photo.url})` }
  const openImage = () => navigate(`${photo.id}`)
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
