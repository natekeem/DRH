import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
export default function BrandSourceNotes({value}:{value:unknown}){
 return <div className="bc-source-prose">{Object.entries(value as Record<string,unknown>).map(([key,text])=><div key={key}><h5>{key}</h5><ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{img:()=>null}}>{typeof text==='string'?text:JSON.stringify(text,null,2)}</ReactMarkdown></div>)}</div>
}
