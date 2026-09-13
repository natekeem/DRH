import { useId, useRef, useState, type CSSProperties } from 'react'
import { componentStyle, isDark, scalar, type BrandCatalog, type BrandTheme, type CatalogComponent } from '../../lib/brandCatalog'
import { projectComponentStyle, resolveComponentStyle } from '../../lib/brandComponentStyle'
import { resolveBrandFont } from '../../lib/brandPresentation'

export function BrandComponentSample({component,catalog,theme,context=false,content}:{component:CatalogComponent;catalog:BrandCatalog;theme:BrandTheme;context?:boolean;content?:'product'|'commerce'|'editorial'|'media'}){
 const {key,kind,values}=component
 const composition=['hero','section','cta-band','pricing','cards','media'].includes(kind)
 const original=resolveComponentStyle(values,catalog,theme),style=projectComponentStyle(original,composition)
 const [index,setIndex]=useState(0),[selected,setSelected]=useState(false),[text,setText]=useState(''),[feedback,setFeedback]=useState('')
 const id=useId(),dialog=useRef<HTMLDialogElement>(null)
 const disabled=/disabled/.test(key),label=key.replace(/-/g,' ')
 const stateStyle=(name:string)=>componentStyle(values[name]&&typeof values[name]==='object'?values[name] as Record<string,unknown>:{},catalog,theme)
 const active=stateStyle('active'),error=stateStyle('error')
 const indicator=componentStyle({borderColor:values.activeIndicator},catalog,theme).borderColor
 const divider=componentStyle({borderColor:values.rowBorder??values['item-divider']},catalog,theme).borderColor
 const bodyRole=catalog.roles.find(([k])=>/body|paragraph/.test(k))?.[1]||catalog.roles[0]?.[1]||{}
 const bodyStyle:CSSProperties={fontFamily:resolveBrandFont(bodyRole).stack,fontSize:13,lineHeight:1.6,letterSpacing:'normal',fontWeight:400}
 const explicitContext=/(?:^|-)on-dark|overlay/.test(key)?true:/(?:^|-)on-light/.test(key)?false:undefined
 const transparent=!original.backgroundColor||original.backgroundColor==='transparent'||/^rgba/.test(String(original.backgroundColor))
 const needsBackdrop=transparent&&(explicitContext!==undefined||typeof original.color==='string'&&isDark(original.color)===isDark(theme.colors.canvas))
 const backdropDark=explicitContext??!isDark(String(original.color))
 const backdrop=needsBackdrop?catalog.colors.find(([role,c])=>/canvas|surface|^ink$|foreground|^dark$|background/.test(role)&&isDark(c)===backdropDark)?.[1]||(backdropDark?'#202124':'#ffffff'):undefined
 const button=catalog.components.find(c=>c.kind==='buttons'&&!/disabled|hover|focus/.test(c.key))
 const action=button?<button style={projectComponentStyle(resolveComponentStyle(button.values,catalog,theme))} onClick={()=>setFeedback('선택했습니다. 실제 서비스 요청은 보내지 않습니다.')}>시작하기</button>:null
 let sample
 if(kind==='buttons')sample=<button style={style} disabled={disabled} aria-label={/play/.test(key)?'재생 상태 예시':undefined} onClick={()=>{setSelected(!selected);setFeedback(/play/.test(key)?'재생 상태 예시입니다. 실제 음원은 없습니다.':'클릭했습니다. 실제 서비스 요청은 보내지 않습니다.')}}>{/play/.test(key)?(selected?'Ⅱ':'▶'):/circular|icon|carousel/.test(key)?'＋':/download/.test(key)?'자료 받기':/secondary|more/.test(key)?'자세히 보기':'계속하기'}</button>
 else if(kind==='inputs')sample=<label className="bc-field"><span>{/search/.test(key)?'검색':/agreement/.test(key)?'이용 안내 동의':'이메일'}</span>{/radio|checkbox|agreement/.test(key)||values.type==='toggle'?<input type={/radio/.test(key)?'radio':'checkbox'} checked={selected} onChange={()=>setSelected(!selected)} style={style}/>: /select/.test(key)?<select style={style} value={text} onChange={e=>setText(e.target.value)}><option value="">항목 선택</option><option>개인 계정</option><option>팀 계정</option></select>:<input style={{...style,...(/error/.test(key)?error:{})}} value={text} disabled={disabled} aria-invalid={/error/.test(key)||undefined} placeholder={/search/.test(key)?'이름으로 찾기':'name@example.com'} onChange={e=>setText(e.target.value)}/>}</label>
 else if(kind==='tabs')sample=<div className="bc-tabs-specimen"><div role="tablist" aria-label={label}>{['개요','활동','설정'].map((v,i)=><button key={v} role="tab" id={id+'-'+i} aria-controls={id+'-panel'} aria-selected={index===i} tabIndex={index===i?0:-1} onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?2:(index+(e.key==='ArrowRight'?1:2))%3;setIndex(next);(e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus()}}} onClick={()=>setIndex(i)} style={{...style,...(index===i?active:{}),...(index===i&&indicator?{borderBottom:`2px solid ${indicator}`}:{})}}>{v}</button>)}</div><p id={id+'-panel'} role="tabpanel" aria-labelledby={id+'-'+index}>{['프로젝트의 최근 현황입니다.','새로운 활동이 없습니다.','알림과 계정을 관리합니다.'][index]}</p></div>
 else if(kind==='dialogs')sample=<><button className="bc-control" onClick={()=>dialog.current?.showModal()}>대화상자 열기</button><dialog ref={dialog} className="bc-sample-dialog" style={style} aria-labelledby={id} onCancel={e=>e.stopPropagation()}><h4 id={id}>변경 사항 확인</h4><p style={bodyStyle}>설정을 저장하기 전에 확인하세요.</p><button className="bc-control" onClick={()=>dialog.current?.close()}>닫기</button></dialog></>
 else if(kind==='tables'){
  const cell=componentStyle({padding:values.cellPadding},catalog,theme)
  const header=componentStyle({backgroundColor:values.headerBackground,typography:values.headerTypography},catalog,theme)
  const body=componentStyle({typography:values.bodyTypography},catalog,theme)
  sample=<table style={style}><caption>최근 프로젝트</caption><thead style={header}><tr>{['이름','상태'].map(v=><th key={v} style={{...cell,borderBottom:divider?`1px solid ${divider}`:undefined}}>{v}</th>)}</tr></thead><tbody style={body}>{[['프로젝트 A','진행 중'],['프로젝트 B','검토 중']].map(row=><tr key={row[0]}>{row.map(v=><td key={v} style={{...cell,borderBottom:divider?`1px solid ${divider}`:undefined}}>{v}</td>)}</tr>)}</tbody></table>
 }
 else if(kind==='navigation')sample=<nav style={style} aria-label={label}>{['홈','보관함','계정'].map((v,i)=><button key={v} aria-current={index===i?'page':undefined} onClick={()=>setIndex(i)} style={{...(index===i?active:{}),...(index===i&&indicator?{borderInlineStart:`3px solid ${indicator}`}:{})}}>{v}</button>)}</nav>
 else if(kind==='badges')sample=<span style={style} className="bc-badge">{/new/.test(key)?'새 소식':'진행 중'}</span>
 else if(kind==='hero'||kind==='section'||kind==='cta-band')sample=<div style={style} className="bc-composition"><small style={bodyStyle}>{kind==='hero'?'WORKSPACE':kind==='section'?'COLLECTION':'NEXT STEP'}</small><strong>{kind==='hero'?'한곳에서 시작하세요':kind==='section'?'일상의 새로운 발견':'다음 작업을 시작하세요'}</strong><p style={bodyStyle}>필요한 정보를 모으고, 중요한 일에 집중하세요.</p>{action}</div>
 else if(kind==='pricing')sample=<div className="bc-composition bc-pricing" style={style}><small style={bodyStyle}>Pro · 요금 예시</small><strong>₩29,000 <small style={bodyStyle}>/ 월</small></strong><p style={bodyStyle}>팀을 위한 핵심 기능<br/>공유 공간 · 프로젝트 관리</p>{action}</div>
 else if(kind==='icon')sample=<><span className="bc-asset-shape" style={{...style,height:original.height}} aria-label="원본에 정의된 빈 에셋 형태"/><small style={bodyStyle}>형태 예시 · 브랜드 에셋 아님</small></>
 else if(kind==='legal'||kind==='footer')sample=<div className="bc-composition" style={style}>{kind==='footer'?<strong>도움말 · 이용 안내 · 문의</strong>:null}<p>서비스 이용 조건과 개인정보 안내를 확인하세요.</p></div>
 else if(kind==='media')sample=<div className="bc-composition" style={style}><div className="bc-abstract" aria-label="DRH 추상 미디어 자리"/><strong>저장한 콘텐츠</strong><p style={bodyStyle}>이미지·음원 대신 사용하는 추상 예시</p></div>
 else if(kind==='code')sample=<pre className="bc-code-specimen" style={style}><code>{'const project = {\n  name: "Workspace",\n  status: "ready"\n}'}</code></pre>
 else if(kind==='status')sample=<div style={style}>변경 사항을 저장했습니다.</div>
 else if(kind==='cards')sample=<div style={style} className="bc-composition">{content==='media'||content==='commerce'?<div className="bc-abstract" aria-label="DRH 추상 콘텐츠 자리"/>:null}<strong>{content==='media'?'나의 플레이리스트':content==='commerce'?'저장한 컬렉션':null}{content==='media'||content==='commerce'?null:/product|tile|media/.test(key)?'저장한 컬렉션':'계정 보안'}</strong><p style={bodyStyle}>{content==='media'?'집중하는 시간을 위한 보관함':/product|tile|media/.test(key)||content==='commerce'?'다시 보고 싶은 항목을 모았습니다.':'새로운 로그인 알림을 확인하세요.'}</p><small style={bodyStyle}>최근 업데이트 · 오늘</small></div>
 else if(kind==='content-surface')sample=<div className="bc-composition" style={style}><strong>프로젝트 정보</strong><p style={bodyStyle}>작업 공간 · 업데이트 완료</p></div>
 else sample=<div className="bc-signature"><p>전용 미리보기 미지원</p><code>{Object.entries(original).map(([k,v])=>`${k}: ${v}`).slice(0,4).join(' · ')||'표현 가능한 시각 속성 없음'}</code></div>
 const specimen=<div className="bc-sample" style={{fontFamily:resolveBrandFont(bodyRole).stack,background:backdrop||theme.colors.canvas,color:theme.colors.text}}>{sample}{feedback&&<span className="bc-feedback" role="status">{feedback}</span>}</div>
 return <article className={context?'bc-context-component':'bc-component'} data-component={key} data-kind={kind} data-evidence="source-component">
  {context?<small className="bc-context-evidence">{key}</small>:<header className="bc-component-title"><h5>{key}</h5>{Boolean(values.use)&&<p title={scalar(values.use)}>{scalar(values.use)}</p>}</header>}
  {specimen}
  {original.backgroundColor&&original.backgroundColor===original.color&&<p className="bc-source-warning">원본의 배경·문자 색이 같습니다. 원본 속성에서 확인하세요.</p>}
  {!context&&<><p className="bc-metrics">{original.fontSize?`원본 글자 ${original.fontSize} · `:''}{original.padding?`원본 패딩 ${original.padding} · `:''}{composition?'화면에 맞춘 축소 표시':'동작은 DRH 예시'}</p><details className="bc-evidence"><summary>원본 속성 · 개발자 근거</summary><pre>{JSON.stringify(values,null,2)}</pre><p>안전하게 해석한 속성</p><pre>{JSON.stringify(original,null,2)}</pre></details></>}
 </article>
}
