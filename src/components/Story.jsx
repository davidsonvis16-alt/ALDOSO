import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { SHOTS, src, srcSet } from '../data/media.js'
import { Rise } from './Type.jsx'
import { EASE, viewport } from '../lib/motion.js'

/* ============================================================================
   CHAPTER 03 — THE TABLE
   ----------------------------------------------------------------------------
   Three photographs run as a single band behind the headline, and the type
   is knocked out of them: the words are transparent, the picture shows
   through the letterforms. As you scroll the band creeps sideways, so the
   image inside the type keeps changing.

   Browsers without background-clip:text fall back to solid bone type on a
   dimmed band, which is still the same layout.
   ========================================================================== */

const BAND = [SHOTS.prep, SHOTS.table, SHOTS.stall]

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
        {BAND.map((s, i) => (
          <div key={i} className="relative overflow-hidden">
            <img src={src(s, 1200)} srcSet={srcSet(s, [560, 900, 1400])} sizes="34vw" alt=""
              loading="lazy"
              className="h-full w-full object-cover"
              style={{ filter: 'saturate(0.7) contrast(1.12) brightness(0.72) sepia(0.14)' }} />
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
              A Hearth spends its life in the middle of an argument about football, a cousin
              arriving late, and a pot that has to stay warm until he does. We build for that
              room — not for the one in the brochure.
            </p>
          </Rise>
          <Rise i={1} className="grid grid-cols-2 gap-4 self-end">
            {[[SHOTS.table, 'Sunday, Kayole'], [SHOTS.stall, 'Chapati, last one']].map(([s, cap]) => (
              <figure key={cap} className="m-0">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={src(s, 800)} srcSet={srcSet(s, [480, 800, 1100])} sizes="25vw"
                    alt={s.alt} loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ filter: 'saturate(0.84) contrast(1.05) brightness(0.9)' }} />
                </div>
                <figcaption className="mt-2.5 border-t border-bone/14 pt-2 text-[10px] uppercase tracking-[0.16em] text-bone/55">
                  {cap}
                </figcaption>
              </figure>
            ))}
          </Rise>
        </div>
      </div>
    </section>
  )
}
