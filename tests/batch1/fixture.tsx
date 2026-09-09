import React from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {ReferenceCard} from '../../src/components/ReferenceCard'
import {DemoRenderer} from '../../src/components/demos/DemoRenderer'
import {references} from '../../src/data/references'
import catalog from '../../src/data/batch1Catalog.json'
import '../../src/styles.css'

const id=new URLSearchParams(location.search).get('id')??'neumorphism'
const item=references.find(r=>r.id===id)!
createRoot(document.getElementById('root')!).render(<BrowserRouter><style>{`
body{margin:0;background:#101722;color:#edf1f8;font-family:system-ui}.qa{padding:24px;max-width:1800px;margin:auto}.qa>header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}.qa h1{font-size:18px}.qa select{max-width:180px;padding:8px}.pair{display:grid;grid-template-columns:340px minmax(0,1fr);gap:24px;align-items:start}.pair .reference-card{width:100%;min-width:0}.pair section{min-width:0}.pair h2{font-size:12px;color:#a6b5cd;margin:0 0 12px}.detail-demo{display:block;width:100%;height:min(70vh,720px);min-height:420px;border:1px solid #4b5670;border-radius:16px;overflow:hidden}.detail-demo>.demo-viewport{height:100%}.card-demo{height:220px!important}@media(max-width:800px){.qa{padding:16px}.pair{grid-template-columns:minmax(0,1fr)}.detail-demo{height:540px}.card-demo{height:192px!important}}
`}</style><main className="qa"><header><h1>{item.name} / Card + Detail</h1><select value={id} onChange={e=>location.search='?id='+e.target.value}>{catalog.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></header><div className="pair"><section data-qa="card"><h2>Card / actual ReferenceCard</h2><ReferenceCard item={item}/></section><section data-qa="detail"><h2>Detail / shared DemoRenderer</h2><div className="detail-demo"><DemoRenderer kind={item.demo} detail/></div></section></div></main></BrowserRouter>)
