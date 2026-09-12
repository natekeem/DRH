import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { sourceLines } from '../../lib/brandPresentation'
export default function BrandSourceNotes({value}:{value:unknown}){
 return <div className="bc-source-prose"><ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{img:()=>null}}>{sourceLines(value).join('\n')}</ReactMarkdown></div>
}
