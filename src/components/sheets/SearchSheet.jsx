import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS } from '../../data/products.js'
import Cooker from '../Cooker.jsx'
import { EASE } from '../../lib/motion.js'
import { KES } from '../../lib/utils.js'
import Sheet, { CloseX } from './Sheet.jsx'

const HINTS = ['60x60', 'Tabletop', 'under 5000', 'Electric plate']

export default function SearchSheet({ open, onClose }) {
  const [q, setQ] = useState('')
  const input = useRef(null)

  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 420) }, [open])

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase()
    const under = s.match(/under\s*([\d,]+)/)
    const cap = under ? +under[1].replace(/,/g, '') : null
    return PRODUCTS.filter(p => {
      if (cap) return p.price <= cap
      if (!s) return true
      const hay = `${p.name} ${p.sub} ${p.spec} ${p.kind.join(' ')} ${p.price}`
        .toLowerCase().replace(/×/g, 'x').replace(/\s/g, '')
      return hay.includes(s.replace(/\s/g, '').replace(/×/g, 'x'))
    })
  }, [q])

  const goto = id => {
    onClose()
    setTimeout(() => document.getElementById('appliances')?.scrollIntoView({ behavior: 'smooth' }), 320)
  }

  return (
    <Sheet open={open} onClose={onClose} label="Search" width="max-w-[640px]">
      <div className="flex items-end justify-between gap-6 border-b border-bone/12 p-[clamp(18px,3vw,34px)]">
        <div className="min-w-0 flex-1">
          <span className="lab">Search</span>
          <input ref={input} type="search" value={q} onChange={e => setQ(e.target.value)}
            placeholder="60 by 60, tabletop, 3+1…" autoComplete="off"
            className="mt-1.5 w-full border-0 bg-transparent p-0 text-[clamp(20px,2.6vw,32px)] text-bone outline-none placeholder:text-bone/25" />
        </div>
        <CloseX onClose={onClose} />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-bone/12 px-[clamp(18px,3vw,34px)] py-4">
        <span className="lab mr-1">Try</span>
        {HINTS.map(h => (
          <button key={h} onClick={() => setQ(h)}
            className="border border-bone/22 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-bone/70 transition-colors hover:border-bone hover:text-bone">
            {h}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-[clamp(14px,2.4vw,26px)]">
        <AnimatePresence mode="popLayout">
          {hits.length ? hits.map((p, i) => (
            <motion.button key={p.id} layout onClick={() => goto(p.id)}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.03 }}
              className="group flex w-full items-center gap-4 border-b border-bone/10 p-3 text-left transition-colors hover:bg-bone/5">
              <span className="relative grid h-14 w-20 shrink-0 place-items-center overflow-hidden bg-soot-2">
                <Cooker cfg={p.svg} className="w-[52%] transition-transform duration-700 group-hover:scale-110" />
              </span>
              <span className="min-w-0 flex-1">
                <b className="block truncate text-[14px] font-semibold text-bone">{p.name}</b>
                <i className="block truncate text-[11.5px] not-italic text-smoke">{p.sub} · {KES(p.price)}</i>
              </span>
              <span className="text-[13px] text-bone/35 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-bone">→</span>
            </motion.button>
          )) : (
            <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-8 text-center text-[13px] leading-relaxed text-smoke">
              No cooker matches “{q}”.<br />Try <b className="text-bone">tabletop</b>, <b className="text-bone">60x60</b> or <b className="text-bone">under 5000</b>.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </Sheet>
  )
}
