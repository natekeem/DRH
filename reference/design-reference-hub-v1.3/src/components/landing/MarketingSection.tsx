import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from './Reveal'

export function MarketingSection({kicker,titleTop,titleBottom,subtitle,accent=false,primaryTo,primaryLabel,secondaryTo,secondaryLabel,children}:{
  kicker:string; titleTop:string; titleBottom:string; subtitle:string; accent?:boolean; primaryTo:string; primaryLabel:string; secondaryTo?:string; secondaryLabel?:string; children:ReactNode
}){
  return <section className="sg-marketing">
    <div className="sg-marketing-inner">
      <Reveal className="sg-marketing-copy"><span className="sg-marketing-badge">{kicker}</span><h2 className={accent?'accent':''}><span>{titleTop}</span><span>{titleBottom}</span></h2><p>{subtitle}</p><div className="sg-marketing-buttons"><Link className="sg-marketing-primary" to={primaryTo}>{primaryLabel} →</Link>{secondaryTo&&secondaryLabel?<Link className="sg-marketing-secondary" to={secondaryTo}>{secondaryLabel}</Link>:null}</div></Reveal>
      <Reveal delay={.12} className="sg-marketing-visual">{children}</Reveal>
    </div>
  </section>
}
