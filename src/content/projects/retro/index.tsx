import type { ProjectEntry } from '../types'

const retro = Object.freeze({
  description: (
    <>
      A simple retro-pixelart 2D game engine. Created for the Hacker&apos;s Week 5 workshop (
      <i>
        event organized by Consejo de Estudiantes of&nbsp;
        <abbr title="Escuela Técnica Superior de Ingeniería Informática">ETSII</abbr>
        &nbsp;of the Unversity of Málaga
      </i>
      ) at March 2018.
    </>
  ),
  technologies: ['C++', 'SDL2'],
  title: 'retro++',
  links: {
    repo: 'https://github.com/melchor629/retro',
  },
  status: {
    started: '2017-10-10',
    status: 'active',
  },
} satisfies ProjectEntry)

export default retro
