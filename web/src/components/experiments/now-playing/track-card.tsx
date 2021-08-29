import { DateTime } from 'luxon'
import { memo } from 'react'
import { animated } from '@react-spring/web'
import {
  NowPlayingTrack,
  RecentTrack,
} from '../../../lib/now-playing'
import Marquee from '../../marquee'

const TrackCard = ({ track, style }: { track: RecentTrack | NowPlayingTrack, style: any }) => (
  <animated.div className="np-track-card" style={style}>
    <div className="np-track-card-cover-art">
      <img
        src={track.albumArtImages?.slice(-1)[0].url || ''}
        alt={`"${track.album || ''}" cover art`}
      />
    </div>
    <div className="np-track-card-content">
      <div className="np-track-card-content-title">
        <Marquee>{track.title}</Marquee>
      </div>
      <div className="np-track-card-content-artist">
        <Marquee>{track.artist}</Marquee>
      </div>
      <div className="np-track-card-content-album">
        <Marquee>{track.album}</Marquee>
      </div>
      <div className="np-track-card-content-scrobbled">
        <Marquee>
          {'nowPlaying' in track
            ? 'Now Playing'
            : track.scrobbledAt.toLocaleString(DateTime.DATETIME_FULL)}
        </Marquee>
      </div>
    </div>
  </animated.div>
)

export default memo(TrackCard)
