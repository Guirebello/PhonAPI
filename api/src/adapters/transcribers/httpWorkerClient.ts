import { openAsBlob } from 'node:fs'
import type { TranscriptionInput } from '../../modules/transcription/transcription.types'

export interface PostAudioOptions {
  /** Worker route to POST to. Defaults to `/transcribe`. */
  path?: string
  /** Multipart field name carrying the audio. Defaults to `audio`. */
  fieldName?: string
  /** Abort if no response headers arrive within this window. Defaults to 120s. */
  timeoutMs?: number
}

/**
 * Shared HTTP transport for per-Model Adapters: builds the multipart upload and
 * POSTs the audio to a worker. It deliberately returns the raw `Response` and
 * does not decode the body — each Adapter owns its Model's response shape,
 * parsing, and post-processing. The timeout guards request dispatch
 * and response headers; streaming the body afterwards is the caller's concern.
 */
export async function postAudio(
  baseUrl: string,
  input: TranscriptionInput,
  options: PostAudioOptions = {}
): Promise<Response> {
  const { path = '/transcribe', fieldName = 'audio', timeoutMs = 120_000 } = options
  const url = `${baseUrl.replace(/\/$/, '')}${path}`

  const blob = await openAsBlob(input.audioPath, { type: input.mimeType })
  const form = new FormData()
  form.append(fieldName, blob, input.originalFilename)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { method: 'POST', body: form, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}
