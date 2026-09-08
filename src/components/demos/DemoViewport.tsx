import { useEffect, useRef, useState } from 'react'
import { recipeHtml } from '../../lib/demos/recipes'

export function DemoViewport({children, detail=false}:{children:React.ReactNode;detail?:boolean}) {
 const ref=useRef<HTMLDivElement>(null)
 const [visible,setVisible]=useState(detail)
 useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{rootMargin:'0px'});io.observe(el);return()=>io.disconnect()},[])
 return <div ref={ref} className={`demo-viewport ${detail?'detail':''}`}>{visible?children:<div className="demo-placeholder" aria-label="화면에 들어오면 데모 재생">미리보기</div>}</div>
}
export function RecipeDemo({kind, detail=false}:{kind:string;detail?:boolean}) {
 return <iframe className="recipe-demo" title={`${kind} 실행 데모`} sandbox="allow-scripts" srcDoc={recipeHtml(kind, { variant: detail ? 'detail' : 'card' })??''}/>
}
