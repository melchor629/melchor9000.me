import {
    MORE_PHOTOS_LOADED,
    FIRST_PHOTOS_LOADED,
    LOADING_PHOTO_DETAIL,
    LOADED_PHOTO_DETAIL,
    HIDDEN_DETAILED,
    LOADED_PHOTO_IMAGE,
    LOADING_MORE_PHOTOS,
    DETAILED_PHOTO_IS_GOING_TO_CHANGE,
    GalleryActions,
} from './actions';
import { Photo, ExifData, PhotoInfo } from '../../lib/flickr';

interface GalleryPhotoSize {
    width: number;
    height: number;
    url: string;
}

export interface GalleryPhotoSizes {
    'Square': GalleryPhotoSize;
    'Large Square'?: GalleryPhotoSize;
    'Thumbnail': GalleryPhotoSize;
    'Small': GalleryPhotoSize;
    'Small 320'?: GalleryPhotoSize;
    'Medium': GalleryPhotoSize;
    'Medium 640'?: GalleryPhotoSize;
    'Medium 800'?: GalleryPhotoSize;
    'Large': GalleryPhotoSize;
    'Large 1600'?: GalleryPhotoSize;
    'Large 2048'?: GalleryPhotoSize;
    'Original'?: GalleryPhotoSize;
}

export type GalleryPhoto = Photo & {
    url: string | null;
    info: PhotoInfo | null;
    exif: ExifData | null;
    sizes: GalleryPhotoSizes | null;
    zoomUrl?: string;
    zoomSize?: { w: number; h: number; };
};

const initialState: GalleryState = {
    primary: null,
    totalPhotos: 0,
    photos: [],

    detailedPhoto: undefined,
    prevDetailedPhoto: undefined,
    directionOfChange: 'next',
    zoomEnabled: false,
    nextPhoto: null,
    prevPhoto: null,
    imageSwitcher: true,

    loadingPhotos: true,
    loadingPhotoDetailInfo: false,
    loadingPhoto: false,
};

export interface GalleryState {
    primary: string | null;
    totalPhotos: number;
    photos: GalleryPhoto[];

    detailedPhoto: string | undefined;
    prevDetailedPhoto: string | undefined;
    directionOfChange: 'next' | 'prev';
    zoomEnabled: boolean;
    nextPhoto: GalleryPhoto | null;
    prevPhoto: GalleryPhoto | null;
    imageSwitcher: boolean;

    loadingPhotos: boolean;
    loadingPhotoDetailInfo: boolean;
    loadingPhoto: boolean;
}

export const galleryList = (state: GalleryState = initialState, action: GalleryActions): GalleryState => {
    switch(action.type) {
        case MORE_PHOTOS_LOADED:
            return {
                ...state,
                photos: [...state.photos, ...action.photos],
                loadingPhotos: false
            };

        case FIRST_PHOTOS_LOADED:
            return {
                ...state,
                primary: action.primary,
                totalPhotos: action.totalPhotos,
                photos: action.photos,
                loadingPhotos: false
            };

        case LOADING_MORE_PHOTOS:
            return { ...state, loadingPhotos: true };

        case HIDDEN_DETAILED:
            return {
                ...state,
                detailedPhoto: undefined,
                zoomEnabled: false,
                nextPhoto: null,
                prevPhoto: null,
                directionOfChange: 'next',
            };

        case LOADING_PHOTO_DETAIL:
            return {
                ...state,
                loadingPhotoDetailInfo: true,
                loadingPhoto: true,
                detailedPhoto: action.photoId,
                prevDetailedPhoto: state.detailedPhoto,
                imageSwitcher: !state.imageSwitcher,
            };

        case LOADED_PHOTO_DETAIL: {
            const currentPhotoPosition = state.photos.findIndex(p => p.id === action.photoId);
            const prevPhoto = currentPhotoPosition > 0 ? state.photos[currentPhotoPosition - 1] : null;
            const nextPhoto = currentPhotoPosition < state.photos.length - 1 ?
                state.photos[currentPhotoPosition + 1] :
                null;
            return {
                ...state,
                loadingPhotoDetailInfo: false,
                zoomEnabled: false,
                nextPhoto,
                prevPhoto,
                photos: state.photos.map(photo => photo.id === action.photoId ? {
                        ...photo,
                        exif: action.exif,
                        info: action.info,
                        sizes: action.sizes,
                    } : photo
                ),
                loadingPhoto: true, //With the new size, a new image is going to be loaded
            };
        }

        case LOADED_PHOTO_IMAGE:
            return { ...state, loadingPhoto: false };

        case DETAILED_PHOTO_IS_GOING_TO_CHANGE: {
            const currentPhotoPosition = state.photos.findIndex(p => p.id === state.detailedPhoto);
            if(action.direction === 'next') {
                const prevPhoto = state.photos[currentPhotoPosition];
                const nextPhoto = currentPhotoPosition < state.photos.length - 2 ?
                    state.photos[currentPhotoPosition + 2] :
                    null;
                return {
                    ...state,
                    directionOfChange: action.direction,
                    prevPhoto,
                    nextPhoto,
                };
            } else {
                const prevPhoto = currentPhotoPosition > 1 ? state.photos[currentPhotoPosition - 2] : null;
                const nextPhoto = state.photos[currentPhotoPosition];
                return {
                    ...state,
                    directionOfChange: action.direction,
                    prevPhoto,
                    nextPhoto,
                };
            }
        }

        default: return state;
    }
};
