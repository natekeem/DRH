import { useEffect, useRef, useState } from 'react'
import { recipeHtml } from '../../lib/demos/recipes'

export function DemoViewport({children, detail=false}:{children:React.ReactNode;detail?:boolean}) {
 const ref=useRef<HTMLDivElement>(null)
 const [visible,setVisible]=useState(detail)
 useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{rootMargin:'0px'});io.observe(el);return()=>io.disconnect()},[])
 return <div ref={ref} className={`demo-viewport ${detail?'detail':''}`}>{visible?children:<div className="demo-placeholder" aria-label="화면에 들어오면 데모 재생">미리보기</div>}</div>
}
export function RecipeDemo({kind, detail=false}:{kind:string;detail?:boolean}) {
 const frame=useRef<HTMLIFrameElement>(null)
 useEffect(()=>{
   const reset=()=>frame.current?.contentWindow?.postMessage({type:'drh:pointerleave'},'*')
   // Opaque-origin frames can miss pointerleave when crossing process boundaries.
   // Parent-document pointer input is necessarily outside the child document.
   document.addEventListener('pointermove',reset,{passive:true})
   window.addEventListener('blur',reset)
   return()=>{document.removeEventListener('pointermove',reset);window.removeEventListener('blur',reset)}
 },[])
 return <iframe ref={frame} className="recipe-demo" title={`${kind} 실행 데모`} sandbox="allow-scripts" onPointerLeave={e=>e.currentTarget.contentWindow?.postMessage({type:'drh:pointerleave'},'*')} srcDoc={recipeHtml(kind, { variant: detail ? 'detail' : 'card' })??''}/>
}
