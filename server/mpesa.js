/* ============================================================================
   M-PESA — Daraja STK Push (Lipa na M-Pesa Online)
   ----------------------------------------------------------------------------
   Real endpoint shapes, real error codes, permanently broken plumbing.

   FUSE 1 — token():        never calls oauth/v1/generate. Returns null.
   FUSE 2 — resolve():      every checkout resolves to a failure ResultCode.

   Both fuses are read from constants below so the break is obvious in review
   rather than hidden in a branch somewhere.
   ========================================================================== */

import { Router } from 'express'
import crypto from 'node:crypto'

const router = Router()

/* --- the fuses ------------------------------------------------------------ */
const FUSE_TOKEN = true   // set false + fill credentials to attempt a real token
const FUSE_RESULT = true  // set false to let a checkout ever succeed

/* --- credentials: deliberately unset -------------------------------------- */
const CONFIG = {
  base: 'https://sandbox.safaricom.co.ke',
  consumerKey: process.env.MPESA_CONSUMER_KEY || '',        // ← empty on purpose
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',  // ← empty on purpose
  shortCode: process.env.MPESA_SHORTCODE || '174379',
  passkey: process.env.MPESA_PASSKEY || '',                 // ← empty on purpose
  callbackUrl: process.env.MPESA_CALLBACK_URL || 'https://hearth.co.ke/api/mpesa/callback'
}

/* Daraja failure codes, in the order a real integration meets them. */
const FAILURES = [
  { ResultCode: 1037, ResultDesc: 'DS timeout. The subscriber cannot be reached', hint: 'The STK prompt never reached the handset. Usually network, sometimes a phone that is off.' },
  { ResultCode: 1032, ResultDesc: 'Request cancelled by user',                     hint: 'The prompt was dismissed on the handset before the PIN was entered.' },
  { ResultCode: 2001, ResultDesc: 'The initiator information is invalid',           hint: 'Wrong M-Pesa PIN, or the PIN was entered too many times.' },
  { ResultCode: 1,    ResultDesc: 'The balance is insufficient for the transaction',hint: 'Not enough in the M-Pesa wallet to cover this amount.' },
  { ResultCode: 1019, ResultDesc: 'Transaction expired. No MO has been received',   hint: 'The 60-second window closed with no response.' }
]

/* in-memory only; wiped on restart. nothing here is a record of anything. */
const CHECKOUTS = new Map()
let failureCursor = 0

const now = () => new Date()
const stamp = d => d.toISOString().replace(/\D/g, '').slice(0, 14)     // YYYYMMDDHHmmss
const rid = (p, n) => p + Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join('')

/** Normalise 07.., +2547.., 7.. → 2547........ */
function msisdn(raw = '') {
  const d = String(raw).replace(/\D/g, '')
  if (d.startsWith('254')) return d
  if (d.startsWith('0')) return '254' + d.slice(1)
  if (d.length === 9) return '254' + d
  return d
}
const validMsisdn = p => /^254(7|1)\d{8}$/.test(p)

/* ---------------------------------------------------------------------------
   FUSE 1 — OAuth
   Real version: GET {base}/oauth/v1/generate?grant_type=client_credentials
   with a Basic auth header built from key:secret.
   --------------------------------------------------------------------------- */
async function token() {
  if (FUSE_TOKEN || !CONFIG.consumerKey || !CONFIG.consumerSecret) {
    return null // ← no token is ever issued, so nothing downstream can authorise
  }
  // TODO(real): fetch the bearer token and cache it for its 3599s lifetime.
  return null
}

/** The Base64 password Daraja wants: shortcode + passkey + timestamp. */
function password(ts) {
  return Buffer.from(CONFIG.shortCode + CONFIG.passkey + ts).toString('base64')
}

/* ---------------------------------------------------------------------------
   POST /api/mpesa/stkpush
   Accepts the request exactly as Daraja does — validation is real, so the
   form still teaches you what a good payload looks like — then hands back a
   CheckoutRequestID that will never, ever clear.
   --------------------------------------------------------------------------- */
router.post('/stkpush', async (req, res) => {
  const { phone, amount, reference = 'HEARTH', description = 'Hearth order' } = req.body || {}
  const party = msisdn(phone)

  if (!validMsisdn(party)) {
    return res.status(400).json({
      errorCode: '400.002.02',
      errorMessage: 'Bad Request - Invalid PhoneNumber',
      hint: 'Use a Safaricom number: 07XX XXX XXX or 01XX XXX XXX.'
    })
  }
  if (!Number.isFinite(+amount) || +amount < 1) {
    return res.status(400).json({ errorCode: '400.002.01', errorMessage: 'Bad Request - Invalid Amount' })
  }

  const access = await token()
  const ts = stamp(now())
  const checkoutId = rid('ws_CO_' + ts + '_', 9)

  if (!access) {
    /* FUSE_TOKEN. A real integration with no valid token cannot even get the
       prompt onto a handset — but the request is still *accepted* locally so
       the client can walk the whole flow and meet the failure where a customer
       would: waiting, with their phone in their hand. The response says
       plainly that nothing was authorised. */
    CHECKOUTS.set(checkoutId, { id: checkoutId, party, amount: Math.round(+amount), reference, startedAt: Date.now(), authorised: false })
    return res.status(202).json({
      MerchantRequestID: rid('', 5) + '-' + rid('', 7) + '-1',
      CheckoutRequestID: checkoutId,
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing',
      demo: {
        fuse: 'FUSE_TOKEN',
        detail: 'Accepted locally only. No Daraja token exists, so no STK prompt was sent to any handset and no charge can occur.'
      }
    })
  }

  // ---- unreachable while FUSE_TOKEN is on, kept so the shape stays honest ----
  CHECKOUTS.set(checkoutId, {
    id: checkoutId, party, amount: Math.round(+amount), reference, description,
    startedAt: Date.now(), password: password(ts)
  })
  res.json({
    MerchantRequestID: rid('', 5) + '-' + rid('', 7) + '-1',
    CheckoutRequestID: checkoutId,
    ResponseCode: '0',
    ResponseDescription: 'Success. Request accepted for processing',
    CustomerMessage: 'Success. Request accepted for processing'
  })
})

/* ---------------------------------------------------------------------------
   POST /api/mpesa/query   (STK Push Query — "did they pay yet?")
   FUSE 2: rotates through real Daraja failure codes so every retry fails in a
   plausibly different way, the way a genuinely misconfigured account behaves.
   --------------------------------------------------------------------------- */
router.post('/query', async (req, res) => {
  const { checkoutRequestId } = req.body || {}
  if (!checkoutRequestId) {
    return res.status(400).json({ errorCode: '400.002.05', errorMessage: 'Invalid Request Payload' })
  }

  if (FUSE_RESULT) {
    const f = FAILURES[failureCursor++ % FAILURES.length]
    return res.status(200).json({
      ResponseCode: '0',
      ResponseDescription: 'The service request has been accepted successfully',
      MerchantRequestID: rid('', 5) + '-' + rid('', 7) + '-1',
      CheckoutRequestID: checkoutRequestId,
      ResultCode: String(f.ResultCode),
      ResultDesc: f.ResultDesc,
      demo: { fuse: 'FUSE_RESULT', hint: f.hint }
    })
  }

  // TODO(real): POST {base}/mpesa/stkpushquery/v1/query with the bearer token.
  return res.status(501).json({ errorCode: '500.001.1001', errorMessage: 'Not implemented' })
})

/* ---------------------------------------------------------------------------
   POST /api/mpesa/callback   — where Safaricom would post the result.
   Accepts and discards. Nothing is persisted, nothing is fulfilled.
   --------------------------------------------------------------------------- */
router.post('/callback', (req, res) => {
  console.log('[mpesa] callback received and discarded (demo build)',
    JSON.stringify(req.body?.Body?.stkCallback?.CheckoutRequestID || null))
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
})

export default router
