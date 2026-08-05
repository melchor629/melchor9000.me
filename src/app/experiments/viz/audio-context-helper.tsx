const audio = typeof window !== 'undefined' ? new Audio() : null!
const canPlay = (contentType: string) => audio.canPlayType(contentType)

async function fetchAudio(url: URL) {
  const response = await fetch(url, { mode: 'cors' })
  if (!response.ok) {
    throw new Error(`Cannot load resource ${url} (status ${response.status})`)
  }

  const contentType = response.headers.get('content-type') ?? 'application/octet-stream'
  if (!canPlay(contentType)) {
    throw new Error(`Resource cannot be played, type is ${contentType}`)
  }

  return response.arrayBuffer()
}

async function readAudioFile(file: File) {
  if (!canPlay(file.type)) {
    throw new Error(`File cannot be played, type is ${file.type}`)
  }

  const { promise, reject, resolve } = Promise.withResolvers<ArrayBuffer>()
  const reader = new FileReader()
  reader.addEventListener('load', () => resolve(reader.result as ArrayBuffer))
  reader.addEventListener('error', () =>
    reject(new Error(`Failed reading file: ${reader.error!.message}`, { cause: reader.error })),
  )
  reader.readAsArrayBuffer(file)
  return promise
}

function sliceAudioBuffer(context: AudioContext, buffer: AudioBuffer, start = 0, end?: number) {
  if (!start && end == null) {
    return buffer
  }

  end ??= buffer.duration
  if (end != null && end <= start) {
    throw new Error('End time must be greater than start time')
  }

  const sampleStart = Math.round(start * buffer.sampleRate)
  const sampleLength = Math.round(((end ?? buffer.duration) - start) * buffer.sampleRate)
  const newBuffer = context.createBuffer(buffer.numberOfChannels, 1, buffer.sampleRate)

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const allSamples = buffer.getChannelData(channel)
    const samples = allSamples.slice(sampleStart, sampleStart + sampleLength)
    newBuffer.copyToChannel(samples, channel)
  }

  return newBuffer
}

export default class AudioContextHelper {
  #context = new AudioContext({ latencyHint: 'playback' })
  #buffers = new Map<string, AudioBuffer>()

  get context() {
    return this.#context
  }

  async load(name: string, value: URL | File): Promise<AudioBuffer> {
    if (this.#buffers.has(name)) {
      throw new Error('Audio has already been loaded')
    }

    let buffer: ArrayBuffer
    if (value instanceof URL) {
      buffer = await fetchAudio(value)
    } else {
      buffer = await readAudioFile(value)
    }

    const audioBuffer = await this.#context.decodeAudioData(buffer)
    this.#buffers.set(name, audioBuffer)
    return audioBuffer
  }

  unload(name: string) {
    this.#buffers.delete(name)
  }

  getNode(
    name: string | AudioBuffer,
    { end, start = 0 }: { start?: number; end?: number } = {},
  ): AudioBufferSourceNode {
    let buffer =
      typeof name === 'string'
        ? (this.#buffers.get(name) ??
          ((): never => {
            throw new Error(`Audio ${name} has not been loaded`)
          })())
        : name
    buffer = sliceAudioBuffer(this.#context, buffer, start, end)
    const source = this.#context.createBufferSource()
    source.buffer = buffer
    return source
  }

  getInfo(name: string) {
    const buffer = this.#buffers.get(name)
    if (!buffer) {
      return null
    }

    return Object.assign(buffer, {
      slice: (start = 0, end?: number) => sliceAudioBuffer(this.#context, buffer, start, end),
    })
  }

  [Symbol.asyncDispose]() {
    return this.context.close()
  }
}
