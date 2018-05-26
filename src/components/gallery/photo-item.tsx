import * as React from 'react';
import { GalleryPhoto } from 'src/redux/gallery/reducers';

interface PhotoItemProps {
    photo: GalleryPhoto;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const PhotoItem = ({ photo, onClick }: PhotoItemProps) => (
    <div className="col-6 col-sm-4 col-md-3">
        <div onClick={onClick} style={{backgroundImage: `url(${photo.url})`}}>
            <div className="square">
                <div className="square-content photo-title"> {photo.title} </div>
            </div>
        </div>
    </div>
);

export default PhotoItem;