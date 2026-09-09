import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CopyBlock } from './CopyBlock'
import { guideHeadings } from '../lib/guideHeadings'

export function GuideMarkdown({text}:{text:string}) {
  const headings = guideHeadings(text)
  return (
    <div className="guide-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: () => null,
          h2: ({node, children}) => <h2 tabIndex={-1} id={headings.find(h=>h.line===node?.position?.start.line)?.id}>{children}</h2>,
          h3: ({node, children}) => <h3 tabIndex={-1} id={headings.find(h=>h.line===node?.position?.start.line)?.id}>{children}</h3>,
          code({node, inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '')
            if (!inline && match) {
              const lang = match[1]
              return (
                <CopyBlock 
                  label={`${lang} · 복사해서 사용하세요`} 
                  text={String(children).replace(/\n$/, '')} 
                  code 
                />
              )
            }
            return <code className={className} {...props}>{children}</code>
          },
          a: ({node, ...props}) => {
            const isExternal = typeof props.href === 'string' && /^https?:\/\//.test(props.href)
            return <a {...props} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined} />
          }
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}
