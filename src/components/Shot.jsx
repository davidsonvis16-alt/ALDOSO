import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { src, srcSet } from '../data/media.js'
import { plate, plateInner, viewport } from '../lib/motion.js'
import { cx } from '../lib/utils.js'

/* ============================================================================
   <Shot> — one photograph.
   Uncovered by a hard wipe, with the picture inside settling back from a
   slight over-scale. Optional scroll-scrub drift on the inner image, so the
   frame stays put while the contents move. No glow, no blur, no bloom — the
   only treatment is a grade and a paper-dark multiply.
   ========================================================================== */
export default function Shot({
  shot, className = '', drift = 0, ar, widths, sizes = '100vw',
  grade = 'warm', priority = false, children, style,
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${-drift}%`, `${drift}%`])

  const grades = {
    warm: 'saturate(0.82) contrast(1.06) brightness(0.86) sepia(0.12)',
    cool: 'saturate(0.7) contrast(1.14) brightness(0.78)',
    full: 'saturate(0.94) contrast(1.02) brightness(0.94)',
    flat: 'grayscale(1) contrast(1.1) brightness(0.8)',
  }

  return (
    <motion.figure
      ref={ref}
      variants={plate}
      initial={priority ? 'show' : 'hidden'}
      whileInView="show"
      viewport={viewport}
      className={cx('relative overflow-hidden bg-soot-2 m-0', className)}
      style={style}
    >
      <motion.img
        variants={plateInner}
        src={src(shot, 1400, { ar })}
        srcSet={srcSet(shot, widths || [560, 900, 1400, 2000], { ar })}
        sizes={sizes}
        alt={shot.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={{
          y: reduce ? 0 : y,
          scale: drift ? 1.18 : 1,
          filter: grades[grade] || grades.warm,
        }}
      />
      {/* paper-dark multiply: keeps every photo inside the brand's soot range */}
      <div className="pointer-events-none absolute inset-0 bg-soot/28 mix-blend-multiply" />
      {children}
    </motion.figure>
  )
}

/** A caption rule that sits under a plate, the way a printed plate is labelled. */
export function Plate({ n, children, className = '' }) {
  return (
    <figcaption className={cx('mt-3 flex items-baseline justify-between gap-4 border-t border-bone/14 pt-2.5', className)}>
      <span className="text-[11px] tracking-[0.02em] text-smoke-2">{children}</span>
      {n && <b className="num font-mono text-[10px] font-medium text-smoke">{n}</b>}
    </figcaption>
  )
}
