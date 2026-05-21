import { Router } from 'express'
import { createTranscription } from './transcription.controller'
import { uploadAudio } from './transcription.upload'

export const transcriptionRouter = Router()

transcriptionRouter.post('/', uploadAudio.single('audio'), createTranscription)
