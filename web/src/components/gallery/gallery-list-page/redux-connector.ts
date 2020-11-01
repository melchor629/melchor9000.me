import { useMemo } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'

import { State } from '../../../redux/reducers'
import { loadFirstPhotos, loadMorePhotos } from '../../../redux/gallery/actions'

export const useGalleryListState = (photosetId: string) => useSelector(
  ({ galleryList }: State) => galleryList.photosets[photosetId],
  shallowEqual,
)

export const useGalleryListActions = (photosetId: string) => {
  const dispatch = useDispatch()
  return useMemo(() => ({
    loadFirstPhotos: () => dispatch(loadFirstPhotos(photosetId)),
    loadMorePhotos: () => dispatch(loadMorePhotos(photosetId)),
  }), [photosetId, dispatch])
}
