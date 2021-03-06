import { useLayoutEffect, useState } from 'react'

import './404.scss'

const Parallax = require('parallax-js')

const PageNotFound = () => {
  const [{ width, height }, setSize] = useState(() => ({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  }))

  useLayoutEffect(() => {
    const onResize = () => setSize({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    })

    const parallax = new Parallax(document.querySelector('#scene'))
    document.body.style.backgroundColor = '#005d8f'
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      parallax.destroy()
      document.body.style.backgroundColor = ''
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div id="scene" className="d-flex align-items-center" style={{ height }}>
      <div className="layer" data-depth="0.3">
        <h3 className="subtitle" style={{ top: Math.max(height / 2 - (width * 0.8) / 3, -20) }}>
          Mira si te has equvocado al poner la URL...
        </h3>
      </div>
      <div className="layer" data-depth="0.5">
        <img
          width="100%"
          alt="me_irl not founding the page :("
          style={{ position: 'absolute', top: height / 2 - (width * 0.8) / 4 }}
          src={`${process.env.PUBLIC_URL}/img/404.png`}
        />
      </div>
      <div className="layer" data-depth="0.8">
        <h1 className="title" style={{ top: height / 2 }}>Uooo, esta página no existe</h1>
      </div>
    </div>
  )
}

export default PageNotFound
