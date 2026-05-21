import type { Request, Response } from 'express'
import { listModels } from './model.service'

export function getModels(_req: Request, res: Response) {
  res.status(200).json({
    data: listModels(),
  })
}
