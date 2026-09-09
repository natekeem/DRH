import React from 'react'
import {createRoot} from 'react-dom/client'
import {DemoRenderer} from '../../src/components/demos/DemoRenderer'
import '../../src/styles.css'
import './fixture.css'
const keys=['particles','meteors','dot-grid','aurora','gradient-mesh','noise-blobs','parallax','tilt-card','magnetic-button','hover-lift','spotlight','cursor-follow','image-trail','fluid-cursor','metaballs','liquid-refraction','starfield','retro-grid','beams','waves','confetti','ripple','image-reveal','comparison-slider','animated-border','shimmer-button']
const kind=new URLSearchParams(location.search).get('kind')??'particles'
createRoot(document.getElementById('root')!).render(<React.StrictMode><main className="scale-qa"><header><h1>Card / Detail — {kind}</h1><select aria-label="Demo" value={kind} onChange={e=>location.search='?kind='+e.target.value}>{keys.map(k=><option key={k}>{k}</option>)}</select></header><div className="scale-pair"><section><h2>CARD PREVIEW</h2><div className="qa-card"><DemoRenderer kind={kind}/></div></section><section><h2>DETAIL PREVIEW</h2><div className="qa-detail"><DemoRenderer kind={kind} detail/></div></section></div></main></React.StrictMode>)
