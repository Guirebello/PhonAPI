import express from 'express'
import cors from 'cors'
import { healthRouter } from './modules/health/health.routes'
import { modelRouter } from './modules/models/model.routes'
import { transcriptionRouter } from './modules/transcription/transcription.routes'

const DEFAULT_ORIGIN = 'http://localhost:5173'

function resolveCorsOrigins(): string[] {
  const raw = process.env.CORS_ORIGIN?.trim()
  if (!raw) return [DEFAULT_ORIGIN]
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)
}

export function createApp() {
  const app = express()

  app.use(cors({ origin: resolveCorsOrigins() }))
  app.use(express.json())

  app.use('/health', healthRouter)
  app.use('/models', modelRouter)
  app.use('/transcription', transcriptionRouter)

  app.use((_req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
      },
    })
  })

  return app
}
