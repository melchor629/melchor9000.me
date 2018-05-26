import { buildPhotoUrl, photos, photosets } from '../../lib/flickr';
import { AnimationTimer } from '../../lib/timer';

export const FIRST_PHOTOS_LOADED = 'FIRST_PHOTOS_LOADED';
export const LOADING_MORE_PHOTOS = 'LOADING_MORE_PHOTOS';
export const MORE_PHOTOS_LOADED = 'MORE_PHOTOS_LOADED';
export const SHOW_DETAILED = 'SHOW_DETAILED';
export const HIDE_DETAILED = 'HIDE_DETAILED';
export const HIDDEN_DETAILED = 'HIDDEN_DETAILED';
export const LOADING_PHOTO_DETAIL = 'LOADING_PHOTO_DETAIL';
export const LOADED_PHOTO_DETAIL = 'LOADED_PHOTO_DETAIL';
export const LOADING_PHOTO_IMAGE = 'LOADING_PHOTO_IMAGE';
export const LOADED_PHOTO_IMAGE = 'LOADED_PHOTO_IMAGE';
export const TOGGLE_INFO_PANEL = 'TOGGLE_INFO_PANEL';
export const ENABLE_PHOTO_ZOOM = 'ENABLE_PHOTO_ZOOM';
export const DISABLE_PHOTO_ZOOM = 'DISABLE_PHOTO_ZOOM';
export const PHOTO_CHANGE_ANIMATION_START = 'PHOTO_CHANGE_ANIMATION_START';
export const PHOTO_CHANGE_ANIMATION_STEP = 'PHOTO_CHANGE_ANIMATION_STEP';
export const PHOTO_CHANGE_ANIMATION_END = 'PHOTO_CHANGE_ANIMATION_END';

class CuriousPromise {
    constructor(numOfDoneCalls, cbk) {
        this._num = numOfDoneCalls;
        this._cbk = cbk;
        this._doneCalls = 0;
    }

    done() {
        this._doneCalls++;
        if(this._doneCalls === this._num) {
            this._cbk();
        }
    }
}

export const firstPhotosLoaded = photoset => ({
    type: FIRST_PHOTOS_LOADED,
    primary: photoset.primary,
    totalPages: photoset.pages,
    photos: photoset.photo.map(photo => ({
        ...photo,
        url: buildPhotoUrl(photo),
        info: null,
        exif: null
    }))
});

export const morePhotosLoaded = photoset => ({
    type: MORE_PHOTOS_LOADED,
    photos: photoset.photo.map(photo => ({
        ...photo,
        url: buildPhotoUrl(photo),
        info: null,
        exif: null
    }))
});

export const showDetailed = photo => ({
    type: SHOW_DETAILED,
    photo: photo.id
});

export const nextDetailed = () => dispatch => {
    dispatch({ type: PHOTO_CHANGE_ANIMATION_START, direction: 'next' });
    new AnimationTimer(250, t => dispatch({ type: PHOTO_CHANGE_ANIMATION_STEP, direction: 'next', t }), true)
        .onEnd(() => dispatch({ type: PHOTO_CHANGE_ANIMATION_END, direction: 'next' }));
};

export const prevDetailed = () => dispatch => {
    dispatch({ type: PHOTO_CHANGE_ANIMATION_START, direction: 'prev' });
    new AnimationTimer(250, t => dispatch({ type: PHOTO_CHANGE_ANIMATION_STEP, direction: 'prev', t }), true)
        .onEnd(() => dispatch({ type: PHOTO_CHANGE_ANIMATION_END, direction: 'prev' }));
};

export const hideDetailed = () => dispatch => {
    //Esto es para la animación de desaparecer
    setTimeout(() => dispatch({ type: HIDDEN_DETAILED }), 510);
    dispatch({
        type: HIDE_DETAILED
    });
};

export const loadingPhotoDetail = photo => ({
    type: LOADING_PHOTO_DETAIL,
    id: photo.id
});

export const loadedPhotoDetail = (photoId, extra) => ({
    type: LOADED_PHOTO_DETAIL,
    photoId,
    extra
});

export const loadingPhotoImage = () => ({
    type: LOADING_PHOTO_IMAGE
});

export const loadedPhotoImage = () => ({
    type: LOADED_PHOTO_IMAGE
});

export const toggleInfoPanel = () => ({
    type: TOGGLE_INFO_PANEL
});

export const loadFirstPhotos = (user_id, photoset_id, per_page, page) => dispatch => {
    photosets.getPhotos({ user_id, photoset_id, per_page, page }, json => {
        photos.getSizes({ photo_id: json.photoset.primary }, son => {
            dispatch(firstPhotosLoaded({
                ...json.photoset,
                primary: son.sizes.size.filter(s => s.label === 'Large')[0].source
            }));
        });
    });
};

export const loadMorePhotos = (user_id, photoset_id, per_page, page, next = false) => dispatch => {
    console.log(user_id, photoset_id, per_page, page, next);
    dispatch({ type: LOADING_MORE_PHOTOS });
    if(next) dispatch({ type: LOADING_PHOTO_DETAIL }); //It's not true right now, but, in fact, it will be true soon
    photosets.getPhotos({ user_id, photoset_id, per_page, page: page + 1 }, json => {
        dispatch(morePhotosLoaded(json.photoset));
        if(next) dispatch(nextDetailed());
    });
};

export const loadDetailedPhoto = photo => dispatch => {
    dispatch(loadingPhotoDetail(photo));
    let cache = { info: photo.info, exif: photo.exif };
    let cp = new CuriousPromise(2, () => dispatch(loadedPhotoDetail(photo.id, cache)));
    if(cache.info) {
        cp.done();
    } else {
        photos.getInfo({ photo_id: photo.id, secret: photo.secret }, json => {
            cache.info = json.photo;
            cp.done();
        });
    }
    if(cache.exif) {
        cp.done();
    } else {
        photos.getExif({ photo_id: photo.id, secret: photo.secret }, json => {
            cache.exif = json.photo;
            cp.done();
        });
    }
};

export const enablePhotoZoom = photo => dispatch => {
    if(photo.zoomUrl === undefined) {
        photos.getSizes({ photo_id: photo.id }, json => {
            let size = null;
            for(let s of json.sizes.size) {
                if(s.label === 'Large') {
                    size = s;
                } else if(s.label === 'Original') {
                    size = s;
                    break;
                }
            }

            dispatch({
                type: ENABLE_PHOTO_ZOOM,
                photo,
                zoomUrl: size.source,
                zoomSize: { w: Number(size.width), h: Number(size.height) }
            });
        });
    } else {
        dispatch({ type: ENABLE_PHOTO_ZOOM, photo, zoomUrl: photo.zoomUrl, zoomSize: photo.zoomSize });
    }
};

export const disablePhotoZoom = () => ({
    type: DISABLE_PHOTO_ZOOM
});
