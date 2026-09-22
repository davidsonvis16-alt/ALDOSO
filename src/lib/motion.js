/* ============================================================================
   The motion language.
   ----------------------------------------------------------------------------
   Rules this page keeps to:
     · Nothing glows, blinks or floats. Movement is mass moving, not light.
     · Type arrives from behind a hard mask, never by fading in place.
     · Drawings are uncovered by a wipe while the plate inside settles back
       from a slight over-scale — the way a printed plate is revealed.
     · Every duration is long enough to read (0.7s–1.4s) and eased out hard.
   ========================================================================== */

export const EASE = [0.16, 0.84, 0.24, 1]      // the house curve
export const EASE_IN = [0.7, 0, 0.84, 0]

/* Lines of a headline, masked and lifted in sequence. */
export const lineWrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.05 } },
}
export const line = {
  hidden: { y: '112%', rotate: 1.4 },
  show: { y: '0%', rotate: 0, transition: { duration: 1.05, ease: EASE } },
}

/* Body copy and small parts: a short lift, no fade-only. */
export const rise = {
  hidden: { y: 26, opacity: 0 },
  show: i => ({
    y: 0, opacity: 1,
    transition: { duration: 0.85, ease: EASE, delay: (i || 0) * 0.08 },
  }),
}

/* A plate being uncovered. Pair with `plateInner` on the drawing inside. */
export const plate = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.25, ease: EASE } },
}
export const plateInner = {
  hidden: { scale: 1.22 },
  show: { scale: 1, transition: { duration: 1.5, ease: EASE } },
}

/* Sheets slide from the edge with weight; scrims are the only thing that fades. */
export const sheetPanel = {
  hidden: { x: '100%' },
  show: { x: 0, transition: { duration: 0.72, ease: EASE } },
  exit: { x: '100%', transition: { duration: 0.5, ease: EASE_IN } },
}
export const scrim = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45 } },
  exit: { opacity: 0, transition: { duration: 0.35 } },
}

export const viewport = { once: true, margin: '0px 0px -12% 0px' }
