import { motion } from 'framer-motion'
import { lineWrap, line, rise, viewport } from '../lib/motion.js'
import { cx } from '../lib/utils.js'

/* ============================================================================
   Kinetic type.
   Each line sits in its own overflow-hidden box and is lifted into view with
   a fraction of a degree of rotation, so a stacked headline reads as sheets
   of paper being dealt rather than text fading up.
   ========================================================================== */
export function Lines({ children, as: Tag = 'h2', className = '', delay = 0 }) {
  const items = Array.isArray(children) ? children : [children]
  return (
    <motion.div
      variants={lineWrap}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ delayChildren: delay }}
    >
      <Tag className={className}>
        {items.map((c, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em]">
            <motion.span variants={line} className="block will-change-transform">{c}</motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  )
}

export function Rise({ children, i = 0, className = '', as: Tag = 'div' }) {
  const M = motion[Tag] || motion.div
  return (
    <M variants={rise} custom={i} initial="hidden" whileInView="show" viewport={viewport} className={className}>
      {children}
    </M>
  )
}

export function Label({ children, className = '' }) {
  return <p className={cx('lab', className)}>{children}</p>
}
