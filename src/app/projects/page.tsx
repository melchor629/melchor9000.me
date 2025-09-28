import Container from '@/components/container'
import PageHeader from '@/components/page-header'
import projects from '@/content/projects'
import ProjectsContent from './projects-content'

export const metadata = {
  title: 'Projects',
}

export default function Projects() {
  return (
    <Container>
      <PageHeader
        title="Projects"
        subtitle="Personal projects I made or collaborated to."
      />
      <ProjectsContent projects={Object.entries(projects)} />
    </Container>
  )
}
