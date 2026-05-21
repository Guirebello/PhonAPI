import { MockTranscriberAdapter } from '../../adapters/transcribers/MockTranscriberAdapter'
import type { TranscriptionInput, TranscriptionResult } from './transcription.types'

const transcriber = new MockTranscriberAdapter()

export async function createMockTranscription(input: TranscriptionInput): Promise<TranscriptionResult> {
  return transcriber.transcribe(input)
}
