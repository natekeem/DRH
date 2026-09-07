import { Route, Routes } from 'react-router-dom'
import { SiteHeader } from './components/SiteHeader'
import { RouteEffects } from './components/RouteEffects'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { ReferencePage } from './pages/ReferencePage'
import { CollectionsPage } from './pages/CollectionsPage'
import { SourcesPage } from './pages/SourcesPage'

function Footer(){return <footer className="site-footer"><div><b>DRH.</b><span>Design Reference Hub</span></div><p>좋은 것을 보고, 정확한 이름을 알고, 바로 가져다 쓰는 Visual Reference Library.</p><small>각 Reference에는 Source와 License 판단 근거를 함께 유지합니다.</small></footer>}

export default function App(){return <><RouteEffects/><SiteHeader/><Routes><Route path="/" element={<HomePage/>}/><Route path="/explore" element={<ExplorePage/>}/><Route path="/collections" element={<CollectionsPage/>}/><Route path="/sources" element={<SourcesPage/>}/><Route path="/reference/:id" element={<ReferencePage/>}/><Route path="*" element={<HomePage/>}/></Routes><Footer/></>}
