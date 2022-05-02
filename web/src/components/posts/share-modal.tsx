import {
  memo,
  PropsWithChildren,
} from 'react'
import { useTranslation } from 'react-i18next'

import { Post } from '../../redux/posts/state'
import { runOnEnter } from '../../lib/aria-utils'
import * as toast from '../../lib/toast'

interface ShareItemProps {
  onClick: () => void
  fab?: string
  fas?: string
  children: string
}

interface ShareModalProps {
  post: Post
}

const ShareItem = ({
  onClick,
  fab,
  fas,
  children,
}: PropsWithChildren<ShareItemProps>) => (
  <div
    className="mx-md-1 mx-2"
    role="button"
    aria-label={children}
    onClick={onClick}
    onKeyUp={runOnEnter(onClick)}
    tabIndex={0}
  >
    <i className={[fab && `fab fa-${fab}`, fas && `fas fa-${fas}`].filter((f) => !!f).join(' ')} />
  </div>
)

ShareItem.defaultProps = {
  fab: '',
  fas: '',
}

const query = (object: Record<string, string>): string => (
  new URLSearchParams(Object.entries(object)).toString()
)

const ShareModalImpl = ({ post }: ShareModalProps) => {
  const [t] = useTranslation()

  const twitterButtonPressed = () => {
    const q = query({
      text: post.title,
      url: window.location.toString(),
      via: 'melchor629',
      related: 'melchor629:Melchor Garau Madrigal',
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
      subject: `${post.title} - melchor9000`,
      body: `Lee la entrada de la morada de melchor9000:\n\t${post.title}\n\t${window.location.toString()}`,
    }).replace(/\+/g, '%20')
    window.location.assign(`mailto:?${q}`)
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

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.toString())
      .then(() => toast.info(t('blog.linkCopied')))
      .catch(() => toast.error(t('blog.linkCopyFailed')))
  }

  const share = () => {
    navigator.share({
      title: post.title,
      url: window.location.toString(),
    }).catch()
  }

  return (
    <div className="mt-2">
      <span><small>{t('blog.share')}</small></span>
      <div className="d-flex justify-content-center" style={{ fontSize: 24 }}>
        {typeof navigator.clipboard !== 'undefined' && <ShareItem onClick={copyLink} fas="copy">Copy</ShareItem>}
        {typeof navigator.share !== 'undefined' && <ShareItem onClick={share} fas="share">Share</ShareItem>}
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
  )
}

const ShareModal = memo(ShareModalImpl)
export default ShareModal
