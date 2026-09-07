// npm install react react-dom @shadergradient/react@2.4.20
// Usage: <HeroShader />. Save as HeroShader.tsx.
// Official: https://github.com/ruucm/shadergradient
// License declaration: https://github.com/ruucm/shadergradient/blob/main/packages/shadergradient/package.json
import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'
class ShaderBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false}
 static getDerivedStateFromError(){return{failed:true}}
 render(){return this.state.failed?null:this.props.children}
}
export default function HeroShader(){
 const ref=useRef<HTMLDivElement>(null)
 const [live,setLive]=useState(false)
 useEffect(()=>{
  const el=ref.current;if(!el)return
  const mq=matchMedia('(prefers-reduced-motion:reduce)')
  const probe=document.createElement('canvas')
  const gl=probe.getContext('webgl2')||probe.getContext('webgl')
  const supported=Boolean(gl)
  gl?.getExtension('WEBGL_lose_context')?.loseContext()
  let visible=false
  const sync=()=>setLive(supported&&visible&&!mq.matches&&!document.hidden)
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()})
  observer.observe(el);mq.addEventListener('change',sync);document.addEventListener('visibilitychange',sync)
  return()=>{observer.disconnect();mq.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync)}
 },[])
 return <div ref={ref} aria-hidden="true" style={{height:480,width:'100%',position:'relative',overflow:'hidden',background:'linear-gradient(120deg,#ff5005,#dbba95,#d0bce1)'}}>
  {live&&<ShaderBoundary><ShaderGradientCanvas style={{position:'absolute',inset:0,width:'100%',height:'100%'}} pixelDensity={1.25} fov={45}>
   <ShaderGradient animate="on" type="plane" color1="#ff5005" color2="#dbba95" color3="#d0bce1" uAmplitude={1} uDensity={1.3} uSpeed={0.4} uStrength={4} brightness={1.2} cAzimuthAngle={180} cDistance={3.6} cPolarAngle={90} cameraZoom={1} grain="on" lightType="3d" positionX={-1.4} positionY={0} positionZ={0} rotationX={0} rotationY={10} rotationZ={50}/>
  </ShaderGradientCanvas></ShaderBoundary>}
 </div>
}
