import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router: Router = Router()
const prisma = new PrismaClient()

/**
 * Health check endpoint that verifies database connectivity.
 * Returns 'ok' status if database is reachable, 'error' otherwise.
 */
router.get('/', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Database unavailable' })
  }
})

export { router as healthRouter }
