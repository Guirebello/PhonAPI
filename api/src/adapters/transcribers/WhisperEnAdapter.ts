import { phonemize } from 'phonemizer'
import { z } from 'zod'
import type {
  TranscriptionInput,
  TranscriptionResult,
} from '../../modules/transcription/transcription.types'
import { postAudio } from './httpWorkerClient'
import type { TranscriberAdapter } from './TranscriberAdapter'

/** espeak-ng voice used for grapheme→phoneme. The bundled WASM ships English
 *  voice data only, so this Adapter is English-specific. */
const ESPEAK_VOICE = 'en-us'

/**
 * The Whisper worker is a bare ASR model: it emits orthographic text plus
 * timestamps, NOT IPA, and so does not speak our domain contract. This native
 * shape is untrusted input crossing a process boundary — validate it.
 */
const workerResponseSchema = z.object({
  text: z.string(),
  language: z.string(),
  durationMs: z.number(),
  segments: z.array(
    z.object({
      start: z.number(),
      end: z.number(),
      text: z.string(),
    })
  ),
})

export class WhisperEnAdapter implements TranscriberAdapter {
  readonly id = 'whisper-en' as const

  constructor(private readonly baseUrl: string) {}

  async transcribe(input: TranscriptionInput): Promise<TranscriptionResult> {
    const res = await postAudio(this.baseUrl, input)
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`worker ${this.id} failed: ${res.status} ${detail}`)
    }

    const body: unknown = await res.json()
    const parsed = workerResponseSchema.parse(body)
    const ipa = await this.graphemeToIpa(parsed.text)

    return {
      modelId: this.id,
      ipa,
      durationMs: parsed.durationMs,
      segments: [],
    }
  }

  /**
   * Whisper outputs orthographic text; PhonAPI's contract is IPA. The G2P step
   * that bridges them is what makes this Adapter genuinely heterogeneous from
   * the XLSR one, and it lives in the Adapter — not the worker.
   * `phonemize` returns one string per input line; join into a single IPA value.
   */
  private async graphemeToIpa(text: string): Promise<string> {
    const lines = await phonemize(text, ESPEAK_VOICE)
    return lines.join(' ').trim()
  }
}
