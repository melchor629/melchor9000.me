import React from 'react';

import './footer.css';

const links = [
    { url: 'https://github.com/melchor629/melchor9000.me', className: 'code' },
    { url: 'https://github.com/melchor629', className: 'github' },
    { url: 'https://twitter.com/melchor629', className: 'twitter' },
    { url: 'https://www.reddit.com/user/melchor9000/', className: 'reddit' },
    { url: 'https://www.instagram.com/melchor9000/', className: 'instagram' },
    { url: 'https://www.last.fm/user/melchor629', className: 'lastfm' },
    { url: 'https://www.linkedin.com/in/melchor9000/', className: 'linkedin' },
];

export default () => (
    <div className="container">
        <div className="row">
            <div className="col-auto">
                <p>
                    melchor629/melchor9000 (2018)
                </p>
            </div>

            <div className="col" />

            <div className="col-auto d-flex align-items-center links">
                { links.map(link => (
                    <a href={ link.url } key={ link.className } target="_blank" rel="noreferrer">
                        <i className={ `fa fa-${ link.className }` } />
                    </a>
                ))}
            </div>
        </div>
    </div>
);