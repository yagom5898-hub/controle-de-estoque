import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

router.get('/', async (req, res) => {
  const list = await prisma.charge.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(list)
})

router.post('/sync', async (req, res) => {
  const { charges } = req.body || {}
  if (!Array.isArray(charges)) return res.status(400).json({ error: 'charges inválido' })
  const upserts = []
  for (const c of charges) {
    if (!c.externalId) continue
    const data = {
      externalId: c.externalId,
      amount: Number(c.amount || 0),
      currency: c.currency || 'BRL',
      status: c.status || 'pending',
      createdAt: c.createdAt ? new Date(c.createdAt) : undefined
    }
    upserts.push(
      prisma.charge.upsert({
        where: { externalId: c.externalId },
        update: { amount: data.amount, currency: data.currency, status: data.status },
        create: data
      })
    )
  }
  const results = await Promise.all(upserts)
  res.json({ synced: results.length })
})

export default router
