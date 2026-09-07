import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

export function RouteEffects() {
  const location = useLocation()
  const navigation = useNavigationType()
  const previous = useRef(location)
  const positions = useRef(new Map<string, number>())
  const y = useRef(window.scrollY)
  useLayoutEffect(() => {
    const original = history.scrollRestoration
    history.scrollRestoration = 'manual'
    const save = () => { y.current = window.scrollY }
    window.addEventListener('scroll', save, { passive: true })
    return () => { window.removeEventListener('scroll', save); history.scrollRestoration = original }
  }, [])
  useLayoutEffect(() => {
    const old = previous.current
    positions.current.set(old.key, y.current)
    previous.current = location
    const changedPage = old.pathname !== location.pathname
    if (changedPage || (navigation === 'POP' && old.key !== location.key)) {
      const top = navigation === 'POP' ? positions.current.get(location.key) ?? 0 : 0
      window.scrollTo({ top, behavior: 'instant' })
      y.current = window.scrollY
    }
    if (location.hash && (changedPage || old.hash !== location.hash)) {
      let id = location.hash.slice(1)
      try { id = decodeURIComponent(id) } catch { /* malformed anchors */ }
      document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' })
    }
  }, [location, navigation])
  return null
}
