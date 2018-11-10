import * as React from 'react';
import { GalleryPhoto } from 'src/redux/gallery/reducers';

interface PhotoItemProps {
    photo: GalleryPhoto;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const PhotoItem = ({ photo, onClick }: PhotoItemProps) => (
    <div className="photo-item">
        <div className="photo-item-container">
            <div onClick={onClick} style={{backgroundImage: `url(${photo.url})`}} className="photo-image">
                <div className="square"/>
            </div>
            <div className="photo-title"> {photo.title} </div>
        </div>
    </div>
);

export default PhotoItem;