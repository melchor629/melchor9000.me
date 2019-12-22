import React, { memo } from 'react'
import { GalleryPhoto } from '../../../redux/gallery/reducers'
import { RouteComponentProps, withRouter } from 'react-router-dom'

interface PhotoItemProps {
    photo: GalleryPhoto
}

const PhotoItemImpl = ({ photo, history }: PhotoItemProps & RouteComponentProps) => {
    const photoImageStyles = { backgroundImage: `url(${photo.url})` }
    const openImage = () => history.push(`/gallery/${photo.id}`)
    return (
        <div className="photo-item">
            <div className="photo-item-container">
                <div onClick={ openImage } style={ photoImageStyles } className="photo-image">
                    <div className="square"/>
                </div>
            </div>
        </div>
    )
}

export const PhotoItem = memo(
    withRouter(PhotoItemImpl),
    ({ photo: oldPhoto }, { photo }) => oldPhoto.id === photo.id && oldPhoto.url === photo.url,
)
