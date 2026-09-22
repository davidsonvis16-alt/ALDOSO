import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sheetPanel, scrim } from '../../lib/motion.js'
import { cx } from '../../lib/utils.js'

/* A panel that slides in from the right with weight. The scrim is the only
   thing on this page allowed to simply fade. */
export default function Sheet({ open, onClose, label, children, width = 'max-w-[560px]' }) {
  useEffect(() => {
    if (!open) return
    document.body.classList.add('locked')
    const esc = e => e.key === 'Escape' && onClose()
    addEventListener('keydown', esc)
    return () => { document.body.classList.remove('locked'); removeEventListener('keydown', esc) }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[800]" role="dialog" aria-modal="true" aria-label={label}>
          <motion.div variants={scrim} initial="hidden" animate="show" exit="exit"
            onClick={onClose} className="absolute inset-0 bg-soot-3/80" />
          <motion.div variants={sheetPanel} initial="hidden" animate="show" exit="exit"
            className={cx('absolute inset-y-0 right-0 flex w-full flex-col border-l border-bone/12 bg-soot', width)}>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function CloseX({ onClose }) {
  return (
    <button onClick={onClose}
      className="group flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-bone/60 transition-colors hover:text-bone">
      Close
      <span className="grid h-6 w-6 place-items-center border border-bone/25 text-[12px] transition-transform duration-500 group-hover:rotate-90">×</span>
    </button>
  )
}
