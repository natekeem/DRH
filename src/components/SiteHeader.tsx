import { Menu, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

export function SiteHeader() {
  const [open,setOpen]=useState(false)
  const [pastHero,setPastHero]=useState(false)
  const [scrolled,setScrolled]=useState(false)
  const location=useLocation(); const navigate=useNavigate()
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
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){
        e.preventDefault();
        navigate(location.pathname==='/explore'?'/explore'+location.search:'/explore', { state: { focusSearch: true } });
      }
    }
    window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)
  },[navigate,location.pathname,location.search])
  const onSearchClick=()=>{navigate(location.pathname==='/explore'?'/explore'+location.search:'/explore', { state: { focusSearch: true } })}

  return <>
    <div className={`header-backdrop-rail ${home&&!pastHero?'over-hero':''}`} />
    <header
      className={`site-header ${home&&!pastHero?'over-hero':''} ${scrolled?'is-scrolled':''}`}
      data-scrolled={scrolled ? 'true' : 'false'}
    >
      <Link className="brand" to="/"><span>DRH</span><i>Design Reference Hub</i></Link>
      <nav className={open?'main-nav open':'main-nav'} aria-label="주요 메뉴">
        <NavLink className={({isActive})=>isActive?'active':''} to="/explore">탐색</NavLink>
        <NavLink className={({isActive})=>isActive?'active':''} to="/sources">출처</NavLink>
        <button className="nav-search-trigger" onClick={onSearchClick}><Search size={15}/> 검색 <kbd>⌘K</kbd></button>
      </nav>
      <button className="menu-button" onClick={()=>setOpen(v=>!v)} aria-label="메뉴 열기/닫기" aria-expanded={open}>{open?<X/>:<Menu/>}</button>
    </header>
  </>
}
