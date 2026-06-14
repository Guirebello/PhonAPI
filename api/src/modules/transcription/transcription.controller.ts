import { unlink } from 'node:fs/promises'
import type { Request, Response } from 'express'
import { runTranscription } from './transcription.service'
import { findAvailableModelById } from '../models/model.service'

export async function createTranscription(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({
      error: {
        code: 'AUDIO_REQUIRED',
        message: 'Audio file is required in the "audio" form field',
      },
    })
    return
  }

  try {
    const requestedModelId =
      typeof req.body.modelId === 'string' ? req.body.modelId.trim() : ''

    if (!requestedModelId) {
      res.status(400).json({
        error: {
          code: 'MODEL_ID_REQUIRED',
          message: 'A modelId is required; choose one from GET /models',
        },
      })
      return
    }

    const model = findAvailableModelById(requestedModelId)

    if (!model) {
      res.status(400).json({
        error: {
          code: 'INVALID_MODEL_ID',
          message: 'Requested model is not available',
        },
      })
      return
    }

    try {
      const result = await runTranscription({
        modelId: model.id,
        audioPath: req.file.path,
        originalFilename: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
      })
      res.status(201).json({ status: 'completed', transcription: result })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error'
      res.status(502).json({
        error: { code: 'WORKER_FAILED', message },
      })
    }
  } finally {
    await unlink(req.file.path).catch(() => undefined)
  }
}
