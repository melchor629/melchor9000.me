import React, { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

const { DiscussionEmbed } = require('disqus-react')

interface DisqusWrapperProps {
  shortName: string
  config: {
    url: string
    identifier: string
    title: string
  } | null | undefined
}

const DisqusWrapper = ({ config, shortName }: DisqusWrapperProps) => {
  const [hasAccepted, setHasAccepted] = useState(() => (
    (window.localStorage.getItem('posts.disqus.accepted') || 'false') === 'true'
  ))
  const [t] = useTranslation()

  const onAcceptClicked = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    window.localStorage.setItem('posts.disqus.accepted', 'true')
    setHasAccepted(true)
  }, [])

  if (hasAccepted) {
    return config ? <DiscussionEmbed shortname={shortName} config={config} /> : null
  }

  return (
    <div className="text-center mb-4 mt-4 d-flex justify-content-center">
      <div style={{ width: '30vw', minWidth: '300px' }}>
        <p>
          <Trans i18nKey="blog.disqus.policy">
            .
            {' '}
            <a href="https://disqus.com/" target="_blank" rel="noopener noreferrer">Disqus</a>
            {' '}
            .
          </Trans>
        </p>
        <p>
          <small>
            <a href="https://help.disqus.com/terms-and-policies" target="_blank" rel="noopener noreferrer">
              {t('blog.disqus.terms')}
            </a>
          </small>
        </p>
        <p>
          <button
            type="button"
            className="btn btn-lg btn-outline-primary"
            onClick={onAcceptClicked}
          >
            {t('blog.disqus.accept')}
          </button>
        </p>
      </div>
    </div>
  )
}

export default DisqusWrapper
