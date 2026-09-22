import { useMemo, useId } from 'react'

/* ============================================================================
   The cooker drawings.
   Straight-on elevations with a shallow top plane, the way a catalogue
   photographer would set a cooker up. Drawn rather than photographed because
   no two stock shots of a cooker agree on angle, lens or white balance — and
   the range has to read as one family on one shelf.
   ========================================================================== */

const FIN = {
  black: { body: '#1d1a17', bodyB: '#0e0c0a', top: '#26221e', topB: '#15120f', edge: '#4a423a', glass: '#0a0908', knob: '#c9c2b8', txt: '#EFE7DA' },
  steel: { body: '#b9b4ac', bodyB: '#827d76', top: '#cfcac2', topB: '#9a958d', edge: '#efeae2', glass: '#12100e', knob: '#3a352f', txt: '#2a241d' },
  ivory: { body: '#e6ded0', bodyB: '#bdb3a2', top: '#efe8dc', topB: '#c8bfae', edge: '#fffaf1', glass: '#14120f', knob: '#3a352f', txt: '#2a241d' },
}

const burner = (cx, cy, rx, ry, lit) => `<g>
  <ellipse cx="${cx}" cy="${cy + 2}" rx="${rx}" ry="${ry}" fill="rgba(0,0,0,.35)"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#8a6a3a" opacity=".85"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx * .68}" ry="${ry * .68}" fill="#2b2620"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx * .3}" ry="${ry * .3}" fill="#171310"/>
  <path d="M${cx - rx - 4} ${cy} h${rx * 2 + 8} M${cx} ${cy - ry - 3} v${ry * 2 + 6}" stroke="#171310" stroke-width="3" stroke-linecap="round" opacity=".9"/>
  <path d="M${cx - rx * .75} ${cy - ry * .75} l${rx * 1.5} ${ry * 1.5} M${cx + rx * .75} ${cy - ry * .75} l${-rx * 1.5} ${ry * 1.5}" stroke="#171310" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>
  ${lit ? `<g class="flame"><ellipse cx="${cx}" cy="${cy}" rx="${rx * .8}" ry="${ry * .8}" fill="#2B5CE6" opacity=".55"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx * .5}" ry="${ry * .5}" fill="#7FB2FF" opacity=".7"/></g>` : ''}
</g>`

const hotplate = (cx, cy, rx, ry) => `<g>
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2a2520"/>
  <ellipse cx="${cx}" cy="${cy - 1}" rx="${rx * .92}" ry="${ry * .92}" fill="#3b342c"/>
  ${[.72, .5, .28].map(f => `<ellipse cx="${cx}" cy="${cy - 1}" rx="${rx * f}" ry="${ry * f}" fill="none" stroke="#1b1714" stroke-width="2"/>`).join('')}
  <ellipse cx="${cx}" cy="${cy - 1}" rx="${rx * .1}" ry="${ry * .1}" fill="#1b1714"/></g>`

const knobShape = (x, y, r, f) => `<g>
  <circle cx="${x}" cy="${y}" r="${r}" fill="${f.knob}" opacity=".9"/>
  <circle cx="${x}" cy="${y}" r="${r * .72}" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="1"/>
  <path d="M${x} ${y - r * .2} V${y - r * .85}" stroke="rgba(0,0,0,.6)" stroke-width="2" stroke-linecap="round"/></g>`

function draw(cfg, id) {
  const f = FIN[cfg.finish] || FIN.black

  if (cfg.type === 'table') {
    return `<svg viewBox="0 0 320 152" role="img" aria-label="Hearth tabletop cooker" style="width:100%;height:auto;display:block">
      <defs>
        <linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f.top}"/><stop offset="1" stop-color="${f.topB}"/></linearGradient>
        <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f.body}"/><stop offset="1" stop-color="${f.bodyB}"/></linearGradient>
      </defs>
      <ellipse cx="160" cy="142" rx="132" ry="8" fill="rgba(20,17,14,.22)"/>
      <path d="M44 30 H276 L300 74 H20 Z" fill="url(#${id}a)"/>
      <path d="M44 30 H276 L280 37 H40 Z" fill="${f.edge}" opacity=".5"/>
      <rect x="20" y="74" width="280" height="46" fill="url(#${id}b)"/>
      <rect x="20" y="74" width="280" height="3" fill="${f.edge}" opacity=".55"/>
      ${burner(90, 52, 30, 13, false)}${burner(160, 52, 34, 15, cfg.lit !== false)}${burner(232, 52, 30, 13, false)}
      ${knobShape(92, 97, 13, f)}${knobShape(160, 97, 13, f)}${knobShape(228, 97, 13, f)}
      <rect x="26" y="120" width="12" height="9" rx="2" fill="#15120f"/>
      <rect x="282" y="120" width="12" height="9" rx="2" fill="#15120f"/>
      <text x="160" y="129" text-anchor="middle" font-family="Archivo,sans-serif" font-size="7" letter-spacing="3.4" fill="${f.txt}" opacity=".5">HEARTH</text>
    </svg>`
  }

  const lit = cfg.lit !== false
  return `<svg viewBox="0 0 320 424" role="img" aria-label="Hearth freestanding cooker" style="width:100%;height:auto;display:block">
    <defs>
      <linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f.top}"/><stop offset="1" stop-color="${f.topB}"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${f.bodyB}"/><stop offset=".22" stop-color="${f.body}"/>
        <stop offset=".62" stop-color="${f.body}"/><stop offset="1" stop-color="${f.bodyB}"/></linearGradient>
      <linearGradient id="${id}c" x1="0" y1="0" x2=".7" y2="1">
        <stop offset="0" stop-color="#3b342c" stop-opacity=".95"/><stop offset=".45" stop-color="${f.glass}"/>
        <stop offset="1" stop-color="#050403"/></linearGradient>
      <linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffd9a3" stop-opacity=".26"/><stop offset="1" stop-color="#ffd9a3" stop-opacity="0"/></linearGradient>
    </defs>
    <ellipse cx="160" cy="410" rx="140" ry="9" fill="rgba(20,17,14,.25)"/>
    <rect x="46" y="38" width="228" height="34" rx="3" fill="${f.bodyB}"/>
    <rect x="46" y="38" width="228" height="4" fill="${f.edge}" opacity=".5"/>
    <text x="160" y="61" text-anchor="middle" font-family="Archivo,sans-serif" font-size="9" font-weight="800" letter-spacing="6" fill="${f.txt}" opacity=".62">HEARTH</text>
    <path d="M48 72 H272 L296 120 H24 Z" fill="url(#${id}a)"/>
    <path d="M48 72 H272 L275 79 H45 Z" fill="${f.edge}" opacity=".45"/>
    ${burner(106, 92, 26, 11, lit)}
    ${cfg.electric ? hotplate(214, 92, 26, 11) : burner(214, 92, 26, 11, false)}
    ${burner(86, 112, 30, 13, false)}
    ${burner(236, 112, 30, 13, false)}
    <rect x="24" y="120" width="272" height="258" fill="url(#${id}b)"/>
    <rect x="24" y="120" width="272" height="3" fill="${f.edge}" opacity=".6"/>
    <rect x="24" y="126" width="272" height="40" fill="rgba(0,0,0,.18)"/>
    ${[70, 110, 150, 210, 250].slice(0, cfg.w === 6 ? 5 : 4).map(x => knobShape(x, 146, 12, f)).join('')}
    <circle cx="288" cy="146" r="3" fill="#E86A2A" opacity=".9"/>
    <rect x="34" y="176" width="252" height="176" rx="2" fill="rgba(0,0,0,.14)"/>
    <rect x="40" y="182" width="240" height="164" rx="2" fill="url(#${id}c)"/>
    <rect x="52" y="194" width="216" height="140" rx="1" fill="none" stroke="rgba(255,255,255,.1)"/>
    <path d="M52 194 L268 334" stroke="rgba(255,255,255,.055)" stroke-width="26"/>
    <rect x="52" y="230" width="216" height="104" fill="url(#${id}d)"/>
    <rect x="32" y="168" width="256" height="9" rx="4.5" fill="${f.edge}" opacity=".92"/>
    <rect x="32" y="168" width="256" height="3" rx="1.5" fill="#fff" opacity=".28"/>
    <rect x="44" y="177" width="9" height="9" fill="${f.bodyB}"/><rect x="267" y="177" width="9" height="9" fill="${f.bodyB}"/>
    <rect x="24" y="360" width="272" height="18" fill="rgba(0,0,0,.3)"/>
    <rect x="34" y="378" width="16" height="16" rx="3" fill="#15120f"/>
    <rect x="270" y="378" width="16" height="16" rx="3" fill="#15120f"/>
  </svg>`
}

export default function Cooker({ cfg, className = '', style }) {
  const raw = useId().replace(/:/g, '')
  const html = useMemo(() => draw(cfg, 'g' + raw), [cfg, raw])
  return <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />
}
