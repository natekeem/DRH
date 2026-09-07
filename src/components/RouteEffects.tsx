import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function RouteEffects() {
  const location = useLocation()
  useEffect(() => {
    const run = () => {
      if (location.hash) {
        const id = decodeURIComponent(location.hash.slice(1))
        const target = document.getElementById(id)
        if (target) {
          target.scrollIntoView({ block: 'start', behavior: 'smooth' })
          return
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
    const timer = window.setTimeout(run, 0)
    return () => window.clearTimeout(timer)
  }, [location.pathname, location.search, location.hash])
  return null
}
