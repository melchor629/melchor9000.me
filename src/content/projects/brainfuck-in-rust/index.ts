import type { ProjectEntry } from '../types'

const brainfuckInRust = Object.freeze({
  title: 'brainfuck-in-rust',
  technologies: ['rust'],
  description:
    'Brainfuck esoteric language implemented in Rust. Has an interpreter and a small transpiler to C.',
  links: {
    repo: 'https://github.com/melchor629/brainfuck-in-rust',
  },
  status: {
    started: '2023-07-31',
    status: 'active',
  },
} satisfies ProjectEntry)

export default brainfuckInRust
