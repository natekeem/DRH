import { ShaderBackdrop } from '../ShaderBackdrop'
import { shaderPresetById } from '../../data/shaderPresets'

export function BrowserMockup(){
  return <div className="sg-browser-window">
    <div className="sg-browser-bar"><i/><i/><i/></div>
    <div className="sg-browser-screen">
      <ShaderBackdrop preset={shaderPresetById.mandarin} compact/>
      <nav><span>Styles</span><span>Motion</span><span>Effects</span><span>DESIGN.md</span></nav>
      <div className="sg-browser-headline">Find<br/>what you like.<br/>Name it.</div>
      <span className="sg-browser-pill">Explore →</span>
    </div>
  </div>
}
