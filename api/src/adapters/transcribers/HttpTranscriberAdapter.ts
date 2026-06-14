import { openAsBlob } from 'node:fs'
import type { ModelId } from '../../modules/models/model.types'
import type { TranscriptionInput, TranscriptionResult } from '../../modules/transcription/transcription.types'
import type { TranscriberAdapter } from './TranscriberAdapter'

export interface HttpTranscriberOptions {
  baseUrl: string
  timeoutMs?: number
}

export class HttpTranscriberAdapter implements TranscriberAdapter {
  private readonly baseUrl: string
  private readonly timeoutMs: number

  constructor(
    readonly id: ModelId,
    options: HttpTranscriberOptions
  ) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '')
    this.timeoutMs = options.timeoutMs ?? 120_000
  }

  async transcribe(input: TranscriptionInput): Promise<TranscriptionResult> {
    const blob = await openAsBlob(input.audioPath, { type: input.mimeType })
    const form = new FormData()
    form.append('audio', blob, input.originalFilename)

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), this.timeoutMs)
    try {
      const res = await fetch(`${this.baseUrl}/transcribe`, {
        method: 'POST',
        body: form,
        signal: controller.signal,
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`worker ${this.id} failed: ${res.status} ${text}`)
      }
      return (await res.json()) as TranscriptionResult
    } finally {
      clearTimeout(timer)
    }
  }
}
