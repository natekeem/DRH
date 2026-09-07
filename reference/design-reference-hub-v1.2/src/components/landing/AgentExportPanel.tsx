import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { ShaderBackdrop } from '../ShaderBackdrop'
import { shaderPresetById } from '../../data/shaderPresets'

const prompt='Create a hero with an animated ShaderGradient background. Keep the content minimal, use the Halo preset, and reveal the reference gallery on scroll.'

export function AgentExportPanel(){
  const [copied,setCopied]=useState(false)
  const copy=async()=>{try{await navigator.clipboard.writeText(prompt);setCopied(true);setTimeout(()=>setCopied(false),1200)}catch{/* noop */}}
  return <div className="sg-export-panel">
    <header><span>▦ Design Reference Hub</span><h3>Hand it to your Coding Agent</h3><p>Prompt · Code · DESIGN.md</p></header>
    <div className="sg-export-preview"><ShaderBackdrop preset={shaderPresetById.mint} compact/></div>
    <div className="sg-export-rows">
      <div><span>Reference</span><b>Shader Gradient / Halo</b></div>
      <div><span>Source</span><b>ruucm/shadergradient · MIT</b></div>
      <div><span>Output</span><b>Prompt + implementation starter</b></div>
    </div>
    <button type="button" className="sg-export-copy" onClick={copy}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy prompt'}</button>
  </div>
}
