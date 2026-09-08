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
function Footer(){return <footer className="site-footer"><div className="footer-left"><div className="footer-brand"><b>DRH.</b><span>Design Reference Hub</span></div><p>좋은 디자인을 보고, 정확한 이름을 알고, 바로 가져다 씁니다.</p></div><div className="footer-right"><nav className="footer-links"><a href="#/explore">Explore</a><a href="#/guides">Guides</a><a href="#/sources">Sources</a><a href="https://github.com/natekeem/DRH" target="_blank" rel="noreferrer">GitHub</a></nav><div className="footer-policy"><span>MIT · Source Policy</span></div></div></footer>}

export default function App(){return <><RouteEffects/><SiteHeader/><Suspense fallback={<main className="not-found" role="status">불러오는 중입니다…</main>}><Routes><Route path="/" element={<HomePage/>}/><Route path="/explore" element={<ExplorePage/>}/><Route path="/collections" element={<CollectionsRedirect/>}/><Route path="/guides" element={<GuidesPage/>}/><Route path="/guides/:slug" element={<GuideArticle/>}/><Route path="/sources" element={<SourcesPage/>}/><Route path="/reference/:id" element={<ReferencePage/>}/><Route path="*" element={<HomePage/>}/></Routes></Suspense><Footer/></>}
