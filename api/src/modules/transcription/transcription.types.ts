import type { ModelId } from '../models/model.types'

export interface TranscriptionSegment {
  startMs: number
  endMs: number
  ipa: string
}

export interface TranscriptionInput {
  modelId: ModelId
  audioPath: string
  originalFilename: string
  mimeType: string
  sizeBytes: number
}

export interface TranscriptionResult {
  modelId: ModelId
  ipa: string
  durationMs: number
  segments: TranscriptionSegment[]
}
