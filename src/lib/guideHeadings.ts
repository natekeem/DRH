import { unified } from 'unified'
import remarkParse from 'remark-parse'

export type GuideHeading = { id: string; text: string; depth: number; line: number }
type MarkdownNode = {type:string;depth?:number;value?:string;alt?:string|null;children?:MarkdownNode[];position?:{start:{line:number}}}
const parser = unified().use(remarkParse)
const plainText = (node: MarkdownNode): string => node.children?.map(plainText).join('') ?? node.value ?? node.alt ?? ''
// Use the same Markdown grammar as ReactMarkdown, including setext headings,
// inline formatting and fenced examples. IDs are unique even when a title ends in -2.
export function guideHeadings(markdown: string): GuideHeading[] {
  const used = new Set<string>(), headings: GuideHeading[] = []
  function visit(node: MarkdownNode) {
    if (node.type==='heading' && (node.depth===2 || node.depth===3)) {
      const text=plainText(node)
      const base=text.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,'').trim().replace(/\s+/g,'-')||'section'
      let id=base, suffix=2
      while(used.has(id)) id=`${base}-${suffix++}`
      used.add(id)
      headings.push({id,text,depth:node.depth,line:node.position!.start.line})
    }
    node.children?.forEach(visit)
  }
  visit(parser.parse(markdown))
  return headings
}
