import { useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { PRODUCTS, FILTERS } from '../data/products.js'
import { src, srcSet } from '../data/media.js'
import { Lines, Rise } from './Type.jsx'
import Cooker from './Cooker.jsx'
import { EASE, viewport } from '../lib/motion.js'
import { KES, cx } from '../lib/utils.js'

/* ============================================================================
   CHAPTER 02 — THE EDIT
   ----------------------------------------------------------------------------
   Seven cookers. Each card carries two images: the drawn elevation, which is
   how the range reads as one family, and a real photograph of a kitchen it
   would live in, which wipes up from below on hover while the elevation lifts
   clear of it. Filtering re-flows the grid with a layout animation instead of
   dimming rows out.
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
        <Rise i={2} className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button key={f.f} onClick={() => setFilter(f.f)}
              className={cx(
                'group relative overflow-hidden border px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300',
                filter === f.f ? 'border-bone bg-bone text-soot' : 'border-bone/22 text-bone/70 hover:border-bone/60'
              )}>
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </Rise>
      </div>

      <LayoutGroup>
        <motion.div layout
          className="mt-[clamp(38px,6vh,80px)] grid gap-x-[clamp(14px,2vw,34px)] gap-y-[clamp(34px,5vh,68px)] sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => <Card key={p.id} p={p} i={i} onAdd={onAdd} />)}
          </AnimatePresence>

          <motion.div layout
            className="flex flex-col justify-end border-t border-bone/14 pt-6 sm:col-span-2 lg:col-span-1">
            <p className="disp text-[clamp(22px,2.3vw,34px)] leading-[0.98] text-bone">
              Seven cookers. One idea:<br />the heat should do what<br />your hand just asked it to.
            </p>
            <span className="hand mt-5">Photographed in Nairobi, dry season.</span>
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
      data-cur="Add"
    >
      {/* --- stage -------------------------------------------------------- */}
      <div className="relative aspect-[4/5] overflow-hidden border border-bone/10 bg-soot">
        {/* the real kitchen, wiped up from below */}
        <div className="absolute inset-0 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-[900ms] ease-[cubic-bezier(.16,.84,.24,1)] group-hover:[clip-path:inset(0_0_0_0)]">
          <img
            src={src(p.shot, 900)}
            srcSet={srcSet(p.shot, [480, 900, 1200])}
            sizes="(max-width: 640px) 100vw, 33vw"
            alt={p.shot.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.16,.84,.24,1)] group-hover:scale-105"
            style={{ filter: 'saturate(0.72) contrast(1.1) brightness(0.52) sepia(0.1)', transform: 'scale(1.14)' }}
          />
        </div>

        <span className="num absolute left-3.5 top-3 z-20 font-mono text-[10px] text-bone/45">{p.no}</span>
        {p.tag && (
          <span className="absolute right-3 top-3 z-20 border border-bone/25 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-bone/75">
            {p.tag}
          </span>
        )}

        {/* the elevation, lifting clear of the photograph */}
        <div className="absolute inset-0 z-10 grid place-items-end justify-center pb-[6%] transition-transform duration-[900ms] ease-[cubic-bezier(.16,.84,.24,1)] group-hover:-translate-y-[3%]">
          <Cooker cfg={p.svg} style={{ width: `${Math.round(p.svg.size * 78)}%` }} />
        </div>
      </div>

      {/* --- meta ---------------------------------------------------------- */}
      <div className="mt-4 flex items-start justify-between gap-5 border-t border-bone/14 pt-3.5">
        <div>
          <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-bone">{p.name}</h3>
          <div className="mt-1 text-[11px] text-smoke">{p.spec}</div>
        </div>
        <div className="shrink-0 text-right">
          <span className="block text-[9px] uppercase tracking-[0.2em] text-smoke">KES</span>
          <span className="num font-mono text-[17px] text-bone">{p.price.toLocaleString('en-KE')}</span>
        </div>
      </div>

      {/* --- buy ----------------------------------------------------------- */}
      <div className="mt-3.5 flex gap-2">
        <button onClick={add}
          className="group/b relative flex-1 overflow-hidden border border-bone/25 px-4 py-3 text-left">
          <span className="absolute inset-0 -translate-x-full bg-bone transition-transform duration-[600ms] ease-[cubic-bezier(.16,.84,.24,1)] group-hover/b:translate-x-0"
            style={added ? { transform: 'translateX(0)' } : undefined} />
          <span className={cx(
            'relative z-10 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500',
            added ? 'text-soot' : 'text-bone group-hover/b:text-soot'
          )}>
            {added ? 'In the cart' : 'Add to cart'}
            <span className="text-[13px]">{added ? '✓' : '+'}</span>
          </span>
        </button>
        <div className="flex items-center border border-bone/25">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Fewer"
            className="h-full px-3 text-bone/60 transition-colors hover:text-bone">−</button>
          <var className="num w-6 text-center font-mono text-[12px] not-italic text-bone">{qty}</var>
          <button onClick={() => setQty(q => Math.min(9, q + 1))} aria-label="More"
            className="h-full px-3 text-bone/60 transition-colors hover:text-bone">+</button>
        </div>
      </div>
    </motion.article>
  )
}
