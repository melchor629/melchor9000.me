import { DateTime } from 'luxon'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { runOnEnter } from '../../lib/aria-utils'
import { Post } from '../../redux/posts/state'

interface PostEntryProps {
  entry: Post
}

const PostEntry = ({ entry }: PostEntryProps) => {
  const navigate = useNavigate()

  const { date, img, title } = entry
  const parsedDate = DateTime.fromJSDate(date.toDate(), { zone: 'UTC' })
  const fecha = parsedDate.toLocal().toLocaleString(DateTime.DATETIME_FULL)
  const url = `${parsedDate.get('year')}/${parsedDate.get('month')}/${parsedDate.get('day')}/${entry.url}`

  const changeUrl = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    navigate(url)
  }, [navigate, url])

  return (
    <div className="card" onClick={changeUrl} onKeyUp={runOnEnter(changeUrl)} role="button" tabIndex={0}>
      <div className="card-img-top post_thumb" style={{ backgroundImage: `url(${img})` }}>
        <div className="post_url">
          <div className="cover" />
        </div>
      </div>
      <div className="card-body">
        <h4 className="card-title">
          {title}
        </h4>
        <p className="card-text"><small>{ fecha }</small></p>
      </div>
    </div>
  )
}

export default React.memo(PostEntry)
