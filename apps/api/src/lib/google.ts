import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { PrismaClient } from '@prisma/client'
import type { Request } from 'express'

const prisma = new PrismaClient()

export interface GoogleUserProfile {
  id: string
  displayName: string
  emails: Array<{ value: string; verified: boolean }>
  photos: Array<{ value: string }>
}

export function createGoogleStrategy() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${process.env.API_URL || 'http://localhost:3001'}/auth/google/callback`,
      passReqToCallback: true,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (_req: Request, _accessToken: any, _refreshToken: any, profile: any, done: any) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) {
          return done(new Error('No email provided by Google'))
        }

        let user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || null,
              googleId: profile.id,
              avatarUrl: profile.photos?.[0]?.value || null,
              emailVerified: profile.emails?.[0]?.verified || false,
            },
          })
        } else {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId: profile.id,
              name: profile.displayName || user.name,
              avatarUrl: profile.photos?.[0]?.value || user.avatarUrl,
              emailVerified: profile.emails?.[0]?.verified || user.emailVerified,
            },
          })
        }

        return done(null, {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
        })
      } catch (err) {
        return done(err)
      }
    }
  )
}

export { prisma }
