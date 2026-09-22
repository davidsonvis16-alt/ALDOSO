/* The catalogue. Seven cookers, drawn as elevations and shot in real kitchens. */
import { SHOTS } from './media.js'

export const PRODUCTS = [
  { id: 'roch6060', no: '01', name: 'Roch 60 × 60', sub: '3 Gas + 1 Electric', price: 32500,
    spec: '60×60 · Oven + grill · Black enamel', tag: 'The house cooker',
    kind: ['free', 'elec'], shot: SHOTS.homeCook,
    svg: { type: 'free', finish: 'black', w: 6, burners: 4, electric: 1, size: 1.0 } },

  { id: 'rochgas', no: '02', name: 'Roch Full Gas', sub: '4 Burner standing', price: 18500,
    spec: '50×55 · Gas oven · Ivory', tag: '',
    kind: ['free'], shot: SHOTS.twoCooks,
    svg: { type: 'free', finish: 'ivory', w: 4, burners: 4, electric: 0, size: .86 } },

  { id: 'roch3b', no: '03', name: 'Roch 3-Burner', sub: 'Tabletop', price: 2600,
    spec: 'Tabletop · Enamel pan supports', tag: 'Under 3K',
    kind: ['table'], shot: SHOTS.outside,
    svg: { type: 'table', finish: 'black', burners: 3, size: .8 } },

  { id: 'mika6060', no: '04', name: 'Mika 60 × 60', sub: '3 Gas + 1 Electric', price: 37500,
    spec: '60×60 · Fan oven · Inox', tag: 'Editor’s pick',
    kind: ['free', 'elec'], shot: SHOTS.counter,
    svg: { type: 'free', finish: 'steel', w: 6, burners: 4, electric: 1, size: 1.0 } },

  { id: 'ss3b', no: '05', name: 'Stainless 3-Burner', sub: 'Tabletop', price: 3000,
    spec: 'Tabletop · Brushed steel top', tag: '',
    kind: ['table'], shot: SHOTS.pouring,
    svg: { type: 'table', finish: 'steel', burners: 3, size: .8 } },

  { id: 'amaze31', no: '06', name: 'Amaze 3+1', sub: 'Standing cooker', price: 19500,
    spec: '50×55 · Gas oven · Hotplate', tag: '',
    kind: ['free', 'elec'], shot: SHOTS.stirring,
    svg: { type: 'free', finish: 'black', w: 4, burners: 4, electric: 1, size: .9 } },

  { id: 'euroken31', no: '07', name: 'Euroken 3+1', sub: 'Standing cooker', price: 21500,
    spec: '50×55 · Rotisserie · Inox', tag: '',
    kind: ['free', 'elec'], shot: SHOTS.melon,
    svg: { type: 'free', finish: 'steel', w: 4, burners: 4, electric: 1, size: .9 } },
]

export const FILTERS = [
  { f: 'all', label: 'All seven' },
  { f: 'free', label: 'Freestanding' },
  { f: 'table', label: 'Tabletop' },
  { f: 'elec', label: 'Gas + Electric' },
]

export const LEVELS = [
  ['Off', 'Gas closed. The click you hear is the valve seating.'],
  ['Warm', 'Just enough to hold a pot of chai where you left it.'],
  ['Low', 'For milk, which will escape the moment you look away.'],
  ['Simmer', 'A 270° sweep instead of the usual 180°. Twice the travel, so low heat is somewhere you can actually stop.'],
  ['Medium', 'Where onions go soft without going brown.'],
  ['Medium+', 'Chapati heat. The pan should hiss, not smoke.'],
  ['High', 'Full 4.2 kW on the wok ring — a loaded sufuria keeps moving.'],
]

export const SPECS = [
  { k: '01', t: 'Brass burner, cast in one piece',
    d: 'Nothing to unscrew, nothing to lose in the sink. 4.2 kW on the wok ring — enough to keep a full sufuria moving.' },
  { k: '02', t: 'Enamel that forgives',
    d: 'Double-coated oven cavity. Spilled milk wipes off cold. We tested it with ugali, which is the real standard.' },
  { k: '03', t: 'Flame failure cut-off',
    d: 'Gas stops within four seconds of the flame going out — for the draught through an open kitchen door.' },
]

export const FACTS = [
  { n: 47, label: 'Counties we deliver to' },
  { n: 1795, label: 'Metres above sea level — we tune burners for it' },
  { n: 24, label: 'Months warranty, parts in stock' },
  { n: 13, label: 'Kg cylinder — the one you already own' },
]

export const COUNTIES = ['Nairobi', 'Kiambu', 'Nakuru', 'Mombasa', 'Kisumu', 'Uasin Gishu',
  'Machakos', 'Meru', 'Nyeri', 'Kakamega', 'Kilifi', 'Kajiado', 'Bungoma', 'Kericho', 'Embu',
  'Garissa', 'Trans Nzoia', 'Laikipia']
