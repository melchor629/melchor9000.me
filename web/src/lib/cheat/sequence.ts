const keys = {
  backspace: 'Backspace',
  tab: 'Tab',
  enter: 'Enter',
  return: 'Enter',
  shift: 'ShiftLeft',
  '⇧': 'ShiftLeft',
  control: 'ControlLeft',
  ctrl: 'ControlLeft',
  '⌃': 'ControlLeft',
  alt: 'AltLeft',
  option: 'AltLeft',
  '⌥': 'AltLeft',
  capslock: 'CapsLock',
  esc: 'Escape',
  space: 'Space',
  left: 'ArrowLeft',
  '←': 'ArrowLeft',
  up: 'ArrowUp',
  '↑': 'ArrowUp',
  right: 'ArrowRight',
  '→': 'ArrowRight',
  down: 'ArrowDown',
  '↓': 'ArrowDown',
  0: 'Digit0',
  1: 'Digit1',
  2: 'Digit2',
  3: 'Digit3',
  4: 'Digit4',
  5: 'Digit5',
  6: 'Digit6',
  7: 'Digit7',
  8: 'Digit8',
  9: 'Digit9',
  a: 'KeyA',
  b: 'KeyB',
  c: 'KeyC',
  d: 'KeyD',
  e: 'KeyE',
  f: 'KeyF',
  g: 'KeyG',
  h: 'KeyH',
  i: 'KeyI',
  j: 'KeyJ',
  k: 'KeyK',
  l: 'KeyL',
  m: 'KeyM',
  n: 'KeyN',
  o: 'KeyO',
  p: 'KeyP',
  q: 'KeyQ',
  r: 'KeyR',
  s: 'KeyS',
  t: 'KeyT',
  u: 'KeyU',
  v: 'KeyV',
  w: 'KeyW',
  x: 'KeyX',
  y: 'KeyY',
  z: 'KeyZ',
  '⌘': 'MetaLeft',
  command: 'MetaLeft',
  f1: 'F1',
  f2: 'F2',
  f3: 'F3',
  f4: 'F4',
  f5: 'F5',
  f6: 'F6',
  f7: 'F7',
  f8: 'F8',
  f9: 'F9',
  f10: 'F10',
  f11: 'F11',
  f12: 'F12',
}

export default class Sequence {
  readonly seq: string[]

  readonly keys: string[]

  doneCbk?: () => void

  private readonly str: string

  constructor(str: string) {
    this.str = str
    this.seq = this.str.split(' ')
    this.keys = this.seq.map((i) => keys[i])
  }

  then(doneCbk: () => void) {
    this.doneCbk = doneCbk
  }

  match(otherKeys: string[]) {
    for (let i = 0; i < this.keys.length; i += 1) {
      if (otherKeys[i] !== this.keys[i]) {
        return false
      }
    }
    return true
  }

  startsWith(otherKeys: string[]) {
    for (let i = 0; i < otherKeys.length; i += 1) {
      if (otherKeys[i] !== this.keys[i]) {
        return false
      }
    }
    return true
  }
}
