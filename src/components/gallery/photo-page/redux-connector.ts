import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { State } from '../../../redux/reducers';
import {
    loadDetailedPhoto, nextDetailed, prevDetailed, hideDetailed, loadedPhotoImage,
    loadMorePhotos
} from '../../../redux/gallery/actions';
import { changeNavbarHideMode } from '../../../redux/effects/actions';

const photoStateSelector = ({ galleryList }: State) => ({
    currentPhoto: galleryList.photos.find(photo => photo.id === galleryList.detailedPhoto)!,
    previousPhoto: galleryList.photos.find(photo => photo.id === galleryList.prevDetailedPhoto),
    isZoomed: galleryList.zoomEnabled,
    nextPhoto: galleryList.nextPhoto,
    prevPhoto: galleryList.prevPhoto,
    totalPhotos: galleryList.totalPhotos,
    imageIsLoading: galleryList.loadingPhoto,
    directionOfChange: galleryList.directionOfChange,
    imageInfoIsLoading: galleryList.loadingPhotoDetailInfo || galleryList.loadingPhotos,
    imageSwitcher: galleryList.imageSwitcher,
});

export const usePhotoState = () => useSelector(photoStateSelector);

export const usePhotoActions = (userId: string, photosetId: string) => {
    const dispatch = useDispatch();
    const state = useSelector(({ galleryList }: State) => ({
        photos: galleryList.photos,
        totalPhotos: galleryList.totalPhotos,
    }));

    return useMemo(() => ({
        loadFullInfoForPhoto: (photoId: string) => dispatch(loadDetailedPhoto(photoId, state, userId, photosetId)),
        photoIsLoaded: () => dispatch(loadedPhotoImage()),
        loadMorePhotosAndNext: () => dispatch(loadMorePhotos(userId, photosetId, state, true)),
        next: () => dispatch(nextDetailed()),
        prev: () => dispatch(prevDetailed()),
        close: () => dispatch(hideDetailed()),
        enableHideNavbarOnTopMode: () => dispatch(changeNavbarHideMode('top-only')),
        disableHideNavbarOnTopMode: () => dispatch(changeNavbarHideMode(null)),
    }), [ userId, photosetId, state ]);
};
