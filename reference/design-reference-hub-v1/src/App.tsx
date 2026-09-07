import { Route, Routes } from 'react-router-dom'
import { SiteHeader } from './components/SiteHeader'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { ReferencePage } from './pages/ReferencePage'
import { CollectionsPage } from './pages/CollectionsPage'
import { SourcesPage } from './pages/SourcesPage'

function Footer(){return <footer className="site-footer"><div><b>DRH.</b><span>Design Reference Hub</span></div><p>See it. Name it. Build it. Curated for people and coding agents.</p><small>Source provenance and license evidence belong with every reference.</small></footer>}

export default function App(){return <><SiteHeader/><Routes><Route path="/" element={<HomePage/>}/><Route path="/explore" element={<ExplorePage/>}/><Route path="/collections" element={<CollectionsPage/>}/><Route path="/sources" element={<SourcesPage/>}/><Route path="/reference/:id" element={<ReferencePage/>}/><Route path="*" element={<HomePage/>}/></Routes><Footer/></>}
