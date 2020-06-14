const keys = {
    backspace: 'Backspace',
    tab: 'Tab',
    enter: 'Enter',
    'return': 'Enter',
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
    '0': 'Digit0',
    '1': 'Digit1',
    '2': 'Digit2',
    '3': 'Digit3',
    '4': 'Digit4',
    '5': 'Digit5',
    '6': 'Digit6',
    '7': 'Digit7',
    '8': 'Digit8',
    '9': 'Digit9',
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

export class Sequence {
    readonly seq: string[]
    readonly keys: string[]
    doneCbk?: () => void
    private readonly str: string

    constructor(str: string) {
        this.str = str
        this.seq = this.str.split(' ')
        this.keys = []
        for(const i of this.seq) {
            this.keys.push(keys[i])
        }
    }

    then(doneCbk: () => void) {
        this.doneCbk = doneCbk
    }

    match(otherKeys: string[]) {
        for(let i = 0; i < this.keys.length; i++) {
            if(otherKeys[i] !== this.keys[i]) {
                return false
            }
        }
        return true
    }

    startsWith(otherKeys: string[]) {
        for(let i = 0; i < otherKeys.length; i++) {
            if(otherKeys[i] !== this.keys[i]) {
                return false
            }
        }
        return true
    }
}

export class Cheat {
    public onnext?: (key: string, sequence: string) => void
    public ondone?: (sequence: Sequence) => void
    public onfail?: () => void
    private readonly seqs: Sequence[]
    private keysPressed: string[]

    constructor() {
        this.seqs = []
        this.keysPressed = []
    }

    add(seqStr: string) {
        const s = new Sequence(seqStr)
        this.seqs.push(s)
        return s
    }

    keydown(key: string) {
        this.keysPressed.push(key)

        const matchingSeqs = this.seqs.filter(seq => seq.startsWith(this.keysPressed))

        if(matchingSeqs.length > 0 && this.onnext) {
            this.onnext(key, matchingSeqs[0].seq[this.keysPressed.length - 1])
        }

        if(matchingSeqs.length === 0) {
            this.reset()
        } else if(matchingSeqs.length === 1) {
            if(matchingSeqs[0].match(this.keysPressed)) {
                this.done(matchingSeqs[0])
            }
        }
    }

    done(seq: Sequence) {
        this.keysPressed = []
        if(this.ondone) {
            this.ondone(seq)
        }
        if(seq.doneCbk) {
            seq.doneCbk()
        }
    }

    reset() {
        this.keysPressed = []
        if(this.onfail) {
            this.onfail()
        }
    }
}
