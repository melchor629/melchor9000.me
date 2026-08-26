import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram'
import { faLastfm } from '@fortawesome/free-brands-svg-icons/faLastfm'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin'
import { faReddit } from '@fortawesome/free-brands-svg-icons/faReddit'
import { faSpotify } from '@fortawesome/free-brands-svg-icons/faSpotify'
import { faTelegram } from '@fortawesome/free-brands-svg-icons/faTelegram'
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp'
import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

type IconProps = Omit<FontAwesomeIconProps, 'icon'>

export const FaGithub = (props: IconProps) => (
  <FontAwesomeIcon
    icon={faGithub}
    {...props}
  />
)
export const FaInstagram = (props: IconProps) => (
  <FontAwesomeIcon
    icon={faInstagram}
    {...props}
  />
)
export const FaLastfm = (props: IconProps) => (
  <FontAwesomeIcon
    icon={faLastfm}
    {...props}
  />
)
export const FaLinkedin = (props: IconProps) => (
  <FontAwesomeIcon
    icon={faLinkedin}
    {...props}
  />
)
export const FaReddit = (props: IconProps) => (
  <FontAwesomeIcon
    icon={faReddit}
    {...props}
  />
)
export const FaSpotify = (props: IconProps) => (
  <FontAwesomeIcon
    icon={faSpotify}
    {...props}
  />
)
export const FaTelegram = (props: IconProps) => (
  <FontAwesomeIcon
    icon={faTelegram}
    {...props}
  />
)
export const FaTwitter = (props: IconProps) => (
  <FontAwesomeIcon
    icon={faTwitter}
    {...props}
  />
)
export const FaWhatsapp = (props: IconProps) => (
  <FontAwesomeIcon
    icon={faWhatsapp}
    {...props}
  />
)
