/* eslint-disable no-underscore-dangle,react/jsx-props-no-spreading */
import { animated, Transition } from '@react-spring/web'
import {
  useCallback, useEffect, useRef, useState,
} from 'react'
import {
  useForm, useFieldArray, useWatch, Control,
} from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import {
  getFirestore, collection, doc, getDoc,
} from 'firebase/firestore'
import app from '../../../lib/firebase'
import * as toast from '../../../lib/toast'
import LoadSpinner from '../../load-spinner'
import Project from '../../projects/project'
import type { ProjectEditorDispatchToProps, ProjectEditorStateToProps } from '../../../containers/admin/projects/editor'
import type { ProjectInfo } from '../../../containers/admin/projects'
import {
  urlRegex,
  urlOrLocalRegex,
  validateUrlByFetching,
} from '../../../lib/validators'
import { AdminBigInput, AdminInput } from '../admin-input'

interface ProjectPreviewProps {
  control: Control
  darkMode: boolean
}

const ProjectPreview = ({ control, darkMode }: ProjectPreviewProps) => {
  const {
    description, title, demo, image, web, repository: repo, technologies, intlDescriptions,
  } = useWatch({ control })
  const project: ProjectInfo = {
    _id: '--preview--',
    description,
    repo,
    technologies: technologies.map(({ value }: any) => value),
    title,
    demo,
    image,
    intlDescription: Object.fromEntries(
      intlDescriptions.map(({ lang, description: d }: any) => [lang, d]),
    ),
    web,
  }

  return <Project project={project} darkMode={darkMode} fullWidth />
}

type ProjectEditorProps = ProjectEditorStateToProps & ProjectEditorDispatchToProps

const ProjectEditor = ({
  clearError,
  darkMode,
  errorSaving,
  saving,
  save,
  update,
}: ProjectEditorProps) => {
  const firstRenderRef = useRef(false)
  const [preview, setPreview] = useState(false)
  const [original, setOriginal] = useState<ProjectInfo | null>(null)
  const params = useParams()
  const navigate = useNavigate()
  const {
    register, control, handleSubmit, setValue, formState: { errors },
  } = useForm({ reValidateMode: 'onBlur' })
  const technologies = useFieldArray({ control, name: 'technologies' })
  const intlDescriptions = useFieldArray({ control, name: 'intlDescriptions' })

  useEffect(() => {
    if (params.id) {
      getDoc(doc(collection(getFirestore(app), 'projects'), params.id))
        .then((obj) => {
          const project = obj.data() as ProjectInfo
          if (!project) {
            navigate('..')
            toast.error(`El projecto con ID ${params.id} no existe`)
            return
          }

          setOriginal({ ...project, _id: obj.id })
          setValue('title', project.title)
          setValue('description', project.description)
          setValue('repository', project.repo || '')
          setValue('demo', project.demo || '')
          setValue('web', project.web || '')
          setValue('image', project.image || '')
          technologies.replace((project.technologies || []).map((value) => ({ value })))
          intlDescriptions.replace(
            Object.entries(project.intlDescription || {})
              .map(([lang, description]) => ({ lang, description })),
          )
        })
        .catch((error) => {
          toast.error(`No se pudo cargar el projecto: ${error.message}`)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  useEffect(() => {
    if (!firstRenderRef.current) {
      firstRenderRef.current = true
      return
    }

    if (!saving) {
      if (!errorSaving) {
        navigate('..')
      } else {
        toast.error(`No se pudo añadir el nuevo proyecto... ${errorSaving.message}`)
        clearError()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving])

  const addTechnology = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    technologies.append({ value: '' })
  }, [technologies])

  const removeTechnology = useCallback((e: React.MouseEvent<HTMLButtonElement>, i: number) => {
    e.preventDefault()
    technologies.remove(i)
  }, [technologies])

  const previewToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setPreview((p) => !p)
  }, [])

  const addDescription = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    intlDescriptions.append({ lang: '', description: '' })
  }, [intlDescriptions])

  const removeDescription = useCallback((e: React.MouseEvent<HTMLButtonElement>, i: number) => {
    e.preventDefault()
    intlDescriptions.remove(i)
  }, [intlDescriptions])

  const effectivelySave = useCallback((data: any) => {
    const project = {
      description: data.description,
      repo: data.repository || null,
      technologies: data.technologies.length
        ? data.technologies.map(({ value }: any) => value)
        : null,
      title: data.title,
      demo: data.demo || null,
      image: data.image || null,
      intlDescription: Object.fromEntries(
        data.intlDescriptions.map(({ lang, description: d }: any) => [lang, d]),
      ),
      web: data.web || null,
    }
    if (original) {
      update({ ...project, _id: original._id })
    } else {
      save(project)
    }
  }, [update, save, original])

  return (
    <div>
      <h1>Añadir un nuevo proyecto</h1>

      <form onSubmit={handleSubmit(effectivelySave)}>
        <AdminInput
          type="text"
          id="title"
          placeholder="Nombre"
          required
          error={errors.title}
          {...register('title', { required: true })}
        />
        <AdminBigInput
          type="text"
          id="description"
          placeholder="Descripción"
          required
          error={errors.description}
          {...register('description', { required: true })}
        />
        <AdminInput
          type="url"
          id="repo"
          placeholder="Repositorio"
          error={errors.repository}
          {...register('repository', {
            pattern: urlRegex,
            validate: {
              url: validateUrlByFetching(),
            },
          })}
        />
        <AdminInput
          type="url"
          id="demo"
          placeholder="Web de demostración"
          error={errors.demo}
          {...register('demo', {
            pattern: urlRegex,
            validate: {
              url: validateUrlByFetching(),
            },
          })}
        />
        <AdminInput
          type="url"
          id="web"
          placeholder="Web"
          error={errors.web}
          {...register('web', {
            pattern: urlRegex,
            validate: {
              url: validateUrlByFetching(),
            },
          })}
        />
        <AdminInput
          type="text"
          id="image"
          placeholder="Imagen"
          error={errors.image}
          {...register('image', {
            pattern: urlOrLocalRegex,
            validate: {
              url: validateUrlByFetching('image/'),
            },
          })}
        />
        <div className="row align-items-end mb-4">
          <div className="col-auto">Traducciones</div>
          <div className="col" />
          <div className="col-auto">
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addDescription}>
              +
            </button>
          </div>
        </div>
        {intlDescriptions.fields.map((item, i) => (
          <div className="row" key={item.id}>
            <div className="col-1">
              <AdminInput
                type="text"
                id={`lang-${item.id}`}
                placeholder="Lang"
                required
                error={errors[`intlDescriptions.${i}.lang`]}
                {...register(`intlDescriptions.${i}.lang`, { required: true })}
              />
            </div>
            <div className="col">
              <AdminBigInput
                type="text"
                id={`description-${item.id}`}
                required
                error={errors[`intlDescriptions.${i}.description`]}
                {...register(`intlDescriptions.${i}.description`, { required: true })}
              />
            </div>
            <div className="col-auto d-flex align-items-center pl-0">
              <button
                type="button"
                className="btn btn-sm btn-outline-warning"
                onClick={(e) => removeDescription(e, i)}
              >
                -
              </button>
            </div>
          </div>
        ))}
        <div className="row align-items-end mb-3">
          <div className="col-auto">Tecnologías</div>
          <div className="col" />
          <div className="col-auto">
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addTechnology}>+</button>
          </div>
        </div>
        {technologies.fields.map((item, i) => (
          <div className="row" key={item.id}>
            <div className="col">
              <AdminInput
                type="text"
                id={`technology-${item.id}`}
                placeholder={`Tecnología ${i}`}
                required
                error={errors[`technologies.${i}.value`]}
                {...register(`technologies.${i}.value`, { required: true })}
              />
            </div>
            {i > 0 && (
              <div
                className="col-auto d-flex align-items-center pl-0"
                style={{ paddingBottom: '1em' }}
              >
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning"
                  onClick={(e) => removeTechnology(e, i)}
                >
                  -
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="d-flex justify-content-between mb-4">
          <div className="btn btn-group">
            <Link to=".." className="btn btn-outline-secondary">Atrás</Link>
          </div>
          <div className="btn btn-group">
            <button type="button" className="btn btn-outline-primary" onClick={previewToggle}>
              Vista previa
            </button>
            <button
              type="submit"
              className="btn btn-outline-success"
            >
              Guardar
            </button>
          </div>
        </div>
      </form>

      <Transition native from={{ val: 0 }} enter={{ val: 1 }} leave={{ val: 0 }} items={preview}>
        {/* eslint-disable-next-line react/no-unstable-nested-components */}
        { ({ val }, toggle) => toggle && (
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
              transform: val.to((x: number) => `translateX(${(1 - x) * 300}px)`),
            }}
          >
            <ProjectPreview control={control} darkMode={darkMode} />
          </animated.div>
        ) }
      </Transition>

      <Transition
        native
        from={{ val: 0 }}
        enter={{ val: 1 }}
        leave={{ val: 0 }}
        items={saving}
      >
        {/* eslint-disable-next-line react/no-unstable-nested-components */}
        { ({ val }, toggle) => toggle && (
          <animated.div
            role="main"
            className="ml-sm-auto px-4"
            style={{
              position: 'fixed',
              overflowY: 'scroll',
              top: 0,
              left: 0,
              width: '100%',
              height: 'calc(100vh - 30px)',
              backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.55)',
              zIndex: 1,
              opacity: val.to((x: number) => `${x}`),
            }}
          >
            <LoadSpinner />
          </animated.div>
        ) }
      </Transition>

    </div>
  )
}

export default ProjectEditor
