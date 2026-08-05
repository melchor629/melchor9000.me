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

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type ProjectMonthDate = Exclude<`0${Digit}` | `1${0 | 1 | 2}`, '00'>
type ProjectDayDate = Exclude<`${0 | 1 | 2}${Digit}` | '30' | '31', '00'>
type ProjectDate = `20${Digit}${Digit}-${ProjectMonthDate}-${ProjectDayDate}`
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
