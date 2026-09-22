import { useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { SHOTS, src, srcSet } from '../data/media.js'
import { LEVELS, SPECS } from '../data/products.js'
import { Lines, Rise } from './Type.jsx'
import { EASE, viewport } from '../lib/motion.js'
import { clamp } from '../lib/utils.js'

/* ============================================================================
   CHAPTER 04 — HOW IT BEHAVES
   ----------------------------------------------------------------------------
   The knob is the page's one real control. Drag it, or use the arrow keys,
   and the photograph behind it changes exposure and crop the way a burner
   actually changes when you open the gas — the frame tightens and the image
   gains contrast. The flame is a photograph, so nothing here needs to glow.
   ========================================================================== */

export default function Mechanics() {
  const [level, setLevel] = useState(3)
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  const k = level / 6

  return (
    <section id="discover" ref={ref}
      className="border-t border-bone/10 px-[clamp(20px,4.6vw,76px)] py-[clamp(70px,11vh,140px)] sm:pl-[calc(var(--spine-w)+clamp(20px,4.6vw,76px))]">
      <Rise><p className="lab">Chapter 04 — How it behaves</p></Rise>
      <Lines as="h2" className="mt-3 text-[clamp(40px,7vw,116px)] font-extrabold uppercase leading-[0.86] tracking-[-0.032em] text-bone">
        {['POWER.', 'PRECISION.', 'SIMPLICITY.']}
      </Lines>

      <div className="mt-[clamp(34px,6vh,74px)] grid gap-[clamp(20px,3vw,46px)] lg:grid-cols-[1.25fr_1fr]">
        {/* --- the burner, responding to the knob -------------------------- */}
        <motion.figure
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
          viewport={viewport}
          transition={{ duration: 1.25, ease: EASE }}
          className="relative m-0 aspect-[16/11] overflow-hidden bg-soot-2"
        >
          <motion.img
            src={src(SHOTS.flameWide, 1600)}
            srcSet={srcSet(SHOTS.flameWide, [700, 1100, 1600, 2100])}
            sizes="(max-width: 1024px) 100vw, 58vw"
            alt={SHOTS.flameWide.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            animate={{
              scale: 1.06 + k * 0.16,
              filter: `saturate(${0.42 + k * 0.62}) contrast(${1.04 + k * 0.3}) brightness(${0.4 + k * 0.72})`,
            }}
            transition={{ duration: 0.85, ease: EASE }}
            style={{ y: reduce ? 0 : imgY }}
          />
          <div className="pointer-events-none absolute inset-0 bg-soot/20 mix-blend-multiply" />

          {/* drawn annotations, the way a parts diagram is labelled */}
          {[
            ['left-[5%] top-[16%]', <>Brass crown — <i className="italic text-flame-hi">one casting</i></>],
            ['right-[5%] top-[36%] text-right', <><i className="italic text-flame-hi">20</i> ports, laser-cut</>],
            ['left-[5%] bottom-[24%]', <>Flame failure device — <i className="italic text-flame-hi">4s</i></>],
            ['right-[5%] bottom-[14%] text-right', <>Output <i className="italic text-flame-hi">4.2 kW</i></>],
          ].map(([pos, body], i) => (
            <motion.span key={i}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewport}
              transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.1 }}
              className={`absolute ${pos} max-w-[42%] text-[10px] uppercase leading-snug tracking-[0.14em] text-bone/80`}
            >
              {body}
            </motion.span>
          ))}
          <span className="absolute bottom-3 left-4 text-[9px] uppercase tracking-[0.2em] text-bone/45">
            Plate 06 — wok ring, full
          </span>
        </motion.figure>

        {/* --- the control column ------------------------------------------ */}
        <div className="flex flex-col gap-[clamp(20px,3vh,38px)]">
          <Rise className="flex items-center gap-6 border border-bone/14 p-5">
            <Knob level={level} setLevel={setLevel} />
            <div className="min-w-0">
              <span className="lab">Try it — drag the knob</span>
              <strong className="mt-1.5 block text-[clamp(19px,2vw,26px)] font-semibold tracking-[-0.01em] text-bone">
                {LEVELS[level][0]}
              </strong>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-smoke-2">{LEVELS[level][1]}</p>
            </div>
          </Rise>

          {SPECS.map((s, i) => (
            <Rise key={s.k} i={i + 1} className="flex gap-5 border-t border-bone/14 pt-5">
              <span className="num shrink-0 font-mono text-[11px] text-smoke">{s.k}</span>
              <div>
                <h3 className="text-[14.5px] font-semibold text-bone">{s.t}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-smoke-2">{s.d}</p>
              </div>
            </Rise>
          ))}

          <Rise i={4} className="relative m-0 aspect-[16/7] overflow-hidden">
            <img src={src(SHOTS.knobRow, 1200)} srcSet={srcSet(SHOTS.knobRow, [560, 900, 1200])}
              sizes="40vw" alt={SHOTS.knobRow.alt} loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: 'grayscale(1) contrast(1.16) brightness(0.72)' }} />
            <span className="absolute bottom-2.5 left-3.5 text-[9px] uppercase tracking-[0.2em] text-bone/70">
              Plate 07 — fascia, as tooled
            </span>
          </Rise>
        </div>
      </div>
    </section>
  )
}

/* --- the knob itself ------------------------------------------------------ */
function Knob({ level, setLevel }) {
  const ref = useRef(null)
  const dragging = useRef(false)

  const fromPointer = useCallback(e => {
    const r = ref.current.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    const deg = clamp(Math.atan2(x, -y) * 180 / Math.PI, -135, 135)
    setLevel(Math.round((deg + 135) / 270 * 6))
  }, [setLevel])

  const deg = -135 + (level / 6) * 270

  return (
    <div
      ref={ref}
      role="slider" tabIndex={0}
      aria-label="Flame control" aria-valuemin={0} aria-valuemax={6} aria-valuenow={level}
      aria-valuetext={LEVELS[level][0]}
      data-cur="Turn"
      className="relative h-[92px] w-[92px] shrink-0 touch-none select-none"
      onPointerDown={e => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); fromPointer(e) }}
      onPointerMove={e => dragging.current && fromPointer(e)}
      onPointerUp={() => { dragging.current = false }}
      onKeyDown={e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { setLevel(l => Math.min(6, l + 1)); e.preventDefault() }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { setLevel(l => Math.max(0, l - 1)); e.preventDefault() }
      }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(239,231,218,.18)" />
        {[0, 1, 2, 3, 4, 5, 6].map(i => {
          const a = (-135 + i / 6 * 270) * Math.PI / 180
          return <path key={i}
            d={`M${(50 + Math.sin(a) * 44).toFixed(1)} ${(50 - Math.cos(a) * 44).toFixed(1)} L${(50 + Math.sin(a) * 38).toFixed(1)} ${(50 - Math.cos(a) * 38).toFixed(1)}`}
            stroke={i <= level ? '#EFE7DA' : 'rgba(239,231,218,.28)'} strokeWidth="1.6" />
        })}
        <motion.g animate={{ rotate: deg }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          style={{ originX: '50px', originY: '50px' }}>
          <circle cx="50" cy="50" r="31" fill="#2f2a24" stroke="rgba(239,231,218,.3)" />
          <circle cx="50" cy="50" r="24" fill="#413a32" />
          <path d="M50 30 V19" stroke="#EFE7DA" strokeWidth="3" strokeLinecap="round" />
          <path d="M38 62 q12 -8 24 0" stroke="rgba(239,231,218,.25)" fill="none" strokeWidth="2" />
        </motion.g>
      </svg>
    </div>
  )
}
