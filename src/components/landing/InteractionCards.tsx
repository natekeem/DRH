import { useMemo, useState } from 'react'
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react'
import { shaderPresetById } from '../../data/shaderPresets'

function rand(){return Math.floor(Math.random()*255).toString(16).padStart(2,'0')}
function hex(){return `#${rand()}${rand()}${rand()}`}

export function InteractionCards(){
  const base=shaderPresetById.universe.props
  const [colors,setColors]=useState([String(base.color1),String(base.color2),String(base.color3)])
  const props=useMemo(()=>({...base,color1:colors[0],color2:colors[1],color3:colors[2]}),[base,colors])
  return <div className="sg-interaction-cards">
    <div className="sg-interaction-card sg-interaction-big">
      <ShaderGradientCanvas style={{position:'absolute',inset:0}} pixelDensity={1} fov={45} lazyLoad>
        <ShaderGradient {...(props as any)}/>
      </ShaderGradientCanvas>
      <span className="sg-hex">{colors.join(' · ')}</span>
      <button type="button" onClick={()=>setColors([hex(),hex(),hex()])}>Randomize</button>
    </div>
    <div className="sg-interaction-card sg-hover-card"><span>Hover<br/>on me!</span><div>Live<br/>Preview</div></div>
    <div className="sg-interaction-card sg-phone-card"><div><b>7:00</b><small>DESIGN<br/>REFERENCE</small></div></div>
  </div>
}
