import 'dotenv/config'
import { createApp } from './app'

const port = Number(process.env.PORT ?? 1337)
const app = createApp()

const server = app.listen(port, () => {
  console.info(`PhonAPI listening on port ${port}`)
})

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0)
  })
})
