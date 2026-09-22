import { useId } from 'react'
import Cooker from './Cooker.jsx'
import { clamp, cx } from '../lib/utils.js'

/* ============================================================================
   THE DRAWINGS
   ----------------------------------------------------------------------------
   Everything on the page that is not type is drawn here, in the same hand as
   the cooker elevations: flat ink on soot, hairlines for the measured parts,
   and the one saturated colour in the brand — the blue of the ring — used as
   ink and never as light. Nothing blooms, so every plate holds up at any size.
   ========================================================================== */

const useUid = p => p + useId().replace(/:/g, '')

/* --- the ground: a measured grid, the way a drawing is set out ------------ */
export function Grid({ step = 30, className = '', style, opacity = 1 }) {
  const id = useUid('gr')
  const fine = `rgba(239,231,218,${0.05 * opacity})`
  const heavy = `rgba(239,231,218,${0.1 * opacity})`
  return (
    <svg aria-hidden="true" className={cx('pointer-events-none absolute inset-0 h-full w-full', className)} style={style}>
      <defs>
        <pattern id={id} width={step} height={step} patternUnits="userSpaceOnUse">
          <path d={`M${step} 0 H0 V${step}`} fill="none" stroke={fine} strokeWidth="1" />
        </pattern>
        <pattern id={`${id}b`} width={step * 4} height={step * 4} patternUnits="userSpaceOnUse">
          <rect width={step * 4} height={step * 4} fill={`url(#${id})`} />
          <path d={`M${step * 4} 0 H0 V${step * 4}`} fill="none" stroke={heavy} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}b)`} />
    </svg>
  )
}

/* --- a burner seen from above, at whatever the knob is asking for --------- */
const PORTS = Array.from({ length: 20 }, (_, i) => (i * 360) / 20)

export function Ring({ lit = 0, className = '', style, label = 'Burner, plan view' }) {
  const k = clamp(lit, 0, 1)
  const h = 4 + k * 15                       // flame height, in drawing units

  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label}
      className={cx('block h-full w-full', className)} style={style}>
      {/* pan supports, cast iron */}
      {[0, 60, 120].map(a => (
        <rect key={a} x="10" y="95.5" width="180" height="9" rx="4.5" fill="#171310"
          transform={`rotate(${a} 100 100)`} />
      ))}

      {/* the gas itself, drawn before the metal so it sits under the crown */}
      {k > 0 && PORTS.map(a => (
        <g key={`f${a}`} transform={`rotate(${a} 100 100)`}>
          <ellipse cx="100" cy={46 - h * 0.35} rx="3.4" ry={h} fill="#2B5CE6" opacity={0.28 + 0.52 * k} />
          <ellipse cx="100" cy={48 - h * 0.25} rx="1.7" ry={h * 0.58} fill="#7FB2FF" opacity={0.3 + 0.55 * k} />
        </g>
      ))}

      {/* crown — one brass casting */}
      <circle cx="100" cy="100" r="53" fill="#8a6a3a" opacity=".88" />
      <circle cx="100" cy="100" r="53" fill="none" stroke="#5e4a28" strokeWidth="1.2" />
      {PORTS.map(a => (
        <rect key={`p${a}`} x="98.7" y="44" width="2.6" height="10" fill="#171310"
          transform={`rotate(${a} 100 100)`} />
      ))}

      {/* cap, and the injector under it */}
      <circle cx="100" cy="100" r="36" fill="#2b2620" />
      <circle cx="100" cy="100" r="36" fill="none" stroke="rgba(239,231,218,.12)" strokeWidth="1" />
      <circle cx="100" cy="100" r="11" fill="#171310" />
      <circle cx="100" cy="100" r="11" fill="none" stroke="rgba(239,231,218,.14)" strokeWidth="1" />

      {/* the flame-failure probe, off to one side, as on the real part */}
      <path d="M137 63 l14 -14" stroke="rgba(239,231,218,.3)" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="152" cy="48" r="3" fill="none" stroke="rgba(239,231,218,.3)" strokeWidth="1.4" />
    </svg>
  )
}

/* --- the fascia: the row of knobs, as tooled ------------------------------ */
export function Fascia({ n = 5, level = 3, className = '', style }) {
  const id = useUid('fa')
  const xs = Array.from({ length: n }, (_, i) => 42 + (i * 236) / (n - 1))
  const set = [0.16, 0.5, 0.84, 0.33, 0.66]

  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Cooker fascia, drawn straight on"
      className={cx('block h-full w-full', className)} style={style}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#26221e" /><stop offset="1" stopColor="#15120f" />
        </linearGradient>
      </defs>

      {/* the lip of the hob, just above */}
      <rect x="0" y="6" width="320" height="18" fill="#1d1a17" />
      <rect x="0" y="6" width="320" height="3" fill="#4a423a" opacity=".5" />

      {/* the fascia itself */}
      <rect x="0" y="24" width="320" height="86" fill={`url(#${id})`} />
      <rect x="0" y="24" width="320" height="2" fill="#4a423a" opacity=".55" />
      {xs.map((x, i) => {
        const deg = -135 + (i === 2 ? level / 6 : set[i % 5]) * 270
        return (
          <g key={x}>
            {[0, 1, 2, 3, 4, 5, 6].map(t => {
              const a = ((-135 + (t / 6) * 270) * Math.PI) / 180
              return <path key={t}
                d={`M${(x + Math.sin(a) * 25).toFixed(1)} ${(67 - Math.cos(a) * 25).toFixed(1)} L${(x + Math.sin(a) * 21).toFixed(1)} ${(67 - Math.cos(a) * 21).toFixed(1)}`}
                stroke="rgba(239,231,218,.28)" strokeWidth="1.2" />
            })}
            <circle cx={x} cy="67" r="15" fill="#c9c2b8" opacity=".9" />
            <circle cx={x} cy="67" r="10.5" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="1" />
            <g transform={`rotate(${deg} ${x} 67)`}>
              <path d={`M${x} 62 V54`} stroke="rgba(0,0,0,.6)" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          </g>
        )
      })}
      <circle cx="300" cy="67" r="4" fill="#E86A2A" opacity=".9" />

      {/* the oven handle and the top of the door, below */}
      <rect x="10" y="112" width="300" height="9" rx="4.5" fill="#4a423a" opacity=".92" />
      <rect x="10" y="112" width="300" height="3" rx="1.5" fill="#EFE7DA" opacity=".24" />
      <rect x="22" y="121" width="9" height="9" fill="#15120f" />
      <rect x="289" y="121" width="9" height="9" fill="#15120f" />
      <rect x="14" y="132" width="292" height="42" fill="#0a0908" />
      <rect x="26" y="142" width="268" height="32" fill="none" stroke="rgba(239,231,218,.1)" />
    </svg>
  )
}

/* --- the corner it lives in: cooker, cylinder, floor line ----------------- */
export function Corner({ className = '', style }) {
  return (
    <div className={cx('relative h-full w-full overflow-hidden bg-soot-2', className)} style={style}>
      <Grid step={34} />
      <svg viewBox="0 0 400 260" aria-hidden="true" className="absolute inset-0 h-full w-full">
        {/* the wall behind, and the line the floor makes with it */}
        <path d="M0 196 H400" stroke="rgba(239,231,218,.18)" strokeWidth="1.2" />
        <path d="M296 196 V70 H400" stroke="rgba(239,231,218,.1)" strokeWidth="1.2" />
        {/* 13 kg cylinder */}
        <g>
          <ellipse cx="338" cy="198" rx="30" ry="5" fill="rgba(20,17,14,.35)" />
          <rect x="312" y="120" width="52" height="78" rx="9" fill="#2a241d" />
          <rect x="312" y="120" width="52" height="4" rx="2" fill="#4a423a" opacity=".6" />
          <rect x="330" y="104" width="16" height="18" fill="#3c342b" />
          <path d="M324 104 h28" stroke="#4a423a" strokeWidth="5" strokeLinecap="round" />
          <path d="M346 112 h12" stroke="rgba(239,231,218,.35)" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M358 112 q10 22 -16 34" stroke="rgba(239,231,218,.22)" strokeWidth="2" fill="none" />
          <text x="338" y="166" textAnchor="middle" fontFamily="Archivo,sans-serif" fontSize="9"
            letterSpacing="1.4" fill="#EFE7DA" opacity=".4">13 KG</text>
        </g>
      </svg>
      <div className="absolute bottom-[22.5%] left-[12%] w-[38%]">
        <Cooker cfg={{ type: 'free', finish: 'black', w: 6, burners: 4, electric: 1, size: 1 }} />
      </div>
    </div>
  )
}

/* --- a sufuria on a lit ring, in elevation -------------------------------- */
export function Pot({ className = '', style }) {
  const id = useUid('po')
  return (
    <svg viewBox="0 0 320 200" role="img" aria-label="A pot on a lit burner"
      className={cx('block h-full w-full', className)} style={style}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#827d76" /><stop offset=".3" stopColor="#b9b4ac" />
          <stop offset=".72" stopColor="#a7a29a" /><stop offset="1" stopColor="#6f6a64" />
        </linearGradient>
      </defs>
      {/* steam, drawn as line, not as haze */}
      {[118, 160, 202].map((x, i) => (
        <path key={x} d={`M${x} ${48 - i * 6} q-11 -18 0 -30 q11 -12 0 -26`}
          stroke="rgba(239,231,218,.2)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ))}
      <path d="M92 86 h136 l-12 62 H104 Z" fill={`url(#${id})`} />
      <rect x="86" y="78" width="148" height="10" rx="4" fill="#cfcac2" />
      <path d="M78 92 q-14 8 0 16" stroke="#9a958d" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M242 92 q14 8 0 16" stroke="#9a958d" strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* the flame under it, licking the base */}
      {[-42, -21, 0, 21, 42].map((d, i) => {
        const h = 26 - Math.abs(d) * 0.22
        return (
          <g key={d}>
            <ellipse cx={160 + d} cy={150 - h * 0.4} rx="9" ry={h} fill="#2B5CE6" opacity=".62" />
            <ellipse cx={160 + d} cy={154 - h * 0.3} rx="4.4" ry={h * 0.6} fill="#7FB2FF" opacity=".72" />
          </g>
        )
      })}
      <rect x="96" y="168" width="128" height="7" rx="3.5" fill="#171310" />
      <rect x="60" y="175" width="200" height="6" rx="3" fill="#2b2620" />
    </svg>
  )
}

/* --- a plain plate of ground, for the places that only need a surface ----- */
export function Field({ children, step = 30, className = '', style }) {
  return (
    <div className={cx('relative overflow-hidden bg-soot-2', className)} style={style}>
      <Grid step={step} />
      {children}
    </div>
  )
}
