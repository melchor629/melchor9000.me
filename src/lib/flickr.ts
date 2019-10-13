const apiKey = process.env.REACT_APP_FLICKR_API_KEY!
const apiUrl = process.env.REACT_APP_FLICKR_API_URL || 'https://api.flickr.com/services/rest/'

const randomString = () => {
    const rand = () => Math.round(Math.random() * 1000000)
    let str = ''
    for(let _ = 0; _ < 8; _++) {
        const num = Math.trunc(Math.random() * 3) % 3
        if(num === 0) {
            str += String.fromCharCode((rand() % 26) + 97)
        } else if(num === 1) {
            str += String.fromCharCode((rand() % 26) + 65)
        } else {
            str += String.fromCharCode((rand() % 10) + 48)
        }
    }
    return str
}

const buildUrl = (url: string, parameters: any) => {
    const queryString = new URLSearchParams(parameters).toString()
    if(queryString) {
        return `${url}?${queryString}`
    }
    return url
}

const doRequest = <T>(request: any): Promise<T> => new Promise(resolve => {
    const rndCbk = `flickr_${randomString()}`
    const script = document.createElement('script')
    request = {
        ...request,
        api_key: apiKey,
        format: 'json',
        jsoncallback: rndCbk,
    }
    window[rndCbk] = (json: any) => {
        resolve(json)
        delete window[rndCbk]
        document.head!.removeChild(script)
    }
    script.src = buildUrl(apiUrl, request)
    document.head!.appendChild(script)
})

const protoFunc = <Params extends object, DataType>(method: string) =>
    (params: Params) => doRequest<DataType>({ ...(params as object), method })

export interface Photo {
    id: string
    secret: string
    server: string
    farm: number
    title: string | { _content: string }
    isprimary: string
    ispublic: number
    isfriend: number
    isfamily: number
}

interface PhotoInfoLocationPlace {
    _content: string
    place_id: string
    woeid: string
}

export interface PhotoInfo extends Photo {
    description: { _content: string }
    urls: { url: Array<{ _content: string }> }
    dates: {
        posted: string
        taken: string
        takengranularity: number
        takenunknown: number
        lastupdate: string
    }
    location?: {
        latitude: string
        longitude: string
        accuracy: string
        context: string
        neighbourhood?: PhotoInfoLocationPlace
        locality?: PhotoInfoLocationPlace
        county?: PhotoInfoLocationPlace
        region?: PhotoInfoLocationPlace
        country?: PhotoInfoLocationPlace
        place_id: string
        woeid: string
    }
}

export interface Photoset {
    id: string
    primary: string
    owner: string
    photo: Photo[]
    pages: number
    total: number
}

interface PhotosetsGetPhotosParams {
    photoset_id: string
    user_id: string
    extras?: string
    privacy_filter?: 1 | 2 | 3 | 4 | 5
    per_page?: number
    page?: number
    media?: 'all' | 'photos' | 'videos'
}

interface PhotoGetInfoParams {
    photo_id: string
    secret?: string
}

export interface ExifData {
    camera: string
    exif: Array<{
        tagspace: string
        tagspaceid: number
        tag: string
        label: string
        raw: { _content: string }
        clean?: { _content: string }
    }>
}

interface PhotoSize {
    label: 'Square' | 'Large Square' | 'Thumbnail' | 'Small' | 'Small 320' | 'Medium' | 'Medium 640' | 'Medium 800' |
        'Large' | 'Large 1600' | 'Large 2048' | 'Original'
    width: string
    height: string
    source: string
    url: string
    media: 'photo'
}

export const photos = {
    getInfo: protoFunc<PhotoGetInfoParams, { photo: PhotoInfo }>('flickr.photos.getInfo'),
    getExif: protoFunc<PhotoGetInfoParams, { photo: ExifData }>('flickr.photos.getExif'),
    getSizes: protoFunc<PhotoGetInfoParams, { sizes: { size: PhotoSize[] } }>('flickr.photos.getSizes'),
}

export const photosets = {
    getPhotos: protoFunc<PhotosetsGetPhotosParams, { photoset: Photoset }>('flickr.photosets.getPhotos'),
}

export const buildThumbnailUrl = (photo: Photo) =>
    `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`
export const buildPhotoUrl = (photo: Photo) =>
    `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`
export const buildLargePhotoUrl = (photo: Photo) =>
    `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`
