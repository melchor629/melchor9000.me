import { memo } from 'react'
import { useTranslation } from 'react-i18next'

const Header = ({ photo }: { photo: string | null }) => {
  const [t] = useTranslation()

  return (
    <div className="gallery-header" style={{ position: 'absolute' }}>
      <div className="image-background" style={{ backgroundImage: photo ? `url(${photo})` : 'none' }} />
      <div>
        <h1>{ t('gallery.header.title') }</h1>
        <p className="lead">{ t('gallery.header.description') }</p>
      </div>
    </div>
  )
}

export default memo(Header)
