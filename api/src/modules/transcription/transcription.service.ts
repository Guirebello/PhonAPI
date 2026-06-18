import { MockTranscriberAdapter } from '../../adapters/transcribers/MockTranscriberAdapter'
import type { TranscriberAdapter } from '../../adapters/transcribers/TranscriberAdapter'
import { WhisperEnAdapter } from '../../adapters/transcribers/WhisperEnAdapter'
import { XlsrPtBrAdapter } from '../../adapters/transcribers/XlsrPtBrAdapter'
import type { ModelId } from '../models/model.types'
import type { TranscriptionInput, TranscriptionResult } from './transcription.types'

const XLSR_PT_BR_URL = process.env.XLSR_PT_BR_URL ?? 'http://localhost:8000'
const WHISPER_EN_URL = process.env.WHISPER_EN_URL ?? 'http://localhost:8001'

const transcribers = new Map<ModelId, TranscriberAdapter>([
  ['mock-pt-br', new MockTranscriberAdapter()],
  ['xlsr-pt-br', new XlsrPtBrAdapter(XLSR_PT_BR_URL)],
  ['whisper-en', new WhisperEnAdapter(WHISPER_EN_URL)],
])

export function getTranscriber(modelId: ModelId): TranscriberAdapter {
  const adapter = transcribers.get(modelId)
  if (!adapter) throw new Error(`no adapter registered for modelId=${modelId}`)
  return adapter
}

export async function runTranscription(input: TranscriptionInput): Promise<TranscriptionResult> {
  return getTranscriber(input.modelId).transcribe(input)
}
