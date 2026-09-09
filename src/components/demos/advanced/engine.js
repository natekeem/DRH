/*
 * DRH Advanced Demo Engines — original implementation, MIT.
 * Copyright (c) 2026 Design Reference Hub contributors.
 * Numerical background: Mark J. Harris, GPU Gems chapter 38 (concepts only).
 * No upstream code, shaders, textures, fonts or assets are copied.
 * This module deliberately has no imports. React and standalone HTML execute
 * this exact source; keep every runtime helper inside mountAdvancedDemo.
 */

export function mountAdvancedDemo(root, options = {}) {
  const kind = ['fluid', 'metaballs', 'refraction'].includes(options.kind) ? options.kind : 'fluid';
  const card = options.variant === 'card';
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const finite = (v, fallback) => Number.isFinite(v) ? v : fallback;
  const intensity = clamp(finite(options.intensity, 1), 0, 2);
  const requestedRadius = clamp(finite(options.radius, card ? 62 : 155), 12, 600);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  const canvas = document.createElement('canvas');
  const fallback = document.createElement('div');
  const status = document.createElement('span');
  canvas.className = 'drh-advanced__canvas';
  canvas.setAttribute('aria-hidden', 'true');
  fallback.className = `drh-advanced__fallback drh-advanced__fallback--${kind}`;
  fallback.setAttribute('aria-hidden', 'true');
  status.className = 'drh-advanced__status';
  status.setAttribute('role', 'status');
  root.append(fallback, canvas, status);

  let disposed = false, enabled = options.active !== false, intersecting = true;
  let raf = 0, lastTime = 0, renderer = null, gl = null, lost = false;
  let width = 0, height = 0, mobile = false, frames = 0, inputs = 0, losses = 0;
  let mode = '', error = '', resizeDirty = true;
  const listeners = [];
  const pointer = { x: .5, y: .5, vx: 0, vy: 0, active: false, down: false, time: -10 };
  const splats = [];
  const on = (target, name, fn, opts) => {
    target.addEventListener(name, fn, opts);
    listeners.push(() => target.removeEventListener(name, fn, opts));
  };
  const setMode = (next, message) => {
    if (mode !== next) {
      mode = next;
      root.dataset.engineMode = next;
      status.textContent = message;
    }
  };
  const nowSeconds = () => performance.now() / 1000;
  function sample(x, y, down = pointer.down) {
    const now = nowSeconds();
    const dt = clamp(now - pointer.time, 1 / 240, .08);
    // Entering starts a fresh stroke; never inject a line from the old pointer.
    const dx = pointer.active ? clamp(x - pointer.x, -.15, .15) : 0;
    const dy = pointer.active ? clamp(y - pointer.y, -.15, .15) : 0;
    Object.assign(pointer, { x, y, vx: dx / dt, vy: dy / dt, active: true, down, time: now });
    inputs++;
    if (!reduced.matches && enabled && !document.hidden && intersecting) {
      splats.push({ x, y, dx, dy, hue: now * .18, tap: down && Math.hypot(dx, dy) < .001 });
      if (splats.length > 12) splats.shift();
      fallback.style.setProperty('--advanced-x', `${x * 100}%`);
      fallback.style.setProperty('--advanced-y', `${(1 - y) * 100}%`);
    }
  }
  function pointerSample(e) {
    const rect = root.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    sample(clamp((e.clientX - rect.left) / rect.width, 0, 1), clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1), e.buttons > 0);
  }
  on(root, 'pointermove', pointerSample, { passive: true });
  on(root, 'pointerdown', e => {
    pointerSample(e);
    pointer.down = true;
    if (root.setPointerCapture) root.setPointerCapture(e.pointerId);
  }, { passive: true });
  const release = () => { pointer.down = false; pointer.active = false; pointer.vx = pointer.vy = 0; };
  on(root, 'pointerup', release, { passive: true });
  on(root, 'pointercancel', release, { passive: true });
  on(root, 'pointerleave', e => { if (!root.hasPointerCapture?.(e.pointerId)) release(); }, { passive: true });
  on(root, 'lostpointercapture', release);
  on(root, 'keydown', e => {
    if (e.target !== root) return;
    if (e.key === 'r' || e.key === 'R') { e.preventDefault(); reset(); return; }
    const delta = { ArrowLeft: [-.06, 0], ArrowRight: [.06, 0], ArrowUp: [0, .06], ArrowDown: [0, -.06] }[e.key];
    if (delta || e.key === ' ') {
      e.preventDefault();
      sample(clamp(pointer.x + (delta?.[0] || 0), .05, .95), clamp(pointer.y + (delta?.[1] || 0), .05, .95), e.key === ' ');
    }
  });
  on(root, 'keyup', e => { if (e.key === ' ') pointer.down = false; });
  on(root, 'blur', release);

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastTime = 0;
    splats.length = 0;
    release();
  }
  function destroyRenderer() {
    renderer?.destroy();
    renderer = null;
  }
  function measure() {
    const rect = root.getBoundingClientRect();
    width = Math.max(0, Math.round(rect.width));
    height = Math.max(0, Math.round(rect.height));
    mobile = coarse.matches || width < 600;
    const dpr = Math.min(devicePixelRatio || 1, mobile || card ? 1 : 1.5);
    const pixelBudget = card ? 160000 : mobile ? 360000 : 1000000;
    const scale = Math.min(dpr, Math.sqrt(pixelBudget / Math.max(1, width * height)));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    resizeDirty = false;
  }
  function init() {
    destroyRenderer();
    measure();
    canvas.hidden = true;
    fallback.hidden = false;
    if (!width || !height) return;
    if (reduced.matches) {
      setMode('reduced-motion', '동작 줄이기 · 정적 미리보기');
      return;
    }
    if (lost) { setMode('context-lost', '그래픽 연결이 중단되었습니다 · 정적 미리보기'); return; }
    try {
      if (!gl) gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: card ? 'low-power' : 'default' });
      if (!gl) throw new Error('WebGL 2 unavailable');
      renderer = createRenderer(gl);
      canvas.hidden = false;
      fallback.hidden = true;
      error = '';
      setMode('webgl2', kind === 'fluid' ? '포인터 / 터치로 흐름 만들기 · 방향키 / Space · R 초기화' : kind === 'metaballs' ? '다가가면 밀리고, 누르면 모입니다 · 방향키 / Space · R 초기화' : '움직여 굴절 확인 · 누르면 확대 · 방향키 / Space · R 초기화');
    } catch (e) {
      destroyRenderer();
      error = String(e?.message || e);
      setMode('fallback', 'WebGL 기능을 사용할 수 없습니다 · 가벼운 대체 미리보기');
    }
  }
  function allowed() { return !disposed && enabled && intersecting && !document.hidden && !reduced.matches && !lost && width > 0 && height > 0; }
  function tick(time) {
    raf = 0;
    if (!allowed()) return;
    if (resizeDirty) init();
    if (!renderer) return;
    const dt = lastTime ? clamp((time - lastTime) / 1000, .001, 1 / 30) : 1 / 60;
    lastTime = time;
    try {
      renderer.frame(dt, time / 1000);
      frames++;
      if (allowed()) raf = requestAnimationFrame(tick);
    } catch (e) {
      error = String(e?.message || e);
      destroyRenderer();
      canvas.hidden = true;
      fallback.hidden = false;
      setMode('fallback', '렌더링이 중단되었습니다 · 가벼운 대체 미리보기');
    }
  }
  function sync() {
    stop();
    if (disposed) return;
    if (reduced.matches || resizeDirty || (!renderer && enabled && intersecting && !document.hidden)) init();
    if (allowed() && renderer) raf = requestAnimationFrame(tick);
  }
  function reset() {
    if (disposed) return;
    stop();
    pointer.x = pointer.y = .5;
    init();
    if (allowed() && renderer) raf = requestAnimationFrame(tick);
  }
  on(document, 'visibilitychange', sync);
  on(reduced, 'change', sync);
  on(coarse, 'change', () => { resizeDirty = true; sync(); });
  on(window, 'resize', () => { resizeDirty = true; sync(); }, { passive: true });
  on(canvas, 'webglcontextlost', e => {
    e.preventDefault();
    lost = true;
    losses++;
    stop();
    destroyRenderer();
    canvas.hidden = true;
    fallback.hidden = false;
    setMode('context-lost', '그래픽 연결이 중단되었습니다 · 정적 미리보기');
  });
  on(canvas, 'webglcontextrestored', () => { lost = false; resizeDirty = true; sync(); });
  // Standalone exports survive back/forward cache; disposal occurs on real unload.
  on(window, 'pagehide', e => { if (e.persisted) stop(); else destroy(); });
  on(window, 'pageshow', e => { if (e.persisted) sync(); });
  const resizeObserver = new ResizeObserver(() => { resizeDirty = true; sync(); });
  resizeObserver.observe(root);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    intersecting = entry.isIntersecting;
    sync();
  }, { threshold: 0 });
  intersectionObserver.observe(root);
  init();
  if (allowed() && renderer) raf = requestAnimationFrame(tick);

  function destroy() {
    if (disposed) return;
    disposed = true;
    stop();
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    listeners.splice(0).forEach(remove => remove());
    destroyRenderer();
    if (gl && !gl.isContextLost()) gl.getExtension('WEBGL_lose_context')?.loseContext();
    gl = null;
    canvas.remove();
    fallback.remove();
    status.remove();
    delete root.dataset.engineMode;
  }
  return {
    destroy, reset,
    setActive(active) { enabled = Boolean(active); sync(); },
    inspect() {
      return { kind, mode, running: Boolean(raf), disposed, frames, inputs, contextLosses: losses, width, height, mobile,
        resources: renderer?.resources() || { textures: 0, framebuffers: 0, programs: 0 },
        ...renderer?.inspect(), ...(error ? { error } : {}) };
    }
  };

  // All WebGL allocations are owned here, including partially constructed renderers.
  function createRenderer(g) {
    const textures = new Set(), framebuffers = new Set(), programs = new Set();
    const shaders = new Set();
    const vao = g.createVertexArray();
    g.bindVertexArray(vao);
    const vertex = `#version 300 es
    precision highp float;
    out vec2 uv;
    void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;
    function disposeGPU() {
      textures.forEach(t => g.deleteTexture(t)); textures.clear();
      framebuffers.forEach(f => g.deleteFramebuffer(f)); framebuffers.clear();
      programs.forEach(p => g.deleteProgram(p)); programs.clear();
      shaders.forEach(s => g.deleteShader(s)); shaders.clear();
      g.deleteVertexArray(vao);
    }
    function program(body, declarations = '') {
      const p = g.createProgram();
      if (!p) throw new Error('Cannot allocate WebGL program');
      programs.add(p);
      for (const [type, source] of [[g.VERTEX_SHADER, vertex], [g.FRAGMENT_SHADER, `#version 300 es\nprecision highp float;\nprecision highp sampler2D;\nin vec2 uv;\nout vec4 outColor;\n${declarations}\n${body}`]]) {
        const s = g.createShader(type);
        if (!s) throw new Error('Cannot allocate shader');
        shaders.add(s);
        g.shaderSource(s, source); g.compileShader(s);
        if (!g.getShaderParameter(s, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(s) || 'Shader compilation failed');
        g.attachShader(p, s);
      }
      g.linkProgram(p);
      if (!g.getProgramParameter(p, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(p) || 'Shader link failed');
      const locations = new Map();
      const loc = name => { if (!locations.has(name)) locations.set(name, g.getUniformLocation(p, name)); return locations.get(name); };
      return { p, loc };
    }
    function texture(w, h, data = null, float = true) {
      const t = g.createTexture();
      if (!t) throw new Error('Cannot allocate texture');
      textures.add(t); g.bindTexture(g.TEXTURE_2D, t);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, float ? g.NEAREST : g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, float ? g.NEAREST : g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texImage2D(g.TEXTURE_2D, 0, float ? g.RGBA16F : g.RGBA8, w, h, 0, g.RGBA, float ? g.HALF_FLOAT : g.UNSIGNED_BYTE, data);
      return t;
    }
    function target(w, h) {
      const tex = texture(w, h), fbo = g.createFramebuffer();
      if (!fbo) throw new Error('Cannot allocate framebuffer');
      framebuffers.add(fbo); g.bindFramebuffer(g.FRAMEBUFFER, fbo);
      g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0);
      if (g.checkFramebufferStatus(g.FRAMEBUFFER) !== g.FRAMEBUFFER_COMPLETE) throw new Error('Float framebuffer unsupported');
      g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT);
      return { tex, fbo, w, h };
    }
    function pair(w, h) { return { read: target(w, h), write: target(w, h), swap() { [this.read, this.write] = [this.write, this.read]; } }; }
    function pass(p, output, samplers = {}, uniforms = {}) {
      g.useProgram(p.p); g.bindVertexArray(vao);
      let unit = 0;
      for (const [name, tex] of Object.entries(samplers)) {
        g.activeTexture(g.TEXTURE0 + unit); g.bindTexture(g.TEXTURE_2D, tex);
        g.uniform1i(p.loc(name), unit++);
      }
      for (const [name, value] of Object.entries(uniforms)) {
        const location = p.loc(name);
        if (typeof value === 'number') g.uniform1f(location, value);
        else if (value.length === 2) g.uniform2fv(location, value);
        else if (value.length === 3) g.uniform3fv(location, value);
        else if (value.length === 4) g.uniform4fv(location, value);
        else g.uniform4fv(location, value);
      }
      g.bindFramebuffer(g.FRAMEBUFFER, output?.fbo || null);
      g.viewport(0, 0, output?.w || canvas.width, output?.h || canvas.height);
      g.drawArrays(g.TRIANGLES, 0, 3);
    }
    const resources = () => ({ textures: textures.size, framebuffers: framebuffers.size, programs: programs.size });
    try {
      const impl = kind === 'fluid' ? fluid() : kind === 'metaballs' ? metaballs() : refraction();
      return { ...impl, resources, destroy: disposeGPU };
    } catch (e) { disposeGPU(); throw e; }

    function fluid() {
      if (!g.getExtension('EXT_color_buffer_float')) throw new Error('EXT_color_buffer_float required for the pressure solver');
      const short = mobile ? 80 : card ? 96 : 160;
      const dyeShort = mobile ? 192 : card ? 192 : 384;
      // Simulation cells stay approximately square even in portrait containers.
      const grid = n => width >= height ? [Math.min(512, Math.round(n * width / height)), n] : [n, Math.min(512, Math.round(n * height / width))];
      const [sw, sh] = grid(short), [dw, dh] = grid(dyeShort);
      const velocity = pair(sw, sh), dye = pair(dw, dh), pressure = pair(sw, sh);
      const curlTarget = target(sw, sh), divTarget = target(sw, sh);
      const iterations = mobile ? 12 : card ? 16 : 32;
      const texel = [1 / sw, 1 / sh], aspect = width / height;
      const samplers = 'uniform sampler2D source; uniform vec2 stepSize;';
      const splat = program(`void main(){vec2 d=(uv-point)*vec2(aspect,1.);float s=exp(-dot(d,d)/radius2);vec3 c=texture(source,uv).xyz+value*s;outColor=vec4(clamp(c,vec3(-260.),vec3(260.)),1.);}`,
        'uniform sampler2D source;uniform vec2 point;uniform vec3 value;uniform float aspect,radius2;');
      // Explicit viscosity/dye diffusion with a stable <= .24 Laplacian weight.
      const diffuse = program(`void main(){vec4 c=texture(source,uv);vec4 sum=texture(source,uv+vec2(stepSize.x,0))+texture(source,uv-vec2(stepSize.x,0))+texture(source,uv+vec2(0,stepSize.y))+texture(source,uv-vec2(0,stepSize.y));outColor=c+weight*(sum-4.*c);}`, samplers+'uniform float weight;');
      const advect = program(`vec4 bilerp(vec2 pos){vec2 size=vec2(textureSize(source,0));vec2 p=clamp(pos*size-.5,vec2(0),size-1.);vec2 f=fract(p);ivec2 i=ivec2(floor(p)),hi=ivec2(size)-1;return mix(mix(texelFetch(source,i,0),texelFetch(source,min(i+ivec2(1,0),hi),0),f.x),mix(texelFetch(source,min(i+ivec2(0,1),hi),0),texelFetch(source,min(i+ivec2(1,1),hi),0),f.x),f.y);}void main(){vec2 v=texture(flow,uv).xy;outColor=bilerp(uv-dt*v/grid)*exp(-decay*dt);}`,
        'uniform sampler2D source,flow;uniform vec2 grid;uniform float dt,decay;');
      const curlProgram = program(`void main(){float r=texture(source,uv+vec2(stepSize.x,0)).y,l=texture(source,uv-vec2(stepSize.x,0)).y,t=texture(source,uv+vec2(0,stepSize.y)).x,b=texture(source,uv-vec2(0,stepSize.y)).x;outColor=vec4(.5*(r-l-t+b),0,0,1);}`, samplers);
      const confinement = program(`void main(){float c=texture(curlField,uv).x;vec2 grad=.5*vec2(abs(texture(curlField,uv+vec2(stepSize.x,0)).x)-abs(texture(curlField,uv-vec2(stepSize.x,0)).x),abs(texture(curlField,uv+vec2(0,stepSize.y)).x)-abs(texture(curlField,uv-vec2(0,stepSize.y)).x));vec2 n=grad/(length(grad)+.0001);vec2 v=texture(source,uv).xy+vec2(n.y,-n.x)*c*dt*strength;outColor=vec4(clamp(v,vec2(-260),vec2(260)),0,1);}`, samplers+'uniform sampler2D curlField;uniform float dt,strength;');
      // Forward divergence + backward pressure gradient form the same discrete
      // Laplacian as Jacobi, unlike mismatched centered/one-cell stencils.
      const divergence = program(`void main(){vec2 c=texture(source,uv).xy;float r=texture(source,uv+vec2(stepSize.x,0)).x,t=texture(source,uv+vec2(0,stepSize.y)).y;outColor=vec4(r-c.x+t-c.y,0,0,1);}`, samplers);
      const jacobi = program(`void main(){float l=texture(source,uv-vec2(stepSize.x,0)).x,r=texture(source,uv+vec2(stepSize.x,0)).x,b=texture(source,uv-vec2(0,stepSize.y)).x,t=texture(source,uv+vec2(0,stepSize.y)).x;float div=texture(divField,uv).x;outColor=vec4((l+r+b+t-div)*.25,0,0,1);}`, samplers+'uniform sampler2D divField;');
      const project = program(`void main(){float c=texture(pressureField,uv).x,l=texture(pressureField,uv-vec2(stepSize.x,0)).x,b=texture(pressureField,uv-vec2(0,stepSize.y)).x;vec2 v=texture(source,uv).xy-vec2(c-l,c-b);if(uv.x<stepSize.x||uv.x>1.-stepSize.x)v.x=0.;if(uv.y<stepSize.y||uv.y>1.-stepSize.y)v.y=0.;outColor=vec4(v,0,1);}`, samplers+'uniform sampler2D pressureField;');
      const display = program(`void main(){vec3 d=max(texture(source,uv).rgb,vec3(0));float density=max(d.r,max(d.g,d.b));vec3 ink=1.-exp(-d*1.45);vec3 bg=mix(vec3(.018,.028,.07),vec3(.065,.043,.13),uv.y);vec2 px=1./vec2(textureSize(source,0));float slope=length(texture(source,uv+vec2(px.x,0)).rgb-texture(source,uv-vec2(px.x,0)).rgb);vec3 color=bg+ink*.93+vec3(.14,.23,.28)*slope;float vignette=1.-.30*dot(uv-.5,uv-.5);outColor=vec4(color*vignette,1);}`, 'uniform sampler2D source;');
      let diagnostic = {}, stepCount = 0;
      const color = hue => [.18+.82*(.5+.5*Math.cos(hue*6.28)), .18+.82*(.5+.5*Math.cos(hue*6.28+2.1)), .18+.82*(.5+.5*Math.cos(hue*6.28+4.2))];
      function inject(s) {
        const force = s.tap ? [0, sh * .8, 0] : [s.dx * sw * 24, s.dy * sh * 24, 0];
        pass(splat, velocity.write, { source: velocity.read.tex }, { point: [s.x,s.y], value: force, aspect, radius2: .0012 }); velocity.swap();
        pass(splat, dye.write, { source: dye.read.tex }, { point: [s.x,s.y], value: color(s.hue).map(c=>c*.65), aspect, radius2: .0007 }); dye.swap();
      }
      // A finite startup impulse demonstrates flow without an endless fake trail.
      for(let i=0;i<5;i++) inject({x:.28+i*.10,y:.43+Math.sin(i)*.07,dx:.025*Math.cos(i),dy:.04*Math.sin(i+1),hue:i*.15,tap:false});
      function rms(field) {
        const pixels = new Float32Array(field.w * field.h * 4);
        g.bindFramebuffer(g.FRAMEBUFFER, field.fbo);
        g.readPixels(0,0,field.w,field.h,g.RGBA,g.FLOAT,pixels);
        if(g.getError()!==g.NO_ERROR)return null;
        let sum=0; for(let i=0;i<pixels.length;i+=4)sum+=pixels[i]*pixels[i];
        return Math.sqrt(sum/(field.w*field.h));
      }
      return {
        frame(dt) {
          splats.splice(0).forEach(inject);
          pass(advect,velocity.write,{source:velocity.read.tex,flow:velocity.read.tex},{grid:[sw,sh],dt,decay:.16});velocity.swap();
          pass(diffuse,velocity.write,{source:velocity.read.tex},{stepSize:texel,weight:Math.min(.24,dt*1.8)});velocity.swap();
          pass(curlProgram,curlTarget,{source:velocity.read.tex},{stepSize:texel});
          pass(confinement,velocity.write,{source:velocity.read.tex,curlField:curlTarget.tex},{stepSize:texel,dt,strength:14});velocity.swap();
          pass(divergence,divTarget,{source:velocity.read.tex},{stepSize:texel});
          const checking=options.diagnostics && (stepCount++%90===0);
          const before=checking?rms(divTarget):null;
          // Zero-start pressure prevents stale pressure impulses after long pauses.
          g.bindFramebuffer(g.FRAMEBUFFER,pressure.read.fbo);g.clearColor(0,0,0,0);g.clear(g.COLOR_BUFFER_BIT);
          for(let i=0;i<iterations;i++){pass(jacobi,pressure.write,{source:pressure.read.tex,divField:divTarget.tex},{stepSize:texel});pressure.swap();}
          pass(project,velocity.write,{source:velocity.read.tex,pressureField:pressure.read.tex},{stepSize:texel});velocity.swap();
          if(checking){pass(divergence,divTarget,{source:velocity.read.tex},{stepSize:texel});const after=rms(divTarget);if(before!==null&&after!==null)diagnostic={divergenceBefore:before,divergenceAfter:after};}
          pass(advect,dye.write,{source:dye.read.tex,flow:velocity.read.tex},{grid:[sw,sh],dt,decay:.26});dye.swap();
          pass(diffuse,dye.write,{source:dye.read.tex},{stepSize:[1/dw,1/dh],weight:Math.min(.24,dt*.65)});dye.swap();
          if(checking){const energy=rms(dye.read);if(energy!==null)diagnostic.dyeEnergy=energy;}
          pass(display,null,{source:dye.read.tex});
        },
        inspect: () => ({ simulation:[sw,sh],dye:[dw,dh],pressureIterations:iterations,...diagnostic })
      };
    }

    function metaballs() {
      const count = card ? 6 : mobile ? 8 : 10;
      const aspect = width / height;
      const balls = Array.from({length:count},(_,i)=>{
        const angle=i/count*Math.PI*2;
        return { x:aspect*.5+Math.cos(angle)*Math.min(aspect*.27,card?.21:.29), y:.5+Math.sin(angle)*(card?.16:.22), vx:0,vy:0,r:(card?.082:.065)+(i%3)*.013,angle,stretch:1 };
      });
      const shape = new Float32Array(48), motion = new Float32Array(48);
      const shader = program(`
        void main(){vec2 p=uv*vec2(aspect,1.);float field=0.;vec2 grad=vec2(0);vec3 tint=vec3(0);
          for(int i=0;i<12;i++){if(float(i)>=count)break;vec4 b=blobs[i],m=motions[i];float c=cos(m.z),s=sin(m.z);mat2 rot=mat2(c,-s,s,c);vec2 q=rot*(p-b.xy);vec2 inv=vec2(1./m.w,m.w);vec2 e=q*inv;float denom=dot(e,e)+b.z*b.z*.11;float f=b.z*b.z/denom;field+=f;grad+=transpose(rot)*(-2.*b.z*b.z*q*inv*inv/(denom*denom));tint+=f*(.55+.45*cos(vec3(0.,2.,4.)+float(i)*.7));}
          float aa=max(fwidth(field),.003);float mask=smoothstep(1.18-aa,1.18+aa,field);vec3 n=normalize(vec3(-grad*.36/max(field*field,1.),2.4));vec3 light=normalize(vec3(-.5,.75,1.));float spec=pow(max(dot(n,normalize(light+vec3(0,0,1))),0.),42.);float rim=pow(max(0.,1.-clamp(n.z,0.,1.)),2.2);vec3 base=tint/max(field,.001);vec3 surface=base*(.30+.52*max(dot(n,light),0.))+vec3(.88,.98,1.)*spec*.78+vec3(.4,.65,.9)*rim*.35;vec3 bg=mix(vec3(.025,.025,.075),vec3(.10,.065,.16),uv.y);float halo=exp(-abs(field-1.18)*4.)*.065;outColor=vec4(mix(bg+halo,surface,mask),1.);}`,
        'uniform vec4 blobs[12],motions[12];uniform float aspect,count;');
      let elapsed=0,maxDeformation=1;
      return {
        frame(dt, now) {
          elapsed+=dt;splats.length=0;maxDeformation=1;
          const influence=pointer.active?Math.exp(-Math.max(0,now-pointer.time-.18)*2.5):0;
          const pv=Math.min(4,Math.hypot(pointer.vx,pointer.vy));
          for(let i=0;i<count;i++){
            const b=balls[i];
            const ax=aspect*.5+Math.cos(b.angle+Math.sin(elapsed*.23)*.12)*Math.min(aspect*.27,card?.21:.29);
            const ay=.5+Math.sin(b.angle)*(card?.16:.22)+Math.sin(elapsed*.6+i)*.022;
            let fx=(ax-b.x)*5.5,fy=(ay-b.y)*5.5;
            const dx=b.x-pointer.x*aspect,dy=b.y-pointer.y,d=Math.max(.025,Math.hypot(dx,dy));
            const reach=Math.max(0,1-d/.38)*influence;
            const direction=pointer.down?-.65:1;
            fx+=direction*dx/d*reach*(1.9+pv*.6);fy+=direction*dy/d*reach*(1.9+pv*.6);
            // Soft pair separation avoids numerical collapse, but permits visual merging.
            for(let j=0;j<count;j++)if(i!==j){const q=balls[j],xx=b.x-q.x,yy=b.y-q.y,dd=Math.max(.01,Math.hypot(xx,yy));const f=Math.max(0,.075-dd)*2;fx+=xx/dd*f;fy+=yy/dd*f;}
            b.vx=(b.vx+fx*dt)*Math.exp(-dt*3.1);b.vy=(b.vy+fy*dt)*Math.exp(-dt*3.1);
            b.x=clamp(b.x+b.vx*dt,b.r*.75,aspect-b.r*.75);b.y=clamp(b.y+b.vy*dt,b.r*.75,1-b.r*.75);
            const speed=Math.hypot(b.vx,b.vy),target=1+Math.min(.65,speed*.65+pv*reach*.12);
            b.stretch+=(target-b.stretch)*(1-Math.exp(-dt*12));maxDeformation=Math.max(maxDeformation,b.stretch);
            shape.set([b.x,b.y,b.r,0],i*4);motion.set([b.vx,b.vy,Math.atan2(b.vy,b.vx),b.stretch],i*4);
          }
          pass(shader,null,{}, {blobs:shape,motions:motion,aspect,count});
        },
        inspect:()=>({blobCount:count,maxDeformation})
      };
    }

    function refraction() {
      const aspect = width / height;
      const source = document.createElement('canvas');
      source.width=Math.min(1400,Math.max(320,Math.round(width)));source.height=Math.min(1000,Math.max(240,Math.round(height)));
      const ctx=source.getContext('2d');
      if(!ctx)throw new Error('Canvas 2D unavailable for the generated texture');
      const w=source.width,h=source.height;
      const gradient=ctx.createLinearGradient(0,0,w,h);gradient.addColorStop(0,'#bdc9ff');gradient.addColorStop(.48,'#7ee6da');gradient.addColorStop(1,'#f9bd94');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
      ctx.strokeStyle='#18315440';ctx.lineWidth=1;
      const grid=Math.max(22,Math.min(w,h)/12);
      for(let x=0;x<w;x+=grid){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
      for(let y=0;y<h;y+=grid){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
      ctx.fillStyle='#183154';ctx.font=`800 ${Math.round(Math.min(w/6.5,h/5))}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('LIQUID',w*.42,h*.42);ctx.fillText('OPTICS',w*.58,h*.62);
      ctx.fillStyle='#fcf7e9';ctx.fillRect(w*.1,h*.78,w*.8,h*.05);ctx.fillStyle='#183154';
      for(let i=0;i<24;i++)ctx.fillRect(w*.1+i*w*.8/24,h*.78,w*.8/48,h*.05);
      const tex=texture(w,h,null,false);g.bindTexture(g.TEXTURE_2D,tex);g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,true);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,source);g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,false);
      const shader=program(`void main(){vec2 p=uv*vec2(aspect,1.),delta=p-center;float c=cos(angle),s=sin(angle);mat2 rot=mat2(c,-s,s,c);vec2 q=rot*delta/vec2(radius*stretch,radius/stretch);float d=length(q);vec3 background=texture(scene,uv).rgb;float shadow=(1.-smoothstep(1.,1.4,d))*.14;if(d>=1.){outColor=vec4(background-shadow,1);return;}float z=sqrt(max(0.,1.-d*d));vec3 normal=normalize(vec3(q,z));vec3 ray=refract(vec3(0,0,-1),normal,1./1.46);vec2 bend=transpose(rot)*(ray.xy*z*radius*.65*intensity);vec2 offset=bend/vec2(aspect,1.);vec3 glass=vec3(texture(scene,uv+offset*1.07).r,texture(scene,uv+offset).g,texture(scene,uv+offset*.93).b);float fresnel=.035+.965*pow(1.-z,5.);vec3 light=normalize(vec3(-.5+click*.25,.65,1.));float spec=pow(max(dot(normal,normalize(light+vec3(0,0,1))),0.),70.);float rim=smoothstep(.84,1.,d);glass=mix(glass,vec3(.87,.98,1.),fresnel*.52)+spec*.6+rim*.14;float edge=1.-smoothstep(.985,1.,d);outColor=vec4(mix(background,glass,edge),1);}`,
        'uniform sampler2D scene;uniform vec2 center;uniform float aspect,radius,stretch,angle,intensity,click;');
      let x=aspect*.5,y=.5,vx=0,vy=0,stretch=1,angle=0,click=0;
      let radius=Math.min(requestedRadius/height,.43,aspect*.43);
      return {
        frame(dt) {
          splats.length=0;
          const tx=pointer.active?pointer.x*aspect:aspect*.5,ty=pointer.active?pointer.y:.5;
          // Damped second-order spring, integrated in small stable substeps.
          const steps=Math.ceil(dt/(1/120)),h=dt/steps;
          for(let i=0;i<steps;i++){vx+=((tx-x)*180-vx*24)*h;vy+=((ty-y)*180-vy*24)*h;x+=vx*h;y+=vy*h;}
          const speed=Math.hypot(vx,vy);if(speed>.01)angle=Math.atan2(vy,vx);
          stretch+=(1+Math.min(.45,speed*.28)-stretch)*(1-Math.exp(-dt*10));
          click+=((pointer.down?1:0)-click)*(1-Math.exp(-dt*12));
          pass(shader,null,{scene:tex},{center:[x,y],aspect,radius:radius*(1+click*.12),stretch,angle,intensity:intensity*(1+click*.18),click});
        },
        inspect:()=>({lens:{x:x/aspect,y,radius:radius*height,stretch,intensity}})
      };
    }
  }
}
