const apiKey = '***REMOVED***';
const apiUrl = 'https://api.flickr.com/services/rest/';

const randomString = () => {
    const rand = () => Math.round(Math.random() * 1000000);
    let str = '';
    for(let _ = 0; _ < 8; _++) {
        let num = Math.trunc(Math.random() * 3) % 3;
        if(num === 0) {
            str += String.fromCharCode((rand() % 26) + 97);
        } else if(num === 1) {
            str += String.fromCharCode((rand() % 26) + 65);
        } else {
            str += String.fromCharCode((rand() % 10) + 48);
        }
    }
    return str;
};

const buildUrl = (url: string, parameters: any) => {
    let queryString = '';

    for(let key in parameters) {
        if(parameters.hasOwnProperty(key)) {
            queryString += encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]) + '&';
        }
    }

    if(queryString.lastIndexOf('&') === queryString.length - 1) {
        queryString = queryString.substring(0, queryString.length - 1);
    }

    return url + '?' + queryString;
};

const doRequest = (request: any, cbk: (data: any) => void) => {
    const rndCbk = 'flickr_' + randomString();
    request = { ...request,
        api_key: apiKey,
        format: 'json',
        jsoncallback: rndCbk
    };
    window[rndCbk] = (json: any) => {
        cbk(json);
        delete window[rndCbk];
    };
    let script = document.createElement('script');
    script.src = buildUrl(apiUrl, request);
    document.head.appendChild(script);
    document.head.removeChild(script);
};

const protoFunc = <Params extends object, DataType>(method: string) =>
    (params: Params, callback: (data: DataType) => void) => doRequest({ ...(params as object), method }, callback);

export interface Photo {
    id: string;
    secret: string;
    server: string;
    farm: number;
    title: string | { _content: string };
    isprimary: string;
    ispublic: number;
    isfriend: number;
    isfamily: number;
}

export interface PhotoInfo extends Photo {
    description: { _content: string };
    urls: { url: { _content: string }[] };
    dates: {
        posted: string;
        taken: string;
        takengranularity: number;
        takenunknown: number;
        lastupdate: string;
    };
}

interface Photoset {
    id: string;
    primary: string;
    owner: string;
    photo: Photo[];
}

interface PhotosetsGetPhotosParams {
    photoset_id: string;
    user_id: string;
    extras?: string;
    privacy_filter?: 1 | 2 | 3 | 4 | 5;
    per_page?: number;
    page?: number;
    media?: 'all' | 'photos' | 'videos';
}

interface PhotoGetInfoParams {
    photo_id: string;
    secret?: string;
}

export interface ExifData {
    camera: string;
    exif: {
        tagspace: string;
        tagspaceid: number;
        tag: string;
        label: string;
        raw: { _content: string };
        clean?: { _content: string };
    }[];
}

export const photos = {
    getInfo: protoFunc<PhotoGetInfoParams, { photo: PhotoInfo }>('flickr.photos.getInfo'),
    getExif: protoFunc<PhotoGetInfoParams, { photo: ExifData }>('flickr.photos.getExif'),
    getSizes: protoFunc<PhotoGetInfoParams, {}>('flickr.photos.getSizes')
};

export const photosets = {
    getPhotos: protoFunc<PhotosetsGetPhotosParams, { photoset: Photoset }>('flickr.photosets.getPhotos')
};

export const buildThumbnailUrl = (photo: Photo) =>
    `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`;
export const buildPhotoUrl = (photo: Photo) =>
    `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
export const buildLargePhotoUrl = (photo: Photo) =>
    `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
