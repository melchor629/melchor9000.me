import React, { useEffect } from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useDispatch, useSelector } from 'react-redux'
import * as toast from '../../lib/toast'
import { removeError, subscribe, unsubscribe } from '../../redux/database/actions'
import LoadSpinner from '../load-spinner'
import Project from './project'
import './projects.scss'

export interface ProjectInfo {
    _id: string
    title: string
    repo: string
    demo: string
    web: string
    image?: string
    technologies: string[]
    description: string
    intlDescription?: { [lang: string]: string }
}

type ProjectsPageProps = WithTranslation

const Projects = ({ t }: ProjectsPageProps) => {
    const dispatch = useDispatch()
    const { darkMode, projects, subscriptionError } = useSelector(({ database, effects }) => ({
        darkMode: effects.darkMode,
        projects: database.snapshots.projects as ProjectInfo[] | undefined,
        subscriptionError: database.snapshots.projectsError,
    }))

    useEffect(() => {
        dispatch(subscribe('projects', 'title'))

        return () => void dispatch(unsubscribe('projects'))
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if(subscriptionError) {
            toast.error(() => (
                <div>
                    {t('projects.couldNotLoad')}
                    <br/>
                    <span className="text-muted">{subscriptionError.message}</span>
                </div>
            ))
            dispatch(removeError('projects'))
        }
    }, [ subscriptionError ]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>

            <Helmet>
                <title>Projects</title>
                <meta name="Description"
                    content="Page of my code projects" />
            </Helmet>

            <div className="page-header">
                <h1>{t('projects.title')} <small>{t('projects.subtitle')}</small></h1>
                <p className="lead">
                    {t('projects.description')}
                </p>
            </div>

            {projects ? (
                <div className="card-columns">
                    {projects.map(project => (
                        <Project project={project} key={project._id} darkMode={darkMode} />
                    ))}
                </div>
            ) :
                <LoadSpinner />
            }
        </div>
    )
}

export default withTranslation()(Projects)
