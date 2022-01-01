const join = (a: string, b: string) => (a.endsWith('/') ? a + b : `${a}/${b}`)

export const publicUrl = (process.env.PUBLIC_URL || '/')
export const assetsUrl = publicUrl

export const absoluteUrl = (url: string) => (url.startsWith('http') ? url : join(publicUrl, url))
export const getAssetUrl = (url: string) => (url.startsWith('http') ? url : join(assetsUrl, url))
