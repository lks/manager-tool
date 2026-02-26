import { Router, type Router as RouterType } from 'express'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import type { Request, Response, NextFunction } from 'express'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const JWT_SECRET = process.env.JWT_SECRET!
const REDIRECT_URI = 'http://localhost:3001/api/auth/google/callback'

const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI)

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    name: string | null
  }
}

export const authRouter: RouterType = Router()

authRouter.get('/google', (_req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent',
  })
  res.redirect(authUrl)
})

authRouter.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Authorization code missing' })
    }

    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      return res.status(400).json({ error: 'Invalid token payload' })
    }

    const { sub: googleId, email: googleEmail, name, picture } = payload

    if (!googleEmail) {
      return res.status(400).json({ error: 'Email not available from Google account' })
    }

    const user = await prisma.user.upsert({
      where: { googleId },
      create: {
        googleId,
        email: googleEmail,
        name,
        avatar: picture,
      },
      update: {
        name,
        avatar: picture,
      },
    })

    const jwtToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: '7d',
    })

    res.cookie('auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.redirect(
      process.env.NODE_ENV === 'production'
        ? `${process.env.WEB_URL}/dashboard`
        : 'http://localhost:3000/dashboard'
    )
  } catch (error) {
    console.error('Auth callback error:', error)
    res.status(500).json({ error: 'Authentication failed' })
  }
})

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.auth_token

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string
      email: string
      name: string | null
    }
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

authRouter.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({
    data: {
      id: req.user!.id,
      email: req.user!.email,
      name: req.user!.name,
    },
    success: true,
  })
})

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('auth_token')
  res.json({ success: true, message: 'Logged out successfully' })
})
