import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CopyBlock } from './CopyBlock'

export function GuideMarkdown({text}:{text:string}) {
  return (
    <div className="guide-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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
