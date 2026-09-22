import { useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { PRODUCTS, FILTERS } from '../data/products.js'
import { Lines, Rise } from './Type.jsx'
import Cooker from './Cooker.jsx'
import { Grid } from './Drawn.jsx'
import { EASE, viewport } from '../lib/motion.js'
import { KES, cx } from '../lib/utils.js'

/* ============================================================================
   CHAPTER 02 — THE EDIT
   ----------------------------------------------------------------------------
   Seven cookers, one drawing each, so the range reads as one family on one
   shelf. On hover the measured ground wipes up from below and the elevation
   lifts clear of it — the way a part is lifted off its drawing. Filtering
   re-flows the grid with a layout animation instead of dimming rows out.
   ========================================================================== */

export default function Edit({ onAdd }) {
  const [filter, setFilter] = useState('all')
  const list = PRODUCTS.filter(p => filter === 'all' || p.kind.includes(filter))

  return (
    <section id="appliances" className="border-t border-bone/10 bg-soot-2 px-[clamp(20px,4.6vw,76px)] py-[clamp(70px,11vh,140px)] sm:pl-[calc(var(--spine-w)+clamp(20px,4.6vw,76px))]">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <Rise><p className="lab">Chapter 02 — Seven objects</p></Rise>
          <Lines as="h2" className="disp mt-3 text-[clamp(44px,7.4vw,124px)] text-bone">
            {[
              <b key="a" className="font-normal">THE COOKER</b>,
              <b key="b" className="font-normal"><em className="italic text-clay">edit.</em></b>,
            ]}
          </Lines>
        </div>
        <Rise i={2} className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
          {FILTERS.map(f => (
            <button key={f.f} onClick={() => setFilter(f.f)}
              className={cx(
                'group relative overflow-hidden border px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 sm:py-2.5 sm:text-left',
                filter === f.f ? 'border-bone bg-bone text-soot' : 'border-bone/22 text-bone/70 hover:border-bone/60'
              )}>
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </Rise>
      </div>

      <LayoutGroup>
        <motion.div layout
          className="mt-[clamp(38px,6vh,80px)] grid grid-cols-2 gap-x-[clamp(12px,2vw,34px)] gap-y-[clamp(30px,5vh,68px)] lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => <Card key={p.id} p={p} i={i} onAdd={onAdd} />)}
          </AnimatePresence>

          <motion.div layout
            className="col-span-2 flex flex-col justify-end border-t border-bone/14 pt-6 lg:col-span-1">
            <p className="disp text-[clamp(22px,2.3vw,34px)] leading-[0.98] text-bone">
              Seven cookers. One idea:<br />the heat should do what<br />your hand just asked it to.
            </p>
            <span className="hand mt-5">Drawn in Nairobi, dry season.</span>
          </motion.div>
        </motion.div>
      </LayoutGroup>
    </section>
  )
}

function Card({ p, i, onAdd }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const add = () => {
    onAdd(p, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1900)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18, transition: { duration: 0.32, ease: EASE } }}
      viewport={viewport}
      transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.07 }}
      className="group flex flex-col"
    >
      {/* --- stage -------------------------------------------------------- */}
      <div className="relative aspect-[4/5] overflow-hidden border border-bone/10 bg-soot">
        {/* the measured ground, wiped up from below */}
        <div className="absolute inset-0 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-[900ms] ease-[cubic-bezier(.16,.84,.24,1)] group-hover:[clip-path:inset(0_0_0_0)]">
          <div className="absolute inset-0 bg-soot-2" />
          <Grid step={22} />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-soot-2 to-transparent" />
        </div>

        <span className="num absolute left-3.5 top-3 z-20 font-mono text-[10px] text-bone/45">{p.no}</span>
        {p.tag && (
          <span className="absolute right-3 top-3 z-20 border border-bone/25 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-bone/75">
            {p.tag}
          </span>
        )}

        {/* the elevation, lifting clear of the ground */}
        <div className="absolute inset-0 z-10 grid place-items-end justify-center pb-[6%] transition-transform duration-[900ms] ease-[cubic-bezier(.16,.84,.24,1)] group-hover:-translate-y-[3%]">
          <Cooker cfg={p.svg} style={{ width: `${Math.round(p.svg.size * 78)}%` }} />
        </div>
      </div>

      {/* --- meta ---------------------------------------------------------- */}
      <div className="mt-4 flex flex-col gap-1.5 border-t border-bone/14 pt-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
        <div>
          <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-bone sm:text-[15px]">{p.name}</h3>
          <div className="mt-1 text-[11px] text-smoke">{p.spec}</div>
        </div>
        <div className="flex items-baseline justify-between gap-2 sm:block sm:shrink-0 sm:text-right">
          <span className="text-[9px] uppercase tracking-[0.2em] text-smoke sm:block">KES</span>
          <span className="num font-mono text-[15px] text-bone sm:text-[17px]">{p.price.toLocaleString('en-KE')}</span>
        </div>
      </div>

      {/* --- buy ----------------------------------------------------------- */}
      <div className="mt-3.5 flex gap-2">
        <button onClick={add}
          className="group/b relative flex-1 overflow-hidden border border-bone/25 px-3 py-3.5 text-left sm:px-4 sm:py-3">
          <span className="absolute inset-0 -translate-x-full bg-bone transition-transform duration-[600ms] ease-[cubic-bezier(.16,.84,.24,1)] group-hover/b:translate-x-0"
            style={added ? { transform: 'translateX(0)' } : undefined} />
          <span className={cx(
            'relative z-10 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500',
            added ? 'text-soot' : 'text-bone group-hover/b:text-soot'
          )}>
            <span className="sm:hidden">{added ? 'In cart' : 'Add'}</span>
            <span className="hidden sm:inline">{added ? 'In the cart' : 'Add to cart'}</span>
            <span className="text-[13px]">{added ? '✓' : '+'}</span>
          </span>
        </button>
        <div className="flex items-center border border-bone/25">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Fewer"
            className="h-full px-2.5 text-bone/60 transition-colors hover:text-bone sm:px-3">−</button>
          <var className="num w-5 text-center font-mono text-[12px] not-italic text-bone sm:w-6">{qty}</var>
          <button onClick={() => setQty(q => Math.min(9, q + 1))} aria-label="More"
            className="h-full px-2.5 text-bone/60 transition-colors hover:text-bone sm:px-3">+</button>
        </div>
      </div>
    </motion.article>
  )
}
