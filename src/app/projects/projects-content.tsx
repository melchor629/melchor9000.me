'use client'

import { Masonry } from '@mui/lab'
import { useCallback, useMemo, useState } from 'react'
import type { ProjectEntry } from '@/content/projects/types'
import ProjectCard from './project-card'
import ProjectFilters, { type ProjectFiltersProps } from './project-filters'

type Props = {
  readonly projects: [key: string, project: ProjectEntry][]
}

export default function ProjectsContent({ projects }: Props) {
  const [sortBy, setSortBy] = useState('name-asc')
  const [showDiscontinued, setShowDiscontinued] = useState(false)
  const [techs, setTechs] = useState<ProjectEntry['technologies']>([])
  const availableTechs = useMemo(() => (
    [...new Set(projects.flatMap(([, project]) => project.technologies))]
      .toSorted((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  ), [projects])
  const filteredProjects = useMemo(() => {
    let filtered = projects
    if (!showDiscontinued) {
      filtered = filtered.filter(([, p]) => p.status.status === 'active')
    }

    if (techs.length > 0) {
      filtered = filtered.filter(([, p]) => techs.every((t) => p.technologies.includes(t)))
    }

    if (sortBy === 'name-asc') {
      filtered = filtered.toSorted(
        ([, a], [, b]) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
      )
    } else if (sortBy === 'name-desc') {
      filtered = filtered.toSorted(
        ([, a], [, b]) => b.title.localeCompare(a.title, undefined, { sensitivity: 'base' }),
      )
    } else if (sortBy === 'started-asc') {
      filtered = filtered.toSorted(
        ([, a], [, b]) => +new Date(a.status.started) - +new Date(b.status.started),
      )
    } else if (sortBy === 'started-desc') {
      filtered = filtered.toSorted(
        ([, a], [, b]) => +new Date(b.status.started) - +new Date(a.status.started),
      )
    }

    return filtered
  }, [sortBy, showDiscontinued, techs, projects])

  const onFilterChange = useCallback<ProjectFiltersProps['onChange']>((name, value) => {
    if (name === 'sortBy') {
      setSortBy(value as never)
    } else if (name === 'showDiscontinued') {
      setShowDiscontinued(value as never)
    } else if (name === 'techs') {
      setTechs(value as never)
    }
  }, [])

  return (
    <>
      <ProjectFilters
        values={{ sortBy, showDiscontinued, techs }}
        onChange={onFilterChange}
        allTechs={availableTechs}
      />
      <Masonry
        columns={{ xs: 1, md: 2, lg: 3 }}
        defaultColumns={3}
        defaultHeight={550}
        spacing={2}
      >
        {filteredProjects.map(([key, project]) => (
          <ProjectCard key={key} project={project} />
        ))}
      </Masonry>
    </>
  )
}
