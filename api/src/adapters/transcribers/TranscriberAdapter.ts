import type { ModelId } from '../../modules/models/model.types'
import type { TranscriptionInput, TranscriptionResult } from '../../modules/transcription/transcription.types'

export interface TranscriberAdapter {
  readonly id: ModelId
  transcribe(input: TranscriptionInput): Promise<TranscriptionResult>
}
