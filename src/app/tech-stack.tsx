import {
  SiDocker,
  SiDotnet,
  SiFastify,
  SiIcloud,
  SiKubernetes,
  SiLinux,
  SiMui,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiReactquery,
  SiReactrouter,
  SiRust,
  SiStorybook,
  SiTailwindcss,
  SiVite,
  SiVitest,
  type IconType,
} from '@icons-pack/react-simple-icons'
import { Box, Typography } from '@mui/material'
import type { PropsWithChildren } from 'react'
import Container from '@/components/container'

type TechStackItemProps = Readonly<{
  label: string
  icon: IconType
  link: string
  size?: 'small' | 'medium'
}>

const TechStackItem = ({ icon: Icon, label, link, size = 'medium' }: TechStackItemProps) => (
  <Box
    component="a"
    href={link}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: {
        xs: 1,
        sm: 1,
        md: size === 'small' ? 1 : 2,
      },
      justifyContent: 'center',
      alignItems: 'center',
      width: size === 'medium' ? '100%' : 'calc(50% - 1.5 * var(--me-spacing))',
      height: 'fit-content',
      minWidth: 0,
      minHeight: 0,
      flexGrow: 0,
      flexBasis: 'auto',
      aspectRatio: 1,
      padding: size === 'medium' ? 2 : 1.5,
      containerType: 'size',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'primary.dark',
      borderRadius: size === 'medium' ? 3 : 2,
      color: 'primary.main',
      backgroundImage:
        'radial-gradient(circle at center, rgb(from var(--me-palette-primary-dark) r g b / 20%) 0, rgb(from transparent r g b / 0%) 60%)',
      backgroundSize: '0% 0%',
      backgroundPosition: 'center 40%',
      backgroundRepeat: 'no-repeat',
      textDecoration: 'none',
      fontSize: size === 'medium' ? '1.25rem' : '1rem',
      transition: 'all 300ms ease-out',
      boxShadow:
        '0px 2px 4px -1px rgb(from var(--me-palette-primary-dark) r g b / 20%), 0px 4px 5px 0px rgb(from var(--me-palette-primary-dark) r g b / 14%), 0px 1px 10px 0px rgb(from var(--me-palette-primary-dark) r g b / 12%)',

      '&:hover': {
        backgroundSize: '100% 100%',
        borderColor: 'primary.main',
        color: 'primary.light',
        boxShadow:
          '0px 8px 10px -5px rgb(from var(--me-palette-primary-dark) r g b / 20%), 0px 16px 24px 2px rgb(from var(--me-palette-primary-main) r g b / 14%), 0px 6px 30px 5px rgb(from var(--me-palette-primary-main) r g b / 12%)',
      },
    }}
  >
    <Box
      sx={{
        lineHeight: 0,
        '> svg': {
          width: { xs: size === 'small' ? '75cqw' : '33cqw', md: '33cqw' },
          height: { xs: size === 'small' ? '75cqw' : '33cqw', md: '33cqw' },
        },
      }}
    >
      <Icon />
    </Box>
    <Box
      sx={{
        textAlign: 'center',
        fontWeight: 500,
        display: { xs: size === 'small' ? 'none' : undefined, md: 'initial' },
        color: 'text.primary',
        opacity: 0.75,
      }}
    >
      {label}
    </Box>
  </Box>
)

const TechStackSection = ({ children }: PropsWithChildren) => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 3,
    }}
  >
    {children}
  </Box>
)

export default function TechStack() {
  return (
    <Container>
      <Typography
        variant="h2"
        sx={{ textAlign: 'center', mt: 2, mb: 4 }}
      >
        Technologies
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          mb: 8,
        }}
      >
        <TechStackSection>
          <TechStackItem
            label="React"
            icon={SiReact}
            link="https://react.dev"
          />
          <TechStackItem
            label="Next.js"
            icon={SiNextdotjs}
            link="https://nextjs.org"
            size="small"
          />
          <TechStackItem
            label="React Router"
            icon={SiReactrouter}
            link="https://reactrouter.com"
            size="small"
          />
          <TechStackItem
            label="Tanstack Query"
            icon={SiReactquery}
            link="https://tanstack.com/query/latest"
            size="small"
          />
          <TechStackItem
            label="MUI"
            icon={SiMui}
            link="https://mui.com"
            size="small"
          />
          <TechStackItem
            label="Tailwind"
            icon={SiTailwindcss}
            link="https://tailwindcss.com"
            size="small"
          />
          <TechStackItem
            label="Storyboard"
            icon={SiStorybook}
            link="https://storyboard.js.org"
            size="small"
          />
        </TechStackSection>
        <TechStackSection>
          <TechStackItem
            label="Docker"
            icon={SiDocker}
            link="https://docker.com"
            size="small"
          />
          <TechStackItem
            label="AWS"
            icon={SiIcloud}
            link="https://aws.amazon.com"
            size="small"
          />
          <TechStackItem
            label="Kubernetes"
            icon={SiKubernetes}
            link="https://kubernetes.io"
          />
          <TechStackItem
            label=".NET · C#"
            icon={SiDotnet}
            link="https://dotnet.microsoft.com/en-us/"
          />
        </TechStackSection>
        <TechStackSection>
          <TechStackItem
            label="Vite"
            icon={SiVite}
            link="https://vite.dev"
            size="small"
          />
          <TechStackItem
            label="Vitest"
            icon={SiVitest}
            link="https://vitest.dev"
            size="small"
          />
          <TechStackItem
            label="psql"
            icon={SiPostgresql}
            link="https://www.postgresql.org"
            size="small"
          />
          <TechStackItem
            label="Fastify"
            icon={SiFastify}
            link="https://fastify.dev"
            size="small"
          />
          <TechStackItem
            label="node.js"
            icon={SiNodedotjs}
            link="https://nodejs.org"
          />
          <TechStackItem
            label="Rust"
            icon={SiRust}
            link="https://rust-lang.org"
            size="small"
          />
          <TechStackItem
            label="Linux"
            icon={SiLinux}
            link="https://kernel.org/"
            size="small"
          />
        </TechStackSection>
      </Box>
    </Container>
  )
}
