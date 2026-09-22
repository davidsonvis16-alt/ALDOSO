import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'

/* ============================================================================
   The cursor chip.
   Not a dot and not a ring — a small rectangular caption that only exists
   when the pointer is over something that does something. Hidden entirely on
   touch and for reduced motion.
   ========================================================================== */
export default function Cursor() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 620, damping: 44, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 620, damping: 44, mass: 0.6 })
  const [label, setLabel] = useState(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const move = e => {
      x.set(e.clientX); y.set(e.clientY)
      const hit = e.target.closest?.('[data-cur]')
      setLabel(hit ? hit.dataset.cur : null)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  return (
    <AnimatePresence>
      {label && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[9200] hidden md:block"
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.86 }}
          transition={{ duration: 0.18 }}
        >
          <span className="block -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap bg-bone px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-soot">
            {label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
