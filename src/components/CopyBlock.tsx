import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
export function CopyButton({text,label='복사'}:{text:string;label?:string}){
 const [state,setState]=useState<'idle'|'copied'|'error'>('idle')
 const timer=useRef<ReturnType<typeof setTimeout>>()
 useEffect(()=>()=>clearTimeout(timer.current),[])
 const copy=async()=>{try{if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);else{const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();const ok=document.execCommand('copy');area.remove();if(!ok)throw Error('copy failed')}setState('copied');clearTimeout(timer.current);timer.current=setTimeout(()=>setState('idle'),1800)}catch{setState('error')}}
 return <><button onClick={copy}>{state==='copied'?<Check size={14}/>:<Copy size={14}/>} {state==='copied'?'복사됨':label}</button><span role="status" className={state==='copied'?'sr-only':'copy-error'}>{state==='copied'?'복사 완료':state==='error'?'복사하지 못했습니다. 아래 텍스트를 선택하거나 다운로드하세요.':''}</span></>
}
export function CopyBlock({label,text,code=false}:{label:string;text:string;code?:boolean}){return <section className="copy-block"><header><span>{label}</span><CopyButton text={text}/></header><pre className={code?'code':''}>{text}</pre></section>}
