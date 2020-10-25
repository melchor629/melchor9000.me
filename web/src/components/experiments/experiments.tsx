import React from 'react'
import { useTranslation } from 'react-i18next'
import Experiment from './experiment'

const Experiments = () => {
  const [t] = useTranslation()

  return (
    <>
      <div className="page-header">
        <h1>{t('experiments.title')}</h1>
        <p className="lead">{t('experiments.description')}</p>
      </div>

      <div className="row">
        <div className="col-12">
          <Experiment id="eugl" />
          <Experiment id="viz" />
        </div>
      </div>
    </>
  )
}

export default Experiments
