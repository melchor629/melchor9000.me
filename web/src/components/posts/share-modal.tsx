import * as bootstrap from 'bootstrap'
import { memo, PropsWithChildren, useRef, useLayoutEffect } from 'react'
import Ink from 'react-ink'
import { useTranslation } from 'react-i18next'

import { Post } from '../../redux/posts/reducers'
import { runOnEnter } from '../../lib/aria-utils'

interface ShareItemProps {
  onClick: () => void
  fab?: string
  fas?: string
  children: string
}

const ShareItem = memo(({
  onClick,
  fab,
  fas,
  children,
}: PropsWithChildren<ShareItemProps>) => (
  <div className="share-link" onClick={onClick} onKeyUp={runOnEnter(onClick)} role="button" tabIndex={0}>
    <div className="row">
      <div className="col-2">
        <i className={[fab && `fab fa-${fab}`, fas && `fas fa-${fas}`].filter((f) => !!f).join(' ')} />
      </div>
      <div className="col-10">{ children }</div>
    </div>
    <Ink />
  </div>
))

const ShareModalImpl = ({ post, show, onHide }: { post: Post, show: boolean, onHide: () => void }) => {
  const [t] = useTranslation()
  const modalRef = useRef<HTMLDivElement>(null)

  const query = (object: any): string => new URLSearchParams(Object.entries(object)).toString()

  const twitterButtonPressed = () => {
    const q = query({
      text: encodeURIComponent(post.title),
      url: encodeURIComponent(window.location.toString()),
      via: 'melchor629',
      related: 'melchor629%3AMelchor%20Garau%20Madrigal',
    })
    window.open(`http://twitter.com/intent/tweet?${q}`)
  }

  const telegramButtonPressed = () => {
    window.location.assign(`tg://msg_url?url=${encodeURIComponent(window.location.toString())}`)
  }

  const whatsappButtonPressed = () => {
    window.location.assign(`whatsapp://send?text=${encodeURIComponent(`${post.title}: ${window.location}`)}`)
  }

  const emailButtonPressed = () => {
    const q = query({
      subject: encodeURIComponent(`${post.title} - melchor9000`),
      body: encodeURIComponent(
        `${'Lee la entrada de la morada de melchor9000:\n'
                + '\t'}${post.title}\n`
                + `\t${window.location.toString()}`,
      ),
    })
    window.open(`mailto:?${q}`)
  }

  const redditButtonPressed = () => {
    const url = encodeURIComponent(window.location.toString())
    const title = encodeURIComponent(post.title)
    window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`)
  }

  const linkedinButtonPressed = () => {
    const url = encodeURIComponent(window.location.toString())
    const title = encodeURIComponent(post.title)
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`)
  }

  const facebookButtonPressed = () => {
    const url = encodeURIComponent(window.location.toString())
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
  }

  useLayoutEffect(() => {
    const modal = bootstrap.Modal.getOrCreateInstance(modalRef.current!)
    if (show) {
      modal?.show()
    } else {
      modal?.hide()
    }
  }, [show])

  useLayoutEffect(() => {
    const elBicho = modalRef.current
    elBicho?.addEventListener('hidden.bs.modal', onHide)
    return () => elBicho?.addEventListener('hidden.bs.modal', onHide)
  }, [onHide])

  useLayoutEffect(() => () => bootstrap.Modal.getOrCreateInstance(modalRef.current!).dispose(), [])

  return (
    <div className="modal share-modal fade" id="share-modal" tabIndex={-1} role="dialog" ref={modalRef}>
      <div className="modal-dialog modal-sm">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{ t('blog.share') }</h2>
          </div>
          <div className="modal-body">
            <ShareItem onClick={twitterButtonPressed} fab="twitter">Twitter</ShareItem>
            <ShareItem onClick={redditButtonPressed} fab="reddit">Reddit</ShareItem>
            <ShareItem onClick={telegramButtonPressed} fab="telegram">Telegram</ShareItem>

            { /ipad|iphone|ipod|android/.test(navigator.userAgent.toLowerCase())
                            && <ShareItem onClick={whatsappButtonPressed} fab="whatsapp">WhatsApp</ShareItem>}

            <ShareItem onClick={linkedinButtonPressed} fab="linkedin">LinkedIn</ShareItem>
            <ShareItem onClick={facebookButtonPressed} fab="facebook">Facebook</ShareItem>
            <ShareItem onClick={emailButtonPressed} fas="envelope">Email</ShareItem>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShareModal = memo(ShareModalImpl)
export default ShareModal
