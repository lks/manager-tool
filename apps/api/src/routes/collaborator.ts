import { Router, type Router as RouterType } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticateToken, type AuthRequest } from './auth.js'

export const collaboratorRouter: RouterType = Router()

collaboratorRouter.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const collaborators = await prisma.collaborator.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ data: collaborators, success: true })
  } catch (error) {
    console.error('Error fetching collaborators:', error)
    res.status(500).json({ error: 'Failed to fetch collaborators' })
  }
})

collaboratorRouter.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { firstName, lastName } = req.body

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' })
    }

    const collaborator = await prisma.collaborator.create({
      data: {
        firstName,
        lastName,
        userId: req.user!.id,
      },
    })

    res.json({ data: collaborator, success: true })
  } catch (error) {
    console.error('Error creating collaborator:', error)
    res.status(500).json({ error: 'Failed to create collaborator' })
  }
})

collaboratorRouter.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params

    await prisma.collaborator.deleteMany({
      where: { id, userId: req.user!.id },
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting collaborator:', error)
    res.status(500).json({ error: 'Failed to delete collaborator' })
  }
})
