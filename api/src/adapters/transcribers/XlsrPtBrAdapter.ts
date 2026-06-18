import { z } from 'zod'
import type {
  TranscriptionInput,
  TranscriptionResult,
} from '../../modules/transcription/transcription.types'
import { postAudio } from './httpWorkerClient'
import type { TranscriberAdapter } from './TranscriberAdapter'

/**
 * Adapter for the self-hosted wav2vec XLSR pt-BR worker. This worker is one we
 * control, so we made it speak our domain contract directly: it emits IPA and
 * the response is a near-identity map to TranscriptionResult. The worker output
 * is still untrusted input crossing a process boundary, so we validate it.
 */
const workerResponseSchema = z.object({
  modelId: z.string(),
  ipa: z.string(),
  durationMs: z.number(),
  segments: z.array(
    z.object({
      startMs: z.number(),
      endMs: z.number(),
      ipa: z.string(),
    })
  ),
})

export class XlsrPtBrAdapter implements TranscriberAdapter {
  readonly id = 'xlsr-pt-br' as const

  constructor(private readonly baseUrl: string) {}

  async transcribe(input: TranscriptionInput): Promise<TranscriptionResult> {
    const res = await postAudio(this.baseUrl, input)
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`worker ${this.id} failed: ${res.status} ${detail}`)
    }

    const body: unknown = await res.json()
    const parsed = workerResponseSchema.parse(body)

    return {
      modelId: this.id,
      ipa: parsed.ipa,
      durationMs: parsed.durationMs,
      segments: parsed.segments,
    }
  }
}
