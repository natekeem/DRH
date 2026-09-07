import { Menu, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

export function SiteHeader() {
  const [open,setOpen]=useState(false)
  const [search,setSearch]=useState('')
  const location=useLocation(); const navigate=useNavigate()
  useEffect(()=>setOpen(false),[location.pathname])
  const submit=(e:React.FormEvent)=>{e.preventDefault(); if(search.trim())navigate(`/explore?search=${encodeURIComponent(search.trim())}`)}
  return <header className="site-header">
    <Link className="brand" to="/"><span>DRH</span><i>Design Reference Hub</i></Link>
    <nav className={open?'main-nav open':'main-nav'}>
      <NavLink to="/explore">Explore</NavLink>
      <NavLink to="/collections">Collections</NavLink>
      <NavLink to="/sources">Sources</NavLink>
      <form className="nav-search" onSubmit={submit}><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search references"/><kbd>⌘K</kbd></form>
    </nav>
    <button className="menu-button" onClick={()=>setOpen(v=>!v)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
  </header>
}
