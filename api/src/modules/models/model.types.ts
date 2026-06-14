export type ModelId = 'mock-pt-br' | 'xlsr-pt-br'

export interface PhoneticModel {
  id: ModelId
  name: string
  language: 'en' | 'pt-BR'
  status: 'available' | 'disabled'
}
