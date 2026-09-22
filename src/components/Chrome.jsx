import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'
import { EASE } from '../lib/motion.js'
import { cx } from '../lib/utils.js'

const SECTIONS = [
  ['hero', 'THE ROOM'], ['cook', 'GOOD FOOD'], ['appliances', 'THE EDIT'],
  ['story', 'THE TABLE'], ['discover', 'HOW IT WORKS'], ['kenya', 'KENYA'],
]
const NAV = [
  ['cook', 'Cook', '01'], ['discover', 'Discover', '02'],
  ['appliances', 'Appliances', '03'], ['story', 'Our Story', '04'],
]

/* ============================================================================
   THE SPINE — a fixed left rail carrying the wordmark, a progress hairline
   and the name of wherever you currently are. It sits in difference blend so
   it inverts itself against whatever scrolls underneath. No box, no glow.
   ========================================================================== */
export function Spine() {
  const { scrollYProgress } = useScroll()
  const fill = useSpring(scrollYProgress, { stiffness: 180, damping: 34, mass: 0.4 })
  const [pct, setPct] = useState(0)
  const [now, setNow] = useState('THE ROOM')

  useMotionValueEvent(scrollYProgress, 'change', v => setPct(Math.round(v * 100)))

  useEffect(() => {
    const on = () => {
      let label = 'THE ROOM'
      for (const [id, l] of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= innerHeight * 0.42) label = l
      }
      setNow(label)
    }
    addEventListener('scroll', on, { passive: true }); on()
    return () => removeEventListener('scroll', on)
  }, [])

  return (
    <div
      className="fixed inset-y-0 left-0 z-[600] hidden w-[var(--spine-w)] flex-col items-center justify-between border-r border-bone/16 py-3.5 text-white mix-blend-difference sm:flex"
    >
      <a href="#top" aria-label="Hearth — back to top"
        className="pb-1 font-sans text-[clamp(13px,1.15vw,16px)] font-extrabold tracking-[0.52em] [writing-mode:vertical-rl] [transform:rotate(180deg)]"
        style={{ fontVariationSettings: '"wdth" 118' }}>
        HEARTH
      </a>
      <div className="relative my-4 w-px flex-1 bg-white/18">
        <motion.i className="absolute -left-px top-0 block w-[3px] origin-top bg-white"
          style={{ height: '100%', scaleY: fill }} />
      </div>
      <div className="h-[132px] overflow-hidden text-[9px] font-semibold uppercase tracking-[0.3em] opacity-75 [writing-mode:vertical-rl]">
        {now}
      </div>
      <div className="num font-mono text-[9px] font-medium">{String(pct).padStart(2, '0')}</div>
    </div>
  )
}

/* ============================================================================
   NAV — tucks away when you scroll down, returns the moment you scroll up.
   Hovering a link widens it along the font's width axis: the word physically
   broadens instead of lighting up. That is the whole hover state.
   ========================================================================== */
export function Nav({ active }) {
  const [tuck, setTuck] = useState(false)
  const last = useRef(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', y => {
    setTuck(y > last.current && y > 420)
    last.current = y
  })

  return (
    <motion.nav
      aria-label="Primary"
      animate={{ y: tuck ? -22 : 0, opacity: tuck ? 0 : 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed z-[620] hidden items-baseline gap-[clamp(14px,1.9vw,30px)] md:flex"
      style={{
        top: 'clamp(16px,2.4vw,30px)',
        left: 'calc(var(--spine-w) + clamp(16px,2.6vw,38px))',
        pointerEvents: tuck ? 'none' : 'auto',
      }}
    >
      {NAV.map(([id, label, n]) => (
        <a key={id} href={`#${id}`} className="group relative pb-[7px] text-[11px] font-semibold uppercase text-bone mix-blend-difference"
          style={{ fontVariationSettings: '"wdth" 88', letterSpacing: '0.19em' }}
          onMouseEnter={e => { e.currentTarget.style.fontVariationSettings = '"wdth" 112' }}
          onMouseLeave={e => { e.currentTarget.style.fontVariationSettings = '"wdth" 88' }}
        >
          <span className="transition-[font-variation-settings] duration-500">{label}</span>
          <i className="absolute -top-2 -right-2.5 text-[8px] not-italic tracking-normal opacity-45">{n}</i>
          <span className={cx(
            'absolute bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-flame-hi transition-transform duration-500',
            'group-hover:origin-left group-hover:scale-x-100',
            active === id && 'origin-left scale-x-100'
          )} />
        </a>
      ))}
    </motion.nav>
  )
}

/* ============================================================================
   UTILITY — search, account, cart. Square, hairline, no circles and no dots;
   the cart count sits in the label itself rather than in a bubble.
   ========================================================================== */
export function Util({ count, onSearch, onCart, onAuth, onMenu }) {
  const Btn = ({ children, onClick, label }) => (
    <button onClick={onClick} aria-label={label}
      className="group relative h-9 overflow-hidden border border-white/25 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-white">
      <span className="absolute inset-0 -translate-y-full bg-white transition-transform duration-[450ms] ease-[cubic-bezier(.16,.84,.24,1)] group-hover:translate-y-0" />
      <span className="relative transition-colors duration-300 group-hover:text-soot">{children}</span>
    </button>
  )
  return (
    <div className="fixed right-[clamp(14px,3vw,40px)] top-[clamp(13px,2.2vw,27px)] z-[620] flex items-center gap-1.5 mix-blend-difference">
      <Btn onClick={onSearch} label="Search">Search</Btn>
      <Btn onClick={onAuth} label="Account">Account</Btn>
      <Btn onClick={onCart} label="Cart">Cart {count > 0 && <span className="num">({count})</span>}</Btn>
      <button onClick={onMenu} aria-label="Menu"
        className="ml-0.5 flex h-9 items-center gap-2 border border-white/25 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white md:hidden">
        Menu
        <span className="flex w-3.5 flex-col gap-[3px]">
          <i className="block h-px w-full bg-current" /><i className="block h-px w-full bg-current" />
        </span>
      </button>
    </div>
  )
}
