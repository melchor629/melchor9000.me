import { Action, Dispatch } from 'redux'
import { debounce } from 'debounce'

import { buildPhotoUrl, ExifData, Photo, PhotoInfo, photos, Photoset, photosets } from '../../lib/flickr'
import { GalleryPhotoSizes, GalleryState } from './reducers'
import { State } from '../reducers'

export const FIRST_PHOTOS_LOADED = 'FIRST_PHOTOS_LOADED'
export const LOADING_MORE_PHOTOS = 'LOADING_MORE_PHOTOS'
export const MORE_PHOTOS_LOADED = 'MORE_PHOTOS_LOADED'
export const HIDDEN_DETAILED = 'HIDDEN_DETAILED'
export const LOADING_PHOTO_DETAIL = 'LOADING_PHOTO_DETAIL'
export const LOADED_PHOTO_DETAIL = 'LOADED_PHOTO_DETAIL'
export const LOADED_PHOTO_IMAGE = 'LOADED_PHOTO_IMAGE'
export const DETAILED_PHOTO_IS_GOING_TO_CHANGE = 'DETAILED_PHOTO_IS_GOING_TO_CHANGE'

const howMuchToLoad = 500

interface FirstPhotosLoadedAction extends Action<typeof FIRST_PHOTOS_LOADED> {
    primary: string
    totalPhotos: number
    photos: Array<Photo & { url: string, info: null, exif: null, sizes: null }>
}

export const firstPhotosLoaded = (photoset: Photoset): FirstPhotosLoadedAction => ({
    type: FIRST_PHOTOS_LOADED,
    primary: photoset.primary,
    totalPhotos: photoset.total,
    photos: photoset.photo.map(photo => ({
        ...photo,
        url: buildPhotoUrl(photo),
        info: null,
        exif: null,
        sizes: null,
    })),
})

interface MorePhotosLoadedAction extends Action<typeof MORE_PHOTOS_LOADED> {
    photos: Array<Photo & { url: string, info: null, exif: null, sizes: null }>
}

export const morePhotosLoaded = (photoset: Photoset): MorePhotosLoadedAction => ({
    type: MORE_PHOTOS_LOADED,
    photos: photoset.photo.map(photo => ({
        ...photo,
        url: buildPhotoUrl(photo),
        info: null,
        exif: null,
        sizes: null,
    })),
})

interface DetailedPhotoIsGoingToChange extends Action<typeof DETAILED_PHOTO_IS_GOING_TO_CHANGE> {
    direction: 'next' | 'prev'
}

export const nextDetailed = (): DetailedPhotoIsGoingToChange => ({
    type: DETAILED_PHOTO_IS_GOING_TO_CHANGE,
    direction: 'next',
})

export const prevDetailed = (): DetailedPhotoIsGoingToChange => ({
    type: DETAILED_PHOTO_IS_GOING_TO_CHANGE,
    direction: 'prev',
})

type HiddenDetailed = Action<typeof HIDDEN_DETAILED>

export const hideDetailed = () => (dispatch: Dispatch<HiddenDetailed>) => {
    dispatch({ type: HIDDEN_DETAILED })
}

interface LoadingPhotoDetail extends Action<typeof LOADING_PHOTO_DETAIL> {
    photoId: string
}

export const loadingPhotoDetail = (photoId: string): LoadingPhotoDetail => ({
    type: LOADING_PHOTO_DETAIL,
    photoId,
})

interface LoadedPhotoDetail extends Action<typeof LOADED_PHOTO_DETAIL> {
    photoId: string
    exif: ExifData
    info: PhotoInfo
    sizes: GalleryPhotoSizes
}

export const loadedPhotoDetail = (e: Omit<LoadedPhotoDetail, 'type'>): LoadedPhotoDetail => ({
    type: LOADED_PHOTO_DETAIL,
    ...e,
})

type LoadedPhotoImage = Action<typeof LOADED_PHOTO_IMAGE>

export const loadedPhotoImage = (): LoadedPhotoImage => ({ type: LOADED_PHOTO_IMAGE })

export const loadFirstPhotos = (userId: string, photosetId: string) => (
    async (dispatch: Dispatch, getState: () => State) => {
        if(getState().galleryList.photos.length > 0) {
            return
        }

        const { photoset } = await photosets.getPhotos({
            user_id: userId,
            photoset_id: photosetId,
            per_page: howMuchToLoad,
            page: 1,
        })
        const primaryPhotoSize = await photos.getSizes({ photo_id: photoset.primary })
        dispatch(firstPhotosLoaded({
            ...photoset,
            primary: primaryPhotoSize.sizes.size.find(s => s.label === 'Large')!.source,
        }))
    }
)

export const loadMorePhotos = (
    userId: string,
    photosetId: string,
    next = false,
) => async (dispatch: Dispatch, getState: () => State) => {
    const { galleryList: { totalPhotos, photos } } = getState()
    if(totalPhotos === photos.length) {
        return
    }

    dispatch({ type: LOADING_MORE_PHOTOS })
    if(next) {
        //It's not true right now, in fact, it will be true soon
        dispatch({ type: LOADING_PHOTO_DETAIL })
    }

    const { photoset } = await photosets.getPhotos({
        user_id: userId,
        photoset_id: photosetId,
        per_page: howMuchToLoad,
        page: Math.floor(photos.length / howMuchToLoad) + 1,
    })
    dispatch(morePhotosLoaded(photoset))
    if(next) {
        dispatch(nextDetailed())
    }
}

const loadDetailedPhotoImpl = debounce(async (dispatch: Dispatch,
    photoId: string,
    state: GalleryState,
    userId: string,
    photosetId: string,
) => {
    dispatch(loadingPhotoDetail(photoId))
    const isFirstLoad = state.photos.length === 0
    const photosList: typeof state.photos = []
    let totalPhotos = isFirstLoad ? 1 : state.totalPhotos
    let primary: string = ''
    const countPhotos = () => photosList.length + state.photos.length
    while(countPhotos() < totalPhotos) {
        const { photoset } = await photosets.getPhotos({
            user_id: userId,
            photoset_id: photosetId,
            per_page: howMuchToLoad,
            page: Math.floor(photosList.length + state.photos.length) / howMuchToLoad + 1,
        })
        photosList.push(...photoset.photo.map(p => ({
            ...p,
            url: buildPhotoUrl(p),
            info: null,
            exif: null,
            sizes: null,
        })))

        if(isFirstLoad && !primary) {
            totalPhotos = photoset.total
            primary = photoset.primary
        }
    }

    if(isFirstLoad) {
        const primaryPhotoSize = await photos.getSizes({ photo_id: primary })
        dispatch(firstPhotosLoaded({
            id: photosetId,
            owner: '',
            pages: 0,
            photo: photosList,
            primary: primaryPhotoSize.sizes.size.find(s => s.label === 'Large')!.source,
            total: totalPhotos,
        }))
    } else if(photosList.length > 0) {
        dispatch(morePhotosLoaded({
            id: photosetId,
            owner: '',
            pages: 0,
            photo: photosList,
            primary: '',
            total: totalPhotos,
        }))
    }

    const photo = state.photos.find(p => p.id === photoId) || photosList.find(p => p.id === photoId)
    if(!photo) {
        //TODO not found
        return
    }

    const [ info, exif, sizes ] = await Promise.all([
        photo.info ?
            Promise.resolve(photo.info) :
            photos.getInfo({ photo_id: photo.id, secret: photo.secret }).then(p => p.photo),
        photo.exif ?
            Promise.resolve(photo.exif) :
            photos.getExif({ photo_id: photo.id, secret: photo.secret }).then(p => p.photo),
        photo.sizes ?
            Promise.resolve(photo.sizes) :
            photos.getSizes({ photo_id: photo.id, secret: photo.secret })
                .then(p => p.sizes.size)
                .then(p => p.reduce((o, s) => ({
                    ...o,
                    [s.label]: {
                        url: s.source,
                        width: Number(s.width),
                        height: Number(s.height),
                    },
                }), {} as any)),
    ])

    dispatch(loadedPhotoDetail({ photoId: photo.id, exif, info, sizes }))
}, 250)

export const loadDetailedPhoto = (photoId: string, userId: string, photosetId: string) =>
    (dispatch: Dispatch, getState: () => State) =>
        loadDetailedPhotoImpl(dispatch, photoId, getState().galleryList, userId, photosetId)

export type GalleryActions = FirstPhotosLoadedAction |
    MorePhotosLoadedAction |
    DetailedPhotoIsGoingToChange |
    HiddenDetailed |
    LoadingPhotoDetail |
    LoadedPhotoDetail |
    LoadedPhotoImage |
    Action<typeof LOADING_MORE_PHOTOS>
