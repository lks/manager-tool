import { Router, type Request, type Response } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { createGoogleStrategy } from '../lib/google.js'

const router: Router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

console.log('Loading Google Strategy with:')
console.log('  GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'set' : 'MISSING')
console.log('  GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'set' : 'MISSING')
console.log('  API_URL:', process.env.API_URL)
console.log('  FRONTEND_URL:', FRONTEND_URL)

passport.use(createGoogleStrategy())

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user as Express.User | null)
})

export interface AuthUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
}

function generateToken(payload: AuthUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req: Request, res: Response) => {
    const user = req.user as AuthUser
    const token = generateToken(user)

    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`)
  }
)

router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    res.json({ user: decoded })
  } catch {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' })
  }
})

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token')
  res.json({ success: true })
})

export { router as authRouter, generateToken }
