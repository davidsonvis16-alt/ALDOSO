import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Fascia, Grid, Ring } from './Drawn.jsx'
import { Rise } from './Type.jsx'
import { EASE, viewport } from '../lib/motion.js'

/* ============================================================================
   CHAPTER 03 — THE TABLE
   ----------------------------------------------------------------------------
   A band of three drawn rings runs behind the headline and creeps sideways as
   you scroll, so what sits behind the letterforms keeps changing. Two of the
   headline's lines are outlined rather than filled, which lets the band read
   straight through them.
   ========================================================================== */

/* the band: the same burner three times, at three settings — full, simmer, off */
const BAND = [0.9, 0.3, 0]

export default function Story() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bandX = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const bandScale = useTransform(scrollYProgress, [0, 1], [1.2, 1.05])

  return (
    <section id="story" ref={ref} className="relative overflow-hidden bg-soot-3 py-[clamp(80px,14vh,180px)]">
      {/* --- the band ------------------------------------------------------ */}
      <motion.div
        aria-hidden="true"
        style={{ x: reduce ? 0 : bandX, scale: reduce ? 1.05 : bandScale }}
        className="absolute inset-0 grid grid-cols-3"
      >
        {BAND.map((lit, i) => (
          <div key={i} className="relative overflow-hidden">
            <Grid step={32} opacity={0.8} />
            <div className="absolute inset-0 grid place-items-center p-[6%] opacity-70">
              <Ring lit={lit} />
            </div>
          </div>
        ))}
      </motion.div>
      {/* flat ramp so the edges read as one continuous band, not three tiles */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#070605_0%,rgba(7,6,5,.28)_26%,rgba(7,6,5,.28)_74%,#070605_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-soot-3/45" />

      {/* --- knocked-out headline ------------------------------------------ */}
      <div className="relative px-[clamp(20px,4.6vw,76px)] sm:pl-[calc(var(--spine-w)+clamp(20px,4.6vw,76px))]">
        <h2 className="text-[clamp(50px,11.2vw,190px)] font-extrabold uppercase leading-[0.86] tracking-[-0.035em]"
          style={{ fontVariationSettings: '"wdth" 112' }}>
          {['FOR THE', 'PEOPLE', 'AROUND', 'THE TABLE.'].map((w, i) => (
            <span key={w} className="block overflow-hidden">
              <motion.b
                initial={{ y: '110%' }} whileInView={{ y: 0 }} viewport={viewport}
                transition={{ duration: 1.05, ease: EASE, delay: i * 0.08 }}
                className="block font-extrabold"
                style={i === 1 || i === 2 ? {
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(239,231,218,.55)',
                } : { color: '#EFE7DA' }}
              >
                {w}
              </motion.b>
            </span>
          ))}
        </h2>

        <div className="mt-[clamp(30px,6vh,72px)] grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Rise>
            <p className="max-w-[52ch] text-[clamp(14px,1.3vw,17px)] leading-relaxed text-bone/80">
              <b className="text-bone">Twelve people. One cooker. Nobody sitting where they were told to.</b>
              <br /><br />
              An Aldosi cooker spends its life in the middle of an argument about football, a cousin
              arriving late, and a pot that has to stay warm until he does. We build for that
              room — not for the one in the brochure.
            </p>
          </Rise>
          <Rise i={1} className="grid grid-cols-2 gap-4 self-end">
            {[['Plate 08', 'The ring, as it sits', <Ring key="r" lit={0.55} />],
              ['Plate 09', 'Fascia, four up', <Fascia key="f" n={4} level={2} />]].map(([n, cap, art]) => (
              <figure key={n} className="m-0">
                <div className="relative aspect-[4/5] overflow-hidden bg-soot-2">
                  <Grid step={24} />
                  <div className="absolute inset-0 grid place-items-center p-[10%]">{art}</div>
                </div>
                <figcaption className="mt-2.5 flex items-baseline justify-between gap-3 border-t border-bone/14 pt-2 text-[10px] uppercase tracking-[0.16em] text-bone/55">
                  <span>{cap}</span>
                  <b className="num font-mono normal-case tracking-normal text-bone/40">{n}</b>
                </figcaption>
              </figure>
            ))}
          </Rise>
        </div>
      </div>
    </section>
  )
}
