import type { PhoneticModel } from './model.types'

const models: PhoneticModel[] = [
  {
    id: 'mock-pt-br',
    name: 'Mock Portuguese BR',
    language: 'pt-BR',
    status: 'available',
  },
  {
    id: 'xlsr-pt-br',
    name: 'wav2vec XLSR pt-BR (phoneme)',
    language: 'pt-BR',
    status: 'available',
  },
  {
    id: 'whisper-en',
    name: 'Whisper small en-US (ASR + G2P)',
    language: 'en',
    status: 'available',
  },
]

export function listModels(): PhoneticModel[] {
  return models
}

export function findAvailableModelById(modelId: string): PhoneticModel | undefined {
  return models.find((model) => model.id === modelId && model.status === 'available')
}
