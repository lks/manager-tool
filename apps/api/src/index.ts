import express, { type Express } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { healthRouter } from './routes/health.js'
import { authRouter } from './routes/auth.js'
import { errorHandler } from './middleware/error-handler.js'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3001

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.WEB_URL
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())

app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})
