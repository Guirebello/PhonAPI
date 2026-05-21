import { Router } from 'express'
import { getModels } from './model.controller'

export const modelRouter = Router()

modelRouter.get('/', getModels)
