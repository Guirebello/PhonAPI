import multer from 'multer'

const acceptedAudioMimeTypes = new Set([
  'audio/wav',
  'audio/x-wav',
  'audio/x-m4a',
  'audio/mpeg',
  'audio/mp4',
  'audio/webm',
  'audio/ogg',
])

export const uploadAudio = multer({
  dest: 'tmp/uploads',
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 1,
    fields: 2,
    parts: 3,
  },
  fileFilter: (_req, file, cb) => {
    cb(null, acceptedAudioMimeTypes.has(file.mimetype))
  },
})
