import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sheet, { CloseX } from './Sheet.jsx'
import { Wipe } from '../Mpesa.jsx'
import { Grid, Ring } from '../Drawn.jsx'
import { auth } from '../../lib/api.js'
import { EASE } from '../../lib/motion.js'
import { cx } from '../../lib/utils.js'

/* ============================================================================
   SIGN IN — a door with no room behind it.
   ----------------------------------------------------------------------------
   The form is real: it validates the email, insists on a password of a
   sensible length, disables itself while in flight, and reports exactly what
   the server said. What it never does is let anyone in — the identity
   provider is fused off in server/auth.js, so every attempt ends in a
   different, entirely plausible failure.

   Nothing typed here is stored, hashed, compared or logged.
   ========================================================================== */

const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim())

export default function AuthSheet({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [touched, setTouched] = useState({})
  const [busy, setBusy] = useState(null)      // null | 'credentials' | provider name
  const [err, setErr] = useState(null)
  const [shake, setShake] = useState(0)
  const [tries, setTries] = useState(0)

  const emailBad = touched.email && !isEmail(email)
  const pwBad = touched.pw && pw.length > 0 && pw.length < 8
  const ready = isEmail(email) && pw.length >= 8

  async function submit(e) {
    e.preventDefault()
    setTouched({ email: true, pw: true })
    if (!ready) { setShake(s => s + 1); return }

    setBusy('credentials'); setErr(null)
    const r = await auth.login({ email: email.trim(), password: pw })
    setBusy(null); setTries(t => t + 1)
    setErr({ code: r.data?.code, message: r.data?.message, hint: r.data?.demo?.hint || r.data?.demo?.detail })
    setShake(s => s + 1)
    setPw('')
  }

  async function social(provider) {
    setBusy(provider); setErr(null)
    const r = await auth.oauth(provider)
    setBusy(null); setTries(t => t + 1)
    setErr({ code: r.data?.code, message: r.data?.message, hint: r.data?.demo?.hint })
    setShake(s => s + 1)
  }

  return (
    <Sheet open={open} onClose={onClose} label="Sign in" width="max-w-[880px]">
      <div className="grid h-full grid-cols-1 md:grid-cols-[1fr_1.1fr]">
        {/* --- the drawn half, kept on desktop ---------------------------- */}
        <div className="relative hidden overflow-hidden bg-soot-2 md:block">
          <Grid step={28} />
          <div className="absolute inset-0 grid place-items-center p-[14%] pb-[42%]">
            <Ring lit={0.6} label="A burner, half open" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-soot-3 via-soot-3/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-[clamp(18px,2.4vw,32px)]">
            <p className="disp text-[clamp(26px,2.8vw,40px)] leading-[0.95] text-bone">
              Your kitchen,<br /><em className="italic text-clay">remembered.</em>
            </p>
            <p className="mt-3 max-w-[30ch] text-[12px] leading-relaxed text-bone/60">
              Orders, warranty dates, which burner you replaced and when.
            </p>
            <span className="mt-5 block text-[9px] uppercase tracking-[0.2em] text-bone/35">
              Plate 11 — the ring, half open
            </span>
          </div>
        </div>

        {/* --- the form half ------------------------------------------------ */}
        <div className="flex flex-col overflow-y-auto">
          <div className="flex items-start justify-between p-[clamp(18px,3vw,34px)] pb-0">
            <div>
              <p className="lab">Aldosi Merchants account</p>
              <h3 className="disp mt-2 text-[clamp(30px,3.6vw,48px)] leading-[0.95] text-bone">Sign in</h3>
            </div>
            <CloseX onClose={onClose} />
          </div>

          <div className="mx-[clamp(18px,3vw,34px)] mt-5 flex items-start gap-3 border border-bone/14 bg-bone/4 px-4 py-3">
            <span className="mt-[3px] block h-3 w-3 shrink-0 border border-ember" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed text-smoke-2">
              <b className="text-bone">Demo build — sign-in is switched off.</b> There are no
              accounts to sign into. Nothing you type is sent anywhere it could be stored.
            </p>
          </div>

          <motion.form onSubmit={submit} className="p-[clamp(18px,3vw,34px)]"
            key={shake}
            animate={err ? { x: [0, -9, 8, -5, 3, 0] } : {}}
            transition={{ duration: 0.42, ease: EASE }}>

            <label className="lab block" htmlFor="au-email">Email</label>
            <input id="au-email" type="email" value={email} autoComplete="email"
              onChange={e => setEmail(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              placeholder="you@example.com"
              aria-invalid={!!emailBad}
              className={cx('field mt-2', emailBad && 'field-err')} />
            {emailBad && <p className="mt-1.5 text-[11.5px] text-ember">Enter an email address we can actually reach.</p>}

            <label className="lab mt-6 block" htmlFor="au-pw">Password</label>
            <input id="au-pw" type="password" value={pw} autoComplete="current-password"
              onChange={e => setPw(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, pw: true }))}
              placeholder="At least 8 characters"
              aria-invalid={!!pwBad}
              className={cx('field mt-2', pwBad && 'field-err')} />
            {pwBad && <p className="mt-1.5 text-[11.5px] text-ember">Password must be at least 8 characters.</p>}

            <AnimatePresence>
              {err && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 22 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden">
                  <div className="border-l-2 border-ember bg-ember/6 p-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="num font-mono text-[10px] uppercase tracking-[0.14em] text-ember">{err.code}</span>
                      <span className="num font-mono text-[9px] text-smoke">attempt {tries}</span>
                    </div>
                    <p className="mt-2 text-[13.5px] leading-snug text-bone">{err.message}</p>
                    {err.hint && <p className="mt-2 text-[11.5px] leading-relaxed text-smoke-2">{err.hint}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Wipe type="submit" disabled={busy !== null} className="mt-6 w-full">
              {busy === 'credentials' ? <Working label="Checking" /> : <>Sign in <span className="text-[13px]">→</span></>}
            </Wipe>

            <div className="my-7 flex items-center gap-4">
              <i className="h-px flex-1 bg-bone/14" />
              <span className="text-[9px] uppercase tracking-[0.22em] text-smoke">or</span>
              <i className="h-px flex-1 bg-bone/14" />
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {['google', 'apple'].map(p => (
                <Wipe key={p} type="button" variant="ghost" disabled={busy !== null}
                  onClick={() => social(p)}>
                  {busy === p ? <Working label="Opening" /> : `Continue with ${p[0].toUpperCase()}${p.slice(1)}`}
                </Wipe>
              ))}
            </div>

            <p className="mt-7 text-[11.5px] leading-relaxed text-smoke">
              No account? <span className="text-bone/70">Registration is closed in this build too.</span>
              <br />
              <span className="text-smoke/70">
                The form, validation and error handling are real; the identity provider is
                fused off in <span className="num font-mono">server/auth.js</span>.
              </span>
            </p>
          </motion.form>
        </div>
      </div>
    </Sheet>
  )
}

/* A working state that reads as a line drawing itself, not a spinner. */
function Working({ label }) {
  return (
    <span className="flex items-center gap-3">
      {label}
      <span className="relative block h-px w-8 overflow-hidden bg-bone/25">
        <motion.i className="absolute inset-y-0 left-0 block w-1/2 bg-current"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} />
      </span>
    </span>
  )
}
