import { motion } from 'framer-motion'
import { plate, plateInner, viewport } from '../lib/motion.js'
import { Grid } from './Drawn.jsx'
import { cx } from '../lib/utils.js'

/* ============================================================================
   <Plate> — one drawing, presented the way a printed plate is.
   Uncovered by a hard wipe, with the drawing inside settling back from a
   slight over-scale. No glow, no blur, no bloom: the plate is ink on soot and
   a measured ground behind it.
   ========================================================================== */
export default function Plate({
  className = '', grid = 30, priority = false, children, style, label,
}) {
  return (
    <motion.figure
      variants={plate}
      initial={priority ? 'show' : 'hidden'}
      whileInView="show"
      viewport={viewport}
      className={cx('relative m-0 overflow-hidden bg-soot-2', className)}
      style={style}
      aria-label={label}
    >
      {grid ? <Grid step={grid} /> : null}
      <motion.div variants={plateInner} className="absolute inset-0 grid place-items-center">
        {children}
      </motion.div>
    </motion.figure>
  )
}

/** A caption rule that sits under a plate, the way a printed plate is labelled. */
export function Caption({ n, children, className = '' }) {
  return (
    <figcaption className={cx('mt-3 flex items-baseline justify-between gap-4 border-t border-bone/14 pt-2.5', className)}>
      <span className="text-[11px] tracking-[0.02em] text-smoke-2">{children}</span>
      {n && <b className="num font-mono text-[10px] font-medium text-smoke">{n}</b>}
    </figcaption>
  )
}
