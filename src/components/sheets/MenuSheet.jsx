import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '../../lib/motion.js'

const ITEMS = [
  ['cook', 'Cook', '01'], ['discover', 'Discover', '02'], ['appliances', 'Appliances', '03'],
  ['story', 'Our Story', '04'], ['kenya', 'Support', '05'],
]

/* Full-bleed menu. Each item is a hard-masked line; hovering one pushes the
   others back in weight so the list reads as a single focused row. */
export default function MenuSheet({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[820] bg-soot-3"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.7, ease: EASE } }}
          exit={{ clipPath: 'inset(100% 0 0 0)', transition: { duration: 0.55, ease: EASE } }}
          role="dialog" aria-modal="true" aria-label="Menu"
        >
          <div className="flex h-full flex-col justify-between px-[clamp(20px,4.6vw,76px)] py-[clamp(24px,5vh,56px)]">
            <div className="flex items-start justify-between">
              <span className="lab">Hearth — Nairobi</span>
              <button onClick={onClose}
                className="group flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-bone/60 hover:text-bone">
                Close
                <span className="grid h-7 w-7 place-items-center border border-bone/25 text-[13px] transition-transform duration-500 group-hover:rotate-90">×</span>
              </button>
            </div>

            <ul className="group/list my-auto">
              {ITEMS.map(([id, label, n], i) => (
                <li key={id} className="overflow-hidden border-b border-bone/10">
                  <motion.a
                    href={`#${id}`} onClick={onClose}
                    initial={{ y: '110%' }}
                    animate={{ y: 0, transition: { duration: 0.85, ease: EASE, delay: 0.18 + i * 0.06 } }}
                    className="flex items-baseline justify-between py-[clamp(8px,1.6vh,18px)] disp text-[clamp(44px,9vw,132px)] text-bone/85 transition-all duration-500 hover:text-bone hover:pl-[clamp(10px,2vw,34px)] group-hover/list:opacity-40 hover:!opacity-100"
                  >
                    {label}
                    <sup className="num font-mono text-[11px] font-normal text-smoke">{n}</sup>
                  </motion.a>
                </li>
              ))}
            </ul>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <span className="lab">Showroom</span>
                <p className="mt-2 text-[13px] leading-relaxed text-bone/65">
                  Ngong Road, Nairobi.<br />Open Mon–Sat, 09:00–18:00. The kettle is real.
                </p>
              </div>
              <div>
                <span className="lab">Talk to a human</span>
                <p className="num mt-2 font-mono text-[13px] leading-relaxed text-bone/65">
                  +254 700 000 000<br />karibu@hearth.co.ke
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
