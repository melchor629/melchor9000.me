/* eslint-disable react/jsx-props-no-spreading */
import {
  animated,
  useSpring,
  useTransition,
  Transition,
} from '@react-spring/web'
import clsx from 'clsx'
import { DateTime } from 'luxon'
import * as firestore from 'firebase/firestore'
import * as storage from 'firebase/storage'
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm, useWatch, Control } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import speakingurl from 'speakingurl'
import app from '../../../lib/firebase'
import * as toast from '../../../lib/toast'
import getFirebaseFunctionUrl from '../../../lib/firebase-function'
import type { PostEditorDispatchToProps, PostEditorStateToProps } from '../../../containers/admin/posts/editor'
import LoadSpinner from '../../load-spinner'
import { Post } from '../../../redux/posts/state'
import { AdminInput } from '../admin-input'
import { validateUrlByFetching } from '../../../lib/validators'
import { ID } from '../../../redux/database/state'
import { getAssetUrl } from '../../../lib/url'

const LittleSpinner = (props: React.HTMLProps<HTMLDivElement> & { ref?: undefined }) => {
  const [spring] = useSpring({
    config: { duration: 1000, easing: (t) => t },
    from: { r: 0 },
    to: { r: 2 * Math.PI },
    loop: () => true,
  }, [])
  return (
    <animated.div
      style={{
        transform: spring.r.to((x) => `rotateZ(${x}rad)`),
        display: 'inline-block',
        position: 'absolute',
        top: 5,
        right: 10,
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <i className="fas fa-spinner" />
    </animated.div>
  )
}

LittleSpinner.defaultProps = { ref: undefined }

interface PostPreviewProps {
  darkMode: boolean
  contentRendered: string
  control: Control
  previewToggle: (e: React.MouseEvent<HTMLButtonElement>) => void
  show: boolean
}

const PostPreview = ({
  darkMode, contentRendered, control, previewToggle, show,
}: PostPreviewProps) => {
  const [title, img] = useWatch({ name: ['title', 'img'], control })
  const transitions = useTransition(show, {
    from: { transform: 'translateX(100vw)' },
    enter: { transform: 'translateX(0vw)' },
    leave: { transform: 'translateX(100vw)' },
  })

  return transitions((styles, item) => item && (
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
        backgroundColor: darkMode ? '#222' : 'white',
        zIndex: 100,
        ...styles,
      }}
    >
      <div className="text-center">
        <img src={img} className="img-fluid" alt={title} />
      </div>

      <div className="d-flex justify-content-end" style={{ position: 'sticky', top: 40 }}>
        <div className="btn btn-group">
          <button type="button" className="btn btn-outline-primary" onClick={previewToggle}>
            &times;
          </button>
        </div>
      </div>

      <h1>{title}</h1>
      <p
        className="lead"
        dangerouslySetInnerHTML={{ __html: contentRendered || '<p />' }}
      />
    </animated.div>
  ))
}

const PreviewUrl = ({ control }: { control: Control }) => {
  const [publishDateString, slang] = useWatch({ name: ['publishDate', 'url'], control })
  const publishDate = DateTime.fromISO(publishDateString).toUTC()
  const url = publishDate.isValid && slang
    ? getAssetUrl(`/posts/${publishDate.toFormat('yyyy/MM/dd')}/${slang}`)
    : ''

  if (!url) {
    return null
  }

  return (
    <div className="mx-2 mt-1">
      <code>{url}</code>
    </div>
  )
}

const render = (content: string, format: 'html' | 'md') => (
  fetch(getFirebaseFunctionUrl('posts', '/render'), {
    method: 'POST',
    body: JSON.stringify({ content, format }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((res) => res.renderedHtml)
)

type PostEditorProps = PostEditorStateToProps & PostEditorDispatchToProps

const showError = (message: string, error: any) => {
  toast.error(
    <div>
      { message }
      <br />
      <span className="text-muted">{ error.toString() }</span>
    </div>,
  )
}

const PostEditor = ({
  clearError,
  darkMode,
  errorSaving,
  update,
  save,
  saving: saving2,
}: PostEditorProps) => {
  const firstRenderRef = useRef(false)
  const [saving, setSaving] = useState(false)
  const [original, setOriginal] = useState<Post | null>(null)
  const [contentRendered, setContentRendered] = useState('')
  const [preview, setPreview] = useState(false)
  const [loadingContent, setLoadingContent] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  const {
    register, control, handleSubmit, setValue, watch, formState: { errors, isValid },
  } = useForm({ reValidateMode: 'onBlur', mode: 'onBlur' })

  useEffect(() => {
    if (params.id) {
      setSaving(true)
      const db = firestore.getFirestore(app)
      const col = firestore.collection(db, 'posts')
      const document = firestore.doc(col, params.id)
      firestore.getDoc(document)
        .then((obj) => {
          const post = obj.data()
          if (!post) {
            navigate('..')
            toast.error(`El post con ID ${params.id} no existe`)
            return
          }

          setValue('title', post.title)
          setValue('img', post.img)
          setValue('url', post.url)
          setValue(
            'publishedDate',
            DateTime.fromJSDate(post.date.toDate()).toISO({ includeOffset: false }),
          )
          setValue('content', '')
          setOriginal({ ...post, [ID]: params.id } as Post)
          setSaving(false)

          setLoadingContent(true)
          const fileRef = storage.ref(storage.getStorage(app), post.file)
          storage.getDownloadURL(fileRef)
            .then((url) => fetch(url))
            .then((res) => res.text())
            .then((content) => {
              setValue('content', content)
              setLoadingContent(false)
            })
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  useEffect(() => {
    if (!firstRenderRef.current) {
      firstRenderRef.current = true
      return
    }

    if (!saving2) {
      if (!errorSaving) {
        navigate('..')
      } else {
        showError('No se pudo subir los metadatos del post...', errorSaving)
        clearError()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving2])

  const titleWatch = watch('title', '')
  useEffect(() => {
    setValue('url', speakingurl(titleWatch, { lang: 'es' }))
  }, [titleWatch, setValue])

  const contentWatch = watch('content', '')
  useEffect(() => {
    const renderTimer = setTimeout(() => {
      if (!contentWatch) {
        return
      }

      setLoadingContent(true)
      render(contentWatch, 'md')
        .then((renderedContent) => {
          setContentRendered(renderedContent)
        })
        .catch((error) => {
          setContentRendered('')
          showError('No se pudo renderizar el contenido', error)
        })
        .finally(() => {
          setLoadingContent(false)
        })
    }, 750)

    return () => clearTimeout(renderTimer)
  }, [contentWatch])

  const previewToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setPreview((p) => !p)
  }, [])

  const effectivelySave = (data: any) => {
    setSaving(true)
    const publishDate = DateTime.fromISO(data.publishDate).toUTC()
    if (original) {
      const fileRef = storage.ref(storage.getStorage(app), original.file)
      storage.uploadString(
        fileRef,
        data.content,
        storage.StringFormat.RAW,
        { contentType: 'text/x-markdown' },
      )
        .then(() => {
          update({
            date: firestore.Timestamp.fromDate(publishDate.toJSDate()),
            file: original!.file,
            img: data.img,
            title: data.title,
            url: data.url,
            modifiedDate: firestore.Timestamp.fromDate(DateTime.utc().toJSDate()),
            hide: false,
            [ID]: original![ID],
          })
        })
        .catch((error) => {
          showError('No se pudo subir el contenido del post...', error)
          setSaving(false)
        })
    } else {
      const {
        url, img, title, content,
      } = data
      const file = `/posts/${publishDate.toFormat('yyyy-MM-dd')}-${url}.md`
      const fileRef = storage.ref(storage.getStorage(app), file)
      storage.uploadString(fileRef, content, storage.StringFormat.RAW)
        .then(() => {
          save({
            date: firestore.Timestamp.fromDate(publishDate.toJSDate()),
            file,
            img,
            title,
            url,
            [ID]: '--empty--',
          })
        })
        .catch((error) => {
          showError('No se pudo subir el contenido del post...', error)
          setSaving(false)
        })
    }
  }

  return (
    <div>

      <Helmet>
        <title>{original !== null ? `Editing: ${titleWatch}` : `Creating new post: ${titleWatch}`}</title>
      </Helmet>

      {original !== null ? <h1>Editando entrada</h1> : <h1>Crear nueva entrada</h1>}

      <form onSubmit={handleSubmit(effectivelySave)}>
        <AdminInput
          type="text"
          id="title"
          placeholder="Título"
          required
          error={errors.title}
          {...register('title', { required: true })}
        />
        <AdminInput
          type="datetime-local"
          id="publishDate"
          placeholder="Fecha de publicación"
          min={useMemo(() => (
            DateTime
              .local()
              .plus({ hour: 1 })
              .set({ minute: 0, second: 0, millisecond: 0 })
              .toISO({ includeOffset: false, suppressMilliseconds: true, suppressSeconds: true })
          ), [])}
          defaultValue={useMemo(() => (
            DateTime
              .local()
              .plus({ day: 1 })
              .set({ minute: 0, second: 0, millisecond: 0 })
              .toISO({ includeOffset: false, suppressMilliseconds: true, suppressSeconds: true })
          ), [])}
          required
          error={errors.publishDate}
          {...register('publishDate', { required: true })}
        />
        <AdminInput
          type="text"
          id="url"
          placeholder="URL"
          disabled
          required
          error={errors.url}
          {...register('url', { required: true })}
        >
          <PreviewUrl control={control} />
        </AdminInput>
        <AdminInput
          type="text"
          style={{ position: 'relative' }}
          id="img"
          placeholder="Imagen"
          required
          error={errors.img}
          {...register('img', {
            required: true,
            validate: {
              url: validateUrlByFetching('image/'),
            },
          })}
        />
        <div className="form-group material mb-3" style={{ position: 'relative' }}>
          <textarea
            className={clsx('form-control', errors.content && 'is-invalid')}
            style={{ height: 'calc(100vh - 466px)' }}
            {...register('content', { required: true })}
          />
          { loadingContent && <LittleSpinner /> }
        </div>

        <div className="d-flex justify-content-between mb-4">
          <div className="btn btn-group">
            <Link to=".." className="btn btn-outline-secondary">Atrás</Link>
          </div>
          <div className="btn btn-group">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={previewToggle}
              disabled={!isValid}
            >
              Vista previa
            </button>
            <button
              type="submit"
              className="btn btn-outline-success"
              disabled={!isValid}
            >
              Guardar
            </button>
          </div>
        </div>
      </form>

      <PostPreview
        contentRendered={contentRendered}
        control={control}
        darkMode={darkMode}
        previewToggle={previewToggle}
        show={preview}
      />

      <Transition
        native
        from={{ val: 0 }}
        enter={{ val: 1 }}
        leave={{ val: 0 }}
        items={saving2 || saving}
      >
        {/* eslint-disable-next-line react/no-unstable-nested-components */}
        { ({ val }, toggle) => (
          !toggle
            ? null
            : (
              <animated.div
                role="main"
                className="ml-sm-auto px-4"
                style={{
                  position: 'fixed',
                  overflowY: 'scroll',
                  top: 30,
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
            )
        ) }
      </Transition>
    </div>
  )
}

export default PostEditor
