import { AnyAction } from 'redux';
import {
    MORE_PHOTOS_LOADED, FIRST_PHOTOS_LOADED, SHOW_DETAILED, HIDE_DETAILED, LOADING_PHOTO_DETAIL,
    LOADED_PHOTO_DETAIL, HIDDEN_DETAILED, TOGGLE_INFO_PANEL, LOADED_PHOTO_IMAGE, LOADING_PHOTO_IMAGE,
    LOADING_MORE_PHOTOS, ENABLE_PHOTO_ZOOM, DISABLE_PHOTO_ZOOM, PHOTO_CHANGED,
} from './actions';
import { Photo, ExifData, PhotoInfo } from 'src/lib/flickr';

export type GalleryPhoto = Photo & {
    photo: Photo;
    url: string | null;
    info: PhotoInfo | null;
    exif: ExifData | null;
    zoomUrl?: string;
    zoomSize?: { w: number; h: number; };
};

interface LinkedPhoto {
    photo: GalleryPhoto;
    next: GalleryPhoto | null;
    prev: GalleryPhoto | null;
}

const linkedPhotos = (photos: GalleryPhoto[]): LinkedPhoto[] => photos.map((photo, i) => ({
    photo,
    next: i < photos.length ? photos[i + 1] : null,
    prev: i > 0 ? photos[i - 1] : null
}));

const find = (photos: LinkedPhoto[], id: string) => photos.find(p => p.photo.id === id)!;

const initialState: GalleryState = {
    primary: null,
    totalPages: 0,
    photos: [],
    page: 1,

    detailedPhoto: undefined,
    prevDetailedPhoto: undefined,
    directionOfChange: 'next',
    zoomEnabled: false,
    hasNext: false,
    hasPrev: false,
    showOverlayEffect: false,
    showInfoPanel: true,

    loadingPhotos: true,
    loading: false,
    loadingPhoto: false,
};

export interface GalleryState {
    primary: string | null;
    totalPages: number;
    photos: GalleryPhoto[];
    page: number;

    detailedPhoto: string | undefined;
    prevDetailedPhoto: string | undefined;
    directionOfChange: 'next' | 'prev';
    zoomEnabled: boolean;
    hasNext: boolean;
    hasPrev: boolean;
    showOverlayEffect: boolean;
    showInfoPanel: boolean;

    loadingPhotos: boolean;
    loading: boolean;
    loadingPhoto: boolean;
}

export const galleryList = (state: GalleryState = initialState, action: AnyAction): GalleryState => {
    switch(action.type) {
        case MORE_PHOTOS_LOADED:
            return {
                ...state,
                photos: [...state.photos, ...action.photos],
                page: state.page + 1,
                loadingPhotos: false
            };

        case FIRST_PHOTOS_LOADED:
            return {
                ...state,
                primary: action.primary,
                totalPages: action.totalPages,
                photos: action.photos,
                page: 1,
                loadingPhotos: false
            };

        case LOADING_MORE_PHOTOS:
            return { ...state, loadingPhotos: true };

        case SHOW_DETAILED:
            return {
                ...state,
                detailedPhoto: action.photo,
                zoomEnabled: false,
                hasNext: !!find(linkedPhotos(state.photos), action.photo).next,
                hasPrev: !!find(linkedPhotos(state.photos), action.photo).prev
            };

        case HIDE_DETAILED:
            return { ...state, showOverlayEffect: false };

        case HIDDEN_DETAILED:
            return { ...state, detailedPhoto: undefined, zoomEnabled: false, hasNext: false, hasPrev: false };

        case LOADING_PHOTO_DETAIL:
            return { ...state, loading: true };

        case LOADED_PHOTO_DETAIL:
            return {
                ...state,
                loading: false,
                photos: state.photos.map(photo => {
                    return photo.id === state.detailedPhoto ? { ...photo, ...action.extra } : photo;
                })
            };

        case LOADING_PHOTO_IMAGE:
            return { ...state, loadingPhoto: true };

        case LOADED_PHOTO_IMAGE:
            return { ...state, loadingPhoto: false };

        case PHOTO_CHANGED: {
            let photos = linkedPhotos(state.photos);
            const current = find(photos, state.detailedPhoto!);
            let next = current.next;
            let prev = current.prev;
            if(action.direction === 'next') {
                return {
                    ...state,
                    detailedPhoto: next!.id,
                    prevDetailedPhoto: current!.photo.id,
                    hasNext: !!find(photos, next!.id).next,
                    hasPrev: true,
                    directionOfChange: action.direction,
                };
            } else {
                return {
                    ...state,
                    detailedPhoto: prev!.id,
                    prevDetailedPhoto: current!.photo.id,
                    hasNext: true,
                    hasPrev: !!find(photos, prev!.id).prev,
                    directionOfChange: action.direction,
                };
            }
        }

        case TOGGLE_INFO_PANEL:
            return { ...state, showInfoPanel: !state.showInfoPanel };

        case 'TOGGLE_SHOW': return { ...state, showOverlayEffect: true };

        case ENABLE_PHOTO_ZOOM:
            return {
                ...state,
                zoomEnabled: true,
                photos: state.photos.map(photo => photo.id === action.photo.id ?
                    { ...photo, zoomUrl: action.zoomUrl, zoomSize: action.zoomSize } : photo)
            };

        case DISABLE_PHOTO_ZOOM:
            return { ...state, zoomEnabled: false };

        default: return state;
    }
};
