import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { SHOTS, src, srcSet } from '../data/media.js'
import { Lines, Rise } from './Type.jsx'
import { EASE } from '../lib/motion.js'

/* ============================================================================
   CHAPTER 01 — HEAT
   ----------------------------------------------------------------------------
   A pinned rail. The section holds still while the plates travel sideways
   past it, each one drifting at its own rate so the row has depth rather
   than sliding as a single sheet.

   The travel is measured off the row itself rather than written down as a
   vw figure, because the plates are much wider proportionally on a phone
   than on a laptop — a fixed distance runs out early there and leaves the
   last plates parked off-screen. Measuring means the whole row clears the
   viewport at the same pace on any width.

   Reduced motion gets the same photographs as an ordinary stacked grid.
   ========================================================================== */

const RAIL = [
  { shot: SHOTS.ring,    n: '01', cap: 'The ring, 4.2 kW',            w: 'w-[74vw] sm:w-[40vw]', h: 'h-[44vh] sm:h-[54vh]', drift: -30, grade: 'cool' },
  { shot: SHOTS.onions,  n: '02', cap: 'Onions, cut small — as taught', w: 'w-[62vw] sm:w-[26vw]', h: 'h-[52vh] sm:h-[68vh]', drift: 42 },
  { pull: true },
  { shot: SHOTS.simmer,  n: '03', cap: 'Githeri, hour two',            w: 'w-[70vw] sm:w-[34vw]', h: 'h-[38vh] sm:h-[46vh]', drift: -18 },
  { shot: SHOTS.dials,   n: '04', cap: 'Knob, brushed steel',          w: 'w-[58vw] sm:w-[22vw]', h: 'h-[48vh] sm:h-[62vh]', drift: 34 },
  { shot: SHOTS.griddle, n: '05', cap: 'Chapati, second side',         w: 'w-[76vw] sm:w-[38vw]', h: 'h-[46vh] sm:h-[56vh]', drift: -26 },
]

function RailPlate({ item, progress, reduce }) {
  const y = useTransform(progress, [0, 1], [item.drift, -item.drift])
  if (item.pull) {
    return (
      <div className="flex w-[70vw] shrink-0 flex-col justify-center sm:w-[30vw]">
        <p className="disp text-[clamp(26px,3.1vw,50px)] leading-[0.94] text-bone">
          We didn’t design<br />a cooker. We designed<br />
          <em className="italic text-clay">the twenty minutes</em><br />before dinner.
        </p>
        <span className="hand mt-6">— the whole brief, honestly</span>
      </div>
    )
  }
  return (
    <figure className={`${item.w} shrink-0`}>
      <div className={`relative ${item.h} overflow-hidden bg-soot-2`}>
        <motion.img
          src={src(item.shot, 1400)}
          srcSet={srcSet(item.shot, [560, 900, 1400])}
          sizes="45vw"
          alt={item.shot.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            y: reduce ? 0 : y,
            scale: 1.16,
            filter: item.grade === 'cool'
              ? 'saturate(0.66) contrast(1.16) brightness(0.8)'
              : 'saturate(0.8) contrast(1.06) brightness(0.84) sepia(0.1)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-soot/25 mix-blend-multiply" />
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-bone/14 pt-2.5">
        <span className="text-[11px] text-smoke-2">{item.cap}</span>
        <b className="num font-mono text-[10px] text-smoke">{item.n}</b>
      </figcaption>
    </figure>
  )
}

/* scroll pixels spent per pixel the row moves — under 1 so the plates still
   outrun the finger slightly, the way the section always read on a laptop */
const PACE = 0.9

export default function Heat() {
  const ref = useRef(null)
  const track = useRef(null)
  const reduce = useReducedMotion()
  const [travel, setTravel] = useState(0)

  useEffect(() => {
    if (reduce) return
    const el = track.current
    if (!el) return
    const measure = () => {
      const frame = ref.current?.clientWidth || window.innerWidth
      setTravel(Math.max(0, Math.round(el.scrollWidth - frame)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [reduce])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])

  if (reduce) {
    return (
      <section id="cook" className="px-[clamp(20px,4.6vw,76px)] py-24 sm:pl-[calc(var(--spine-w)+clamp(20px,4.6vw,76px))]">
        <Head />
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {RAIL.map((it, i) => <RailPlate key={i} item={it} progress={scrollYProgress} reduce />)}
        </div>
      </section>
    )
  }

  return (
    <section id="cook" ref={ref} className="relative"
      style={{ height: `calc(100svh + ${Math.round(travel * PACE)}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="px-[clamp(20px,4.6vw,76px)] sm:pl-[calc(var(--spine-w)+clamp(20px,4.6vw,76px))]">
          <Head />
        </div>
        <motion.div ref={track} style={{ x }}
          className="mt-10 flex w-max items-center gap-[clamp(18px,3vw,54px)] pl-[calc(var(--spine-w)+clamp(20px,4.6vw,76px))] pr-[clamp(20px,4.6vw,76px)] will-change-transform">
          {RAIL.map((it, i) => <RailPlate key={i} item={it} progress={scrollYProgress} reduce={false} />)}
        </motion.div>

        {/* rail progress — a hairline, filled */}
        <div className="mx-[clamp(20px,4.6vw,76px)] mt-8 h-px bg-bone/14 sm:ml-[calc(var(--spine-w)+clamp(20px,4.6vw,76px))]">
          <motion.i className="block h-full origin-left bg-bone/70" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  )
}

function Head() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-8">
      <div>
        <Rise><p className="lab">Chapter 01 — Heat</p></Rise>
        <Lines as="h2" className="disp mt-3 text-[clamp(44px,7.4vw,124px)] text-bone">
          {[
            <b key="a" className="font-normal">GOOD FOOD</b>,
            <b key="b" className="font-normal"><em className="italic text-clay">starts here.</em></b>,
          ]}
        </Lines>
      </div>
      <Rise i={2} className="max-w-[38ch]">
        <p className="text-[13.5px] leading-relaxed text-bone/60">
          Not in the plating. Not in the photograph. In the eleven seconds between
          the knob turning and the blue catching.
        </p>
      </Rise>
    </div>
  )
}
