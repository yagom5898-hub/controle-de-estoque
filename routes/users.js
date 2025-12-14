import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

router.post('/', async (req, res) => {
  const { name, email } = req.body
  const user = await prisma.user.create({ data: { name, email } })
  res.json(user)
})

export default router
