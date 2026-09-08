import { lazy, Suspense } from 'react'
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { SiteHeader } from './components/SiteHeader'
import { RouteEffects } from './components/RouteEffects'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { ReferencePage } from './pages/ReferencePage'
import { SourcesPage } from './pages/SourcesPage'

const GuidesPage = lazy(()=>import('./pages/GuidesPage').then(m=>({default:m.GuidesPage})))
const GuideArticle = lazy(()=>import('./pages/GuidesPage').then(m=>({default:m.GuideArticle})))

function CollectionsRedirect(){const location=useLocation();return <Navigate to={'/explore?view=collections'+location.hash} replace/>}
function Footer(){return <footer className="site-footer"><div className="footer-brand"><b>DRH.</b><span>Design Reference Hub</span></div><div className="footer-copy"><p>좋은 것을 보고, 정확한 이름을 알고, 바로 가져다 쓰는 Visual Reference Library.</p><small>Source와 License를 숨기지 않고 Reference별로 함께 기록합니다.</small></div><div className="footer-links"><a href="#/explore">Explore</a><a href="#/collections">Collections</a><a href="#/sources">Sources</a></div></footer>}

export default function App(){return <><RouteEffects/><SiteHeader/><Suspense fallback={<main className="not-found" role="status">불러오는 중입니다…</main>}><Routes><Route path="/" element={<HomePage/>}/><Route path="/explore" element={<ExplorePage/>}/><Route path="/collections" element={<CollectionsRedirect/>}/><Route path="/guides" element={<GuidesPage/>}/><Route path="/guides/:slug" element={<GuideArticle/>}/><Route path="/sources" element={<SourcesPage/>}/><Route path="/reference/:id" element={<ReferencePage/>}/><Route path="*" element={<HomePage/>}/></Routes></Suspense><Footer/></>}
