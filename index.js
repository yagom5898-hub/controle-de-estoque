import express from 'express'
import usersRouter from './routes/users.js'
import chargesRouter from './routes/charges.js'

const app = express()
app.use(express.json())
app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/users', usersRouter)
app.use('/api/charges', chargesRouter)

export default app
