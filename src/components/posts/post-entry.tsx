import * as React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Post } from 'src/redux/posts/reducers';

interface PostEntryProps {
    entry: Post;
}

export default ({ entry }: PostEntryProps) => {
    const { date, img, title } = entry;
    const _date = moment(date.toDate()).utc();
    let fecha = date.toDate().toLocaleString();
    let url = `/blog/${_date.get('year')}/${_date.get('month') + 1}/${_date.get('date')}/${entry.url}`;

    return (
        <div className="card mb-sm-4 mb-2">
            <div className="card-img-top post_thumb" style={{backgroundImage: `url(${img})`}}>
                <Link to={ url } className="post_url">
                    <div className="cover" />
                </Link>
            </div>
            <div className="card-body">
                <h4 className="card-title">
                    <Link to={ url } className="text-white">{ title }</Link>
                </h4>
                <p className="card-text"><small className="text-light">{ fecha }</small></p>
            </div>
        </div>
    );
};
