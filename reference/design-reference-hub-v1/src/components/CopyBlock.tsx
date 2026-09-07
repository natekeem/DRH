import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyBlock({ label, text, code=false }:{label:string;text:string;code?:boolean}) {
  const [copied,setCopied]=useState(false)
  const copy=async()=>{
    try {
      if(navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
      else { const area=document.createElement('textarea'); area.value=text; area.style.position='fixed'; area.style.opacity='0'; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove() }
      setCopied(true); setTimeout(()=>setCopied(false),1400)
    } catch { setCopied(false) }
  }
  return <section className="copy-block"><header><span>{label}</span><button onClick={copy}>{copied?<><Check size={14}/> Copied</>:<><Copy size={14}/> Copy</>}</button></header><pre className={code?'code':''}>{text}</pre></section>
}
