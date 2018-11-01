import * as React from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
import { GalleryPhoto } from 'src/redux/gallery/reducers';

interface ZoomImageOverlayProps extends WithNamespaces {
    photo: GalleryPhoto;
    onTouchStart: (event: React.TouchEvent<HTMLElement>) => void;
    onTouchEnd: (event: React.TouchEvent<HTMLElement>) => void;
}

const ZoomImageOverlay = ({ photo, onTouchStart, onTouchEnd, t }: ZoomImageOverlayProps) => {
    const styles = {
        width: photo.zoomSize!.w,
        height: photo.zoomSize!.h,
        backgroundImage: `url(${photo.zoomUrl})`
    };
    return (
        <div className="zoom-container" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="zoom-image-view" style={styles} />
            <div className="zoom-image-info">
                { t('gallery.zoomOverlay.closepc') }<br />
                { t('gallery.zoomOverlay.closesm') }
            </div>
        </div>
    );
};

export default withNamespaces()(ZoomImageOverlay);
