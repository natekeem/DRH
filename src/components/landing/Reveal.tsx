import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/hooks'

export function Reveal({ children, delay = 0, className = '' }:{ children:ReactNode; delay?:number; className?:string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [visible,setVisible] = useState(reduced)
  useEffect(()=>{
    const el=ref.current
    if(!el || reduced || typeof IntersectionObserver==='undefined'){ setVisible(true); return }
    const observer=new IntersectionObserver(([entry])=>{if(entry?.isIntersecting){setVisible(true);observer.disconnect()}},{threshold:.15,rootMargin:'0px 0px -10% 0px'})
    observer.observe(el)
    return()=>observer.disconnect()
  },[reduced])
  return <div ref={ref} className={`sg-reveal ${visible?'is-visible':''} ${className}`} style={{transitionDelay:`${delay}s`}}>{children}</div>
}
