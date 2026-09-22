/* ============================================================================
   HEARTH — API
   ----------------------------------------------------------------------------
   ⚠ THIS BACKEND DOES NOT WORK, AND THAT IS ON PURPOSE.

   It is a faithful *shape* of the Safaricom Daraja (M-Pesa) integration and a
   standard credential login — every route, payload and error code matches what
   the real thing returns — but the happy path is fused shut in three places:

     1. server/mpesa.js  → OAuth token fetch is short-circuited (no creds).
     2. server/mpesa.js  → STK push is accepted, then the status poll always
                           resolves to a Daraja failure ResultCode.
     3. server/auth.js   → every credential check returns 401, every OTP 400.

   No money moves. No session is ever issued. Nothing is stored anywhere.
   The point is the choreography: the pending state, the 60s wait, the
   phone-prompt copy, the real error codes — all of it, minus the charge.

   To make it real you would: fill server/.env with live Daraja credentials,
   delete the FUSE constants below, and implement the TODOs in each module.
   ========================================================================== */

import express from 'express'
import cors from 'cors'
import mpesa from './mpesa.js'
import auth from './auth.js'

const app = express()
const PORT = process.env.PORT || 8787

app.use(cors())
app.use(express.json())

// every response is stamped so no client can mistake this for production
app.use((_req, res, next) => {
  res.set('X-Hearth-Env', 'demo')
  res.set('X-Hearth-Payments', 'disabled-by-design')
  next()
})

app.use('/api/mpesa', mpesa)
app.use('/api/auth', auth)

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'hearth-api',
    env: 'demo',
    payments: { provider: 'daraja', live: false, reason: 'DEMO_FUSE_ACTIVE' },
    auth: { live: false, reason: 'DEMO_FUSE_ACTIVE' }
  })
})

app.use((_req, res) => res.status(404).json({ errorCode: '404.000.00', errorMessage: 'Resource not found' }))

app.listen(PORT, () => {
  console.log(`\n  hearth-api  →  http://localhost:${PORT}`)
  console.log(`  payments    →  DISABLED BY DESIGN (demo fuse active)`)
  console.log(`  auth        →  DISABLED BY DESIGN (demo fuse active)\n`)
})
