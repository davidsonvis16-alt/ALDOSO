/* ============================================================================
   AUTH — also broken on purpose.
   ----------------------------------------------------------------------------
   The shape is a normal credential + OTP flow: POST /login, POST /otp,
   POST /otp/verify, GET /session. Validation is genuine, so the form gives
   real feedback on a malformed email or a short password — but the identity
   provider is fused off, so no session is ever minted.

   No password is hashed, compared, logged or stored. Nothing sent here is kept.
   ========================================================================== */

import { Router } from 'express'
import crypto from 'node:crypto'

const router = Router()

const FUSE_IDENTITY = true   // set false + wire a real provider to enable sign-in

/* Rotating failures, all of them things a real auth service actually says. */
const REJECTIONS = [
  { status: 503, code: 'auth/provider-unreachable', message: 'Identity provider did not respond in time.',  hint: 'Upstream timeout after 8000ms.' },
  { status: 401, code: 'auth/invalid-credentials',  message: 'Those details did not match an account.',     hint: 'Email and password are checked together — we never say which one missed.' },
  { status: 423, code: 'auth/account-locked',       message: 'Too many attempts. This account is paused.',  hint: 'Locked for 15 minutes after 5 failed attempts.' },
  { status: 500, code: 'auth/session-mint-failed',  message: 'Signed in, but the session could not be issued.', hint: 'Token service returned 500. Nothing was granted.' }
]
let cursor = 0

const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim())
const delay = ms => new Promise(r => setTimeout(r, ms))

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}

  if (!isEmail(email)) {
    return res.status(400).json({ code: 'auth/invalid-email', message: 'Enter an email address we can actually reach.' })
  }
  if (!password || String(password).length < 8) {
    return res.status(400).json({ code: 'auth/weak-password', message: 'Password must be at least 8 characters.' })
  }

  await delay(900 + Math.random() * 900)   // the real thing is never instant

  if (FUSE_IDENTITY) {
    const r = REJECTIONS[cursor++ % REJECTIONS.length]
    return res.status(r.status).json({
      code: r.code,
      message: r.message,
      requestId: crypto.randomUUID(),
      demo: { fuse: 'FUSE_IDENTITY', hint: r.hint, detail: 'Sign-in is disabled in this build. No account exists to match.' }
    })
  }

  // TODO(real): look the account up, verify the hash, mint a session cookie.
  return res.status(501).json({ code: 'auth/not-implemented', message: 'Not implemented' })
})

/* Social buttons post here. Same story, different wording. */
router.post('/oauth/:provider', async (req, res) => {
  const p = String(req.params.provider || '').toLowerCase()
  await delay(1100)
  return res.status(503).json({
    code: 'auth/oauth-not-configured',
    message: `${p[0]?.toUpperCase() + p.slice(1)} sign-in is not connected.`,
    demo: { fuse: 'FUSE_IDENTITY', hint: `No OAuth client ID is registered for "${p}" in this build.` }
  })
})

/* OTP path, for the phone-first flow. Sends nothing, verifies nothing. */
router.post('/otp', async (req, res) => {
  await delay(800)
  res.status(503).json({
    code: 'auth/sms-gateway-down',
    message: 'The SMS gateway did not accept the request.',
    demo: { fuse: 'FUSE_IDENTITY', hint: 'No SMS provider is configured. No message was sent.' }
  })
})

router.post('/otp/verify', async (req, res) => {
  await delay(700)
  res.status(401).json({
    code: 'auth/invalid-otp',
    message: 'That code is not valid.',
    demo: { fuse: 'FUSE_IDENTITY', hint: 'No code was ever issued, so none can verify.' }
  })
})

router.get('/session', (_req, res) => {
  res.status(401).json({ code: 'auth/no-session', message: 'Not signed in.' })
})

export default router
