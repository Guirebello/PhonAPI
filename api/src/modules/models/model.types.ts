export type ModelId = 'mock-pt-br'

export interface PhoneticModel {
  id: ModelId
  name: string
  language: string
  status: 'available' | 'disabled'
}
