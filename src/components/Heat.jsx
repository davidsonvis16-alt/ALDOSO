import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Fascia, Grid, Pot, Ring } from './Drawn.jsx'
import Cooker from './Cooker.jsx'
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

   Reduced motion gets the same plates as an ordinary stacked grid.
   ========================================================================== */

const RAIL = [
  { key: 'ring',   n: 'Plate 01', cap: 'The ring, 4.2 kW',          w: 'w-[74vw] sm:w-[40vw]', h: 'h-[44vh] sm:h-[54vh]', drift: -30, pad: '12%' },
  { key: 'cooker', n: 'Plate 02', cap: 'The 60 × 60, black enamel', w: 'w-[62vw] sm:w-[26vw]', h: 'h-[52vh] sm:h-[68vh]', drift: 42,  pad: '8%' },
  { pull: true },
  { key: 'fascia', n: 'Plate 03', cap: 'Fascia, as tooled',         w: 'w-[70vw] sm:w-[34vw]', h: 'h-[34vh] sm:h-[42vh]', drift: -18, pad: '9%' },
  { key: 'low',    n: 'Plate 04', cap: 'The same ring, barely on',  w: 'w-[58vw] sm:w-[22vw]', h: 'h-[40vh] sm:h-[44vh]', drift: 34,  pad: '10%' },
  { key: 'pot',    n: 'Plate 05', cap: 'Githeri, hour two',         w: 'w-[76vw] sm:w-[38vw]', h: 'h-[38vh] sm:h-[46vh]', drift: -26, pad: '9%' },
]

/* each plate's subject, drawn — see components/Drawn.jsx */
const SUBJECT = {
  ring: <Ring lit={0.95} label="A gas burner at full, seen from above" />,
  low: <Ring lit={0.18} label="The same burner turned down to a simmer" />,
  fascia: <Fascia n={5} level={4} />,
  pot: <Pot />,
  cooker: <Cooker className="w-[70%]" cfg={{ type: 'free', finish: 'black', w: 6, burners: 4, electric: 1, size: 1 }} />,
}

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
        <Grid step={26} />
        <motion.div
          className="absolute inset-0 grid place-items-center"
          style={{ y: reduce ? 0 : y, padding: item.pad }}
        >
          {SUBJECT[item.key]}
        </motion.div>
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
          Not in the plating. Not in the styling. In the eleven seconds between
          the knob turning and the blue catching.
        </p>
      </Rise>
    </div>
  )
}
