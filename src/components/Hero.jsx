import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Grid, Ring } from './Drawn.jsx'
import { Lines, Rise } from './Type.jsx'
import { EASE } from '../lib/motion.js'

/* ============================================================================
   HERO
   ----------------------------------------------------------------------------
   The plate is a drawing, not a photograph: a burner seen from above, lit, on
   a measured ground. It is not decoration — the blue ring is the argument the
   whole brand makes, and it is drawn so it reads the same on every screen.

   Three things move, all tied to the same scroll:
     · the plate itself contracts from full bleed into a framed rectangle,
     · the drawing inside drifts up slower than the frame,
     · the headline leaves upward while the strapline holds a beat longer.
   Nothing fades on its own. Nothing pulses.
   ========================================================================== */
export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const inset = useTransform(scrollYProgress, [0, 1], ['0%', '7%'])
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.22])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-42%'])
  const metaY = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])

  const still = v => (reduce ? undefined : v)

  return (
    <section id="hero" ref={ref} className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      {/* --- the plate ---------------------------------------------------- */}
      <motion.div
        className="absolute inset-0 overflow-hidden bg-soot-2"
        style={{ left: still(inset), right: still(inset), bottom: still(inset) }}
      >
        <Grid step={34} className="opacity-90" />
        <motion.div
          className="absolute -right-[12%] -top-[18%] w-[92vh] max-w-[1100px]"
          style={{ y: still(imgY), scale: still(imgScale) }}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1.06, opacity: 1 }}
          transition={{ duration: 2.1, ease: EASE, delay: 0.25 }}
        >
          <Ring lit={0.92} label="A gas burner, lit, seen from above" />
        </motion.div>

        {/* the measured callout, the way the drawing would be dimensioned */}
        <svg aria-hidden="true" className="absolute inset-0 hidden h-full w-full lg:block">
          <line x1="0" x2="100%" y1="62%" y2="62%" stroke="rgba(239,231,218,.08)" strokeWidth="1" />
          <line x1="72%" x2="72%" y1="0" y2="100%" stroke="rgba(239,231,218,.08)" strokeWidth="1" />
        </svg>

        {/* legibility: a flat gradient ramp, not a vignette bloom */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-soot-2 via-soot-2/30 to-soot-2/55" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-soot-2/75 via-transparent to-transparent" />
      </motion.div>

      {/* --- handwriting, top right --------------------------------------- */}
      <Rise i={4} className="absolute right-[clamp(18px,5vw,90px)] top-[clamp(88px,13vh,150px)] hidden text-right lg:block">
        <span className="hand block">Built for real kitchens.</span>
        <svg viewBox="0 0 80 26" aria-hidden="true" className="ml-auto mt-1 block w-[80px] stroke-clay fill-none">
          <path d="M3 4c14 12 42 19 74 5" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M69 3c5 4 8 6 8 6s-4 1-9 4" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </Rise>

      {/* --- copy ---------------------------------------------------------- */}
      <motion.div
        style={{ y: still(copyY) }}
        className="relative flex h-full flex-col justify-end px-[clamp(20px,4.6vw,76px)] pb-[clamp(30px,7vh,76px)] sm:pl-[calc(var(--spine-w)+clamp(20px,4.6vw,76px))]"
      >
        <Rise className="lab" style={{ color: 'rgba(239,231,218,.62)' }}>
          <span className="text-bone/60">Aldosi Merchants &nbsp;/&nbsp; Nairobi &nbsp;/&nbsp; Est. 2014</span>
        </Rise>

        <Lines as="h1" className="disp mt-3 text-[clamp(62px,13.5vw,224px)] text-bone" delay={0.15}>
          {[
            <b key="a" className="font-normal">MORE THAN</b>,
            <b key="b" className="font-normal"><em className="font-normal not-italic italic text-clay">a cooker.</em></b>,
          ]}
        </Lines>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-[46ch]">
            <Rise i={2}>
              <p className="text-[clamp(14px,1.35vw,17px)] leading-relaxed text-bone/72">
                Made for the meals that bring everyone home — the Sunday pilau, the 6am chai,
                the pot nobody admits they finished.
              </p>
            </Rise>
            <Rise i={3} className="mt-6">
              <a href="#appliances"
                className="group inline-flex items-center gap-4 overflow-hidden border border-bone/30 px-6 py-3.5">
                <span className="absolute" />
                <span className="relative z-10 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 group-hover:text-soot">
                  Explore Aldosi Merchants
                </span>
                <span className="relative z-10 text-[13px] transition-transform duration-500 group-hover:translate-x-1.5 group-hover:text-soot">→</span>
                <span className="absolute inset-0 -translate-x-full bg-bone transition-transform duration-[650ms] ease-[cubic-bezier(.16,.84,.24,1)] group-hover:translate-x-0" />
              </a>
            </Rise>
          </div>

          {/* --- the strip of readings, like a light meter -------------------- */}
          <motion.div style={{ y: still(metaY) }}
            className="grid w-full max-w-[520px] grid-cols-3 gap-x-3 gap-y-2.5 border-t border-bone/14 pt-3 sm:gap-x-6 sm:gap-y-1.5 lg:w-auto">
            {[['16:40', 'EAT'], ['Kilimani', 'Nairobi'], ['Gas ring', '2.2 kPa'],
              ['Sufuria', 'No. 24'], ['Frame', '001'], ['Cylinder', '13 kg']].map(([k, v], i) => (
              <Rise key={k} i={4 + i * 0.3}>
                <div className="flex flex-col gap-0.5 text-[9px] uppercase tracking-[0.1em] text-bone/45 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3 sm:text-[10px] sm:tracking-[0.16em]">
                  <span className="truncate">{k}</span><b className="num font-mono font-medium text-bone/85">{v}</b>
                </div>
              </Rise>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* --- scroll hint: a hairline that travels, not a bouncing arrow ----- */}
      <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-bone/40 md:flex">
        <span className="relative block h-px w-14 overflow-hidden bg-bone/20">
          <motion.i className="absolute inset-y-0 left-0 block w-1/3 bg-bone/80"
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: EASE }} />
        </span>
        Scroll — the pot is on
      </div>
    </section>
  )
}
