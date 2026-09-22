export const KES = n => 'KES ' + Number(n).toLocaleString('en-KE')
export const cx = (...a) => a.filter(Boolean).join(' ')
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

/** localStorage that never takes the page down (private windows, blocked data). */
export const store = {
  get(k) { try { return localStorage.getItem(k) } catch { return null } },
  set(k, v) { try { localStorage.setItem(k, v) } catch {} },
}

/** 07XX XXX XXX — the way a Kenyan number is actually written down. */
export function formatPhone(raw) {
  const d = String(raw).replace(/\D/g, '').slice(0, 10)
  if (d.length <= 4) return d
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`
}
export const isKenyanMobile = raw => /^(07|01)\d{8}$/.test(String(raw).replace(/\D/g, ''))
