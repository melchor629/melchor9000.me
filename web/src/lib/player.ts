import { getAssetUrl } from './url'

// @ts-ignore
window.AudioContext = (window.AudioContext || window.mozAudioContext || window.webkitAudioContext)

class Player {
  private readonly soundBuffers

  // eslint-disable-next-line react/static-property-placement
  private readonly context: AudioContext = new AudioContext()

  private readonly canPlay: { m4a: boolean, mp3: boolean, ogg: boolean, wav: boolean }

  constructor() {
    const a = new Audio()
    this.canPlay = {
      m4a: !!a.canPlayType('audio/m4a') || !!a.canPlayType('audio/x-m4a') || !!a.canPlayType('audio/aac'),
      mp3: !!a.canPlayType('audio/mp3') || !!a.canPlayType('audio/mpeg'),
      ogg: !!a.canPlayType('audio/ogg; codecs="vorbis"'),
      wav: !!a.canPlayType('audio/wav; codecs="1"'),
    }

    this.soundBuffers = new Map<String, { url: string, buffer: AudioBuffer | null }>()
  }

  get audioContext() {
    return this.context
  }

  loadSound(name: string, format1: string, format2: string) {
    let file
    if (this.canPlay[format1]) {
      file = `snd/${name}.${format1}`
    } else if (this.canPlay[format2]) {
      file = `snd/${name}.${format2}`
    } else {
      throw new Error(`Cannot play song in either ${format1} nor ${format2}`)
    }

    this.soundBuffers.set(name, { url: getAssetUrl(file), buffer: null })
  }

  loadFile(name: string, file: File): Promise<void> {
    return new Promise<void>((accept, reject) => {
      if (!file.type.includes('audio/')) {
        reject(new Error(`El archivo que has subido no es música (${file.type})`))
      }

      if (!document.createElement('audio').canPlayType(file.type)) {
        reject(new Error(`Tu navegador no soporta este tipo de archivos (${file.type})`))
      }

      const fr = new FileReader()
      fr.onload = () => {
        const filebuffer = fr.result
        this.audioContext.decodeAudioData(filebuffer as ArrayBuffer, (buffer) => {
          this.soundBuffers.set(name, { url: 'bl0b', buffer })
          accept()
        }, (error) => reject(new Error(`${'No se pudo '
                    + 'decodificar el archivo: '}${error.code}`)))
      }
      fr.onerror = () => reject(new Error(`No se pudo leer el archivo: ${fr.error!.code}`))
      fr.readAsArrayBuffer(file)
    })
  }

  async playSound(name: string, start?: number): Promise<AudioBufferSourceNode> {
    if (this.soundBuffers.has(name)) {
      if (this.soundBuffers.get(name)!.buffer === null) {
        await this.asyncLoad(name)
      }

      await this.context.resume()
    } else {
      throw new Error('No existe sonido')
    }

    let buffer = this.soundBuffers.get(name)!.buffer!

    if (start) {
      const s = Math.round(start * buffer.sampleRate)
      const l = Math.round((buffer.duration - start) * buffer.sampleRate)
      const newBuffer = this.context.createBuffer(
        buffer.numberOfChannels,
        l,
        buffer.sampleRate,
      )

      for (let i = 0; i < buffer.numberOfChannels; i += 1) {
        const fullSamples = buffer!.getChannelData(i)
        const samples = fullSamples.slice(s, s + l)
        newBuffer.copyToChannel(samples, i)
      }

      buffer = newBuffer
    }

    const source = this.context.createBufferSource()
    source.buffer = buffer
    source.addEventListener('end', () => {
      this.context.suspend().catch()
    })

    return source
  }

  unloadSong(name: string) {
    if (this.soundBuffers.has(name)) {
      this.soundBuffers.delete(name)
    }
  }

  destroy() {
    if (this.context.state !== 'closed') {
      this.context.close().catch()
    }
  }

  private async asyncLoad(name: string) {
    const response = await fetch(this.soundBuffers.get(name)!.url)
    const buffer = await response.arrayBuffer()
    const buffer2 = await new Promise<AudioBuffer>((accept, reject) => {
      this.context.decodeAudioData(buffer, accept, reject)
    })
    this.soundBuffers.set(name, { ...this.soundBuffers.get(name)!, buffer: buffer2 })
    return buffer
  }
}

export default Player
