import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sheet, { CloseX } from './Sheet.jsx'
import Cooker from '../Cooker.jsx'
import Mpesa, { Wipe } from '../Mpesa.jsx'
import { PRODUCTS } from '../../data/products.js'
import { EASE } from '../../lib/motion.js'
import { KES } from '../../lib/utils.js'

export default function CartSheet({ open, onClose, cart, setQty, remove, total, count }) {
  const [paying, setPaying] = useState(false)
  useEffect(() => { if (!open) setPaying(false) }, [open])

  const ship = total > 0 && total < 5000 ? 450 : 0

  return (
    <Sheet open={open} onClose={onClose} label="Cart" width="max-w-[620px]">
      <div className="flex items-center justify-between border-b border-bone/12 p-[clamp(18px,3vw,34px)]">
        <div className="flex items-baseline gap-4">
          {paying && (
            <button onClick={() => setPaying(false)}
              className="text-[10px] font-semibold uppercase tracking-[0.18em] text-smoke transition-colors hover:text-bone">
              ← Cart
            </button>
          )}
          <h3 className="disp text-[clamp(24px,3vw,36px)] text-bone">
            {paying ? 'Checkout' : 'Your cart'}
          </h3>
        </div>
        <CloseX onClose={onClose} />
      </div>

      {paying ? (
        <Mpesa total={total + ship} items={count} onClose={onClose} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-[clamp(14px,2.4vw,26px)]">
            <AnimatePresence mode="popLayout">
              {count === 0 ? (
                <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-10 text-center text-[13.5px] leading-relaxed text-smoke">
                  Nothing in here yet.<br />
                  <a href="#appliances" onClick={onClose} className="border-b border-current text-bone">
                    The cooker edit
                  </a> is one scroll away.
                </motion.p>
              ) : Object.entries(cart).map(([id, q], i) => {
                const p = PRODUCTS.find(x => x.id === id)
                if (!p) return null
                return (
                  <motion.div key={id} layout
                    initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24, transition: { duration: 0.3 } }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
                    className="flex items-center gap-4 border-b border-bone/10 py-4">
                    <div className="w-16 shrink-0">
                      <Cooker cfg={{ ...p.svg, lit: false }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="truncate text-[14px] font-semibold text-bone">{p.name}</h5>
                      <div className="mt-0.5 text-[11.5px] text-smoke">{p.sub}</div>
                      <div className="mt-2 flex w-max items-center border border-bone/20">
                        <button onClick={() => setQty(id, q - 1)} aria-label="Fewer"
                          className="px-2.5 py-1 text-bone/55 hover:text-bone">−</button>
                        <span className="num w-6 text-center font-mono text-[11px] text-bone">{q}</span>
                        <button onClick={() => setQty(id, q + 1)} aria-label="More"
                          className="px-2.5 py-1 text-bone/55 hover:text-bone">+</button>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="num block font-mono text-[14px] text-bone">{KES(p.price * q)}</span>
                      <button onClick={() => remove(id)}
                        className="mt-1.5 text-[10px] uppercase tracking-[0.14em] text-smoke underline-offset-4 hover:text-ember hover:underline">
                        Remove
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <div className="border-t border-bone/12 p-[clamp(18px,3vw,34px)]">
            {[['Subtotal', KES(total)],
              ['Delivery — Nairobi & environs', ship ? KES(ship) : 'Free'],
              ['Installation & first light', 'Included']].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between py-1.5 text-[12.5px]">
                <span className="text-smoke">{k}</span>
                <span className="num font-mono text-bone/80">{v}</span>
              </div>
            ))}
            <div className="mt-3 flex items-baseline justify-between border-t border-bone/14 pt-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-smoke">Total</span>
              <span className="num font-mono text-[22px] text-bone">{KES(total + ship)}</span>
            </div>
            <Wipe onClick={() => setPaying(true)} disabled={count === 0} className="mt-5 w-full">
              Pay with M-Pesa <span className="text-[13px]">→</span>
            </Wipe>
            <p className="mt-3 text-center text-[10.5px] text-smoke/80">
              Demo build — no payment can be taken.
            </p>
          </div>
        </>
      )}
    </Sheet>
  )
}
