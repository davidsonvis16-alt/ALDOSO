import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { EASE } from '../lib/motion.js'

/* ============================================================================
   The curtain.
   A counter runs to 100 while the wordmark widens along the Archivo width
   axis — the letters physically broaden, which is the whole trick. Then the
   sheet splits and leaves. It is on a hard timer: even if everything below it
   throws, the page is uncovered.
   ========================================================================== */
/* Shown once a session. Coming back to the page a second time should not
   cost you another two seconds, and a screenshot or an embed shouldn't
   either — ?skipIntro forces past it. */
function alreadySeen() {
  try {
    if (new URLSearchParams(location.search).has('skipIntro')) return true
    return sessionStorage.getItem('hearth.intro') === '1'
  } catch { return false }
}

export default function Preloader({ onDone }) {
  const [n, setN] = useState(0)
  const [gone, setGone] = useState(alreadySeen)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || alreadySeen()) { setGone(true); onDone?.(); return }
    try { sessionStorage.setItem('hearth.intro', '1') } catch {}
    document.body.classList.add('locked')
    const t0 = performance.now()
    const DUR = 1700
    let raf
    const step = t => {
      const k = Math.min(1, (t - t0) / DUR)
      setN(Math.round(100 * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    const bail = setTimeout(() => { setGone(true); onDone?.() }, DUR + 520)
    return () => { cancelAnimationFrame(raf); clearTimeout(bail) }
  }, [reduce, onDone])

  useEffect(() => {
    if (gone) document.body.classList.remove('locked')
  }, [gone])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[9500] grid grid-rows-2"
          exit={{ transition: { staggerChildren: 0.06 } }}
        >
          {[0, 1].map(i => (
            <motion.div
              key={i}
              className="relative overflow-hidden bg-soot-2"
              exit={{ scaleY: 0, transition: { duration: 0.85, ease: EASE, delay: i * 0.05 } }}
              style={{ transformOrigin: i === 0 ? 'top' : 'bottom' }}
            >
              <div
                className="absolute left-1/2 w-max -translate-x-1/2 disp text-bone"
                style={{
                  top: i === 0 ? 'auto' : 0, bottom: i === 0 ? 0 : 'auto',
                  transform: `translateX(-50%) translateY(${i === 0 ? '50%' : '-50%'})`,
                  fontFamily: 'Archivo, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(46px,11vw,150px)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  fontVariationSettings: `"wdth" ${62 + (n / 100) * 63}`,
                  clipPath: i === 0 ? 'inset(0 0 50% 0)' : 'inset(50% 0 0 0)',
                }}
              >
                HEARTH
              </div>
            </motion.div>
          ))}
          <motion.div
            className="pointer-events-none absolute bottom-6 left-0 right-0 flex items-end justify-between px-[clamp(18px,4vw,54px)]"
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <span className="lab">Nairobi — lighting the ring</span>
            <span className="num font-mono text-[clamp(28px,5vw,58px)] leading-none text-bone">
              {String(n).padStart(3, '0')}
            </span>
          </motion.div>
          {/* a single hairline that fills, left to right */}
          <motion.i
            className="absolute bottom-0 left-0 h-px bg-bone/70"
            style={{ width: `${n}%` }}
            exit={{ opacity: 0 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
