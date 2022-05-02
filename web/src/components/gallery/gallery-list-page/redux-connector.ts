import { useMemo } from 'react'
import { shallowEqual } from 'react-redux'

import { useDispatch, useSelector } from '../../../redux'
import { loadFirstPhotos, loadMorePhotos } from '../../../redux/gallery/actions'

export const useGalleryListState = (photosetId: string) => useSelector(
  ({ gallery }) => gallery.photosets[photosetId],
  shallowEqual,
)

export const useGalleryListActions = (photosetId: string) => {
  const dispatch = useDispatch()
  return useMemo(() => ({
    loadFirstPhotos: () => dispatch(loadFirstPhotos(photosetId)),
    loadMorePhotos: () => dispatch(loadMorePhotos(photosetId)),
  }), [photosetId, dispatch])
}
