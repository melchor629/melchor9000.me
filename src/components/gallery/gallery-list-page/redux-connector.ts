import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { State } from '../../../redux/reducers';
import { loadFirstPhotos, loadMorePhotos } from '../../../redux/gallery/actions';

const galleryStateSelector = ({ galleryList }: State) => ({
    primary: galleryList.primary,
    photos: galleryList.photos,
    totalPhotos: galleryList.totalPhotos,
    loadingPhotosList: galleryList.loadingPhotos
});

export const useGalleryListState = () => useSelector(galleryStateSelector);

export const useGalleryListActions = (userId: string, photosetId: string) => {
    const dispatch = useDispatch();
    const hasPhotos = useSelector(({ galleryList }: State) => galleryList.photos.length > 0);
    const state = useSelector(({ galleryList }: State) => ({
        photos: galleryList.photos,
        totalPhotos: galleryList.totalPhotos,
    }));
    return useMemo(() => ({
        loadFirstPhotos: () => !hasPhotos && dispatch(loadFirstPhotos(userId, photosetId)),
        loadMorePhotos: () => dispatch(loadMorePhotos(userId, photosetId, state)),
    }), [ userId, photosetId, hasPhotos ]);
};
