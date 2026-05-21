import type { TranscriptionInput, TranscriptionResult } from '../../modules/transcription/transcription.types'
import type { TranscriberAdapter } from './TranscriberAdapter'

export class MockTranscriberAdapter implements TranscriberAdapter {
  readonly id = 'mock-pt-br'

  async transcribe(_input: TranscriptionInput): Promise<TranscriptionResult> {
    return {
      modelId: this.id,
      ipa: 'ka.za',
      durationMs: 1200,
      segments: [],
    }
  }
}
