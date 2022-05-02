import Masonry from 'masonry-layout'
import React, {
  useCallback, useEffect, useMemo, useState, useRef, useLayoutEffect,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import * as toast from '../../lib/toast'
import { removeError, subscribe, unsubscribe } from '../../redux/database/actions'
import LoadSpinner from '../load-spinner'
import { useDispatch, useSelector } from '../../redux'
import Project from './project'
import './projects.scss'
import { ID } from '../../redux/database/state'

export interface ProjectInfo {
  [ID]: string
  title: string
  repo: string
  demo?: string
  web?: string
  image?: string
  technologies: string[]
  description: string
  intlDescription?: { [lang: string]: string }
}

const Projects = () => {
  const masonryRef = useRef<Masonry>()
  const [t] = useTranslation()
  const dispatch = useDispatch()
  const { darkMode, projects, subscriptionError } = useSelector(({ database, effects }) => ({
    darkMode: effects.darkMode,
    projects: database.projects?.snapshot as ProjectInfo[] | undefined,
    subscriptionError: database.projects?.error,
  }))

  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])

  useEffect(() => {
    dispatch(subscribe('projects', 'title'))

    return () => {
      dispatch(unsubscribe('projects'))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (subscriptionError) {
      toast.error(() => (
        <div>
          {t('projects.couldNotLoad')}
          <br />
          <span className="text-muted">{subscriptionError.message}</span>
        </div>
      ))
      dispatch(removeError('projects'))
    }
  }, [subscriptionError]) // eslint-disable-line react-hooks/exhaustive-deps

  const techs = useMemo(
    () => (
      Array.from(new Set(
        projects
          ?.map((p) => p.technologies.map((q) => q.toLowerCase()))
          .flat() ?? [],
      )).sort()
    ),
    [projects],
  )

  const filteredProjects = useMemo(() => {
    if (!projects) {
      return projects
    }

    let filtered = projects

    if (selectedTechnologies.length) {
      filtered = filtered
        .filter((p) => p.technologies.some((q) => selectedTechnologies.includes(q.toLowerCase())))
    }

    return filtered
  }, [projects, selectedTechnologies])

  const onTechnologyClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault()

    const value = (e.target as HTMLButtonElement).innerText
    if (value === 'clear') {
      setSelectedTechnologies([])
    } else if (e.ctrlKey || e.metaKey) {
      setSelectedTechnologies((st) => (
        st.includes(value) ? st.filter((f) => f !== value) : [...st, value]
      ))
    } else {
      setSelectedTechnologies((st) => (st.includes(value) ? [] : [value]))
    }
  }, [])

  const configureMasonry = useCallback((ref: HTMLDivElement) => {
    const masonry = new Masonry(ref, {
      percentPosition: true,
    })

    masonryRef.current = masonry
  }, [])

  useLayoutEffect(() => {
    if (masonryRef.current) {
      const elem = (masonryRef.current as any).element
      masonryRef.current.destroy?.()
      configureMasonry(elem)
    }
  }, [filteredProjects, configureMasonry])

  return (
    <div>

      <Helmet>
        <title>Projects</title>
        <meta
          name="Description"
          content="Page of my code projects"
        />
      </Helmet>

      <div className="page-header">
        <h1>
          {t('projects.title')}
          {' '}
          <small>{t('projects.subtitle')}</small>
        </h1>
        <p className="lead">
          {t('projects.description')}
        </p>
      </div>

      <div style={{
        overflowX: 'auto', position: 'relative', display: 'flex', paddingBottom: '0.75rem',
      }}
      >
        <div className="px-1 col-auto" style={{ position: 'sticky', left: 2, zIndex: 2 }}>
          <button
            type="button"
            className="btn btn-sm btn-warning"
            onClick={onTechnologyClick}
            disabled={!selectedTechnologies.length}
          >
            clear
          </button>
        </div>
        {techs.map((q) => (
          <div key={q} className="px-1 col-auto">
            <button
              type="button"
              className={`btn btn-sm btn-secondary ${selectedTechnologies.includes(q) && 'active'}`}
              onClick={onTechnologyClick}
            >
              {q}
            </button>
          </div>
        ))}
      </div>

      {filteredProjects
        ? (
          <div className="row mt-4" ref={configureMasonry}>
            {filteredProjects.map((project) => (
              <Project
                project={project}
                key={project[ID]}
                darkMode={darkMode}
                onImageLoaded={() => masonryRef.current?.layout?.()}
              />
            ))}
          </div>
        )
        : <LoadSpinner />}
    </div>
  )
}

export default Projects
