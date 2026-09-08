import type { ReactNode } from 'react'
import { CopyBlock } from './CopyBlock'

// Deliberately small, text-only Markdown subset. HTML is always escaped by React.
function inline(text:string):ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g).map((part,i)=>{
    const link=part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if(link&&/^(https:\/\/|#\/)/.test(link[2]))return <a key={i} href={link[2]} {...(link[2].startsWith('https:')?{target:'_blank',rel:'noreferrer'}:{})}>{link[1]}</a>
    if(part.startsWith('`')&&part.endsWith('`'))return <code key={i}>{part.slice(1,-1)}</code>
    if(part.startsWith('**')&&part.endsWith('**'))return <strong key={i}>{part.slice(2,-2)}</strong>
    return part
  })
}
export function GuideMarkdown({text}:{text:string}) {
  const lines=text.replace(/\r/g,'').split('\n'), blocks:ReactNode[]=[]
  let i=0
  while(i<lines.length){
    const line=lines[i], key=i
    if(!line.trim()){i++;continue}
    if(line.startsWith('```')){const lang=line.slice(3);const code:string[]=[];i++;while(i<lines.length&&!lines[i].startsWith('```'))code.push(lines[i++]);i++;blocks.push(<CopyBlock key={key} label={`${lang||'text'} · 복사해서 사용하세요`} text={code.join('\n')} code/>);continue}
    if(line.startsWith('# ')){i++;continue} // Article title comes from searchable metadata.
    if(line.startsWith('## ')){blocks.push(<h2 id={`section-${key}`} key={key}>{inline(line.slice(3))}</h2>);i++;continue}
    if(line.startsWith('- ')){const list:string[]=[];while(i<lines.length&&lines[i].startsWith('- '))list.push(lines[i++].slice(2));blocks.push(<ul key={key}>{list.map((s,n)=><li key={n}>{inline(s)}</li>)}</ul>);continue}
    const paragraph:string[]=[]
    while(i<lines.length&&lines[i].trim()&&!/^(#|```|- )/.test(lines[i]))paragraph.push(lines[i++])
    if(!paragraph.length){paragraph.push(lines[i++])}
    blocks.push(<p key={key}>{inline(paragraph.join(' '))}</p>)
  }
  return <div className="guide-markdown">{blocks}</div>
}
