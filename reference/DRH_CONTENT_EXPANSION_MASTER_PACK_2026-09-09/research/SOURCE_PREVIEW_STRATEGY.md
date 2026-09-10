# Source Page Preview Strategy

사용자가 Source 목록에서도 "사이트에 들어가기 전에 무엇을 주는 곳인지" 보고 싶어 한다는 요구를 반영한 제안.

## 외부 screenshot 189개를 저장하는 방식은 비추천
이유:
- copyright / site terms / stale screenshot 문제
- 외부망 차단 환경에서 관리가 어려움
- source site가 업데이트될 때 즉시 낡음

## 권장 3종 Preview

### 1) IMPORTABLE OSS
실제 허용된 코드로 **DRH 내부 mini demo**를 렌더링.
예: beUI → Dynamic Island mini demo, metal-fx → metallic ring mini demo.

### 2) DESIGN SYSTEM / DATA SOURCE
실제 token/schema를 바탕으로 **generated design-system preview**.
예: awesome-design-md, Google DESIGN.md.

### 3) REFERENCE ONLY / RESTRICTED
외부 screenshot 대신 DRH가 생성한 summary card:
- 제공 분야 3~5개
- 대표 concept 3개
- stack
- license class
- "Reference only" 표시

예:
GetLayers
[3D Scenes] [Backgrounds] [Gradients]
Cinematic motion / WebGL discovery
REFERENCE ONLY

이렇게 하면 화면이 시각적으로 풍부해지면서도 외부 콘텐츠를 미러링하지 않는다.

## Schema proposal

```ts
preview?: {
  type: 'demo' | 'design-system' | 'generated-summary'
  key?: string
  concepts?: string[]
  stack?: string[]
}
```

`image`는 명시적 사용 허가/자체 생성물일 때만 추가.
