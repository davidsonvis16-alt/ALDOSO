# ALDOSI MERCHANTS

An editorial storefront for a Nairobi cooker brand — React + Vite + Tailwind v4 +
Framer Motion, with an Express API for M-Pesa and sign-in.

**The payments and the login do not work. That is deliberate and it is not hidden.**

```bash
npm install
npm run dev      # web on :5173, api on :8787
```

`npm run dev:web` runs the site alone — the flows still fail identically, because
the client falls back to the same errors the server would have sent.

---

## What is switched off, and where

Three fuses, all named constants so nothing is buried in a branch:

| Fuse | File | Effect |
|---|---|---|
| `FUSE_TOKEN` | `server/mpesa.js` | The Daraja OAuth call never runs. No token exists, so no STK prompt can reach any handset. |
| `FUSE_RESULT` | `server/mpesa.js` | The status query rotates through real Daraja failure codes — 1037, 1032, 2001, 1, 1019 — so each retry fails a different, plausible way. |
| `FUSE_IDENTITY` | `server/auth.js` | Every credential check, OAuth hand-off and OTP ends in a rotating 401/423/500/503. No session is ever minted. |

Everything *around* the fuses is real: the route shapes, the phone-number
normalisation to `2547…`, amount validation, the Base64 `shortcode+passkey+timestamp`
password, the callback endpoint, the 60-second window, the error codes and the
copy Safaricom actually sends. Only the outcome is fixed.

No password is hashed, compared, stored or logged. No cart is ever charged.
Nothing posted to these endpoints is persisted anywhere.

### Making it real

Fill `server/.env` from `server/.env.example`, set the three fuses to `false`,
and implement the `TODO(real)` in each module. Filling in credentials alone does
nothing — the fuses short-circuit first, on purpose.

---

## The design

- **Palette** — soot, ash, bone, clay. The only saturated colour in the brand is
  the blue of the gas ring, and it appears as ink, never as light.
- **Motion** — nothing glows, blinks, floats or pulses. Type arrives from behind a
  hard mask; photographs are uncovered by a wipe while the picture inside settles
  back from an over-scale; Chapter 01 pins and travels sideways; the wordmark
  widens along Archivo's variable width axis rather than fading. Everything is
  reduced-motion aware.
- **Photography** — real photographs, hand-picked: Nairobi street kitchens, a
  Ugandan chapati griddle, a blue ring in a dark room. Credited in the footer, as
  the Unsplash licence asks.
- **Cooker drawings** — the seven products are drawn as SVG elevations
  (`src/components/Cooker.jsx`) so the range reads as one family; each card
  cross-fades to a real kitchen on hover.

## Layout

```
src/
  data/       media.js (photo manifest + credits), products.js
  lib/        motion.js (the motion language), api.js, utils.js
  components/ Hero, Heat, Edit, Story, Mechanics, Kenya, Footer,
              Cooker, Shot, Type, Chrome, Preloader, Cursor, Mpesa, Toast
              sheets/ Sheet, MenuSheet, SearchSheet, CartSheet, AuthSheet
server/
  index.js    mounts the API, stamps every response as a demo
  mpesa.js    Daraja STK push — FUSE_TOKEN, FUSE_RESULT
  auth.js     credentials + OAuth + OTP — FUSE_IDENTITY
```

The original single-file prototype is kept at `aldosi-homepage.html`.
