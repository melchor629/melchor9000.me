import React from 'react'
// import {
//   getFirestore, collection, doc, getDoc,
// } from 'firebase/firestore'
import { animated, Transition } from '@react-spring/web'
import { nanoid } from 'nanoid'
// import app from '../../../lib/firebase'
import * as toast from '../../../lib/toast'
import LoadSpinner from '../../load-spinner'
import Project from '../../projects/project'
import type { ProjectEditorDispatchToProps, ProjectEditorStateToProps } from '../../../containers/admin/projects/editor'
import type { ProjectInfo } from '../../../containers/admin/projects'
import {
  urlOrLocalValidator,
  urlValidator,
  valueValidator,
} from '../../../lib/validators'
import { AdminBigInput, AdminInput } from '../admin-input'

type ProjectEditorProps = ProjectEditorStateToProps & ProjectEditorDispatchToProps

interface ProjectEditorState {
  title: string
  description: string
  intlDescription: Array<{ id: string, lang: string, description: string }>
  repo: string
  demo: string
  web: string
  image: string
  technologies: Array<{ id: string, value: string }>
  preview: boolean
  original: ProjectInfo | null
  exists: { [x: string]: boolean }
  checking: { [x: string]: boolean }
}

export default class ProjectEditor extends React.Component<ProjectEditorProps, ProjectEditorState> {
  private urlFieldChangedTimers: { [x: string]: NodeJS.Timer | null } = {}

  constructor(props: ProjectEditorProps) {
    super(props)
    this.state = {
      title: '',
      description: '',
      intlDescription: [],
      repo: '',
      demo: '',
      web: '',
      image: '',
      technologies: [{ id: nanoid(), value: '' }],
      preview: false,
      original: null,
      exists: {},
      checking: {},
    }

    this.changeLangDescription = this.changeLangDescription.bind(this)
    this.changeDescription = this.changeDescription.bind(this)
    this.removeDescription = this.removeDescription.bind(this)
    this.removeTechnology = this.removeTechnology.bind(this)
    this.addDescription = this.addDescription.bind(this)
    this.previewToggle = this.previewToggle.bind(this)
    this.addTechnology = this.addTechnology.bind(this)
    this.save = this.save.bind(this)
  }

  componentDidMount() {
    // TODO refactor component into FC
    /* const { match } = this.props
    if (match.params.id) {
      getDoc(doc(collection(getFirestore(app), 'projects'), match.params.id))
        .then((obj) => {
          const project = obj.data() as ProjectInfo
          this.setState({
            original: { ...project, _id: obj.id },
            title: project.title,
            description: project.description,
            repo: project.repo || '',
            demo: project.demo || '',
            web: project.web || '',
            image: project.image || '',
            technologies: project.technologies.map((value) => ({ value, id: nanoid() })),
            intlDescription: Object.entries(project.intlDescription ?? {})
              .map(([lang, description]) => ({ id: nanoid(), lang, description })),
          })
        })
    } */
  }

  componentDidUpdate(prevProps: ProjectEditorProps) {
    const {
      saving,
      errorSaving,
      // history,
      clearError,
    } = this.props
    if (prevProps.saving && !saving) {
      if (!errorSaving) {
        // history.push('/admin/projects/')
      } else {
        toast.error(`No se pudo añadir el nuevo proyecto...${errorSaving.message}`)
        clearError()
      }
    }
  }

  private getProject() {
    const {
      title,
      repo,
      technologies,
      description,
      image,
      demo,
      web,
      original,
      intlDescription,
    } = this.state
    const project: Partial<ProjectInfo> = {
      title,
      repo,
      technologies: technologies.map(({ value }) => value),
      description,
    }

    if (image) {
      project.image = image
    }

    if (demo) {
      project.demo = demo
    }

    if (web) {
      project.web = web
    }

    if (original) {
      // eslint-disable-next-line no-underscore-dangle
      project._id = original._id
    }

    if (intlDescription.length > 0) {
      project.intlDescription = Object.fromEntries(
        intlDescription.map(({ lang, description: desc }) => [lang, desc]),
      )
    }

    return project
  }

  private addTechnology(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const { technologies } = this.state
    this.setState({
      technologies: [
        ...technologies,
        { id: nanoid(), value: '' },
      ],
    })
  }

  private removeTechnology(e: React.MouseEvent<HTMLButtonElement>, i: number) {
    e.preventDefault()
    const { technologies } = this.state
    this.setState({
      technologies: [
        ...technologies.slice(0, i),
        ...technologies.slice(i + 1),
      ],
    })
  }

  private urlFieldChanged<K extends keyof ProjectEditorState>(
    e: React.ChangeEvent<HTMLInputElement>,
    a: K,
    value: string,
    valid: boolean,
    type?: string,
  ) {
    e.preventDefault()
    this.setState({ [a]: value } as any)

    // eslint-disable-next-line react/destructuring-assignment
    if ((valid || !this.state.exists[value]) && type) {
      if (this.urlFieldChangedTimers[a] !== null) {
        clearTimeout(this.urlFieldChangedTimers[a]!)
      }

      this.urlFieldChangedTimers[a] = setTimeout(async () => {
        this.setState(({ checking }) => ({ checking: { ...checking, [a]: true } }))
        try {
          const res = await fetch(value, { method: 'HEAD' })
          this.setState(({ exists, checking }) => ({
            exists: {
              ...exists,
              [a]: res.ok && res.status === 200 && res.headers.get('Content-Type')!.includes(type),
            },
            checking: { ...checking, [a]: false },
          }))
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message)
          }

          this.setState(({ exists, checking }) => ({
            exists: {
              ...exists,
              [a]: false,
            },
            checking: { ...checking, [a]: false },
          }))
        }
      }, 300)
    }
  }

  private previewToggle(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const { preview } = this.state
    this.setState({ preview: !preview })
  }

  private addDescription(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const { intlDescription, description } = this.state
    this.setState({
      intlDescription: [
        ...intlDescription,
        { id: nanoid(), lang: '', description },
      ],
    })
  }

  private changeDescription(e: React.ChangeEvent<HTMLTextAreaElement>, i: number) {
    const { intlDescription } = this.state
    this.setState({
      intlDescription: [
        ...intlDescription.slice(0, i),
        { ...intlDescription[i], description: e.currentTarget.value },
        ...intlDescription.slice(i + 1),
      ],
    })
  }

  private removeDescription(e: React.MouseEvent<HTMLButtonElement>, i: number) {
    e.preventDefault()
    const { intlDescription } = this.state
    this.setState({
      intlDescription: [
        ...intlDescription.slice(0, i),
        ...intlDescription.slice(i + 1),
      ],
    })
  }

  private changeLangDescription(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const { intlDescription } = this.state
    this.setState({
      intlDescription: [
        ...intlDescription.slice(0, i),
        { ...intlDescription[i], lang: e.currentTarget.value.toLocaleLowerCase() },
        ...intlDescription.slice(i + 1),
      ],
    })
  }

  private save(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const { original } = this.state
    const { update, save } = this.props
    if (original) {
      update(this.getProject())
    } else {
      save(this.getProject())
    }
  }

  render() {
    const {
      title,
      description,
      repo,
      demo,
      web,
      image,
      technologies,
      preview,
      exists,
      intlDescription,
    } = this.state
    const { darkMode, saving } = this.props

    return (
      <div>
        <h1>Añadir un nuevo proyecto</h1>

        <form>
          <AdminInput
            type="text"
            id="title"
            placeholder="Nombre"
            value={title}
            required
            onChange={(e) => this.setState({ title: e.target.value })}
          />
          <AdminBigInput
            type="text"
            id="description"
            placeholder="Descripción"
            value={description}
            required
            onChange={(e) => this.setState({ description: e.target.value })}
          />
          <AdminInput
            type="url"
            id="repo"
            placeholder="Repositorio"
            value={repo}
            validators={[urlValidator]}
            onChangeAlt={(e, v, i) => this.urlFieldChanged(e, 'repo', v, i)}
          />
          <AdminInput
            type="url"
            id="demo"
            placeholder="Web de demostración"
            value={demo}
            validators={[urlValidator]}
            onChangeAlt={(e, v, i) => this.urlFieldChanged(e, 'demo', v, i)}
          />
          <AdminInput
            type="url"
            id="web"
            placeholder="Web"
            value={web}
            validators={[urlValidator]}
            onChangeAlt={(e, v, i) => this.urlFieldChanged(e, 'web', v, i)}
          />
          <AdminInput
            type="url"
            id="image"
            placeholder="Imagen"
            value={image}
            validators={[urlOrLocalValidator, valueValidator(exists.image)]}
            onChangeAlt={(e, v, i) => this.urlFieldChanged(e, 'image', v, i, 'image')}
          />
          <div className="row align-items-end mb-2">
            <div className="col-auto">Traducciones</div>
            <div className="col" />
            <div className="col-auto">
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={this.addDescription}>
                +
              </button>
            </div>
          </div>
          {intlDescription.map(({ id, lang, description: desc }, i) => (
            <div className="row" key={id}>
              <div className="col-1">
                <AdminInput
                  type="text"
                  id={`lang-${id}`}
                  placeholder="Lang"
                  required
                  onChange={(e) => this.changeLangDescription(e, i)}
                  value={lang}
                />
              </div>
              <div className="col">
                <AdminBigInput
                  type="text"
                  id={`description-${id}`}
                  value={desc}
                  required
                  onChange={(e) => this.changeDescription(e, i)}
                />
              </div>
              <div className="col-auto d-flex align-items-center pl-0">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning"
                  onClick={(e) => this.removeDescription(e, i)}
                >
                  -
                </button>
              </div>
            </div>
          ))}
          <div className="row align-items-end mb-2">
            <div className="col-auto">Tecnologías</div>
            <div className="col" />
            <div className="col-auto">
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={this.addTechnology}>+</button>
            </div>
          </div>
          {technologies.map(({ id, value }, i) => (
            <div className="row" key={id}>
              <div className="col">
                <AdminInput
                  type="text"
                  id={`technology-${id}`}
                  placeholder={`Tecnología ${i}`}
                  value={value}
                  required
                  onChange={(e) => this.setState({
                    technologies: [
                      ...technologies.slice(0, i),
                      { id, value: e.target.value },
                      ...technologies.slice(i + 1),
                    ],
                  })}
                />
              </div>
              { i > 0 && (
              <div
                className="col-auto d-flex align-items-center pl-0"
                style={{ paddingBottom: '1em' }}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning"
                  onClick={(e) => this.removeTechnology(e, i)}
                >
                  -
                </button>
              </div>
              ) }
            </div>
          )) }

          <div className="d-flex justify-content-end">
            <div className="btn btn-group">
              <button type="button" className="btn btn-outline-primary" onClick={this.previewToggle}>
                Vista previa
              </button>
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={this.save}
              >
                Guardar
              </button>
            </div>
          </div>
        </form>

        <Transition native from={{ val: 0 }} enter={{ val: 1 }} leave={{ val: 0 }} items={preview}>
          {/* eslint-disable-next-line react/no-unstable-nested-components */}
          { (toggle) => ((vals: any) => toggle && (
          <animated.div
            className="ml-sm-auto px-4"
            style={{
              position: 'fixed',
              top: 'calc(40px + 10px)',
              right: 0,
              zIndex: 1,
              width: '300px',
              maxHeight: 'calc(100vh - 40px - 10px - 30px)',
              overflowY: 'scroll',
              transform: vals.val.interpolate((x: number) => `translateX(${(1 - x) * 300}px)`),
            }}
          >
            <Project project={this.getProject() as ProjectInfo} darkMode={darkMode} />
          </animated.div>
          )) }
        </Transition>

        <Transition
          native
          from={{ val: 0 }}
          enter={{ val: 1 }}
          leave={{ val: 0 }}
          items={saving}
        >
          {/* eslint-disable-next-line react/no-unstable-nested-components */}
          { (toggle) => ((vals: any) => toggle && (
          <animated.div
            role="main"
            className="ml-sm-auto px-4"
            style={{
              position: 'absolute',
              overflowY: 'scroll',
              top: 0,
              left: 0,
              width: '100%',
              height: 'calc(100vh - 30px)',
              backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.55)',
              zIndex: 1,
              opacity: vals.val.interpolate((x: number) => `${x}`),
            }}
          >
            <LoadSpinner />
          </animated.div>
          )) }
        </Transition>

      </div>
    )
  }
}
