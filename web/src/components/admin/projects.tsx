import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import type { ProjectsDispatchToProps, ProjectsStateToProps } from '../../containers/admin/projects'
import { ProjectsHome } from '../../containers/admin/projects/home'
import { ProjectEditor } from '../../containers/admin/projects/editor'

type ProjectsPageProps = ProjectsStateToProps & ProjectsDispatchToProps

const Posts = ({ subscribe, unsubscribe }: ProjectsPageProps) => {
  useEffect(() => {
    subscribe()

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Routes>
      <Route index element={<ProjectsHome />} />
      <Route path="create" element={<ProjectEditor />} />
      <Route path="edit/:id" element={<ProjectEditor />} />
    </Routes>
  )
}

export default Posts
