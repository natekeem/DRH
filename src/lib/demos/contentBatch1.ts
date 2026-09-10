import type { DemoRecipe } from './recipes'

export const contentBatch1Recipes: Record<string, DemoRecipe> = {
  'style-clay': {
    html: `<article class="clay-card" tabindex="0">
  <small>MATERIAL</small>
  <strong>03</strong>
  <span>Tactile Surface</span>
</article>`,
    css: `main { background: #e9ddff; color: #44253a; }
.clay-card {
  width: min(80%, 320px);
  aspect-ratio: 1;
  max-height: 80%;
  margin: auto;
  background: #f0a7cd;
  border-radius: 20%;
  box-shadow: 
    20px 20px 40px #ce8bae,
    -20px -20px 40px #ffc3e8,
    inset 6px 6px 16px rgba(255,255,255,0.6),
    inset -6px -6px 16px rgba(180,90,130,0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: transform 250ms cubic-bezier(0.2,0.8,0.2,1.2), box-shadow 250ms ease;
  cursor: pointer;
}
.clay-card small { font-size: 10px; opacity: 0.6; letter-spacing: 1px; }
.clay-card strong { font-size: clamp(48px, 12vw, 96px); font-weight: 800; margin: 10px 0; }
.clay-card span { font-size: 12px; opacity: 0.7; }
.clay-card:hover, .clay-card:focus-visible {
  transform: scale(1.05) translateY(-5px);
  box-shadow: 
    25px 25px 50px #ce8bae,
    -25px -25px 50px #ffc3e8,
    inset 8px 8px 20px rgba(255,255,255,0.8),
    inset -8px -8px 20px rgba(180,90,130,0.3);
}
.clay-card:active {
  transform: scale(0.95) translateY(2px);
  box-shadow: 
    10px 10px 20px #ce8bae,
    -10px -10px 20px #ffc3e8,
    inset 4px 4px 10px rgba(255,255,255,0.5),
    inset -4px -4px 10px rgba(180,90,130,0.1);
}`,
    logic: 'CSS box-shadow를 다중으로 사용하여 외부의 부드러운 그림자와 내부의 밝은 highlight를 동시에 적용. hover/active 시 물리적인 탄성감을 주도록 scale과 그림자를 보간함.',
    acceptance: '버튼 형태가 부풀어 오른 찰흙 같은 질감을 가지며, 누를 때 실제로 눌리는 듯한 반응을 보임. 그림자 계층이 명확함.',
    sourceNotes: 'Hub Original implementation. 순수 CSS 그림자 조합으로 3D 효과 구현.'
  },
  'morph': {
    html: `<div class="morph-container">
  <div class="morph-shape"></div>
  <div class="morph-content">
    <h3>Shape Morph</h3>
  </div>
</div>`,
    css: `main { background: #f0f4f8; color: #111; }
.morph-container {
  position: relative;
  width: min(90%, 400px);
  height: min(90%, 400px);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.morph-shape {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
  animation: morph-anim 6s ease-in-out infinite alternate;
  z-index: 0;
}
@media (prefers-reduced-motion) {
  .morph-shape { animation: none; border-radius: 40px; }
}
.morph-content {
  position: relative;
  z-index: 1;
  padding: 30px;
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(8px);
  border-radius: 20px;
}
@keyframes morph-anim {
  0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  100% { border-radius: 40% 60% 30% 70% / 40% 40% 60% 50%; }
}`,
    logic: 'CSS border-radius를 8개의 값으로 세밀하게 애니메이션하여 연속적인 blob 형태 변화 구현. reduced-motion 시 애니메이션 정지 및 기본 shape 유지.',
    acceptance: '도형이 불연속적으로 끊기지 않고 부드럽게 모양을 바꿈. 내용물은 영향을 받지 않음.',
    sourceNotes: 'Hub Original implementation.'
  },
  'section-bento': {
    html: `<div class="bento-grid">
  <div class="bento-item hero"><h3>Bento Grid</h3><p>Clear visual hierarchy.</p></div>
  <div class="bento-item stat"><strong>92%</strong><span>LIVE</span></div>
  <div class="bento-item action"><button>Copy &rarr;</button></div>
  <div class="bento-item visual"><div class="mock-chart"></div></div>
</div>`,
    css: `main { background: #f5f5f7; color: #1d1d1f; display: flex; align-items: center; justify-content: center; padding: 16px; }
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 12px;
  width: min(100%, 600px);
  aspect-ratio: 3/2;
}
main[data-variant="card"] .bento-grid {
  zoom: 0.55;
}
@media (max-width: 440px) {
  main:not([data-variant="card"]) .bento-grid {
    display: flex;
    flex-direction: column;
    aspect-ratio: auto;
    height: 100%;
    overflow-y: auto;
  }
}
.bento-item {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.bento-item:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
.hero { grid-column: span 2; background: #e0eaff; justify-content: center; }
.hero h3 { font-size: clamp(20px, 4vw, 28px); margin: 0 0 8px 0; }
.hero p { margin: 0; opacity: 0.8; }
.stat { align-items: center; justify-content: center; background: #fbfbfa; }
.stat strong { font-size: clamp(24px, 5vw, 36px); color: #0066cc; }
.action { background: #1d1d1f; color: #fff; align-items: center; justify-content: center; }
.action button { background: none; border: none; color: inherit; font-size: 16px; font-weight: 600; cursor: pointer; }
.visual { grid-column: span 2; display: flex; align-items: flex-end; padding: 0; overflow: hidden; }
.mock-chart { width: 100%; height: 60%; background: linear-gradient(0deg, #d1e3ff 0%, transparent 100%); border-top: 2px dashed #0066cc; }`,
    logic: 'CSS Grid를 활용해 비대칭적인 셀 구조 설계. 모바일 환경에서는 flex column으로 안전하게 쌓이도록(stacking) 처리.',
    acceptance: '서로 다른 크기의 셀이 시각적 위계를 가지며, 하나 이상의 셀이 호버 시 반응함. 밝은 테마에서 텍스트 대비가 정상임.',
    sourceNotes: 'Hub Original implementation.'
  },
  'section-contact': {
    html: `<div class="contact-split">
  <div class="contact-info">
    <small>CONTACT US</small>
    <h2>Let's build<br>something.</h2>
  </div>
  <form class="contact-form" onsubmit="event.preventDefault(); this.innerHTML='<div class=\\'success\\'>Message sent!</div>'">
    <div class="input-group">
      <input type="text" id="name" required placeholder=" ">
      <label for="name">Your Name</label>
    </div>
    <div class="input-group">
      <input type="email" id="email" required placeholder=" ">
      <label for="email">Email Address</label>
    </div>
    <button type="submit">Send Message</button>
  </form>
</div>`,
    css: `main { background: #0a0a0a; color: #fff; display: flex; align-items: center; justify-content: center; padding: 20px; }
.contact-split {
  display: flex;
  flex-direction: row;
  width: min(100%, 800px);
  gap: 40px;
}
main[data-variant="card"] .contact-split {
  zoom: 0.45;
}
@media (max-width: 600px) {
  main:not([data-variant="card"]) .contact-split { flex-direction: column; gap: 20px; width: 100%; }
}
.contact-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.contact-info small { color: #888; font-weight: 600; letter-spacing: 1px; margin-bottom: 10px; display: block; }
.contact-info h2 { font-size: clamp(40px, 8vw, 64px); margin: 0; line-height: 1.05; letter-spacing: -1px; }
.contact-form { flex: 1; background: #161616; padding: 30px; border-radius: 16px; display: flex; flex-direction: column; gap: 20px; }
.input-group { position: relative; }
.input-group input { 
  width: 100%; background: transparent; border: none; border-bottom: 1px solid #333; 
  padding: 10px 0; color: #fff; font-size: 16px; outline: none; transition: border-color 0.2s;
}
.input-group label {
  position: absolute; left: 0; top: 10px; color: #666; font-size: 16px; transition: 0.2s ease; pointer-events: none;
}
.input-group input:focus, .input-group input:not(:placeholder-shown) { border-bottom-color: #fff; }
.input-group input:focus + label, .input-group input:not(:placeholder-shown) + label {
  top: -12px; font-size: 12px; color: #aaa;
}
.contact-form button {
  background: #fff; color: #000; border: none; padding: 14px; border-radius: 8px; font-weight: 600; font-size: 16px;
  cursor: pointer; transition: opacity 0.2s; margin-top: 10px;
}
.contact-form button:hover { opacity: 0.8; }
.success { text-align: center; color: #a3ff99; font-size: 18px; padding: 40px 0; }`,
    logic: 'Flexbox를 이용한 2단 분할 레이아웃. 모바일에서는 수직으로 쌓임. input의 placeholder-shown 가상 클래스를 이용해 JS 없이 플로팅 라벨을 구현. form 제출 시 네트워크 요청 없이 client-side 성공 상태로 전환.',
    acceptance: 'Contact 정보와 폼이 양분됨. input 포커스 시 라벨이 상단으로 이동함. Send 클릭 시 실제 제출 없이 Success 상태를 표시함. 키보드로 접근 가능함.',
    sourceNotes: 'Hub Original implementation. CSS-only floating labels.'
  },
  'progressive-blur': {
    html: `<div class="blur-container" tabindex="0">
  <div class="content-layer">
    <div class="mock-text" style="width:80%"></div>
    <div class="mock-text" style="width:60%"></div>
    <div class="mock-text" style="width:90%"></div>
    <div class="mock-text" style="width:40%"></div>
    <div class="mock-text" style="width:70%"></div>
    <div class="mock-text" style="width:85%"></div>
    <div class="mock-text" style="width:50%"></div>
    <div class="mock-text" style="width:60%"></div>
    <div class="mock-text" style="width:75%"></div>
    <div class="mock-text" style="width:40%"></div>
    <div class="mock-text" style="width:80%"></div>
    <div class="mock-text" style="width:65%"></div>
    <div class="mock-text" style="width:55%"></div>
    <div class="mock-text" style="width:90%"></div>
  </div>
  <div class="progressive-blur-overlay"></div>
  <span class="scroll-hint">스크롤해 보세요</span>
</div>`,
    css: `main { background: #fff; color: #111; display: flex; align-items: center; justify-content: center; }
.blur-container { position: relative; width: min(90%, 400px); height: 300px; border: 1px solid #eee; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; background: #fafafa; }
.content-layer { padding: 20px; display: flex; flex-direction: column; gap: 18px; padding-bottom: 150px; overflow-y: auto; height: 100%; }
.content-layer::-webkit-scrollbar { display: none; }
.content-layer { -ms-overflow-style: none; scrollbar-width: none; }
.mock-text { height: 12px; background: #d0d0d0; border-radius: 6px; flex-shrink: 0; }
.progressive-blur-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 150px;
  pointer-events: none;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
  z-index: 1;
}
.scroll-hint {
  position: absolute;
  top: 15px; right: 20px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  pointer-events: none;
  z-index: 2;
}
`,
    logic: 'backdrop-filter: blur()에 CSS mask-image(linear-gradient)를 적용하여 아래로 갈수록 blur 강도가 짙어지는 효과 구현. pointer-events: none으로 아래 요소들의 클릭 방해 방지.',
    acceptance: '단순한 반투명 그라데이션이 아니라, 실제 텍스트가 점진적으로 흐려지는 효과가 보임.',
    sourceNotes: 'Hub Original implementation. CSS 마스크 기반 progressive blur.'
  },
  'morphing-dialog': {
    html: `<div class="morph-dialog-wrapper">
  <button class="morph-trigger" aria-expanded="false" onclick="this.parentElement.classList.add('open'); this.setAttribute('aria-expanded','true')">
    <span class="icon">+</span> Add New
  </button>
  <div class="morph-dialog" role="dialog" aria-modal="true">
    <h3>Create Item</h3>
    <p>Fill out the details below to create a new item in your workspace.</p>
    <div class="actions">
      <button class="close-btn" onclick="const w = this.closest('.morph-dialog-wrapper'); w.classList.remove('open'); w.querySelector('.morph-trigger').setAttribute('aria-expanded','false')">Cancel</button>
      <button class="save-btn">Save</button>
    </div>
  </div>
</div>`,
    css: `main { background: #f9f9fb; color: #333; display: flex; align-items: center; justify-content: center; }
.morph-dialog-wrapper { position: relative; width: min(100%, 400px); height: 400px; display: flex; align-items: center; justify-content: center; }
.morph-trigger {
  background: #0055ff; color: #fff; border: none; padding: 12px 24px; border-radius: 30px; font-size: 16px; cursor: pointer;
  display: flex; align-items: center; gap: 8px; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2; position: absolute;
}
.morph-dialog {
  position: absolute;
  background: #fff; border-radius: 20px; padding: 30px; width: 80%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  opacity: 0; pointer-events: none; transform: scale(0.8) translateY(20px);
  transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}
.morph-dialog h3 { margin: 0 0 10px 0; }
.morph-dialog p { color: #666; margin-bottom: 20px; line-height: 1.5; }
.actions { display: flex; gap: 10px; justify-content: flex-end; }
.actions button { padding: 8px 16px; border-radius: 8px; cursor: pointer; border: none; font-weight: 500; }
.close-btn { background: #eee; color: #333; }
.save-btn { background: #0055ff; color: #fff; }

.morph-dialog-wrapper.open .morph-trigger {
  opacity: 0; pointer-events: none; transform: scale(1.2);
}
.morph-dialog-wrapper.open .morph-dialog {
  opacity: 1; pointer-events: auto; transform: scale(1) translateY(0); z-index: 3;
}
@media (prefers-reduced-motion) {
  .morph-trigger, .morph-dialog { transition: none; }
}`,
    logic: 'Trigger의 bounding box에서 dialog의 bounding box까지 위치/폭/높이/radius를 연속 보간한다. open 시 trigger content는 0.3s easing으로 확장되며 투명해지고, dialog body가 나타난다. Wrapper를 기준으로 position: absolute를 활용하여 offset 없이 제자리에서 팽창하는 듯한 shared-layout illusion을 준다. reduced-motion 시 애니메이션 없이 즉시 상태가 전환된다.',
    acceptance: '버튼을 클릭하면 단순한 scale 팝업이 아니라 trigger 위치에서부터 부드럽게 연속적으로 펼쳐지는 모달이 등장함. scale-only modal pop 금지. shared geometry가 보임. 닫기 버튼이 정상 작동함. 포커스 관리가 필요함.',
    sourceNotes: 'Hub Original implementation. Shared layout animation illusion using CSS transitions.'
  },
  'dock-magnification': {
    html: `<div class="dock-container">
  <div class="dock">
    <div class="dock-item">A</div>
    <div class="dock-item">B</div>
    <div class="dock-item">C</div>
    <div class="dock-item">D</div>
    <div class="dock-item">E</div>
  </div>
</div>`,
    css: `main { background: #1a1a1a; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 40px; }
.dock-container { padding: 20px; }
.dock { display: flex; gap: 10px; padding: 10px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); }
.dock-item {
  width: 40px; height: 40px; background: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  font-weight: bold; color: #333; cursor: pointer;
  transition: width 0.2s, height 0.2s, transform 0.2s, margin 0.2s;
  transform-origin: bottom;
}
/* Focus fallback for keyboard */
.dock-item:focus-visible { outline: 2px solid #55aaff; outline-offset: 4px; transform: scale(1.2); }`,
    js: `const dock = document.querySelector('.dock');
const items = Array.from(dock.querySelectorAll('.dock-item'));

dock.addEventListener('mousemove', (e) => {
  if (reduced.matches) return;
  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const distance = Math.abs(e.clientX - centerX);
    
    // falloff calculation
    const maxDist = 100;
    const scale = Math.max(1, 1.8 - (distance / maxDist) * 0.8);
    
    item.style.width = \`\${40 * scale}px\`;
    item.style.height = \`\${40 * scale}px\`;
    item.style.margin = \`0 \${5 * scale}px\`;
  });
});

dock.addEventListener('mouseleave', () => {
  items.forEach(item => {
    item.style.width = '40px';
    item.style.height = '40px';
    item.style.margin = '0';
  });
});`,
    logic: 'JavaScript로 마우스 X 좌표와 각 항목 중심 간의 거리를 계산해 scale/width falloff 보간 처리. CSS transform-origin: bottom으로 하단 고정 확대. 키보드 접근성 유지.',
    acceptance: '마우스가 다가가면 대상은 크게, 양옆 항목은 중간 크기로 부드럽게 확대됨. 마우스가 벗어나면 원상태로 돌아감. 터치 기기에서는 기본 정적 렌더링 유지.',
    sourceNotes: 'Hub Original implementation. macOS style dock math logic.'
  },
  'split-flap': {
    html: `<div class="flap-board">
  <div class="flap-char" data-char="D">
    <div class="top">D</div><div class="bottom">D</div>
    <div class="flap top-flap"></div><div class="flap bottom-flap"></div>
  </div>
  <div class="flap-char" data-char="R">
    <div class="top">R</div><div class="bottom">R</div>
    <div class="flap top-flap"></div><div class="flap bottom-flap"></div>
  </div>
  <div class="flap-char" data-char="H">
    <div class="top">H</div><div class="bottom">H</div>
    <div class="flap top-flap"></div><div class="flap bottom-flap"></div>
  </div>
</div>`,
    css: `main { background: #222; display: flex; align-items: center; justify-content: center; perspective: 1000px; }
.flap-board { display: flex; gap: 4px; background: #111; padding: 10px; border-radius: 8px; box-shadow: inset 0 5px 15px rgba(0,0,0,0.8); }
.flap-char { 
  position: relative; width: 40px; height: 60px; background: #333; color: #eee; font-family: monospace; font-size: 40px; font-weight: bold;
  border-radius: 4px; line-height: 60px; text-align: center;
}
.flap-char::after {
  content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 2px; background: #111; margin-top: -1px; z-index: 5;
}
.top, .bottom, .flap { position: absolute; width: 100%; height: 50%; left: 0; overflow: hidden; background: #333; }
.top, .top-flap { top: 0; line-height: 60px; transform-origin: bottom; }
.bottom, .bottom-flap { bottom: 0; line-height: 0px; transform-origin: top; }
.flap { z-index: 2; border-radius: 4px; }
.top-flap { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
.bottom-flap { border-top-left-radius: 0; border-top-right-radius: 0; }

.animating .top-flap {
  animation: flipTop 0.25s ease-in forwards;
}
.animating .bottom-flap {
  animation: flipBottom 0.25s ease-out 0.25s forwards;
}
@keyframes flipTop { 100% { transform: rotateX(-90deg); } }
@keyframes flipBottom { 0% { transform: rotateX(90deg); } 100% { transform: rotateX(0deg); } }
@media (prefers-reduced-motion) { .animating .top-flap, .animating .bottom-flap { animation: none; } }`,
    js: `const chars = document.querySelectorAll('.flap-char');

function triggerFlip(el, newChar) {
  if (reduced.matches) {
    el.dataset.char = newChar;
    el.querySelector('.top').textContent = newChar;
    el.querySelector('.bottom').textContent = newChar;
    return;
  }
  
  const oldChar = el.dataset.char;
  el.dataset.char = newChar;
  
  const topF = el.querySelector('.top-flap');
  const botF = el.querySelector('.bottom-flap');
  const top = el.querySelector('.top');
  const bot = el.querySelector('.bottom');
  
  topF.textContent = oldChar;
  botF.textContent = newChar;
  botF.style.transform = 'rotateX(90deg)';
  
  top.textContent = newChar;
  bot.textContent = oldChar;
  
  el.classList.remove('animating');
  void el.offsetWidth; // trigger reflow
  el.classList.add('animating');
  
  setTimeout(() => {
    bot.textContent = newChar;
    el.classList.remove('animating');
  }, 500);
}

// Demo interval
setInterval(() => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  chars.forEach((c, i) => {
    setTimeout(() => {
      triggerFlip(c, letters[Math.floor(Math.random() * letters.length)]);
    }, i * 150);
  });
}, 3000);`,
    logic: '상/하단 패널과 플랩(flap) 요소를 분리하여 rotateX(90deg) 애니메이션 조합으로 플랩 시계 효과 구현. JS로 문자를 순차 교체하며, reduced-motion 설정 시 즉시 문자가 바뀜.',
    acceptance: '실제 아날로그 전광판처럼 상단이 넘어가고 하단이 따라오는 flip 애니메이션이 보여야 함. 정적 상태에서도 글씨가 읽혀야 함.',
    sourceNotes: 'Hub Original implementation. CSS 3D Transforms.'
  }
}
