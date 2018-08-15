import React from 'react';
import { i18n as I18n } from 'i18next';
import { InjectedI18nProps, InjectedTranslateProps, translate } from 'react-i18next';
import { ProjectInfo } from 'src/containers/projects';

type ProjectProps = { project: ProjectInfo, darkMode: boolean } & InjectedTranslateProps & InjectedI18nProps;

const getDescription = (project: ProjectInfo, i18n: I18n): string => {
    if(project.intlDescription) {
        const avail = [ i18n.language, ...i18n.languages ]
            .map(lang => project.intlDescription![lang])
            .filter(descr => !!descr);
        if(avail.length > 0) {
            return avail[0];
        }
    }
    return project.description;
};

const Project = ({ project, darkMode, t, i18n }: ProjectProps) => (
    <div className={ `card ${darkMode ? 'bg-dark' : 'bg-light'}` }>
        { project.image ? <img className="card-img-top" src={ project.image } alt={ project.title } /> : null }
        <div className="card-body">
            <h5 className="card-title">{ project.title }</h5>
            <h6 className="card-subtitle mb-2 text-muted">{ project.technologies.join(', ') }</h6>
            <p className="card-text" dangerouslySetInnerHTML={{ __html: getDescription(project, i18n) }} />
            { project.repo &&
            <a href={ project.repo } className="card-link" target="_blank" rel="nofollow">{t('projects.repo')}</a> }
            { project.demo &&
            <a href={ project.demo } className="card-link" target="_blank" rel="nofollow">{t('projects.demo')}</a> }
            { project.web &&
            <a href={ project.web } className="card-link" target="_blank" rel="nofollow">{t('projects.web')}</a>  }
        </div>
    </div>
);

export default translate()(Project);