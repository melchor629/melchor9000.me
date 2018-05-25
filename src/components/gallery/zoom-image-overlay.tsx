import * as React from 'react';
import { GalleryPhoto } from '../../redux/gallery/reducers';

interface ZoomImageOverlayProps {
    photo: GalleryPhoto;
    onTouchStart: (event: React.TouchEvent<HTMLElement>) => void;
    onTouchEnd: (event: React.TouchEvent<HTMLElement>) => void;
}

const ZoomImageOverlay = ({ photo, onTouchStart, onTouchEnd }: ZoomImageOverlayProps) => {
    const styles = {
        width: photo.zoomSize!.w,
        height: photo.zoomSize!.h,
        backgroundImage: `url(${photo.zoomUrl})`
    };
    return (
        <div className="zoom-container" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="zoom-image-view" style={styles} />
            <div className="zoom-image-info">
                ESC para cerrar<br />
                Mantener apretado para cerrar
            </div>
        </div>
    );
};

export default ZoomImageOverlay;
