import { useId, useRef, useState } from 'react'
import { componentStyle, isDark, type BrandCatalog, type BrandTheme, type CatalogComponent } from '../../lib/brandCatalog'

export function BrandComponentSample({component,catalog,theme}:{component:CatalogComponent;catalog:BrandCatalog;theme:BrandTheme}){
 const {key,kind,values}=component,style=componentStyle(values,catalog,theme)
 const [navIndex,setNavIndex]=useState(0)
 const [selected,setSelected]=useState(false),[text,setText]=useState(''),id=useId(),dialog=useRef<HTMLDialogElement>(null)
 const disabled=/disabled/.test(key),label=key.replace(/-/g,' ')
 const contextDark=/on-dark/.test(key)?true:/on-light/.test(key)?false:undefined
 const backdrop=style.background==='transparent'&&contextDark!==undefined?catalog.colors.find(([role,color])=>/canvas|surface|^ink$/.test(role)&&isDark(color)===contextDark)?.[1]:undefined
 const sourceColorConflict=typeof values.backgroundColor==='string'&&values.backgroundColor===values.textColor
 let sample
 if(kind==='buttons')sample=<><button style={style} disabled={disabled} aria-pressed={selected} onClick={()=>setSelected(!selected)}>{/circular|icon/.test(key)?'＋':selected?'Selected':'Continue →'}</button><span className="bc-feedback" role="status">{selected?'클릭 상태 예시':''}</span></>
 else if(kind==='inputs')sample=<label className="bc-field"><span>{/search/.test(key)?'Search':'Sample field'}</span>{/radio|checkbox/.test(key)?<input type={/radio/.test(key)?'radio':'checkbox'} checked={selected} onChange={()=>setSelected(!selected)} style={style}/>: /select/.test(key)?<select style={style} value={text} onChange={e=>setText(e.target.value)}><option value="">Choose an option</option><option>Option A</option><option>Option B</option></select>:<input style={style} value={text} disabled={disabled} aria-invalid={/error/.test(key)||undefined} placeholder="Type here…" onChange={e=>setText(e.target.value)}/>}</label>
 else if(kind==='tabs')sample=<div><div role="tablist" aria-label={label}>{['Overview','Details'].map((v,i)=><button key={v} role="tab" id={id+'-'+i} aria-controls={id+'-panel'} aria-selected={selected===(i===1)} tabIndex={selected===(i===1)?0:-1} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?1:selected?0:1;setSelected(next===1);(e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus()}}} onClick={()=>setSelected(i===1)} style={style}>{v}</button>)}</div><p id={id+'-panel'} role="tabpanel" aria-labelledby={id+'-'+(selected?1:0)}>{selected?'Details sample':'Overview sample'}</p></div>
 else if(kind==='dialogs')sample=<><button className="bc-control" onClick={()=>dialog.current?.showModal()}>Open { /drawer/.test(key)?'drawer':'dialog'}</button><dialog ref={dialog} className="bc-sample-dialog" style={style} aria-labelledby={id} onCancel={e=>e.stopPropagation()}><h4 id={id}>Sample dialog</h4><p>원본의 표면·테두리·깊이 예시</p><button className="bc-control" onClick={()=>dialog.current?.close()}>닫기</button></dialog></>
 else if(kind==='tables')sample=<table style={style}><caption>Sample data</caption><thead><tr><th>Item</th><th>Status</th></tr></thead><tbody><tr><td>Sample A</td><td>Ready</td></tr><tr><td>Sample B</td><td>Draft</td></tr></tbody></table>
 else if(kind==='navigation')sample=<nav style={style} aria-label={label}>{['Home','Library','Account'].map((v,i)=><button key={v} aria-current={navIndex===i?'page':undefined} onClick={()=>setNavIndex(i)}>{v}</button>)}</nav>
 else if(kind==='badges')sample=<span style={style} className="bc-badge">{ /selected/.test(key)?'Selected':/new/.test(key)?'New':'Label'}</span>
 else sample=<div style={style} className="bc-surface"><strong>{kind==='cards'?'Sample card':'Sample surface'}</strong><p>Design in the details.</p></div>
 return <article className="bc-component" data-component={key} data-kind={kind}><h5>{key}</h5><div className="bc-sample" style={backdrop?{background:backdrop,color:style.color}:undefined}>{sample}</div>{sourceColorConflict&&<p className="bc-source-warning">원본의 배경·문자 색이 같습니다. Source properties에서 확인하세요.</p>}<details className="bc-evidence"><summary>Source properties</summary><pre>{JSON.stringify(values,null,2)}</pre></details></article>
}
