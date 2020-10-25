import Timer from './timer'

export default class AnimationTimer extends Timer {
  private startTime: number | null = null

  private endCbk: (() => void) | null = null

  start() {
    this.startTime = null
    const func = (timestamp: number) => {
      if (this.startTime === null) {
        this.startTime = timestamp
      }

      if (timestamp - this.startTime <= this.time) {
        this.cbk((timestamp - this.startTime) / this.time)
        window.requestAnimationFrame(func)
      } else if (this.endCbk) {
        this.endCbk()
      }
    }
    window.requestAnimationFrame(func)
  }

  stop() {
    this.startTime = this.time + 1
  }

  onEnd(cbk: () => void | null) {
    this.endCbk = cbk
  }

  restart() {
    this.stop()
    this.start()
  }
}
