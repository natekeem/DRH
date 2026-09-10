# License / Ingestion Notes

이 패키지는 코드, premium prompt, third-party screenshot을 포함하지 않는다.
수집한 것은 공개적으로 확인 가능한 **이름, 기능 개념, 라이선스 상태, URL, DRH용 독립 요약**뿐이다.

## 바로 import 후보
MIT/Apache/ISC 등 permissive license가 명확한 공개 소스만 실제 코드 ingestion 대상으로 삼는다.
이번 신규 후보 중 대표:
- ShaderGradient
- beUI
- AI Canvas **free repo only**
- Velora UI
- UseLayouts
- UI TripleD
- Great UI
- Creative Tim UI
- FLUX UI
- itsjwill Motion Primitives
- metal-fx
- fluidkit
- gooey-react
- gooey-toast
- Intent UI
- Mischief UI
- snapcn

각 실제 import 시:
1. exact upstream commit 고정
2. LICENSE/NOTICE 보존
3. copied/adapted/derived 여부 기록
4. font/image/logo/trademark 권리는 별도 검증
5. standalone export에도 필요한 notice 포함

## Free/Open-core 분리 필요
- AI Canvas: free repo MIT, premium proprietary.
- Wensity: free MIT items와 pro offerings 분리.
- snapcn: 현재 free registry MIT, 향후 pro는 별도.
- Creative Tim UI 등도 dependency/assets는 별도 라이선스 가능.

## Reference / Discovery only
- Refero Styles: bulk catalog redistribution 권한 미확인.
- design-isms: root redistribution license 미확인.
- MotionSites: premium prompt library.
- PromptSites: all-rights-reserved.
- GetLayers: prompt/source-template redistribution 제한.
- Framer Marketplace: free item이라도 competing/internal catalog mirror 허용으로 해석하지 않음.
- React Bits: MIT + Commons Clause → component catalog redistribution 부적합.
- Aceternity UI: component/source redistribution 제한.

## Legal conflict / verify first
### Lightswind UI
GitHub repository에는 MIT LICENSE가 있으나,
현재 website license는 standalone source redistribution / rival UI kit / public registry를 금지한다.
DRH 같은 catalog에는 **REFERENCE / LEGAL CONFLICT**로 두고 scope가 명확해질 때까지 vendor하지 않는다.

### Rendyn
사이트는 개별 컴포넌트를 MIT + complete editable source라고 표기하지만,
이번 조사에서 bulk-access 가능한 공개 repo/배포 경로를 독립적으로 확인하지 못했다.
따라서 `REFERENCE / ACCESS VERIFY`.

## User-provided repos with no verified license
- Shatlyk1011/agency-website
- j0nghyeok/opic-mock-test

둘 다 구조/UX/reference로만 사용하고 코드를 DRH에 복제하지 않는다.
