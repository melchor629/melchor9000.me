export default class Timer {
  protected handle: any | null = null

  constructor(
    public time: number = 1000,
    protected readonly cbk: (some?: any) => void,
    autostart: boolean = false,
  ) {
    this.handle = null
    if (autostart) {
      this.start()
    }
  }

  start() {
    if (this.handle) {
      clearTimeout(this.handle)
    }
    this.handle = setTimeout(this.cbk, this.time)
  }

  cancel() {
    if (this.handle) {
      clearTimeout(this.handle)
      this.handle = null
    }
  }

  restart() {
    this.cancel()
    this.start()
  }
}
