import { motion } from 'framer-motion'
import { CREDITS } from '../data/media.js'
import { Rise } from './Type.jsx'
import { EASE, viewport } from '../lib/motion.js'

const COLS = [
  ['Shop', ['Freestanding cookers', 'Tabletop hobs', 'Gas + electric', 'Spares & burners'], '#appliances'],
  ['Support', ['Installation & first light', 'Warranty — 24 months', 'Book a technician', '+254 700 000 000'], '#top'],
  ['Find us', ['Showroom — Ngong Road', 'Nairobi, Kenya', 'Mon–Sat, 09:00–18:00', 'Stockists, 47 counties'], null],
  ['Follow', ['Instagram', 'TikTok', 'Facebook', 'YouTube'], '#top'],
]

export default function Footer({ count, onCart }) {
  return (
    <footer className="border-t border-bone/12 bg-soot-3 px-[clamp(20px,4.6vw,76px)] pb-8 pt-[clamp(54px,8vh,100px)] sm:pl-[calc(var(--spine-w)+clamp(20px,4.6vw,76px))]">
      <Rise>
        <p className="disp text-[clamp(38px,6vw,96px)] leading-[0.9] text-bone">
          Cook well. <em className="italic text-clay">Live well.</em>
        </p>
      </Rise>

      <div className="mt-[clamp(38px,6vh,80px)] grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {COLS.map(([h, items, href], ci) => (
          <Rise key={h} i={ci}>
            <h4 className="lab">{h}</h4>
            <ul className="mt-4 space-y-2.5">
              {items.map(it => (
                <li key={it}>
                  <a href={href || undefined}
                    className="group inline-flex items-center gap-2 text-[13px] text-bone/65 transition-colors hover:text-bone">
                    <span className="relative">
                      {it}
                      <i className="absolute -bottom-0.5 left-0 block h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                    </span>
                  </a>
                </li>
              ))}
              {ci === 3 && (
                <li>
                  <button onClick={onCart} className="text-[13px] text-bone/65 transition-colors hover:text-bone">
                    Your cart — <span className="num font-mono">{count === 1 ? '1 item' : `${count} items`}</span>
                  </button>
                </li>
              )}
            </ul>
          </Rise>
        ))}
      </div>

      {/* --- the wordmark, widening as it comes into view ------------------- */}
      <motion.div
        aria-hidden="true"
        className="mt-[clamp(44px,8vh,110px)] overflow-hidden"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewport}>
        <motion.div
          className="w-full text-center font-extrabold uppercase leading-[0.78] text-bone"
          style={{ fontSize: 'clamp(58px,17vw,260px)', letterSpacing: '-0.035em' }}
          initial={{ fontVariationSettings: '"wdth" 62' }}
          whileInView={{ fontVariationSettings: '"wdth" 125' }}
          viewport={viewport}
          transition={{ duration: 1.8, ease: EASE }}>
          HEARTH
        </motion.div>
      </motion.div>

      {/* --- photo credits: the licence asks, and it belongs here anyway ---- */}
      <div className="mt-10 border-t border-bone/12 pt-6">
        <h4 className="lab">Photography</h4>
        <p className="mt-3 max-w-[92ch] text-[11.5px] leading-relaxed text-smoke">
          {CREDITS.map((c, i) => (
            <span key={c.handle}>
              <a href={`https://unsplash.com/@${c.handle}`} target="_blank" rel="noreferrer"
                className="text-bone/70 underline-offset-4 transition-colors hover:text-bone hover:underline">
                {c.by}
              </a>{i < CREDITS.length - 1 ? ' · ' : ''}
            </span>
          ))}
          <span className="block mt-2 text-smoke/70">
            All photographs via Unsplash, used under the Unsplash licence. Cooker elevations drawn in-house.
          </span>
        </p>
      </div>

      <div className="mt-7 flex flex-wrap items-baseline justify-between gap-4 border-t border-bone/12 pt-5 text-[11px] text-smoke">
        <span>© 2026 Hearth Appliances Ltd — Nairobi</span>
        <span>Prices in <b className="text-bone/80">KES</b>, VAT inclusive</span>
        <span>Demo build · payments and sign-in disabled by design</span>
      </div>
    </footer>
  )
}
