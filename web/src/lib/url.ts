const join = (a: string, b: string) => {
  const aStripped = a.replace(/\/$/, '')
  const bStripped = b.replace(/^\//, '')
  return `${aStripped}/${bStripped}`
}

export const publicUrl = (import.meta.env.BASE_URL || '/')
export const assetsUrl = publicUrl

export const absoluteUrl = (url: string) => (url.startsWith('http') ? url : join(publicUrl, url))
export const getAssetUrl = (url: string) => (url.startsWith('http') ? url : join(assetsUrl, url))
