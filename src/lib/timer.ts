export class Timer {
    protected _hdl: any | null = null

    constructor(public time: number = 1000, protected readonly _cbk: (some?: any) => void, autostart: boolean = false) {
        this._hdl = null
        if(autostart) {
            this.start()
        }
    }

    start() {
        if(this._hdl) {
            clearTimeout(this._hdl)
        }
        this._hdl = setTimeout(this._cbk, this.time)
    }

    cancel() {
        if(this._hdl) {
            clearTimeout(this._hdl)
            this._hdl = null
        }
    }

    restart() {
        this.cancel()
        this.start()
    }
}

export class IntervalTimer extends Timer {
    start() {
        if(this._hdl) {
            clearInterval(this._hdl)
        }

        this._hdl = setInterval(this._cbk, this.time)
    }

    cancel() {
        if(this._hdl) {
            clearInterval(this._hdl)
            this._hdl = null
        }
    }
}

export class AnimationTimer extends Timer {
    private _startTime: number | null = null
    private _endCbk: (() => void) | null = null

    start() {
        this._startTime = null
        const func = (timestamp: number) => {
            if(this._startTime === null) {
                this._startTime = timestamp
            }

            if(timestamp - this._startTime <= this.time) {
                this._cbk((timestamp - this._startTime) / this.time)
                window.requestAnimationFrame(func)
            } else if(this._endCbk) {
                this._endCbk()
            }
        }
        window.requestAnimationFrame(func)
    }

    stop() {
        this._startTime = this.time + 1
    }

    onEnd(cbk: () => void | null) {
        this._endCbk = cbk
    }

    restart() {
        this.stop()
        this.start()
    }
}
