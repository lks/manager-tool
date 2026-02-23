import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import { healthRouter } from './routes/health.js'
import { authRouter } from './routes/auth.js'
import { errorHandler } from './middleware/error.js'

const app: Express = express()
const PORT = process.env.PORT || 3001

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

/**
 * Root endpoint that returns API information.
 */
app.get('/', (_req, res) => {
  res.json({ message: 'Manager Tool API', version: '1.0.0' })
})

app.use('/health', healthRouter)
app.use('/auth', authRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})

export default app
