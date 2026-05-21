import type { PhoneticModel } from './model.types'

const models: PhoneticModel[] = [
  {
    id: 'mock-pt-br',
    name: 'Mock Portuguese BR',
    language: 'pt-BR',
    status: 'available',
  },
]

export function listModels(): PhoneticModel[] {
  return models
}

export function findAvailableModelById(modelId: string): PhoneticModel | undefined {
  return models.find((model) => model.id === modelId && model.status === 'available')
}
