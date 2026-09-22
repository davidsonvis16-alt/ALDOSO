/* ============================================================================
   PHOTOGRAPHY
   ----------------------------------------------------------------------------
   Real photographs, served from the Unsplash CDN. Every entry was picked by
   hand — Nairobi street kitchens, Ugandan chapati griddles, a blue ring in a
   dark room — rather than the usual glossy appliance stock.

   Each record carries its photographer so the footer can credit them properly,
   which is what the Unsplash licence asks for.
   ========================================================================== */

const CDN = 'https://images.unsplash.com/'

/** Build a sized, format-negotiated URL. */
export function src(shot, w = 1200, opts = {}) {
  const { q = 72, ar } = opts
  const crop = ar ? `&ar=${ar}&fit=crop&crop=entropy` : '&fit=crop'
  return `${CDN}${shot.slug}?auto=format${crop}&w=${w}&q=${q}`
}

/** A 4-step srcset so phones don't pull a 2400px file. */
export function srcSet(shot, widths = [480, 800, 1200, 1800], opts) {
  return widths.map(w => `${src(shot, w, opts)} ${w}w`).join(', ')
}

const S = (slug, alt, by, handle, tone = 'warm') => ({ slug, alt, by, handle, tone })

export const SHOTS = {
  /* --- hero ------------------------------------------------------------- */
  hero: S('photo-1764699486820-30a00e6ded7a',
    'A hand turning flatbread over an open blue gas flame',
    'Shane Wester', 'shanewester', 'cool'),

  /* --- chapter 01, heat -------------------------------------------------- */
  ring: S('photo-1633810602125-6653dfd91e8d',
    'A gas burner alight in a dark kitchen', 'Ankita Bhattacharya', 'ankita_clicks', 'cool'),
  onions: S('photo-1760445529057-2d9c60969d55',
    'Hands slicing red onion on a wooden board', 'Ahmet Koç', 'ahmetkoc'),
  simmer: S('photo-1778712533513-a3ec06e04fdf',
    'A pot at a simmer, steam coming off it', 'Kern Morris', 'kernsway'),
  dials: S('photo-1695654673011-35de11c0f010',
    'The knobs on a cooker, close', 'Alex Moliski', 'alexmoliski'),
  griddle: S('photo-1754394483922-4d3a10cc6187',
    'Chapati turning on a flat griddle', 'Mugabi Owen', 'spenz_official'),

  /* --- chapter 02, the table --------------------------------------------- */
  table: S('photo-1726177973983-6bcc1621fd4f',
    'People gathered around a wooden table', 'Victor Birai', 'tekniq'),
  prep: S('photo-1683549200177-e60855969f29',
    'A kitchen full of people preparing food together', 'Sweet Life', 'sweetlifediabetes'),
  stall: S('photo-1747359636487-6ba68244b050',
    'Two people eating at a food stall', 'Dwayne joe', 'spliff_dj_joe'),

  /* --- chapter 03, mechanics --------------------------------------------- */
  flameWide: S('photo-1715187289840-02f4710e0aad',
    'A blue flame across a burner, close and wide', 'Hitesh Kapoor', 'hiteshkapoor', 'cool'),
  knobRow: S('photo-1772974776381-68f1f5fef1aa',
    'A row of cooker knobs and their settings', 'Ries Bosch', 'ries_bosch'),

  /* --- chapter 04, Kenya -------------------------------------------------- */
  vendor: S('photo-1747359637042-985e0c70892d',
    'A vendor cooking at a street stall in Nairobi', 'Dwayne joe', 'spliff_dj_joe'),
  market: S('photo-1747359636521-5a3f1cf37606',
    'Someone cooking at an open-air market', 'Dwayne joe', 'spliff_dj_joe'),
  city: S('photo-1741991110666-88115e724741',
    'Nairobi from above on a clear day', 'imsogabriel stock', 'imsogabriel'),

  /* --- product in-situ ---------------------------------------------------- */
  counter: S('photo-1727064213749-1cdcaaf330cd',
    'A woman reading at a kitchen counter', 'Dwayne joe', 'spliff_dj_joe'),
  twoCooks: S('photo-1761313279217-a72078a941f8',
    'Two women preparing food in a kitchen', 'Mugabi Owen', 'spenz_official'),
  homeCook: S('photo-1745933368190-ab71ef82fa33',
    'A woman preparing food in a home kitchen', 'Matthew Stephenson', 'matthewryanstephenson'),
  melon: S('photo-1761313279221-c3f08f9bbca8',
    'Slicing watermelon at a kitchen worktop', 'Mugabi Owen', 'spenz_official'),
  stirring: S('photo-1642140076964-9a7d930d0e10',
    'Stirring a pot on the stove', 'Anjan', 'anjanvij'),
  outside: S('photo-1642140076952-f373dacf76c3',
    'Cooking on a stove out of doors', 'Anjan', 'anjanvij'),
  pouring: S('photo-1638544254054-ad0ffce53995',
    'Pouring into a pot on a lit ring', 'Swastik Arora', 'swastikarora'),
  melonNoodles: S('photo-1747359636402-785aa012fe74',
    'Two people sharing a meal at a stall', 'Dwayne joe', 'spliff_dj_joe'),
}

/** De-duplicated credit list for the footer. */
export const CREDITS = Object.values(SHOTS)
  .filter((s, i, a) => a.findIndex(x => x.handle === s.handle) === i)
  .map(s => ({ by: s.by, handle: s.handle }))
