import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ReferenceCard } from '../components/ReferenceCard'
import { collections, references } from '../data/references'

export function CollectionsPage(){return <main className="collections-page"><section className="listing-hero"><span className="eyebrow">CURATED PATHS</span><h1>Start with a goal,<br/><i>not a category.</i></h1><p>Collections bundle references that work well together — useful when you want a vibe, a product direction or a shortlist for your agent.</p></section><div className="collections-list">{collections.map((c,index)=><section key={c.id} id={c.id} className="collection-section"><header><div><small>{String(index+1).padStart(2,'0')} / COLLECTION</small><h2>{c.title}</h2><p>{c.description}</p></div><Link to={`/explore?search=${encodeURIComponent(c.title.split(' ')[0])}`}>Explore related <ArrowUpRight size={16}/></Link></header><div className="collection-strip">{c.ids.map(id=>{const r=references.find(x=>x.id===id);return r?<ReferenceCard key={id} item={r}/>:null})}</div></section>)}</div></main>}
