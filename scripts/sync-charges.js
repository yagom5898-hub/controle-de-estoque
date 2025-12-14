import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()
async function main(){
  const raw = fs.readFileSync('./data/charges.json','utf-8')
  const { charges } = JSON.parse(raw)
  const results = []
  for (const c of charges) {
    if (!c.externalId) continue
    const data = {
      externalId: c.externalId,
      amount: Number(c.amount || 0),
      currency: c.currency || 'BRL',
      status: c.status || 'pending',
      createdAt: c.createdAt ? new Date(c.createdAt) : undefined
    }
    const r = await prisma.charge.upsert({
      where: { externalId: c.externalId },
      update: { amount: data.amount, currency: data.currency, status: data.status },
      create: data
    })
    results.push(r)
  }
  console.log(`Synced ${results.length} charges`)
}
main().finally(()=> prisma.$disconnect())
