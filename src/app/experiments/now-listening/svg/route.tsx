import { ImageResponse } from 'next/og'
import { getRecentTracks } from '@/clients/lastfm'

type NowListeningSvgProps = {
  readonly status: string
  readonly imageUrl?: string | null
  readonly artistName?: string | null
  readonly songName: string
}

const NowListeningSvg = ({ artistName, imageUrl, songName, status }: NowListeningSvgProps) => (
  <div
    style={{
      display: 'flex',
      columnGap: 10,
      padding: '10px',
      width: '100%',
      height: '100%',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
    }}
  >
    {imageUrl && (
      /* oxlint-disable-next-line @next/next/no-img-element */
      <img src={imageUrl} alt="Album cover" style={{ width: 100, height: 100, borderRadius: 5 }} />
    )}
    {!imageUrl && (
      <div
        style={{
          width: 100,
          height: 100,
          borderRadius: 5,
          backgroundColor: '#efefef',
        }}
      />
    )}

    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: '10%',
      }}
    >
      <div
        style={{
          display: 'flex',
          textAlign: 'center',
          width: '100%',
          color: '#828282',
          fontSize: 10,
          userSelect: 'none',
          marginBottom: 4,
        }}
      >
        {status}
      </div>
      <div
        style={{
          color: '#666',
          overflow: 'hidden',
          fontSize: 24,
          marginBottom: 3,
          width: '100%',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {songName}
      </div>
      <div
        style={{
          display: 'flex',
          color: '#b3b3b3',
          fontSize: 20,
          width: '100%',
        }}
      >
        {artistName}
      </div>
    </div>
  </div>
)

export const GET = async (_: Request, { params }: { params: Promise<{ user?: string }> }) => {
  const user = (await params)?.user ?? 'melchor629'
  const tracks = await getRecentTracks(user, 15)
  if (tracks == null) {
    return new Response(null, { status: 404 })
  }

  const track =
    tracks.find((t) => t.nowPlaying) ?? tracks[Math.trunc(tracks.length * Math.random())]
  return new ImageResponse(
    <NowListeningSvg
      songName={track.title}
      status={
        track.scrobbledAt
          ? `Was playing at ${track.scrobbledAt.toLocaleString('es-ES')}:`
          : 'Vibing to:'
      }
      artistName={track.artist}
      imageUrl={track.albumArtImages.at(-1)?.url}
    />,
    {
      width: 480,
      height: 120,
      headers: {
        'Cache-Control': 'no-cache',
      },
    },
  )
}
