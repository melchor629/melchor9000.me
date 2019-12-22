import path from 'path'

export const publicUrl = (process.env.PUBLIC_URL || '/')
export const assetsUrl = publicUrl

export const absoluteUrl = (url: string) => url.startsWith('http') ? url : path.join(publicUrl, url)
export const getAssetUrl = (url: string) => url.startsWith('http') ? url : path.join(assetsUrl, url)
