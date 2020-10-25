import React from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

const SupportMe = () => {
  const [t] = useTranslation()

  return (
    <>

      <Helmet>
        <title>{t('support-me.title')}</title>
        <meta name="Description" content={t('support-me.description')} />
      </Helmet>

      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: 'calc(100vh - 130px)' }}
      >
        <div>
          <h1 className="display-4 text-center">
            Support me!
          </h1>

          <p className="lead mb-4 text-center">
            {t('support-me.subheading')}
            &nbsp;
            <span role="img" aria-label="face winking an eye">😉</span>
          </p>

          <div className="text-center">
            <p>
              <a href="https://ko-fi.com/G2G71SLJU" target="_blank" rel="noopener noreferrer">
                <img
                  height={36}
                  src="https://cdn.ko-fi.com/cdn/kofi4.png?v=2"
                  alt="Buy Me a Coffee at ko-fi.com"
                />
              </a>
            </p>

            <p>
              <a href="https://paypal.me/melchor9000" target="_blank" rel="noopener noreferrer" className="btn btn-info text-white">
                Haz una donación por PayPal
              </a>
            </p>
          </div>
        </div>
      </div>

    </>
  )
}

export default SupportMe
