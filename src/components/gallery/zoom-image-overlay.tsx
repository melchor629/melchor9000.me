import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { GalleryPhoto } from '../../redux/gallery/reducers';

interface ZoomImageOverlayProps extends WithTranslation {
    photo: GalleryPhoto;
    onTouchStart: (event: React.TouchEvent<HTMLElement>) => void;
    onTouchEnd: (event: React.TouchEvent<HTMLElement>) => void;
}

const orientationTagRegex = /^Rotate (\d+) (C?CW)$/i;

const ZoomImageOverlay = ({ photo, onTouchStart, onTouchEnd, t }: ZoomImageOverlayProps) => {
    const styles: any = {
        width: photo.zoomSize!.w,
        height: photo.zoomSize!.h,
        backgroundImage: `url(${photo.zoomUrl})`
    };
    const styles2: any = {
        width: photo.zoomSize!.w,
        height: photo.zoomSize!.h
    };

    const orientationExif = photo.exif!.exif.find(entry => entry.tag === 'Orientation');
    if(orientationExif) {
        const a = orientationExif.raw._content.match(orientationTagRegex);
        if(a) {
            const direction = a[2] === 'CCW' ? -1 : 1;
            const angle = Number(a[1]);
            styles.transform = `rotateZ(${angle * direction}deg)`;
            if(a[1] !== '180') {
                //I don't know why, but if the image is rotated, it is moved from the right position by (846, 846) px
                styles.transform += ' translateX(-864px) translateY(-864px)';
                styles2.width = photo.zoomSize!.h;
                styles2.height = photo.zoomSize!.w;
            }
        }
    }

    return (
        <div className="zoom-container" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div style={ styles2 }>
                <div className="zoom-image-view" style={ styles } />
            </div>
            <div className="zoom-image-info">
                { t('gallery.zoomOverlay.closepc') }<br />
                { t('gallery.zoomOverlay.closesm') }
            </div>
        </div>
    );
};

export default withTranslation()(ZoomImageOverlay);
