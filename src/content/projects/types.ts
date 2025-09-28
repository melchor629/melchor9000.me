import type { StaticImport } from 'next/dist/shared/lib/get-img-props'

export interface ProjectEntryLinks {
  readonly repo?: string
  readonly demo?: string
  readonly web?: string
}

interface ProjectEntryActiveStatus {
  readonly started: ProjectDate
  readonly status: 'active'
}

interface ProjectEntryFinishedStatus {
  readonly started: ProjectDate
  readonly finished: ProjectDate
  readonly status: 'archived' | 'discontinued'
}

type ProjectMonthDate = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'
type ProjectDayDate = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31'
type ProjectDate = `20${number}-${ProjectMonthDate}-${ProjectDayDate}`
type ProjectTechnology =
  | 'angular.js'
  | 'C++'
  | 'Electron'
  | 'GLSL'
  | 'JavaScript'
  | 'OpenGL'
  | 'Objective-C'
  | 'TypeScript'
  | 'three.js'
  | 'React'
  | 'jQuery'
  | 'Swift'
  | 'Java'
  | 'Android'
  | 'FLTK'
  | 'node.js'
  | 'SDL2'
  | 'golang'
  | 'Docker'
  | 'GTK+ 3'
  | 'Python'
  | 'Flask'
  | 'rust'
  | 'ffmpeg'

export interface ProjectEntry {
  readonly title: string
  readonly image?: StaticImport
  readonly imageFit?: 'cover' | 'contain'
  readonly technologies: ProjectTechnology[]
  readonly description: React.ReactNode
  readonly status: ProjectEntryActiveStatus | ProjectEntryFinishedStatus
  readonly links: ProjectEntryLinks
}

export type Projects = Readonly<Record<string, ProjectEntry>>
