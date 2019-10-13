import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { State } from '../../../redux/reducers'
import { loadFirstPhotos, loadMorePhotos } from '../../../redux/gallery/actions'

const galleryStateSelector = ({ galleryList }: State) => ({
    primary: galleryList.primary,
    photos: galleryList.photos,
    totalPhotos: galleryList.totalPhotos,
    loadingPhotosList: galleryList.loadingPhotos,
})

export const useGalleryListState = () => useSelector(galleryStateSelector)

export const useGalleryListActions = (userId: string, photosetId: string) => {
    const dispatch = useDispatch()
    return useMemo(() => ({
        loadFirstPhotos: () => dispatch(loadFirstPhotos(userId, photosetId)),
        loadMorePhotos: () => dispatch(loadMorePhotos(userId, photosetId)),
    }), [ userId, photosetId, dispatch ])
}
