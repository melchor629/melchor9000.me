import { Archive, Cancel } from '@mui/icons-material'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Tooltip,
} from '@mui/material'
import StyledImage from '@/components/styled-image'
import type { ProjectEntry } from '@/content/projects/types'

export default function ProjectCard({ project }: { readonly project: ProjectEntry }) {
  return (
    <Card>
      <CardHeader
        title={project.title}
        subheader={project.technologies.join(', ')}
        action={
          (project.status.status === 'archived' && (
            <Tooltip title={`Archived at ${project.status.finished}`} disableInteractive>
              <Archive color="disabled" />
            </Tooltip>
          )) ||
          (project.status.status === 'discontinued' && (
            <Tooltip title={`Discontinued at ${project.status.finished}`} disableInteractive>
              <Cancel color="disabled" />
            </Tooltip>
          ))
        }
      />
      {project.image && (
        <CardMedia component="div" sx={{ position: 'relative', pb: '50%' }}>
          <StyledImage
            src={project.image}
            alt={`Cover image for project named ${project.title}`}
            fill
            sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, (max-width: 1536px) 33vw, 25vw"
            fit={project.imageFit ?? 'contain'}
          />
        </CardMedia>
      )}
      <CardContent>{project.description}</CardContent>
      <CardActions>
        {project.links.repo && (
          <Button size="small" href={project.links.repo} target="_blank">
            Code
          </Button>
        )}
        {project.links.web && (
          <Button size="small" href={project.links.web} target="_blank">
            Web
          </Button>
        )}
        {project.links.demo && (
          <Button size="small" href={project.links.demo} target="_blank">
            Demo
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
