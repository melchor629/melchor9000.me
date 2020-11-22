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

const Project = ({ project, darkMode }: { project: ProjectInfo, darkMode: boolean }) => {
  const [t, i18n] = useTranslation()
  return (
    <div className={`card ${darkMode ? 'bg-dark' : 'bg-light'}`}>
      {project.image && <img className="card-img-top" src={getAssetUrl(project.image)} alt={project.title} />}
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
  )
}

export default Project
