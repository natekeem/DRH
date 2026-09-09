import type { DemoRecipe } from './recipes'
import { batch1StyleRecipes } from './batch1Styles'
import { batch1PatternRecipes } from './batch1Patterns'
import { batch1AgencyRecipe } from './batch1Agency'
import catalog from '../../data/batch1Catalog.json'
import sources from '../../../docs/licenses/batch1/sources.json'
import neumorphismLicense from '../../../docs/licenses/batch1/ui-neumorphism-LICENSE.txt?raw'
import tactileLicense from '../../../docs/licenses/batch1/tactile-ui-LICENSE.txt?raw'
import sheetLicense from '../../../docs/licenses/batch1/pure-web-bottom-sheet-LICENSE.txt?raw'
import commandLicense from '../../../docs/licenses/batch1/ui-components-LICENSE.txt?raw'
import toastLicense from '../../../docs/licenses/batch1/react-hot-toast-LICENSE.txt?raw'
import skeletonLicense from '../../../docs/licenses/batch1/react-loading-skeleton-LICENSE.txt?raw'
import segmentedLicense from '../../../docs/licenses/batch1/segmented-LICENSE.txt?raw'

const licenses: Record<string,string> = {
 'AKAspanion/ui-neumorphism':neumorphismLicense,'KzqKzq/tactile-ui':tactileLicense,
 'viliket/pure-web-bottom-sheet':sheetLicense,'starc007/ui-components':commandLicense,
 'timolins/react-hot-toast':toastLicense,'dvtng/react-loading-skeleton':skeletonLicense,
 'react-component/segmented':segmentedLicense,
}
export const batch1Recipes: Record<string,DemoRecipe> = {
 ...batch1StyleRecipes,...batch1PatternRecipes,'page-agency':batch1AgencyRecipe,
}
for(const item of catalog){
 const recipe=batch1Recipes[item.demo]
 recipe.js=(recipe.js??'')+"\ndocument.querySelector('main').dataset.ready='true';"
 const source=sources.find(s=>s.repository===item.repository)
 recipe.sourceNotes=source
  ? `Hub Original / MIT — canonical acceptance와 검토한 동작을 바탕으로 독립 구현. Upstream 코드·자산·폰트·런타임을 복사하지 않았습니다. 검토 소스: ${source.repository}@${source.commit}; ${source.reviewedFiles.map(f=>f.path).join(', ')}. ${source.evidenceUrl}. ${item.source.note}`
  : `Hub Original / MIT — ${item.source.title} (${item.source.url})는 ${item.source.scope}입니다. 원본 코드·문구·이미지·브랜드를 복사하지 않고 canonical acceptance에 따라 독립 구현했습니다. 원본의 ${item.source.license}와 DRH 구현의 MIT를 구분합니다.`
 recipe.notices=recipe.sourceNotes+(source?'\n\nReviewed upstream notice (retained for provenance; no upstream code bundled):\n'+licenses[source.repository]:'')
 recipe.acceptance+=' Canonical: '+item.canonicalAcceptance
 recipe.responsive='Card와 Detail은 같은 DOM/상태 로직을 사용한다. 부모 컨테이너의 실제 너비에 따라 440px 이하에서 여백·타입·보조 정보를 조정한다. 작은 Card와 모바일에서는 내부 스크롤을 허용하며 필수 컨트롤을 제거하지 않는다. UI Patterns는 fixed-object, 스타일과 Agency는 scale-sensitive 정책을 사용한다. 터치와 키보드 입력을 유지하며 reduced-motion은 장식 이동만 제거한다.'
}
