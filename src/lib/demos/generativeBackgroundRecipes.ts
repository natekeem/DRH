import type { DemoRecipe } from './recipes'

const backgroundHtml = (kind: 'neural' | 'matrix', label: string) =>
  `<section class="generative-background" data-generative-background="${kind}" role="img" aria-label="${label}"><canvas aria-hidden="true"></canvas></section>`

const css = String.raw`
main{display:block;background:#03070c}
.generative-background{position:absolute;inset:0;overflow:hidden;background:#03070c;isolation:isolate}
.generative-background canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
`

const neuralJs = String.raw`
(()=>{
const root=document.querySelector('[data-generative-background="neural"]');
const canvas=root?.querySelector('canvas');
const ctx=canvas?.getContext('2d',{alpha:false,desynchronized:true});
if(!root||!canvas||!ctx){root?.classList.add('no-canvas');return}
const variant=root.closest('main')?.dataset.variant||'detail';
const nodeCount=variant==='card'?78:148;
const nodes=[];
const edges=[];
const positions=[];
const pointer={x:-9999,y:-9999,active:false};
let width=1,height=1,dpr=1,elapsed=0,lastNow=0,visible=true,disposed=false;
function randomFactory(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const random=randomFactory(0x19a7c3d);
const edgeKeys=new Set();
for(let index=0;index<nodeCount;index++){
 const band=index%11;
 const x=(index*.61803398875+random()*.045)%1;
 const y=(index*.41421356237+band*.013+random()*.055)%1;
 nodes.push({x:.035+x*.93,y:.045+y*.91,size:.72+random()*1.65,phase:random()*Math.PI*2,depth:.35+random()*.65});
}
for(let index=0;index<nodeCount;index++){
 const ranked=[];
 for(let other=0;other<nodeCount;other++){
  if(other===index)continue;
  const dx=(nodes[index].x-nodes[other].x)*1.35;
  const dy=nodes[index].y-nodes[other].y;
  ranked.push([dx*dx+dy*dy,other]);
 }
 ranked.sort((a,b)=>a[0]-b[0]);
 const limit=index%4===0?4:3;
 for(let pick=0;pick<limit;pick++){
  const other=ranked[pick][1];if(ranked[pick][0]>.055)continue;
  const a=Math.min(index,other),b=Math.max(index,other),key=a+':'+b;
  if(!edgeKeys.has(key)){edgeKeys.add(key);edges.push([a,b,random()])}
 }
}
function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
function layout(){
 const rect=root.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);dpr=Math.min(window.devicePixelRatio||1,1.75);
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
 root.dataset.nodeCount=String(nodeCount);root.dataset.edgeCount=String(edges.length);root.dataset.ready='true';
}
function point(node,time){
 const driftX=Math.sin(time*.24+node.phase)*2.3*node.depth;
 const driftY=Math.cos(time*.19+node.phase*1.17)*1.9*node.depth;
 let x=node.x*width+driftX,y=node.y*height+driftY,proximity=0;
 if(pointer.active&&!reduced.matches){
  const radius=Math.max(90,Math.min(190,Math.sqrt(width*height)*.17));
  const dx=x-pointer.x,dy=y-pointer.y,distance=Math.hypot(dx,dy)||1;
  proximity=clamp(1-distance/radius,0,1);
  const bend=proximity*proximity*Math.min(18,radius*.11);
  x+=dx/distance*bend;y+=dy/distance*bend;
 }
 return{x,y,proximity};
}
function draw(now){
 if(disposed||!visible)return false;
 if(lastNow){elapsed+=Math.min(34,Math.max(0,now-lastNow))/1000}lastNow=now;
 const time=reduced.matches?0:elapsed;
 ctx.globalCompositeOperation='source-over';ctx.fillStyle='#03070c';ctx.fillRect(0,0,width,height);
 const ambient=ctx.createRadialGradient(width*.5,height*.48,0,width*.5,height*.48,Math.max(width,height)*.68);
 ambient.addColorStop(0,'rgba(30,76,126,.18)');ambient.addColorStop(.48,'rgba(13,35,68,.10)');ambient.addColorStop(1,'rgba(3,7,12,0)');ctx.fillStyle=ambient;ctx.fillRect(0,0,width,height);
 for(let index=0;index<nodeCount;index++)positions[index]=point(nodes[index],time);
 ctx.save();ctx.globalCompositeOperation='lighter';
 for(let index=0;index<edges.length;index++){
  const edge=edges[index],a=positions[edge[0]],b=positions[edge[1]],near=Math.max(a.proximity,b.proximity);
  const distance=Math.hypot(a.x-b.x,a.y-b.y);const alpha=Math.max(.035,.17-distance/Math.max(width,height)*.18)+near*.38;
  ctx.strokeStyle='rgba('+(near>.08?'83,213,255':'69,121,184')+','+alpha+')';ctx.lineWidth=near>.08?1.05:.62;
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  if(index%7===0){
   const travel=reduced.matches?edge[2]:(edge[2]+time*(.028+(index%4)*.008))%1;
   const x=a.x+(b.x-a.x)*travel,y=a.y+(b.y-a.y)*travel;
   ctx.fillStyle='rgba(151,236,255,'+(.42+near*.42)+')';ctx.beginPath();ctx.arc(x,y,.8+near*1.2,0,Math.PI*2);ctx.fill();
  }
 }
 for(let index=0;index<nodeCount;index++){
  const p=positions[index],node=nodes[index],pulse=reduced.matches?.62:.58+Math.sin(time*.72+node.phase)*.12;
  const radius=node.size*(variant==='card'?.82:1)+p.proximity*2.2;
  if(p.proximity>.04){ctx.fillStyle='rgba(82,208,255,'+(p.proximity*.12)+')';ctx.beginPath();ctx.arc(p.x,p.y,8+p.proximity*16,0,Math.PI*2);ctx.fill()}
  ctx.fillStyle='rgba('+(index%9===0?'190,142,255':'117,207,255')+','+(pulse+p.proximity*.36)+')';ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill();
  if(index%13===0){ctx.fillStyle='rgba(235,250,255,'+(.58+p.proximity*.34)+')';ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.65,radius*.42),0,Math.PI*2);ctx.fill()}
 }
 ctx.restore();root.dataset.motion=reduced.matches?'reduced':'running';return true;
}
function pointerMove(event){if(reduced.matches||event.pointerType==='touch')return;const rect=root.getBoundingClientRect();pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;pointer.active=true;root.dataset.pointerActive='true'}
function pointerLeave(){pointer.x=pointer.y=-9999;pointer.active=false;root.dataset.pointerActive='false'}
canvas.addEventListener('pointermove',pointerMove,{passive:true});canvas.addEventListener('pointerleave',pointerLeave);
const resizeObserver=new ResizeObserver(()=>{layout();lastNow=0;restart()});resizeObserver.observe(root);
const intersectionObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;root.dataset.visible=String(visible);if(visible){lastNow=0;restart()}else cancelAnimationFrame(raf)},{rootMargin:'80px'});intersectionObserver.observe(root);
function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);resizeObserver.disconnect();intersectionObserver.disconnect();canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointerleave',pointerLeave)}
window.addEventListener('pagehide',dispose,{once:true});layout();loop(draw);
})();
`

const matrixJs = String.raw`
(()=>{
const root=document.querySelector('[data-generative-background="matrix"]');
const canvas=root?.querySelector('canvas');
const ctx=canvas?.getContext('2d',{alpha:false,desynchronized:true});
if(!root||!canvas||!ctx){root?.classList.add('no-canvas');return}
const glyphs=[...'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>[]{}+-=*/\\|:;'];
const variant=root.closest('main')?.dataset.variant||'detail';
const streams=[];
const pointer={x:-9999,y:-9999,active:false};
let width=1,height=1,dpr=1,columnWidth=18,rowHeight=20,elapsed=0,lastNow=0,visible=true,disposed=false;
function randomFactory(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function layout(){
 const rect=root.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);dpr=Math.min(window.devicePixelRatio||1,1.75);
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
 columnWidth=variant==='card'?15:19;rowHeight=columnWidth*1.12;const count=Math.max(18,Math.ceil(width/columnWidth));const random=randomFactory(0x3e9b71+count);
 streams.length=0;
 for(let column=0;column<count;column++){
  const length=10+Math.floor(random()*(variant==='card'?14:22));const cycle=height+length*rowHeight;
  streams.push({x:(column+.5)*width/count,length,phase:random()*cycle,speed:24+random()*54,seed:Math.floor(random()*10000),alpha:.42+random()*.52});
 }
 root.dataset.columnCount=String(count);root.dataset.direction='up';root.dataset.ready='true';
}
function glyph(stream,row,timeStep){return glyphs[(stream.seed+row*17+timeStep*(row%4===0?1:0))%glyphs.length]}
function drawStream(stream,time){
 const cycle=height+stream.length*rowHeight;const head=height-((stream.phase+time*stream.speed)%cycle);
 const pointerDistance=Math.abs(stream.x-pointer.x);const columnNear=pointer.active&&!reduced.matches?Math.max(0,1-pointerDistance/120):0;
 for(let copy=-1;copy<=1;copy++){
  const copyHead=head+copy*cycle;
  for(let row=0;row<stream.length;row++){
   const y=copyHead+row*rowHeight;if(y<-rowHeight||y>height+rowHeight)continue;
   const trail=1-row/stream.length;const pointNear=columnNear*Math.max(0,1-Math.abs(y-pointer.y)/180);
   const alpha=(.06+trail*trail*.66)*stream.alpha+pointNear*.30;
   if(row===0){ctx.fillStyle='rgba(224,255,232,'+Math.min(1,.8+pointNear*.2)+')';ctx.shadowColor='rgba(91,255,140,.92)';ctx.shadowBlur=10+pointNear*10}
   else{ctx.fillStyle='rgba('+(row<3?'101,255,149':'38,204,91')+','+Math.min(.92,alpha)+')';ctx.shadowBlur=row<3?4:0}
   const step=reduced.matches?0:Math.floor(time*9);ctx.fillText(glyph(stream,row,step),stream.x,y);
  }
 }
}
function draw(now){
 if(disposed||!visible)return false;
 if(lastNow){elapsed+=Math.min(34,Math.max(0,now-lastNow))/1000}lastNow=now;const time=reduced.matches?0:elapsed;
 ctx.globalCompositeOperation='source-over';ctx.fillStyle='#020705';ctx.fillRect(0,0,width,height);
 const glow=ctx.createLinearGradient(0,height,0,0);glow.addColorStop(0,'rgba(18,91,42,.11)');glow.addColorStop(.55,'rgba(3,18,10,.03)');glow.addColorStop(1,'rgba(2,7,5,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 '+Math.floor(columnWidth*.8)+'px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';ctx.save();ctx.globalCompositeOperation='lighter';
 for(const stream of streams)drawStream(stream,time);
 ctx.restore();ctx.shadowBlur=0;root.dataset.motion=reduced.matches?'reduced':'running';return true;
}
function pointerMove(event){if(reduced.matches||event.pointerType==='touch')return;const rect=root.getBoundingClientRect();pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;pointer.active=true;root.dataset.pointerActive='true'}
function pointerLeave(){pointer.x=pointer.y=-9999;pointer.active=false;root.dataset.pointerActive='false'}
canvas.addEventListener('pointermove',pointerMove,{passive:true});canvas.addEventListener('pointerleave',pointerLeave);
const resizeObserver=new ResizeObserver(()=>{layout();lastNow=0;restart()});resizeObserver.observe(root);
const intersectionObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;root.dataset.visible=String(visible);if(visible){lastNow=0;restart()}else cancelAnimationFrame(raf)},{rootMargin:'80px'});intersectionObserver.observe(root);
function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);resizeObserver.disconnect();intersectionObserver.disconnect();canvas.removeEventListener('pointermove',pointerMove);canvas.removeEventListener('pointerleave',pointerLeave)}
window.addEventListener('pagehide',dispose,{once:true});layout();loop(draw);
})();
`

export const generativeBackgroundRecipes: Record<string, DemoRecipe> = {
  'neural-network-field': {
    html: backgroundHtml('neural', '포인터 주변만 조용히 반응하는 전체 화면 신경망 배경'),
    css,
    js: neuralJs,
    logic: '정규화된 고정 노드 148개(카드 78개)와 최근접 간선 집합을 첫 프레임부터 완성된 상태로 그립니다. 매 프레임 불투명 배경으로 캔버스를 완전히 초기화한 뒤 미세한 계산형 드리프트, 간선 신호, 포인터 반경 안의 국소 밝기와 최대 18px 굴절만 합성합니다. 위치 속도, 스프링, 생성·소멸 큐를 저장하지 않으므로 스크롤 재진입이나 장시간 실행에도 효과가 누적되지 않습니다.',
    acceptance: '첫 프레임부터 화면 전체에 균일한 신경망이 보여야 하며 진입 애니메이션, 형태 모핑, 튀어나오는 파티클이 없어야 한다. 포인터 가까운 노드와 간선만 부드럽게 밝아지고 아주 조금 벌어지며, 포인터를 떼면 즉시 기본 장면으로 돌아온다. 텍스트·버튼·HUD는 없어야 한다.',
    responsive: '카드는 78개, 상세는 148개 노드를 사용하고 모든 좌표를 컨테이너 비율로 계산합니다. DPR은 1.75로 제한하며 320×192 카드, 390×844 모바일, 1440×900 상세에서 네트워크가 한쪽에 몰리지 않고 전체 면적을 사용합니다.',
    visualSystem: '#03070C 바탕에 저채도 블루 간선, 시안 노드, 드문 바이올렛 노드를 사용합니다. 광원은 포인터 주변과 일부 신호점에만 제한하며 DOM 카피와 외부 에셋을 두지 않습니다.',
    sourceNotes: 'Clean-room / Hub Original — euiyun.com의 공개 화면에서 신경망처럼 연결된 배경의 분위기만 관찰하고, 외부 소스 코드·셰이더·폰트·이미지·브랜드 자산 없이 Canvas 2D로 새로 설계했습니다.',
    notices: 'DRH clean-room implementation inspired by the publicly visible neural-network ambience at https://euiyun.com. No upstream source code, shaders, fonts, images, or brand assets are included.'
  },
  'ascending-matrix-rain': {
    html: backgroundHtml('matrix', '문자 스트림이 아래에서 위로 흐르는 전체 화면 매트릭스 배경'),
    css: css.replaceAll('#03070c', '#020705'),
    js: matrixJs,
    logic: '숫자·가타카나·기호로 구성한 열마다 상승 속도, 길이, 위상을 결정적으로 배정합니다. 밝은 선두 문자가 위로 이동하고 아래쪽 꼬리는 점차 어두워집니다. 모든 열은 음의 위상으로 미리 채워 첫 프레임부터 화면 전체가 완성되며, 매 프레임 불투명 배경으로 캔버스를 지워 잔상과 중복을 방지합니다. 포인터는 가까운 열의 밝기만 국소적으로 높입니다.',
    acceptance: '문자 열이 명확히 아래에서 위로 이동하고, 선두는 밝고 아래 꼬리는 부드럽게 사라져야 한다. 시간이 지나도 글자가 겹쳐 두꺼워지거나 화면이 밝아지지 않아야 하며, 첫 로드와 스크롤 재진입 때 새 열이 튀어나오는 연출이 없어야 한다. 텍스트 UI·버튼·HUD는 없어야 한다.',
    responsive: '카드는 약 15px, 상세는 약 19px 열 간격을 사용해 컨테이너 너비에 맞춰 열 수를 다시 계산합니다. 시스템 monospace만 사용하고 DPR은 1.75로 제한합니다. 320×192부터 1440×900까지 빈 한쪽 면 없이 전체 캔버스를 채웁니다.',
    visualSystem: '#020705 바탕, #26CC5B 꼬리, #65FF95 중간 문자, 거의 흰색인 #E0FFE8 선두 문자를 사용합니다. 외부 폰트나 이미지 없이 Canvas 2D 문자만 렌더링합니다.',
    sourceNotes: 'Hub Original — 널리 알려진 디지털 레인 시각 문법을 참고하되 특정 영화 프레임, 폰트, 코드, 로고, 자산을 복제하지 않고 상승 방향의 독립 Canvas 2D 배경으로 설계했습니다.',
    notices: 'Hub Original ascending digital-rain background. No third-party source code, fonts, images, logos, or film assets are included.'
  }
}
