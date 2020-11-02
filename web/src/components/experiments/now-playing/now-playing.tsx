import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { useTransition } from 'react-spring'
import {
  getRecentTrackList,
  getRecentTrackListForUser,
  NowPlayingTrack,
  RecentTrack,
  RecentTracksResponse,
} from '../../../lib/now-playing'
import TrackCard from './track-card'
import './now-playing.scss'

const compareTracks = (a: RecentTrack | NowPlayingTrack, b: RecentTrack | NowPlayingTrack) => {
  if (a.mbid === b.mbid && a.mbid) {
    return true
  }

  return a.title === b.title && a.artist === b.artist && a.album === b.album
}

const NowPlaying = ({ match }: RouteComponentProps<{ user?: string }>) => {
  const { user } = match.params
  const [data, setData] = useState<RecentTracksResponse | undefined>()
  const [tracks, setTracks] = useState<Array<(RecentTrack | NowPlayingTrack) & { key: string }>>([])

  useEffect(() => {
    if (!data) {
      return
    }

    const list: Array<(RecentTrack | NowPlayingTrack) & { key: string }> = []
    let changed = false

    if (data.nowPlaying) {
      if (tracks[0]?.key === 'now-playing' && compareTracks(tracks[0], data.nowPlaying)) {
        list.push(tracks[0])
      } else {
        changed = true
        list.push({
          ...data.nowPlaying,
          key: 'now-playing',
        })
      }
    }

    data.recentTracks.forEach((rt) => {
      const key = `${rt.mbid}:${rt.scrobbledAt.toMillis()}`
      const art = tracks.find((t) => t.key === key)
      if (art) {
        list.push(art)
      } else {
        changed = true
        list.push({ ...rt, key })
      }
    })

    if (changed) {
      setTracks(list)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const transitions = useTransition(tracks, (t) => t.key, {
    initial: { opacity: 0, transform: 'translateY(0px) translateX(0px)' },
    from: { opacity: 0, transform: 'translateY(15px) translateX(0px)' },
    enter: { opacity: 1, transform: 'translateY(0px) translateX(0px)' },
    leave: { opacity: 0, transform: 'translateY(15px) translateX(0px)' },
    unique: true,
    trail: 100,
  })

  useEffect(() => {
    const getter = user
      ? () => getRecentTrackListForUser(user)
      : getRecentTrackList
    const refresher = () => getter().then(setData).catch((error) => console.error(error))
    const handle = setInterval(refresher, 10_000)
    refresher()
    return () => clearInterval(handle)
  }, [user])

  if (!data) {
    return (
      <div className="d-flex align-items-center justify-content-center now-playing-container">
        <h1>Loading tracks...</h1>
      </div>
    )
  }

  return (
    <div className="d-flex align-items-center now-playing-container">
      <div className="d-flex flex-row">
        {transitions.map(({ item, props, key }) => (
          <TrackCard key={key} track={item} style={props} />
        ))}
      </div>
    </div>
  )
}

export default NowPlaying
