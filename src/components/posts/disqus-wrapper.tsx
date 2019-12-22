import React from 'react'
import { Trans, withTranslation, WithTranslation } from 'react-i18next'
const { DiscussionEmbed } = require('disqus-react')

interface DisqusWrapperProps {
    shortName: string
    config: {
        url: string
        identifier: string
        title: string
    } | null | undefined
}

interface State {
    hasAccepted: boolean
}

class DisqusWrapper extends React.PureComponent<DisqusWrapperProps & WithTranslation, State> {
    constructor(props: DisqusWrapperProps & WithTranslation) {
        super(props)

        this.state = { hasAccepted: (window.localStorage.getItem('posts.disqus.accepted') || 'false') === 'true' }

        this.onAcceptClicked = this.onAcceptClicked.bind(this)
    }

    public render() {
        const { config, shortName } = this.props
        if(this.state.hasAccepted) {
            return config ? <DiscussionEmbed shortname={shortName} config={config} /> : null
        } else {
            return (
                <div className="text-center mb-4 mt-4 d-flex justify-content-center">
                    <div style={{ width: '30vw', minWidth: '300px' }}>
                        <p><Trans i18nKey="blog.disqus.policy">
                            . <a href="https://disqus.com/" target="_blank" rel="noopener noreferrer">Disqus</a> .
                        </Trans></p>
                        <p><small><a href="https://help.disqus.com/terms-and-policies" target="_blank" rel="noopener noreferrer">
                            { this.props.t('blog.disqus.terms') }
                        </a></small></p>
                        <p>
                            <button type="button"
                                className="btn btn-lg btn-outline-primary"
                                onClick={ this.onAcceptClicked }>
                                { this.props.t('blog.disqus.accept') }
                            </button>
                        </p>
                    </div>
                </div>
            )
        }
    }

    private onAcceptClicked(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        window.localStorage.setItem('posts.disqus.accepted', 'true')
        this.setState({ hasAccepted: true })
    }
}

export default withTranslation()(DisqusWrapper)
