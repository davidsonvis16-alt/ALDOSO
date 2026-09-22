import { useCallback, useEffect, useMemo, useState } from 'react'
import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import { Spine, Nav, Util } from './components/Chrome.jsx'
import Hero from './components/Hero.jsx'
import Heat from './components/Heat.jsx'
import Edit from './components/Edit.jsx'
import Story from './components/Story.jsx'
import Mechanics from './components/Mechanics.jsx'
import Kenya from './components/Kenya.jsx'
import Footer from './components/Footer.jsx'
import Toast from './components/Toast.jsx'
import MenuSheet from './components/sheets/MenuSheet.jsx'
import SearchSheet from './components/sheets/SearchSheet.jsx'
import CartSheet from './components/sheets/CartSheet.jsx'
import AuthSheet from './components/sheets/AuthSheet.jsx'
import { PRODUCTS } from './data/products.js'
import { store } from './lib/utils.js'

const NAV_IDS = ['cook', 'discover', 'appliances', 'story']

export default function App() {
  /* --- cart, persisted but never fatal ----------------------------------- */
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(store.get('aldosi.cart') || '{}') || {} } catch { return {} }
  })
  useEffect(() => { store.set('aldosi.cart', JSON.stringify(cart)) }, [cart])

  const count = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart])
  const total = useMemo(
    () => Object.entries(cart).reduce((a, [id, q]) => {
      const p = PRODUCTS.find(x => x.id === id)
      return a + (p ? p.price * q : 0)
    }, 0),
    [cart]
  )

  /* --- overlays ----------------------------------------------------------- */
  const [sheet, setSheet] = useState(null)   // menu | search | cart | auth
  const close = useCallback(() => setSheet(null), [])

  /* --- toast -------------------------------------------------------------- */
  const [toast, setToast] = useState(null)
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const add = useCallback((p, q) => {
    setCart(c => ({ ...c, [p.id]: (c[p.id] || 0) + q }))
    setToast({ id: Date.now(), n: q, msg: `${p.name} — added` })
  }, [])

  const setQty = useCallback((id, q) => {
    setCart(c => (q <= 0 ? remove(c, id) : { ...c, [id]: Math.min(9, q) }))
  }, [])
  const removeItem = useCallback(id => setCart(c => remove(c, id)), [])

  /* --- which nav item is live -------------------------------------------- */
  const [active, setActive] = useState(null)
  useEffect(() => {
    const on = () => {
      let hit = null
      for (const id of NAV_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= innerHeight * 0.5 && r.bottom >= innerHeight * 0.4) hit = id
      }
      setActive(hit)
    }
    addEventListener('scroll', on, { passive: true }); on()
    return () => removeEventListener('scroll', on)
  }, [])

  /* the custom cursor only claims the pointer once the page is interactive */
  useEffect(() => {
    document.body.classList.add('has-cursor')
    return () => document.body.classList.remove('has-cursor')
  }, [])

  return (
    <>
      <Preloader />
      <div className="grain" aria-hidden="true" />
      <div className="vig" aria-hidden="true" />
      <Cursor />

      <Spine />
      <Nav active={active} />
      <Util
        count={count}
        onSearch={() => setSheet('search')}
        onCart={() => setSheet('cart')}
        onAuth={() => setSheet('auth')}
        onMenu={() => setSheet('menu')}
      />

      <main id="top">
        <Hero />
        <Heat />
        <Edit onAdd={add} />
        <Story />
        <Mechanics />
        <Kenya />
      </main>

      <Footer count={count} onCart={() => setSheet('cart')} />

      <MenuSheet open={sheet === 'menu'} onClose={close} />
      <SearchSheet open={sheet === 'search'} onClose={close} />
      <CartSheet open={sheet === 'cart'} onClose={close}
        cart={cart} setQty={setQty} remove={removeItem} total={total} count={count} />
      <AuthSheet open={sheet === 'auth'} onClose={close} />

      <Toast toast={toast} />
    </>
  )
}

function remove(c, id) {
  const next = { ...c }
  delete next[id]
  return next
}
