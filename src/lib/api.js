/* ============================================================================
   The client half of a payment flow that is switched off.
   ----------------------------------------------------------------------------
   These functions talk to server/ over /api. If the API is not running — say
   you opened the build with `vite` alone — they fall back to the same failure
   the server would have sent, so the flow behaves identically either way.

   There is no path through this file that results in money moving or a session
   being issued. That is the design, not a bug to be found later.
   ========================================================================== */

const OFFLINE_MPESA = {
  status: 503,
  body: {
    errorCode: '404.001.03',
    errorMessage: 'Invalid Access Token',
    demo: {
      fuse: 'FUSE_TOKEN',
      detail: 'The payments API is not reachable, and it is fused off besides. This build cannot take payments.',
    },
  },
}
const OFFLINE_AUTH = {
  status: 503,
  body: {
    code: 'auth/provider-unreachable',
    message: 'Identity provider did not respond.',
    demo: { fuse: 'FUSE_IDENTITY', hint: 'The auth API is not reachable, and sign-in is disabled in this build.' },
  },
}

async function post(path, body, offline) {
  try {
    const r = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    })
    const data = await r.json().catch(() => ({}))
    return { ok: r.ok, status: r.status, data }
  } catch {
    // network gone, API not started — same destination, different road
    await new Promise(r => setTimeout(r, 950))
    return { ok: false, status: offline.status, data: offline.body }
  }
}

export const mpesa = {
  stkPush: payload => post('/api/mpesa/stkpush', payload, OFFLINE_MPESA),
  query: checkoutRequestId => post('/api/mpesa/query', { checkoutRequestId }, OFFLINE_MPESA),
}

export const auth = {
  login: payload => post('/api/auth/login', payload, OFFLINE_AUTH),
  oauth: provider => post(`/api/auth/oauth/${provider}`, {}, OFFLINE_AUTH),
}
