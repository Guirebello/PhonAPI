import { unlink } from 'node:fs/promises'
import type { Request, Response } from 'express'
import { createMockTranscription } from './transcription.service'
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
    //TODO: Once more models are added, remove mock-pt-br fallback and add 400 error
    const requestedModelId =
      typeof req.body.modelId === 'string' && req.body.modelId.trim() ? req.body.modelId : 'mock-pt-br'

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
    const result = await createMockTranscription({
      modelId: model.id,
      audioPath: req.file.path,
      originalFilename: req.file.originalname,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
    })
    res.status(201).json({ data: result })
  } finally {
    await unlink(req.file.path).catch(() => undefined)
  }
}
