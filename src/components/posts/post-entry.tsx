import * as React from 'react'
import moment from 'moment'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Post } from '../../redux/posts/reducers'

interface PostEntryProps {
    entry: Post
}

export default withRouter(({ entry, history }: PostEntryProps & RouteComponentProps<{}>) => {
    const { date, img, title } = entry
    const _date = moment(date.toDate()).utc()
    const fecha = moment(date.toDate()).format('LL')
    const url = `/blog/${_date.get('year')}/${_date.get('month') + 1}/${_date.get('date')}/${entry.url}`
    const changeUrl = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        history.push(url)
    }

    return (
        <div className="card" onClick={ changeUrl }>
            <div className="card-img-top post_thumb" style={{ backgroundImage: `url(${img})` }}>
                <div className="post_url">
                    <div className="cover" />
                </div>
            </div>
            <div className="card-body">
                <h4 className="card-title">
                    { title }
                </h4>
                <p className="card-text"><small>{ fecha }</small></p>
            </div>
        </div>
    )
})
