import { Menu, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

export function SiteHeader() {
  const [open,setOpen]=useState(false)
  const [search,setSearch]=useState('')
  const [pastHero,setPastHero]=useState(false)
  const searchRef=useRef<HTMLInputElement>(null)
  const location=useLocation(); const navigate=useNavigate()
  const home=location.pathname==='/'

  useEffect(()=>setOpen(false),[location.pathname])
  useEffect(()=>{
    const sync=()=>setPastHero(window.scrollY>Math.max(120,window.innerHeight*.72))
    sync(); window.addEventListener('scroll',sync,{passive:true}); window.addEventListener('resize',sync)
    return()=>{window.removeEventListener('scroll',sync);window.removeEventListener('resize',sync)}
  },[])
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();searchRef.current?.focus()}}
    window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)
  },[])
  const submit=(e:React.FormEvent)=>{e.preventDefault(); if(search.trim())navigate(`/explore?search=${encodeURIComponent(search.trim())}`)}

  return <header className={`site-header ${home&&!pastHero?'over-hero':''}`}>
    <Link className="brand" to="/"><span>DRH</span><i>Design Reference Hub</i></Link>
    <nav className={open?'main-nav open':'main-nav'} aria-label="주요 메뉴">
      <NavLink className={({isActive})=>isActive?'active':''} to="/explore">탐색</NavLink>
      <NavLink className={({isActive})=>isActive?'active':''} to="/collections">컬렉션</NavLink>
      <NavLink className={({isActive})=>isActive?'active':''} to="/sources">출처</NavLink>
      <form className="nav-search" onSubmit={submit}><Search size={15}/><input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="glass, cursor, hero…" aria-label="레퍼런스 검색"/><kbd>⌘K</kbd></form>
    </nav>
    <button className="menu-button" onClick={()=>setOpen(v=>!v)} aria-label="메뉴 열기/닫기">{open?<X/>:<Menu/>}</button>
  </header>
}
