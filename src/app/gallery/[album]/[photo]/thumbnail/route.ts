import type { NextRequest } from 'next/server'
import { fetchAssetThumbnail } from '@/clients/gallery'

type Params = { readonly params: Promise<{ album: string, photo: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  const { photo } = await params
  const blob = await fetchAssetThumbnail(photo)
  if (blob) {
    return new Response(blob)
  }

  return new Response(null, { status: 404 })
}
