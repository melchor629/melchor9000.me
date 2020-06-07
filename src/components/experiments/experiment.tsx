import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Experiment = ({ id }: { id: string }) => {
    const [ t ] = useTranslation()
    const darkMode = useSelector(({ effects }) => effects.darkMode, (a, b) => a !== b)

    return (
        <div className={`card ${darkMode ? 'bg-dark' : 'bg-light'} mb-4`}>
            <div className="card-body">
                <h5 className="card-title">{t(`experiments.${id}.title`)}</h5>
                <p className="card-text">{t(`experiments.${id}.description`)}</p>
                <Link to={`/experiments/${id}`} className="btn btn-primary">{t('experiments.goToExperiment')}</Link>
            </div>
        </div>
    )
}

export default Experiment
