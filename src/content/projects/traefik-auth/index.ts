import type { ProjectEntry } from '../types'

const traefikAuth = Object.freeze({
  title: 'traefik-auth',
  technologies: ['rust'],
  description:
    "Service to authenticate clients using Traefik's ForwardAuth middleware. Authentication methods are Basic (mainly for APIs and apps) and OAuth2.0.",
  links: {
    repo: 'https://github.com/melchor629/traefik-auth',
  },
  status: {
    started: '2023-01-02',
    status: 'active',
  },
} satisfies ProjectEntry)

export default traefikAuth
