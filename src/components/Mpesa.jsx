import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '../lib/motion.js'
import { KES, formatPhone, isKenyanMobile, cx } from '../lib/utils.js'
import { mpesa } from '../lib/api.js'

/* ============================================================================
   M-PESA CHECKOUT — the choreography, without the charge.
   ----------------------------------------------------------------------------
   This walks the real Lipa na M-Pesa Online sequence:

     enter number → STK push request → "check your phone" → 60s window
     → poll the status → the result

   Everything is genuine except the destination. The push is accepted only
   inside this build; no prompt is sent to any handset, no PIN is collected,
   no money moves, and the status poll is wired to fail. Each attempt fails a
   different way because that is what a misconfigured till actually does.

   The demo notice below is never hidden and never dismissible. A payment form
   that cannot take payments has to say so on its face.
   ========================================================================== */

const WINDOW_S = 60

const STAGES = [
  { at: 0,  text: 'Request accepted for processing' },
  { at: 4,  text: 'Waiting for the handset to respond' },
  { at: 16, text: 'Still waiting — the prompt can take a moment' },
  { at: 34, text: 'No response yet. Checking with Safaricom' },
]

export default function Mpesa({ total, items, onClose }) {
  const [step, setStep] = useState('phone')      // phone | pending | failed
  const [phone, setPhone] = useState('')
  const [touched, setTouched] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [checkout, setCheckout] = useState(null)
  const [fail, setFail] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const timer = useRef(null)

  const valid = isKenyanMobile(phone)
  const stage = [...STAGES].reverse().find(s => elapsed >= s.at)?.text || STAGES[0].text

  useEffect(() => () => clearInterval(timer.current), [])

  async function send(e) {
    e?.preventDefault()
    setTouched(true)
    if (!valid) return

    setStep('pending'); setElapsed(0); setFail(null); setAttempt(a => a + 1)

    const push = await mpesa.stkPush({
      phone: phone.replace(/\D/g, ''),
      amount: total,
      reference: 'ALDOSI',
      description: `Aldosi Merchants order · ${items} item${items === 1 ? '' : 's'}`,
    })

    // A rejected push (bad number, bad amount) never becomes a wait.
    if (!push.data?.CheckoutRequestID) {
      setFail({
        code: push.data?.errorCode || 'UNKNOWN',
        desc: push.data?.errorMessage || 'The request was not accepted.',
        hint: push.data?.demo?.detail || push.data?.hint,
        fuse: push.data?.demo?.fuse,
      })
      setStep('failed')
      return
    }

    setCheckout(push.data.CheckoutRequestID)

    clearInterval(timer.current)
    timer.current = setInterval(() => {
      setElapsed(s => {
        const next = s + 1
        if (next >= WINDOW_S) { clearInterval(timer.current); resolve(push.data.CheckoutRequestID) }
        return next
      })
    }, 1000)
  }

  async function resolve(id) {
    const r = await mpesa.query(id)
    const d = r.data || {}
    setFail({
      code: d.ResultCode ?? d.errorCode ?? 'UNKNOWN',
      desc: d.ResultDesc || d.errorMessage || 'The transaction did not complete.',
      hint: d.demo?.hint || d.demo?.detail,
      fuse: d.demo?.fuse,
    })
    setStep('failed')
  }

  function cancel() {
    clearInterval(timer.current)
    setFail({ code: '1032', desc: 'Request cancelled by user', hint: 'You stopped the request from this end.', fuse: null })
    setStep('failed')
  }

  return (
    <div className="flex h-full flex-col">
      <Notice />

      <div className="flex-1 overflow-y-auto p-[clamp(18px,3vw,34px)]">
        <AnimatePresence mode="wait">
          {/* ---------------- enter the number ---------------- */}
          {step === 'phone' && (
            <Pane key="phone">
              <Head kicker="Lipa na M-Pesa" title="Pay from your phone" />
              <form onSubmit={send} className="mt-7">
                <label className="lab block">Safaricom number</label>
                <div className="mt-2 flex items-stretch border border-bone/16 focus-within:border-flame-hi">
                  <span className="num grid shrink-0 place-items-center border-r border-bone/16 px-4 font-mono text-[13px] text-smoke-2">
                    +254
                  </span>
                  <input
                    value={formatPhone(phone)}
                    onChange={e => setPhone(e.target.value)}
                    onBlur={() => setTouched(true)}
                    inputMode="numeric" autoComplete="tel"
                    placeholder="0712 345 678"
                    aria-invalid={touched && !valid}
                    className="num w-full bg-transparent px-4 py-4 font-mono text-[17px] tracking-[0.04em] text-bone outline-none placeholder:text-bone/25"
                  />
                </div>
                {touched && !valid && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-[11.5px] text-ember">
                    That is not a Safaricom number. Try 07XX XXX XXX or 01XX XXX XXX.
                  </motion.p>
                )}

                <dl className="mt-7 border-t border-bone/14 pt-4 text-[12.5px]">
                  {[['Paying', 'Aldosi Merchants Ltd'], ['Till', '174379'],
                    ['Reference', 'ALDOSI'], ['Items', `${items}`]].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between py-1.5">
                      <dt className="text-smoke">{k}</dt>
                      <dd className="num font-mono text-bone/85">{v}</dd>
                    </div>
                  ))}
                  <div className="mt-2 flex items-baseline justify-between border-t border-bone/14 pt-4">
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-smoke">Amount</dt>
                    <dd className="num font-mono text-[22px] text-bone">{KES(total)}</dd>
                  </div>
                </dl>

                <Wipe type="submit" disabled={!valid} className="mt-6 w-full">
                  Send STK push <span className="text-[13px]">→</span>
                </Wipe>
              </form>
            </Pane>
          )}

          {/* ---------------- waiting for a phone that was never rung -------- */}
          {step === 'pending' && (
            <Pane key="pending">
              <Head kicker="Request sent" title="Check your phone" />
              <p className="mt-4 max-w-[42ch] text-[13px] leading-relaxed text-smoke-2">
                A prompt should appear on <b className="num font-mono text-bone">+254 {formatPhone(phone)}</b>.
                Enter your M-Pesa PIN to authorise {KES(total)}.
              </p>

              {/* the handset, drawn — showing the exact text Safaricom sends */}
              <div className="mt-7 border border-bone/16 bg-soot-2 p-5">
                <div className="flex items-center justify-between border-b border-bone/12 pb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-bone/55">MPESA</span>
                  <span className="num font-mono text-[10px] text-smoke">now</span>
                </div>
                <p className="mt-3.5 text-[13px] leading-relaxed text-bone/80">
                  <b className="text-bone">{checkout ? 'Accept' : 'Preparing'}</b> ALDOSI MERCHANTS LTD
                  <br />Ksh{total.toLocaleString('en-KE')}.00
                  <br /><span className="text-smoke-2">Enter M-PESA PIN:</span>
                </p>
                <div className="mt-4 flex gap-2" aria-hidden="true">
                  {[0, 1, 2, 3].map(i => (
                    <span key={i} className="h-8 w-8 border border-bone/20" />
                  ))}
                </div>
              </div>

              {/* countdown: a hairline draining, and the seconds in mono */}
              <div className="mt-7">
                <div className="flex items-baseline justify-between text-[11px] text-smoke">
                  <span>{stage}</span>
                  <span className="num font-mono text-bone">{String(WINDOW_S - elapsed).padStart(2, '0')}s</span>
                </div>
                <div className="mt-2.5 h-px w-full bg-bone/14">
                  <motion.i className="block h-full origin-left bg-bone/70"
                    animate={{ scaleX: 1 - elapsed / WINDOW_S }}
                    transition={{ duration: 1, ease: 'linear' }} />
                </div>
                {checkout && (
                  <p className="num mt-3 break-all font-mono text-[10px] text-smoke/70">{checkout}</p>
                )}
              </div>

              <button onClick={cancel}
                className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-smoke underline-offset-4 transition-colors hover:text-bone hover:underline">
                Cancel the request
              </button>
            </Pane>
          )}

          {/* ---------------- the failure, stated plainly -------------------- */}
          {step === 'failed' && (
            <Pane key="failed">
              <Head kicker={`Attempt ${attempt} — failed`} title="The payment did not go through" tone="ember" />

              <div className="mt-6 border-l-2 border-ember bg-ember/6 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ember">
                    Result {String(fail?.code)}
                  </span>
                  {fail?.fuse && (
                    <span className="num font-mono text-[9px] uppercase tracking-[0.14em] text-smoke">{fail.fuse}</span>
                  )}
                </div>
                <p className="mt-2.5 text-[14px] leading-snug text-bone">{fail?.desc}</p>
                {fail?.hint && <p className="mt-2.5 text-[12px] leading-relaxed text-smoke-2">{fail.hint}</p>}
              </div>

              <p className="mt-6 max-w-[44ch] text-[12.5px] leading-relaxed text-smoke-2">
                Nothing was deducted. In a live till you would try again, switch to a
                different number, or pay on delivery — the cart is untouched either way.
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <Wipe onClick={() => setStep('phone')}>Try another number</Wipe>
                <Wipe onClick={send} variant="ghost">Send it again</Wipe>
              </div>

              <details className="mt-8 border-t border-bone/14 pt-4">
                <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.18em] text-smoke hover:text-bone">
                  Why this always fails
                </summary>
                <p className="mt-3 max-w-[54ch] text-[12px] leading-relaxed text-smoke-2">
                  This build ships the full Daraja request shape — OAuth, STK push, status
                  query, callback — with the happy path fused shut in
                  <span className="num font-mono text-bone/80"> server/mpesa.js</span>. No
                  consumer key, no passkey, no till. The endpoints, validation, error codes
                  and this entire waiting sequence are real; the charge is the one thing that
                  is not, on purpose.
                </p>
              </details>
            </Pane>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* --- pieces --------------------------------------------------------------- */

function Pane({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } }}
      exit={{ opacity: 0, y: -14, transition: { duration: 0.28, ease: EASE } }}
    >
      {children}
    </motion.div>
  )
}

function Head({ kicker, title, tone }) {
  return (
    <>
      <p className={cx('lab', tone === 'ember' && '!text-ember')}>{kicker}</p>
      <h3 className="disp mt-2.5 text-[clamp(28px,3.4vw,44px)] leading-[0.95] text-bone">{title}</h3>
    </>
  )
}

export function Notice() {
  return (
    <div className="flex items-start gap-3 border-b border-bone/12 bg-bone/4 px-[clamp(18px,3vw,34px)] py-3.5">
      <span className="mt-[3px] block h-3 w-3 shrink-0 border border-ember" aria-hidden="true" />
      <p className="text-[11px] leading-relaxed text-smoke-2">
        <b className="text-bone">Demo build — payments are switched off.</b> Nothing here can
        charge a card or an M-Pesa wallet. Enter a real number if you like; no prompt will
        reach it.
      </p>
    </div>
  )
}

export function Wipe({ children, className = '', variant = 'solid', ...rest }) {
  return (
    <button {...rest}
      className={cx(
        'group relative overflow-hidden border px-5 py-3.5 disabled:cursor-not-allowed disabled:opacity-35',
        variant === 'solid' ? 'border-bone/30' : 'border-bone/18',
        className
      )}>
      <span className="absolute inset-0 -translate-x-full bg-bone transition-transform duration-[600ms] ease-[cubic-bezier(.16,.84,.24,1)] group-enabled:group-hover:translate-x-0" />
      <span className="relative z-10 flex items-center justify-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-bone transition-colors duration-500 group-enabled:group-hover:text-soot">
        {children}
      </span>
    </button>
  )
}
