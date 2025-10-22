'use client'

import {
  Email as EmailIcon,
  Link as LinkIcon,
  Share as ShareIcon,
} from '@mui/icons-material'
import {
  Box,
  IconButton,
  Tooltip,
} from '@mui/material'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import {
  FaLinkedin,
  FaReddit,
  FaTelegram,
  FaTwitter,
  FaWhatsapp,
} from '@/components/fa-icons'

export default function ShareLinks({ title }: { readonly title: string }) {
  const pathname = usePathname()
  const thisUrl = useMemo(() => typeof window !== 'undefined'
    ? new URL(pathname, window.location.origin).toString()
    : pathname, [pathname])
  const twitterUrl = useMemo(() => `http://twitter.com/intent/tweet?${new URLSearchParams({
    text: title,
    url: thisUrl,
    via: 'melchor629',
    related: 'melchor629:Melchor Garau Madrigal',
  })}`, [title, thisUrl])
  const telegramUrl = useMemo(() => `tg://msg_url?url=${encodeURIComponent(thisUrl)}`, [thisUrl])
  const whatsAppUrl = useMemo(
    () => `whatsapp://send?text=${encodeURIComponent(`${title}: ${thisUrl}`)}`,
    [title, thisUrl],
  )
  const emailUrl = useMemo(() => {
    const q = new URLSearchParams({
      subject: `${title} - melchor9000`,
      body: `Checkout this post from melchor9000's site:\n\t${title}\n\t${thisUrl}`,
    })
    return `mailto:?${q}`
  }, [title, thisUrl])
  const redditUrl = useMemo(() => {
    const q = new URLSearchParams({
      title,
      url: thisUrl,
    })
    return `https://www.reddit.com/submit?${q}`
  }, [title, thisUrl])
  const linkedinUrl = useMemo(() => {
    const q = new URLSearchParams({
      title,
      url: thisUrl,
      mini: 'true',
    })
    return `https://www.linkedin.com/shareArticle?${q}`
  }, [title, thisUrl])

  const copyLink = useCallback(() => {
    void navigator.clipboard.writeText(thisUrl)
    // TODO send notification
  }, [thisUrl])

  const share = useCallback(() => {
    navigator.share({
      title,
      url: thisUrl,
    }).catch(() => {})
  }, [thisUrl, title])

  return (
    <Box component="section" sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
      <Tooltip title="Copy link" disableInteractive>
        <IconButton onClick={copyLink}>
          <LinkIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share post" disableInteractive>
        <IconButton onClick={share} disabled={typeof navigator?.share === 'undefined'}>
          <ShareIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share on X (formely Twitter)" disableInteractive>
        <IconButton href={twitterUrl} target="_blank" rel="noopener noreferrer">
          <FaTwitter width={20} height={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share on Reddit" disableInteractive>
        <IconButton href={redditUrl} target="_blank" rel="noopener noreferrer">
          <FaReddit width={20} height={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share on Telegram" disableInteractive>
        <IconButton href={telegramUrl} target="_blank" rel="noopener noreferrer">
          <FaTelegram width={20} height={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share on WhatsApp" disableInteractive>
        <IconButton href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp width={20} height={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Share on LinkedIn" disableInteractive>
        <IconButton href={linkedinUrl} target="_blank" rel="noopener noreferrer">
          <FaLinkedin width={20} height={20} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Send through email" disableInteractive>
        <IconButton href={emailUrl} target="_blank" rel="noopener noreferrer">
          <EmailIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
