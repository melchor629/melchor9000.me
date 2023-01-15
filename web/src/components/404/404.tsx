import { useLayoutEffect, useState } from 'react'

import './404.scss'

const PageNotFound = () => {
  const [{ width, height }, setSize] = useState(() => ({
    width: document.body.clientWidth,
    height: document.body.clientHeight - 32,
  }))

  useLayoutEffect(() => {
    const onResize = () => setSize({
      width: document.body.clientWidth,
      height: document.body.clientHeight - 32,
    })

    document.body.style.backgroundColor = '#005d8f'
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      document.body.style.backgroundColor = ''
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div id="scene" className="d-flex align-items-center" style={{ height, overflow: 'hidden' }}>
      <div className="layer" data-depth="0.5">
        <img
          width="100%"
          alt="me_irl not founding the page :("
          style={{ position: 'absolute', top: height / 2 - (width * 0.8) / 4 }}
          src={new URL('./404.png?as=webp&quality=80', import.meta.url).toString()}
        />
      </div>
      <div className="layer" data-depth="0.8">
        <h1 className="title" style={{ top: height / 2 }}>Uooo, esta página no existe</h1>
      </div>
    </div>
  )
}

export default PageNotFound
