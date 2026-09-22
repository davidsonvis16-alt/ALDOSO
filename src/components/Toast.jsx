import { motion, AnimatePresence } from 'framer-motion'
import { EASE } from '../lib/motion.js'

/* A hard-edged slab that slides up from the corner and leaves the same way. */
export default function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ y: '130%' }}
          animate={{ y: 0, transition: { duration: 0.55, ease: EASE } }}
          exit={{ y: '130%', transition: { duration: 0.4, ease: EASE } }}
          className="fixed bottom-4 left-1/2 z-[900] flex -translate-x-1/2 items-center gap-3.5 border border-bone/20 bg-bone px-4 py-3 text-soot sm:left-auto sm:right-5 sm:translate-x-0">
          <b className="num grid h-6 w-6 place-items-center bg-soot font-mono text-[11px] text-bone">{toast.n}</b>
          <span className="text-[12px] font-medium">{toast.msg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
