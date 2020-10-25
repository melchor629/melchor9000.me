import React from 'react'
import './footer.scss'

// eslint-disable-next-line global-require
const { version } = require('../package.json')

const links = [
  { url: 'https://github.com/melchor629/melchor9000.me', key: 'code', fas: 'code' },
  { url: 'https://github.com/melchor629', key: 'github', fab: 'github' },
  { url: 'https://twitter.com/melchor629', key: 'twitter', fab: 'twitter' },
  { url: 'https://www.reddit.com/user/melchor9000/', key: 'reddit', fab: 'reddit' },
  { url: 'https://www.instagram.com/melchor9000/', key: 'instagram', fab: 'instagram' },
  { url: 'https://www.last.fm/user/melchor629', key: 'lastfm', fab: 'lastfm' },
  { url: 'https://www.linkedin.com/in/melchor9000/', key: 'linkedin', fab: 'linkedin' },
]

const Footer = () => (
  <div className="container">
    <div className="row">
      <div className="col col-sm-auto text-sm-right">
        <div className="d-flex justify-content-center align-items-center">
          <span className="text-light">
            melchor629/melchor9000 (
            {new Date().getFullYear()}
            )&nbsp;
          </span>
          <span><small className="text-muted">{version}</small></span>
        </div>
      </div>

      <div className="col-sm" />

      <div className="col col-sm-auto d-flex align-items-center justify-content-center justify-content-sm-start
             links"
      >
        { links.map(({
          url, key, fas, fab,
        }) => (
          <a href={url} key={key} target="_blank" rel="noopener noreferrer">
            <i className={[fas && 'fas', fab && 'fab', `fa-${fab || fas}`].filter((f) => !!f).join(' ')} />
          </a>
        ))}
      </div>
    </div>
  </div>
)

export default Footer
