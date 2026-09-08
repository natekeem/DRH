import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export function SiteHeader() {
  const [open,setOpen]=useState(false)
  const [pastHero,setPastHero]=useState(false)
  const [scrolled,setScrolled]=useState(false)
  const location=useLocation()
  const home=location.pathname==='/'

  useEffect(()=>setOpen(false),[location.pathname])
  useEffect(()=>{
    const sync=()=>{
      const y=window.scrollY
      setScrolled(y>10)
      setPastHero(y>Math.max(120,window.innerHeight*.92))
    }
    sync()
    window.addEventListener('scroll',sync,{passive:true})
    window.addEventListener('resize',sync)
    return()=>{window.removeEventListener('scroll',sync);window.removeEventListener('resize',sync)}
  },[location.pathname])

  return <>
    <div className={`header-backdrop-rail ${home&&!pastHero?'over-hero':''}`} />
    <header
      className={`site-header ${home&&!pastHero?'over-hero':''} ${scrolled?'is-scrolled':''}`}
      data-scrolled={scrolled ? 'true' : 'false'}
    >
      <Link className="brand" to="/"><span>DRH</span><i>Design Reference Hub</i></Link>
      <nav className={open?'main-nav open':'main-nav'} aria-label="주요 메뉴">
        <NavLink className={({isActive})=>isActive?'active':''} to="/explore">탐색</NavLink>
        <NavLink className={({isActive})=>isActive?'active':''} to="/guides">가이드</NavLink>
        <NavLink className={({isActive})=>isActive?'active':''} to="/sources">출처</NavLink>
      </nav>
      <button className="menu-button" onClick={()=>setOpen(v=>!v)} aria-label="메뉴 열기/닫기" aria-expanded={open}>{open?<X/>:<Menu/>}</button>
    </header>
  </>
}
