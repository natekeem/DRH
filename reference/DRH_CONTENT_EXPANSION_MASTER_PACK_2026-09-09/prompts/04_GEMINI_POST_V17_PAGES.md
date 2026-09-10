# Gemini 3.1 Pro High — DRH Post-V1.7 Page/Section Batch

Run after the earlier batches.

Implement:
- Interactive Hero
- Masonry Showcase
- Animated Feature Showcase
- Interactive Product Demo
- AI Chat / Agent Workspace
- Ecommerce Product Landing

Agency Landing is handled in Batch 1.

Read each source mapping first.

Page/Section rule:
Do not mirror a third-party website. Compose a neutral DRH demo from permissive patterns.
No remote screenshots, logos, proprietary photos or paid assets.

Interactive Product Demo:
use Spotlane (MIT) as architecture reference; create local neutral product screens/hotspots.

AI Chat / Agent Workspace:
use AI Elements / assistant-ui / Tool UI / shadcn chatbot-template as architecture references.
No external AI API required in preview: simulate stream/tool/approval/artifact states locally.

Masonry:
use real variable-height packing, not equal-height grid.

For every page:
Card preview must still communicate the page pattern.
Detail should be scrollable/interactive and look like a plausible product, not a wireframe.

Commit:
feat: expand DRH with product page and section references
