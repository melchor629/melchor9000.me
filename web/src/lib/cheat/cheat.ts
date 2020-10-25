import Sequence from './sequence'

export default class Cheat {
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

    const matchingSeqs = this.seqs.filter((seq) => seq.startsWith(this.keysPressed))

    if (matchingSeqs.length > 0 && this.onnext) {
      this.onnext(key, matchingSeqs[0].seq[this.keysPressed.length - 1])
    }

    if (matchingSeqs.length === 0) {
      this.reset()
    } else if (matchingSeqs.length === 1) {
      if (matchingSeqs[0].match(this.keysPressed)) {
        this.done(matchingSeqs[0])
      }
    }
  }

  done(seq: Sequence) {
    this.keysPressed = []
    if (this.ondone) {
      this.ondone(seq)
    }
    if (seq.doneCbk) {
      seq.doneCbk()
    }
  }

  reset() {
    this.keysPressed = []
    if (this.onfail) {
      this.onfail()
    }
  }
}
