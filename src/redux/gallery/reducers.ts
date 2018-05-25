import { AnyAction } from 'redux';
import {
    MORE_PHOTOS_LOADED, FIRST_PHOTOS_LOADED, SHOW_DETAILED, HIDE_DETAILED, LOADING_PHOTO_DETAIL,
    LOADED_PHOTO_DETAIL, HIDDEN_DETAILED, TOGGLE_INFO_PANEL, LOADED_PHOTO_IMAGE, LOADING_PHOTO_IMAGE,
    LOADING_MORE_PHOTOS, ENABLE_PHOTO_ZOOM, DISABLE_PHOTO_ZOOM, PHOTO_CHANGE_ANIMATION_START,
    PHOTO_CHANGE_ANIMATION_STEP, PHOTO_CHANGE_ANIMATION_END
} from './actions';
import { Photo, buildLargePhotoUrl, ExifData, PhotoInfo } from '../../lib/flickr';

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

const find = (photos: LinkedPhoto[], id: string) => photos.filter(p => p.photo.id === id)[0];

const initialState: GalleryState = {
    primary: null,
    totalPages: 0,
    photos: [],
    page: 1,

    detailedPhoto: undefined,
    zoomEnabled: false,
    hasNext: false,
    hasPrev: false,
    showOverlayEffect: false,
    showInfoPanel: true,

    loadingPhotos: true,
    loading: false,
    loadingPhoto: false,

    animation: {
        animating: false,
        direction: null,
        style1: { backgroundImage: null, opacity: null, backgroundPosition: null },
        style2: { backgroundImage: null, opacity: null, backgroundPosition: null, display: 'hidden' }
    }
};

export interface AnimationGalleryState {
    animating: boolean;
    direction: 'next' | 'prev' | null | undefined;
    style1: {
        backgroundImage: string | null;
        opacity: number | null;
        backgroundPosition: string | null;
    };
    style2: {
        backgroundImage: string | null;
        opacity: number | null;
        backgroundPosition: string | null;
        display: 'hidden' | 'block';
    };
}

export interface GalleryState {
    primary: string | null;
    totalPages: number;
    photos: GalleryPhoto[];
    page: number;

    detailedPhoto: string | undefined;
    zoomEnabled: boolean;
    hasNext: boolean;
    hasPrev: boolean;
    showOverlayEffect: boolean;
    showInfoPanel: boolean;

    loadingPhotos: boolean;
    loading: boolean;
    loadingPhoto: boolean;

    animation: AnimationGalleryState;
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

        case PHOTO_CHANGE_ANIMATION_START: {
            let photos = linkedPhotos(state.photos);
            const current = find(photos, state.detailedPhoto!);
            let next = current.next;
            let prev = current.prev;
            if(action.direction === 'next') {
                return {
                    ...state,
                    detailedPhoto: next!.id,
                    hasNext: !!find(photos, next!.id).next,
                    hasPrev: true,
                    animation: {
                        animating: true,
                        direction: 'next',
                        style1: {
                            backgroundImage: `url(${buildLargePhotoUrl(next!)})`,
                            opacity: 0,
                            backgroundPosition: '60% 50%'
                        },
                        style2: {
                            backgroundImage: `url(${buildLargePhotoUrl(current.photo)})`,
                            opacity: 1,
                            backgroundPosition: '50% 50%',
                            display: 'block'
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    detailedPhoto: prev!.id,
                    hasNext: true,
                    hasPrev: !!find(photos, prev!.id).prev,
                    animation: {
                        animating: true,
                        direction: 'prev',
                        style1: {
                            backgroundImage: `url(${buildLargePhotoUrl(current.photo)})`,
                            opacity: 1,
                            backgroundPosition: '50% 50%'
                        },
                        style2: {
                            backgroundImage: `url(${buildLargePhotoUrl(prev!)})`,
                            opacity: 0,
                            backgroundPosition: '40% 50%',
                            display: 'block'
                        }
                    }
                };
            }
        }

        case PHOTO_CHANGE_ANIMATION_STEP: {
            const p = -(Math.cos(Math.PI * action.t) - 1) / 2;
            if(state.animation.direction === 'next') {
                const pos1 = 60 - 10 * action.t;
                const pos2 = 50 - 10 * action.t;
                return {
                    ...state,
                    animation: {
                        ...state.animation,
                        style1: { ...state.animation.style1, opacity: p, backgroundPosition: `${pos1}% 50%` },
                        style2: { ...state.animation.style2, opacity: 1 - p, backgroundPosition: `${pos2}% 50%` }
                    }
                };
            } else {
                const pos1 = 40 + 10 * action.t;
                const pos2 = 50 + 10 * action.t;
                return {
                    ...state,
                    animation: {
                        ...state.animation,
                        style1: { ...state.animation.style1, opacity: 1 - p, backgroundPosition: `${pos2}% 50%` },
                        style2: { ...state.animation.style2, opacity: p, backgroundPosition: `${pos1}% 50%` }
                    }
                };
            }
        }

        case PHOTO_CHANGE_ANIMATION_END:
            return {
                ...state,
                animation: {
                    animating: false,
                    direction: undefined,
                    style1: { backgroundImage: null, opacity: null, backgroundPosition: null },
                    style2: { backgroundImage: null, opacity: null, backgroundPosition: null, display: 'hidden' }
                }
            };

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
