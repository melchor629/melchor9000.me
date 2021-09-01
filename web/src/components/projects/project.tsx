import type { i18n as i18next } from 'i18next'
import { useTranslation } from 'react-i18next'
import { getAssetUrl } from '../../lib/url'
import type { ProjectInfo } from './projects'

const getDescription = (project: ProjectInfo, i18n: i18next): string => {
  if (project.intlDescription) {
    let avail = project.intlDescription[i18n.language]
    if (avail) {
      return avail
    }

    avail = project.intlDescription[i18n.language.replace(/-.+/, '')]
    if (avail) {
      return avail
    }
  }
  return project.description
}

const Project = ({ project, darkMode, onImageLoaded }: { project: ProjectInfo, darkMode: boolean, onImageLoaded?: () => void }) => {
  const [t, i18n] = useTranslation()
  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className={`card ${darkMode ? 'bg-dark' : 'bg-light'}`}>
        {project.image && <img className="card-img-top" src={getAssetUrl(project.image)} alt={project.title} onLoad={onImageLoaded} />}
        <div className="card-body">
          <h5 className="card-title">{ project.title }</h5>
          <h6 className="card-subtitle mb-2 text-muted">{ project.technologies.join(', ') }</h6>
          <p className="card-text" dangerouslySetInnerHTML={{ __html: getDescription(project, i18n) }} />
          {project.repo && (
            <a href={project.repo} className="card-link" target="_blank" rel="noopener noreferrer">
              {t('projects.repo')}
            </a>
          )}
          {project.demo && (
            <a href={project.demo} className="card-link" target="_blank" rel="noopener noreferrer">
              {t('projects.demo')}
            </a>
          )}
          {project.web && (
            <a href={project.web} className="card-link" target="_blank" rel="noopener noreferrer">
              {t('projects.web')}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default Project
