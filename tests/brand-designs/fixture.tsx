import React from 'react'
import {createRoot} from 'react-dom/client'
import {MemoryRouter} from 'react-router-dom'
import {ReferenceCard} from '../../src/components/ReferenceCard'
import {references} from '../../src/data/references'
import '../../src/styles.css'
import './fixture.css'
const canaries=["apple","airbnb","notion","linear.app","stripe","vercel","spotify","ferrari","nintendo-2001","binance","tesla","figma"]
const all=new URLSearchParams(location.search).has('all')
const entries=all?references.filter(r=>r.id.startsWith('admd-')):canaries.map(slug=>references.find(r=>r.id==='admd-'+slug)!)
createRoot(document.getElementById('root')!).render(<MemoryRouter><main className="brand-canaries"><h1>DESIGN.md / Brand specimens</h1><p>Original DRH compositions · declared values · system font fallbacks · text identifiers</p><div className="reference-grid">{entries.map(item=><ReferenceCard item={item} key={item.id}/>)}</div></main></MemoryRouter>)
