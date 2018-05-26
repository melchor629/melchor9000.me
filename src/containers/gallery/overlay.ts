import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Overlay from 'src/components/gallery/overlay';
import {
    loadDetailedPhoto, nextDetailed, prevDetailed, hideDetailed, toggleInfoPanel, loadingPhotoImage, loadedPhotoImage,
    loadMorePhotos, enablePhotoZoom, disablePhotoZoom
} from 'src/redux/gallery/actions';
import { State } from 'src/redux/reducers';
import { AnimationGalleryState, GalleryPhoto } from 'src/redux/gallery/reducers';

export interface OverlayStateToProps {
    currentPhoto: GalleryPhoto;
    isZoomed: boolean;
    hasNext: boolean;
    hasPrev: boolean;
    show: boolean;
    showInfoPanel: boolean;
    page: number;
    changeAnimation: AnimationGalleryState;
    hasNextPage: boolean;
}

export interface OverlayDispatchToProps {
    loadFullInfoForPhoto: (photo: GalleryPhoto) => void;
    next: () => void;
    prev: () => void;
    close: () => void;
    zoom: (photo: GalleryPhoto) => void;
    zoomOff: () => void;
    toggleShow: () => void;
    toggleInfoPanel: () => void;
    photoIsLoading: () => void;
    photoIsLoaded: () => void;
    loadMorePhotosAndNext: (u: string, p: string, pp: number, page: number) => void;
}

const mapStateToProps = ({ galleryList }: State): OverlayStateToProps => ({
    currentPhoto: galleryList.photos.filter(photo => photo.id === galleryList.detailedPhoto)[0],
    isZoomed: galleryList.zoomEnabled,
    hasNext: galleryList.hasNext,
    hasPrev: galleryList.hasPrev,
    show: galleryList.showOverlayEffect,
    showInfoPanel: galleryList.showInfoPanel || galleryList.showInfoPanel === undefined,
    hasNextPage: galleryList.page < galleryList.totalPages,
    page: galleryList.page,
    changeAnimation: galleryList.animation
});

const mapDispatchToProps = (dispatch: any): OverlayDispatchToProps => {
    return {
        loadFullInfoForPhoto: photo => dispatch(loadDetailedPhoto(photo)),
        toggleShow: () => dispatch({ type: 'TOGGLE_SHOW' }),
        toggleInfoPanel: () => dispatch(toggleInfoPanel()),
        photoIsLoading: () => dispatch(loadingPhotoImage()),
        photoIsLoaded: () => dispatch(loadedPhotoImage()),
        loadMorePhotosAndNext: (u, p, pp, page) => dispatch(loadMorePhotos(u, p, pp, page, true)),
        next: () => dispatch(nextDetailed()),
        prev: () => dispatch(prevDetailed()),
        close: () => dispatch(hideDetailed()),
        zoom: photo => dispatch(enablePhotoZoom(photo)),
        zoomOff: () => dispatch(disablePhotoZoom())
    };
};

export default translate()(connect(
    mapStateToProps,
    mapDispatchToProps
)(Overlay));
