import { recipes } from '../lib/demos/recipes'
import { designSystemFor, designMarkdown } from '../lib/designSystem'
import upstreamReview from '../../docs/licenses/upstream-review.json'
import { vendorEntries, UPSTREAM_COMMIT, UPSTREAM_REPO } from './awesomeDesignMd'
import type { Category, ReferenceItem } from '../types'

// Re-export upstream constants so other modules can import them from references
export { UPSTREAM_COMMIT, UPSTREAM_REPO }

type Seed = {
  id: string
  name: string
  category: Category
  subcategory: string
  demo: string
  description: string
  tags: string[]
  useCases: string[]
  featured?: boolean
  wow?: boolean
  source?: string
  sourceUrl?: string
  repo?: string
  license?: string
  licenseStatus?: 'copy-ok' | 'reference' | 'restricted'
  dependencies?: string[]
  code?: string
  designMd?: string
}

const promptFor = (s: Seed) => `Create a ${s.name} treatment for a modern web interface. ${s.description} Use it for ${s.useCases.join(', ')}. Keep the interaction purposeful, responsive, keyboard-safe where relevant, and provide a reduced-motion fallback.`

const mk = (s: Seed): ReferenceItem => ({
  ...s,
  ...(s.category === 'DESIGN.md' && designSystemFor(s.id) ? { designSystem: designSystemFor(s.id), designMd: designMarkdown(s.name, s.description, designSystemFor(s.id)!) } : {}),
  implementation: {
    type: s.demo === 'shader-gradient' ? 'native' : 'hub-original',
    framework: s.demo === 'shader-gradient' ? 'React + WebGL' : /liquid|rgb-lens/.test(s.demo) ? 'HTML + WebGL' : recipes[s.demo] ? 'HTML + CSS + JavaScript' : 'React + CSS',
    dependencies: s.dependencies ?? [],
  },
  prompt: promptFor(s),
  source: {
    name: s.source ?? 'Design Reference Hub',
    url: s.sourceUrl ?? '',
    repository: s.repo,
  },
  license: {
    name: s.license ?? 'MIT (Hub original demo)',
    status: s.licenseStatus ?? 'copy-ok',
    evidenceUrl: s.repo && upstreamReview.find(r=>'https://github.com/'+r.repository===s.repo)?.license !== 'unverified' ? upstreamReview.find(r=>'https://github.com/'+r.repository===s.repo)?.evidence : s.demo === 'shader-gradient' ? 'https://github.com/ruucm/shadergradient/blob/main/packages/shadergradient/package.json' : s.source === 'Magic UI' ? 'https://github.com/magicuidesign/magicui/blob/main/LICENSE.md' : 'https://github.com/natekeem/DRH/blob/main/LICENSE',
    attributionRequired: s.demo === 'shader-gradient' || s.demo === 'meteors',
    notes: s.demo === 'shader-gradient' ? '공식 패키지의 MIT 선언을 확인했습니다. 설치한 dependency 고지를 유지하세요.' : s.demo === 'meteors' ? 'Magic UI MIT 고지 전문을 실행 HTML에 포함합니다.' : 'Hub 독립 구현은 MIT입니다. 참고 Source 링크는 upstream 코드를 복사했다는 뜻이 아닙니다.',
  },
})

export const references: ReferenceItem[] = [
  // Styles
  mk({ id:'minimalism', name:'Minimalism', category:'Styles', subcategory:'Core', demo:'style-minimal', description:'Quiet hierarchy, generous whitespace, restrained color and only necessary UI.', tags:['clean','white-space','neutral'], useCases:['SaaS','documentation','product'], featured:true }),
  mk({ id:'neo-brutalism', name:'Neo-Brutalism', category:'Styles', subcategory:'Bold', demo:'style-brutal', description:'Thick borders, blunt geometry, loud color and intentionally mechanical layouts.', tags:['bold','border','playful'], useCases:['creative landing','portfolio','campaign'], featured:true }),
  mk({ id:'glassmorphism', name:'Glassmorphism', category:'Styles', subcategory:'Material', demo:'style-glass', description:'Translucent surfaces, backdrop blur, fine highlights and layered depth.', tags:['glass','blur','layer'], useCases:['hero','dashboard','music'], featured:true }),
  mk({ id:'liquid-glass', name:'Liquid Glass', category:'Styles', subcategory:'Material', demo:'liquid-lens', description:'A moving lens-like material with refraction, glow and elastic response.', tags:['liquid','refraction','glass'], useCases:['hero','creative landing','showcase'], featured:true, wow:true }),
  mk({ id:'bento', name:'Bento Grid', category:'Styles', subcategory:'Layout', demo:'style-bento', description:'Asymmetric modular cards that package several stories into one scan-friendly canvas.', tags:['grid','cards','modular'], useCases:['SaaS','AI tool','feature overview'], featured:true }),
  mk({ id:'editorial', name:'Editorial', category:'Styles', subcategory:'Typography', demo:'style-editorial', description:'Strong reading rhythm, oversized type, rule lines, captions and image-led storytelling.', tags:['type','magazine','story'], useCases:['portfolio','brand','article'], featured:true }),
  mk({ id:'swiss', name:'Swiss / International', category:'Styles', subcategory:'Typography', demo:'style-swiss', description:'Strict grid, sans-serif typography, asymmetry and precise visual order.', tags:['grid','type','systematic'], useCases:['portfolio','identity','data story'] }),
  mk({ id:'y2k', name:'Y2K', category:'Styles', subcategory:'Retro', demo:'style-y2k', description:'Chrome, gradients, bubbles and early-web optimism reinterpreted for modern interfaces.', tags:['retro','chrome','bubble'], useCases:['campaign','music','fashion'], featured:true }),
  mk({ id:'frutiger-aero', name:'Frutiger Aero', category:'Styles', subcategory:'Retro', demo:'style-frutiger', description:'Glossy blues and greens, bubbles, glass and nature-tech optimism.', tags:['aero','glossy','nature'], useCases:['playful landing','education','experimental'] }),
  mk({ id:'terminal', name:'Terminal Aesthetic', category:'Styles', subcategory:'Developer', demo:'style-terminal', description:'Monospace hierarchy, prompts, compact status readouts and sparse accent color.', tags:['developer','mono','cli'], useCases:['developer tool','AI agent','documentation'], featured:true }),
  mk({ id:'claymorphism', name:'Claymorphism', category:'Styles', subcategory:'Material', demo:'style-clay', description:'Soft inflated surfaces with rounded forms and playful tactile shadows.', tags:['soft','3d','rounded'], useCases:['education','consumer app','kids'] }),
  mk({ id:'cyberpunk', name:'Cyberpunk', category:'Styles', subcategory:'Futuristic', demo:'style-cyber', description:'Dark surfaces, neon signals, grid overlays and aggressive futuristic contrast.', tags:['neon','dark','future'], useCases:['game','security','experimental'] }),
  mk({ id:'luxury', name:'Luxury', category:'Styles', subcategory:'Brand', demo:'style-luxury', description:'Controlled restraint, serif display type, premium spacing and polished media treatment.', tags:['premium','serif','fashion'], useCases:['fashion','hotel','automotive'] }),
  mk({ id:'dark-ui', name:'Dark UI', category:'Styles', subcategory:'Core', demo:'style-dark', description:'Low-luminance surfaces with deliberate contrast, glow and accessible text hierarchy.', tags:['dark','contrast','product'], useCases:['developer tool','media','dashboard'] }),

  // Background
  mk({ id:'shader-gradient', name:'Shader Gradient', category:'Background', subcategory:'Shader', demo:'shader-gradient', description:'A moving 3D mesh gradient rendered in WebGL.', tags:['shader','webgl','gradient','3d'], useCases:['hero','landing','portfolio'], featured:true, wow:true, source:'ShaderGradient', sourceUrl:'https://shadergradient.co/', repo:'https://github.com/ruucm/shadergradient', license:'MIT', dependencies:['@shadergradient/react','@react-three/fiber','three'] }),
  mk({ id:'aurora-background', name:'Aurora Background', category:'Background', subcategory:'Gradient', demo:'aurora', description:'Soft moving ribbons of color that feel atmospheric without obscuring content.', tags:['aurora','gradient','ambient'], useCases:['hero','AI product','developer tool'], featured:true }),
  mk({ id:'gradient-mesh', name:'Animated Gradient Mesh', category:'Background', subcategory:'Gradient', demo:'gradient-mesh', description:'Several blurred color fields drift and blend into a living mesh.', tags:['mesh','gradient','blob'], useCases:['hero','brand','campaign'] }),
  mk({ id:'particles', name:'Interactive Particles', category:'Background', subcategory:'Particles', demo:'particles', description:'A lightweight point field reacts to pointer position and nearby particles.', tags:['particles','cursor','canvas'], useCases:['tech landing','data','AI'], featured:true, source:'tsParticles', sourceUrl:'https://particles.js.org/', repo:'https://github.com/tsparticles/tsparticles', license:'MIT' }),
  mk({ id:'meteors', name:'Meteors', category:'Background', subcategory:'Particles', demo:'meteors', description:'Diagonal streaks cross a dark surface to add restrained kinetic energy.', tags:['meteor','streak','space'], useCases:['developer tool','launch','dark hero'], source:'Magic UI', sourceUrl:'https://magicui.design/', repo:'https://github.com/magicuidesign/magicui', license:'MIT' }),
  mk({ id:'dot-grid', name:'Interactive Dot Grid', category:'Background', subcategory:'Grid', demo:'dot-grid', description:'A field of dots brightens and scales around the pointer.', tags:['dots','grid','cursor'], useCases:['tool','dashboard','hero'] }),
  mk({ id:'retro-grid', name:'Retro Perspective Grid', category:'Background', subcategory:'Grid', demo:'retro-grid', description:'Perspective grid lines recede into a luminous horizon.', tags:['grid','retro','perspective'], useCases:['Y2K','music','game'] }),
  mk({ id:'spotlight-background', name:'Pointer Spotlight', category:'Background', subcategory:'Light', demo:'spotlight', description:'A radial light follows the pointer and reveals texture beneath it.', tags:['spotlight','cursor','light'], useCases:['dashboard','dark landing','feature section'], featured:true }),
  mk({ id:'beams', name:'Light Beams', category:'Background', subcategory:'Light', demo:'beams', description:'Soft diagonal beams sweep slowly through layered haze.', tags:['beam','light','ambient'], useCases:['hero','luxury','AI'] }),
  mk({ id:'wave-lines', name:'Wave Lines', category:'Background', subcategory:'Lines', demo:'waves', description:'Layered vector-like lines undulate across the background.', tags:['wave','line','flow'], useCases:['data','fintech','tech'] }),
  mk({ id:'noise-blobs', name:'Noise Blobs', category:'Background', subcategory:'Organic', demo:'noise-blobs', description:'Organic blurred shapes drift beneath a fine grain layer.', tags:['blob','grain','organic'], useCases:['editorial','creative','brand'] }),
  mk({ id:'fluid-cursor', name:'Fluid Cursor Field', category:'Background', subcategory:'Fluid', demo:'fluid-cursor', description:'Colorful smoke-like fields bloom where the pointer moves.', tags:['fluid','smoke','cursor'], useCases:['hero','creative studio','showcase'], featured:true, wow:true }),
  mk({ id:'metaballs', name:'Interactive Metaballs', category:'Background', subcategory:'Organic', demo:'metaballs', description:'Soft cells merge visually and repel around the pointer.', tags:['metaball','blob','cursor'], useCases:['experimental','science','creative'], wow:true }),
  mk({ id:'starfield', name:'Starfield', category:'Background', subcategory:'Particles', demo:'starfield', description:'Layered stars drift at different depths for gentle spatial motion.', tags:['stars','space','depth'], useCases:['product launch','space','developer'] }),

  // Motion
  mk({ id:'scroll-reveal', name:'Scroll Reveal', category:'Motion', subcategory:'Scroll', demo:'scroll-reveal', description:'Content enters as it approaches the viewport with controlled opacity and position.', tags:['scroll','reveal','entrance'], useCases:['landing','story','feature section'], source:'Motion Primitives', sourceUrl:'https://motion-primitives.com/', repo:'https://github.com/ibelick/motion-primitives', license:'MIT' }),
  mk({ id:'parallax', name:'Mouse Parallax', category:'Motion', subcategory:'Pointer', demo:'parallax', description:'Foreground and background elements move at different rates around the pointer.', tags:['parallax','cursor','depth'], useCases:['hero','portfolio','campaign'], featured:true }),
  mk({ id:'hover-lift', name:'Hover Lift', category:'Motion', subcategory:'Hover', demo:'hover-lift', description:'Cards lift with shadow and subtle scale to signal affordance.', tags:['hover','card','lift'], useCases:['gallery','pricing','dashboard'] }),
  mk({ id:'magnetic-button', name:'Magnetic Button', category:'Motion', subcategory:'Pointer', demo:'magnetic-button', description:'A button pulls slightly toward the pointer before springing back.', tags:['magnetic','button','cursor'], useCases:['CTA','creative landing','portfolio'], featured:true }),
  mk({ id:'card-tilt', name:'Card Tilt', category:'Motion', subcategory:'Pointer', demo:'tilt-card', description:'A card rotates in 3D according to pointer position.', tags:['tilt','3d','cursor'], useCases:['pricing','portfolio','showcase'], source:'Vanilla Tilt', sourceUrl:'https://micku7zu.github.io/vanilla-tilt.js/', repo:'https://github.com/micku7zu/vanilla-tilt.js', license:'MIT' }),
  mk({ id:'image-trail', name:'Cursor Image Trail', category:'Motion', subcategory:'Pointer', demo:'image-trail', description:'Preview tiles appear along the cursor path and dissolve behind it.', tags:['image','trail','cursor'], useCases:['gallery','creative hero','portfolio'], featured:true, wow:true }),
  mk({ id:'marquee', name:'Infinite Marquee', category:'Motion', subcategory:'Loop', demo:'marquee', description:'A seamless strip of labels or logos loops continuously.', tags:['marquee','loop','ticker'], useCases:['logo cloud','social proof','news'] }),
  mk({ id:'sticky-story', name:'Sticky Scroll Story', category:'Motion', subcategory:'Scroll', demo:'sticky-story', description:'One panel remains pinned while adjacent content advances through narrative steps.', tags:['sticky','scroll','story'], useCases:['product story','case study','explainer'] }),
  mk({ id:'horizontal-scroll', name:'Horizontal Scroll', category:'Motion', subcategory:'Scroll', demo:'horizontal-scroll', description:'Vertical wheel input advances a horizontal sequence of panels.', tags:['horizontal','scroll','gallery'], useCases:['portfolio','timeline','gallery'] }),
  mk({ id:'cursor-follow', name:'Cursor Follower', category:'Motion', subcategory:'Pointer', demo:'cursor-follow', description:'A soft follower lags behind the pointer to add tactile feedback.', tags:['cursor','follow','lag'], useCases:['creative site','gallery','brand'] }),
  mk({ id:'ripple', name:'Ripple Interaction', category:'Motion', subcategory:'Click', demo:'ripple', description:'Clicking emits a circular wave from the interaction point.', tags:['ripple','click','feedback'], useCases:['buttons','cards','touch UI'] }),
  mk({ id:'morph', name:'Shape Morph', category:'Motion', subcategory:'Transition', demo:'morph', description:'A blob smoothly transitions between distinct silhouettes.', tags:['morph','shape','transition'], useCases:['hero','loading','brand moment'] }),
  mk({ id:'accordion-motion', name:'Accordion Motion', category:'Motion', subcategory:'Component', demo:'accordion', description:'Expandable content animates height, opacity and icon state together.', tags:['accordion','expand','collapse'], useCases:['FAQ','settings','documentation'] }),

  // Text
  mk({ id:'typewriter', name:'Typewriter', category:'Text', subcategory:'Reveal', demo:'typewriter', description:'Text appears character-by-character with a caret.', tags:['typing','caret','text'], useCases:['developer tool','AI','hero'], source:'TypewriterJS', sourceUrl:'https://safi.me.uk/typewriterjs/', repo:'https://github.com/tameemsafi/typewriterjs', license:'MIT' }),
  mk({ id:'text-reveal', name:'Text Reveal', category:'Text', subcategory:'Reveal', demo:'text-reveal', description:'Words slide from masked lines in a choreographed sequence.', tags:['mask','reveal','headline'], useCases:['hero','section title','editorial'], featured:true }),
  mk({ id:'blur-reveal', name:'Blur Reveal', category:'Text', subcategory:'Reveal', demo:'blur-reveal', description:'Text resolves from soft blur into crisp focus.', tags:['blur','focus','reveal'], useCases:['hero','modal','story'] }),
  mk({ id:'split-text', name:'Split Text', category:'Text', subcategory:'Kinetic', demo:'split-text', description:'Characters animate independently to create typographic rhythm.', tags:['split','characters','kinetic'], useCases:['hero','campaign','portfolio'], source:'Splitting.js', sourceUrl:'https://splitting.js.org/', repo:'https://github.com/shshaw/Splitting', license:'MIT' }),
  mk({ id:'gradient-text', name:'Gradient Text', category:'Text', subcategory:'Color', demo:'gradient-text', description:'A gradient is clipped into oversized typography.', tags:['gradient','headline','color'], useCases:['hero','AI','brand'] }),
  mk({ id:'shimmer-text', name:'Shimmer Text', category:'Text', subcategory:'Light', demo:'shimmer-text', description:'A moving highlight sweeps across letters.', tags:['shimmer','light','text'], useCases:['AI status','premium','CTA'] }),
  mk({ id:'scramble-text', name:'Scramble Text', category:'Text', subcategory:'Kinetic', demo:'scramble-text', description:'Random glyphs rapidly resolve into the final phrase.', tags:['scramble','decode','terminal'], useCases:['developer tool','cyberpunk','loading'] }),
  mk({ id:'rotating-words', name:'Rotating Words', category:'Text', subcategory:'Loop', demo:'rotating-words', description:'One phrase slot cycles through multiple words.', tags:['rotate','words','loop'], useCases:['hero','product value','campaign'] }),
  mk({ id:'number-ticker', name:'Number Ticker', category:'Text', subcategory:'Data', demo:'number-ticker', description:'Numeric values roll into place like an odometer.', tags:['number','counter','data'], useCases:['stats','dashboard','social proof'] }),
  mk({ id:'highlight-animation', name:'Hand-drawn Highlight', category:'Text', subcategory:'Annotation', demo:'rough-highlight', description:'A hand-drawn marker stroke animates underneath key words.', tags:['highlight','annotation','handdrawn'], useCases:['education','marketing','editorial'], source:'Rough Notation', sourceUrl:'https://roughnotation.com/', repo:'https://github.com/rough-stuff/rough-notation', license:'MIT' }),

  // Effects
  mk({ id:'glass-card', name:'Glass Card', category:'Effects', subcategory:'Surface', demo:'glass-card', description:'A translucent card blurs the background with subtle edge highlights.', tags:['glass','card','blur'], useCases:['dashboard','hero','music'], featured:true }),
  mk({ id:'glow-card', name:'Glow Card', category:'Effects', subcategory:'Light', demo:'glow-card', description:'A halo blooms around the card edge on hover.', tags:['glow','hover','card'], useCases:['pricing','feature','dark UI'] }),
  mk({ id:'spotlight-card', name:'Spotlight Card', category:'Effects', subcategory:'Light', demo:'spotlight-card', description:'A radial highlight tracks the pointer inside the card surface.', tags:['spotlight','card','cursor'], useCases:['feature grid','pricing','dashboard'], featured:true }),
  mk({ id:'animated-border', name:'Animated Border', category:'Effects', subcategory:'Border', demo:'animated-border', description:'A luminous gradient travels continuously around a component border.', tags:['border','gradient','loop'], useCases:['CTA','premium card','AI'] }),
  mk({ id:'shimmer-button', name:'Shimmer Button', category:'Effects', subcategory:'Button', demo:'shimmer-button', description:'A light sweep adds tactile emphasis to a primary CTA.', tags:['button','shimmer','CTA'], useCases:['hero','pricing','conversion'], source:'Magic UI', sourceUrl:'https://magicui.design/', repo:'https://github.com/magicuidesign/magicui', license:'MIT' }),
  mk({ id:'liquid-lens-effect', name:'Liquid Lens', category:'Effects', subcategory:'Pointer', demo:'liquid-lens', description:'A pointer-following lens magnifies and distorts the content beneath it.', tags:['lens','liquid','cursor'], useCases:['hero','gallery','showcase'], featured:true, wow:true }),
  mk({ id:'rgb-lens', name:'RGB Lens Reveal', category:'Effects', subcategory:'Pointer', demo:'rgb-lens', description:'A pointer lens reveals saturated content with chromatic separation.', tags:['lens','rgb','reveal'], useCases:['creative hero','gallery','fashion'], wow:true }),
  mk({ id:'image-reveal', name:'Image Reveal', category:'Effects', subcategory:'Media', demo:'image-reveal', description:'A mask slides across media to reveal it with directional motion.', tags:['image','mask','reveal'], useCases:['portfolio','case study','gallery'] }),
  mk({ id:'comparison-slider', name:'Image Comparison', category:'Effects', subcategory:'Media', demo:'comparison-slider', description:'A draggable divider compares two visual states.', tags:['before-after','drag','image'], useCases:['redesign','photo','case study'] }),
  mk({ id:'confetti', name:'Confetti Burst', category:'Effects', subcategory:'Celebration', demo:'confetti', description:'A compact particle burst celebrates a completed action.', tags:['confetti','success','particles'], useCases:['signup','goal','achievement'] }),

  // Sections
  mk({ id:'hero-section', name:'Hero Section', category:'Sections', subcategory:'Marketing', demo:'section-hero', description:'A focused above-the-fold section with headline, proof and primary action.', tags:['hero','CTA','landing'], useCases:['landing page','product','SaaS'], featured:true }),
  mk({ id:'navbar-section', name:'Floating Navbar', category:'Sections', subcategory:'Navigation', demo:'section-navbar', description:'A compact floating navigation bar with soft glass treatment.', tags:['navbar','floating','navigation'], useCases:['landing','portfolio','product'] }),
  mk({ id:'bento-section', name:'Bento Feature Grid', category:'Sections', subcategory:'Features', demo:'section-bento', description:'A modular feature section mixing text, stats and visual panels.', tags:['bento','features','grid'], useCases:['SaaS','AI','product'], featured:true }),
  mk({ id:'logo-cloud', name:'Logo Cloud', category:'Sections', subcategory:'Proof', demo:'section-logos', description:'A quiet band of customer or partner marks builds trust.', tags:['logos','proof','brands'], useCases:['B2B','SaaS','enterprise'] }),
  mk({ id:'stats-section', name:'Statistics', category:'Sections', subcategory:'Proof', demo:'section-stats', description:'Large numbers communicate adoption, performance or business scale.', tags:['stats','numbers','proof'], useCases:['landing','annual report','dashboard'] }),
  mk({ id:'timeline-section', name:'Timeline', category:'Sections', subcategory:'Story', demo:'section-timeline', description:'Milestones are organized along a readable chronological rail.', tags:['timeline','milestone','story'], useCases:['roadmap','company','process'] }),
  mk({ id:'pricing-section', name:'Pricing Cards', category:'Sections', subcategory:'Conversion', demo:'section-pricing', description:'Tier cards compare plans with a visually dominant recommended option.', tags:['pricing','tiers','CTA'], useCases:['SaaS','subscription','service'] }),
  mk({ id:'testimonials-section', name:'Testimonials', category:'Sections', subcategory:'Proof', demo:'section-testimonials', description:'Customer quotes pair concise stories with identity cues.', tags:['testimonial','quote','social proof'], useCases:['SaaS','agency','product'] }),
  mk({ id:'comparison-section', name:'Feature Comparison', category:'Sections', subcategory:'Conversion', demo:'section-comparison', description:'A matrix compares options across a small set of meaningful criteria.', tags:['comparison','table','features'], useCases:['pricing','migration','product'] }),
  mk({ id:'faq-section', name:'FAQ', category:'Sections', subcategory:'Support', demo:'section-faq', description:'Expandable questions resolve objections without overwhelming the page.', tags:['FAQ','accordion','support'], useCases:['landing','pricing','docs'] }),
  mk({ id:'cta-section', name:'CTA Banner', category:'Sections', subcategory:'Conversion', demo:'section-cta', description:'A high-contrast closing panel gives the page one decisive next action.', tags:['CTA','banner','conversion'], useCases:['landing','signup','contact'] }),
  mk({ id:'footer-section', name:'Footer', category:'Sections', subcategory:'Navigation', demo:'section-footer', description:'A structured footer closes the experience with utility navigation and provenance.', tags:['footer','links','legal'], useCases:['all websites'] }),
  mk({ id:'contact-section', name:'Contact Split', category:'Sections', subcategory:'Conversion', demo:'section-contact', description:'Contact details and a simple form are balanced across two columns.', tags:['contact','form','split'], useCases:['agency','enterprise','portfolio'] }),

  // Pages
  mk({ id:'saas-page', name:'SaaS Landing', category:'Pages', subcategory:'Landing', demo:'page-saas', description:'A conversion-focused SaaS page with product promise, proof, features and CTA.', tags:['SaaS','landing','pricing'], useCases:['software','AI','startup'], featured:true, source:'AstroWind', sourceUrl:'https://astrowind.vercel.app/', repo:'https://github.com/onwidget/astrowind', license:'MIT' }),
  mk({ id:'developer-tool-page', name:'Developer Tool', category:'Pages', subcategory:'Landing', demo:'page-devtool', description:'A dark technical landing page built around code, speed and developer proof.', tags:['developer','terminal','code'], useCases:['SDK','API','AI agent'] }),
  mk({ id:'dashboard-page', name:'Dashboard', category:'Pages', subcategory:'Application', demo:'page-dashboard', description:'A dense but calm application shell with KPI cards, navigation and activity.', tags:['dashboard','admin','data'], useCases:['internal tool','analytics','operations'], featured:true, source:'Tremor', sourceUrl:'https://tremor.so/', repo:'https://github.com/tremorlabs/tremor', license:'Apache-2.0' }),
  mk({ id:'docs-page', name:'Documentation', category:'Pages', subcategory:'Content', demo:'page-docs', description:'Sidebar navigation, readable article measure and code examples prioritize scanning.', tags:['docs','sidebar','developer'], useCases:['API','product docs','knowledge base'] }),
  mk({ id:'portfolio-page', name:'Portfolio', category:'Pages', subcategory:'Creative', demo:'page-portfolio', description:'Project-led storytelling with oversized media and minimal chrome.', tags:['portfolio','gallery','creative'], useCases:['designer','studio','photographer'] }),
  mk({ id:'education-page', name:'Explainer / Education', category:'Pages', subcategory:'Content', demo:'page-education', description:'Friendly cards, annotations and clear progressive disclosure simplify complex concepts.', tags:['education','ELI5','learning'], useCases:['training','onboarding','knowledge'] }),
  mk({ id:'admin-page', name:'Internal Admin', category:'Pages', subcategory:'Application', demo:'page-admin', description:'Utility-first management UI with table controls, filters and status pills.', tags:['admin','internal','table'], useCases:['operations','RPA','backoffice'] }),
  mk({ id:'login-page', name:'Login / Signup', category:'Pages', subcategory:'Authentication', demo:'page-login', description:'A focused authentication experience with one clear task and optional brand panel.', tags:['login','signup','auth'], useCases:['SaaS','internal tool','community'] }),
  mk({ id:'event-page', name:'Event Landing', category:'Pages', subcategory:'Landing', demo:'page-event', description:'Time, speakers and registration are staged around a bold campaign identity.', tags:['event','conference','registration'], useCases:['conference','launch','meetup'] }),

  // DESIGN.md
  ...[
    ['minimal-saas','Minimal SaaS','Clean product-first system with quiet neutral surfaces and one accent.','SaaS'],
    ['playful-brutal','Playful Neo-Brutalism','Bright mechanical system with thick borders, blunt shadows and playful type.','Campaign'],
    ['editorial-system','Editorial','Typographic storytelling system with grids, captions and large display type.','Portfolio'],
    ['developer-tool-system','Developer Tool','Dark developer-facing system with monospace utility labels and restrained neon.','Developer Tool'],
    ['corporate-dashboard','Corporate Dashboard','Dense enterprise interface with calm tokens, clear status and compact controls.','Internal Tool'],
    ['luxury-system','Luxury','High-contrast editorial system with serif display type and premium whitespace.','Luxury'],
    ['docs-system','Documentation','Readable documentation system optimized for navigation, code and long-form content.','Documentation'],
    ['dark-futuristic','Dark Futuristic','Dark spatial system with glowing accents, shader backgrounds and crisp type.','AI / Tech'],
    ['educational-system','ELI5 / Educational','Friendly, accessible system with annotations, diagrams and progressive disclosure.','Education'],
    ['bento-saas-system','Bento SaaS','Modular product system centered on bento feature cards and concise proof.','SaaS'],
  ].map(([id,name,description,useCase]) => mk({
    id, name, category:'DESIGN.md', subcategory:'Preset', demo:`designmd-${id}`, description, tags:['design.md','agent','tokens'], useCases:[useCase], featured:id==='minimal-saas'||id==='developer-tool-system', source:'Design Reference Hub' })),

  // VoltAgent awesome-design-md — MIT ingested brand DESIGN.md entries
  // Source: https://github.com/VoltAgent/awesome-design-md  commit: 8147538b
  // Each entry provenance: derived / MIT. Raw DESIGN.md served from /vendor/awesome-design-md/<slug>/DESIGN.md
  ...vendorEntries.map(v => mk({
    id: `admd-${v.slug}`,
    name: v.name,
    category: 'DESIGN.md' as Category,
    subcategory: v.category,
    demo: `vendor-design-md:${v.slug}`,
    description: v.description || `${v.name} design system analysis via awesome-design-md.`,
    tags: [...v.tags, 'brand', 'design.md', 'vendor', 'awesome-design-md'],
    useCases: [v.category],
    source: 'VoltAgent awesome-design-md',
    sourceUrl: `${UPSTREAM_REPO}/tree/main/${v.upstreamPath}`,
    repo: UPSTREAM_REPO,
    license: 'MIT',
    licenseStatus: 'copy-ok' as const,
  })),
]


export const categories: Category[] = ['Styles','Pages','Sections','Background','Motion','Text','Effects','DESIGN.md']

// ── Vendor entry lookup ───────────────────────────────────────────────────────
export const vendorEntryBySlug = Object.fromEntries(vendorEntries.map(v => [v.slug, v]))
export const vendorSlugFromId = (id: string) => id.startsWith('admd-') ? id.slice(5) : null

export const collections = [
  { id:'wow', title:'WOW Landing Effects', description:'High-impact motion and interaction that earns attention in the first 10 seconds.', ids:['shader-gradient','liquid-lens-effect','image-trail','fluid-cursor','rgb-lens','metaballs','parallax','text-reveal'] },
  { id:'glass', title:'Liquid & Glass', description:'Translucency, refraction, soft light and fluid material experiments.', ids:['liquid-glass','glassmorphism','glass-card','liquid-lens-effect','spotlight-card','shader-gradient'] },
  { id:'developer', title:'Developer Tool UI', description:'Dark technical patterns for internal tools, AI agents and developer products.', ids:['terminal','dark-ui','developer-tool-page','docs-page','dashboard-page','meteors','typewriter'] },
  { id:'vibe-styles', title:'Vibe Coding Style Starter', description:'The visual vocabulary people most often know by sight before they know the name.', ids:['neo-brutalism','glassmorphism','bento','editorial','y2k','frutiger-aero','claymorphism','cyberpunk'] },
  { id:'internal', title:'Internal Tool Essentials', description:'Calm practical references for dashboards, operations and citizen-developer tools.', ids:['dashboard-page','admin-page','corporate-dashboard','bento-section','stats-section','comparison-section','faq-section'] },
  { id:'motion', title:'Motion That Explains', description:'Animation patterns that improve hierarchy, feedback and spatial understanding.', ids:['scroll-reveal','hover-lift','accordion-motion','number-ticker','ripple','text-reveal','marquee'] },
  // Brand Design Systems — from VoltAgent/awesome-design-md (MIT)
  { id:'brand-design-systems', title:'Brand Design Systems', description:'Real-world design language analyses from publicly-visible brand websites. Each entry is a DESIGN.md snapshot via VoltAgent awesome-design-md (MIT).', ids:['admd-apple','admd-stripe','admd-notion','admd-linear.app','admd-figma','admd-vercel','admd-cursor','admd-supabase','admd-raycast','admd-spotify','admd-ferrari','admd-tesla'] },
  { id:'brand-ai-llm', title:'AI & LLM Design', description:'Design language patterns from AI-native products — dark cinematics, monochrome precision, and emergent interfaces.', ids:['admd-claude','admd-elevenlabs','admd-ollama','admd-mistral.ai','admd-cohere','admd-minimax','admd-runwayml','admd-x.ai','admd-voltagent'] },
  { id:'brand-developer', title:'Developer Tool Design', description:'Terminal-first, code-forward, dark-native interface design from the tools developers actually use.', ids:['admd-cursor','admd-warp','admd-raycast','admd-expo','admd-superhuman','admd-lovable','admd-vercel','admd-opencode.ai'] },
  { id:'brand-automotive', title:'Automotive & Luxury', description:'High-contrast editorial systems, precision typography, and premium material design from automotive brands.', ids:['admd-ferrari','admd-tesla','admd-bmw','admd-bmw-m','admd-lamborghini','admd-bugatti','admd-renault','admd-spacex'] },
  { id:'brand-retro', title:'Retro Web', description:'Web design aesthetics from a different era — pixel constraints, CRT monitors, and early-internet energy.', ids:['admd-dell-1996','admd-nintendo-2001','admd-hp','admd-playstation','admd-wired','admd-theverge'] },
]

export const featuredReferences = references.filter((r) => r.featured)
export const wowReferences = references.filter((r) => r.wow)

