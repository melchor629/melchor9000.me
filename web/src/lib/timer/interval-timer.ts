import Timer from './timer'

export default class IntervalTimer extends Timer {
  start() {
    if (this.handle) {
      clearInterval(this.handle)
    }

    this.handle = setInterval(this.cbk, this.time)
  }

  cancel() {
    if (this.handle) {
      clearInterval(this.handle)
      this.handle = null
    }
  }
}
