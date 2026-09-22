import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { SHOTS, src, srcSet } from '../data/media.js'
import { FACTS, COUNTIES } from '../data/products.js'
import { Lines, Rise } from './Type.jsx'
import Shot from './Shot.jsx'
import { EASE, viewport } from '../lib/motion.js'

/* ============================================================================
   CHAPTER 05 — WHERE IT LIVES
   ----------------------------------------------------------------------------
   Two real photographs of Nairobi doing exactly what the product is for, a
   set of counted facts, and a marquee of the counties the cookers actually
   reach. The marquee is a continuous transform, not a stepped animation, so
   it never judders at the seam.
   ========================================================================== */
export default function Kenya() {
  return (
    <section id="kenya" className="border-t border-bone/10 bg-soot-2 pt-[clamp(70px,11vh,140px)]">
      <div className="px-[clamp(20px,4.6vw,76px)] sm:pl-[calc(var(--spine-w)+clamp(20px,4.6vw,76px))]">
        <Rise><p className="lab">Chapter 05 — Where it lives</p></Rise>
        <div className="mt-3 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <Lines as="h2" className="disp text-[clamp(44px,7.4vw,124px)] text-bone">
            {[
              <b key="a" className="font-normal">MADE FOR</b>,
              <b key="b" className="font-normal"><em className="italic text-clay">Kenyan homes.</em></b>,
            ]}
          </Lines>
          <Rise i={2}>
            <p className="max-w-[44ch] text-[13.5px] leading-relaxed text-bone/65">
              Designed in Nairobi against real constraints: a 13kg cylinder in the corner,
              power that comes and goes, and a kitchen that is also the laundry, the homework
              desk and the place people stand.
            </p>
          </Rise>
        </div>

        <div className="mt-[clamp(30px,5vh,62px)] grid gap-[clamp(14px,2vw,28px)] sm:grid-cols-[1.6fr_1fr]">
          <Shot shot={SHOTS.vendor} drift={7} grade="full" className="aspect-[16/10]"
            sizes="(max-width: 640px) 100vw, 60vw">
            <span className="absolute bottom-3.5 left-4 z-10 text-[9px] uppercase tracking-[0.2em] text-bone/85">
              Kilimani, Nairobi — 16:52
            </span>
            <span className="absolute right-4 top-4 z-10 text-[9px] uppercase tracking-[0.2em] text-bone/75">
              13 kg cylinder · mains optional
            </span>
          </Shot>
          <Shot shot={SHOTS.market} drift={10} grade="warm" className="aspect-[16/10] sm:aspect-auto"
            sizes="(max-width: 640px) 100vw, 36vw" />
        </div>

        {/* --- counted facts ------------------------------------------------ */}
        <div className="mt-[clamp(32px,5vh,64px)] grid gap-x-8 gap-y-9 border-t border-bone/14 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => <Fact key={f.label} {...f} i={i} />)}
        </div>
      </div>

      <Marquee />
    </section>
  )
}

function Fact({ n, label, i }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const [v, setV] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) { setV(n); return }
    const t0 = performance.now(), DUR = 1500
    let raf
    const step = t => {
      const k = Math.min(1, (t - t0) / DUR)
      setV(Math.round(n * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, n, reduce])

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport}
      transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}>
      <b className="num block font-mono text-[clamp(38px,5.4vw,76px)] font-medium leading-none tracking-[-0.03em] text-bone">
        {v.toLocaleString('en-KE')}
      </b>
      <span className="mt-2.5 block max-w-[24ch] text-[11.5px] leading-snug text-smoke-2">{label}</span>
    </motion.div>
  )
}

function Marquee() {
  const reduce = useReducedMotion()
  const row = [...COUNTIES, ...COUNTIES]
  return (
    <div className="mt-[clamp(44px,7vh,96px)] overflow-hidden border-y border-bone/12 py-5">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap"
        animate={reduce ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: 46, repeat: Infinity, ease: 'linear' }}
      >
        {row.map((c, i) => (
          <span key={i} className="flex items-center gap-10 text-[clamp(15px,1.7vw,24px)] font-semibold uppercase tracking-[0.06em] text-bone/35"
            style={{ fontVariationSettings: '"wdth" 96' }}>
            {c}<i className="block h-3 w-px bg-bone/25" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
