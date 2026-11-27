/* ============================================================
   memory slides: edit your content here
   ------------------------------------------------------------
   spotify: the song's link (clicking the cd opens it)
   pos:  where the thing floats on a computer (left/top in %)
   mpos: where it floats on a phone
   ============================================================ */
const MEMORIES = {
  taiwan: {
    card: { num: '01', date: 'oct 2026', stamp: 'TAIWAN TRIP', photo: 'assets/taiwan-photo.jpg' },
    background: 'assets/taiwan-hazy.webp',
    title: 'taiwan trip',
    date: 'october 2026',
    blurb: 'this trip felt like a chance to start a new, a refreshing breathe of happiness',
    items: [
      { name: 'the balls', img: 'assets/balls.webp', note: '[why the balls go with this song]', z: 5,
        pos: { left: '76%', top: '50%', size: 'min(210px, 30vw)' }, mpos: { left: '80%', top: '64%', size: '28vw' },
        song: { title: 'Oh, My Life', artist: 'Cosmos People', cover: 'assets/cover-ohmylife.jpg', spotify: 'https://open.spotify.com/track/3Tflpdjw8qA8WjYR3FgYmq' } },
      { name: 'the snails', img: 'assets/snails.webp', note: '[why the snails go with this song]',
        pos: { left: '20%', top: '44%', size: 'min(240px, 34vw)' }, mpos: { left: '20%', top: '64%', size: '30vw' },
        song: { title: 'Maybe Maybe', artist: 'The Chairs', cover: 'assets/cover-maybe.jpg', spotify: 'https://open.spotify.com/track/55e4I1RfHjQT1XAf7glB2J' } },
      { name: 'the surfboards', img: 'assets/surfboards.webp', note: '[why the surfboards go with this song]', tilt: '-20deg',
        pos: { left: '30%', top: '74%', size: 'min(380px, 44vw)' }, mpos: { left: '28%', top: '86%', size: '40vw' },
        song: { title: '海浪', artist: 'deca joins', cover: 'assets/cover-hailang.jpg', spotify: 'https://open.spotify.com/track/5EpLeWSwqOG0mZW0R4WdKQ' } },
      { name: 'the lantern', img: 'assets/lantern.webp', note: '[why the lantern goes with this song]',
        pos: { left: '29%', top: '15%', size: 'min(230px, 32vw)' }, mpos: { left: '15%', top: '24%', size: '24vw' },
        song: { title: 'Bluebird', artist: '落日飛車 Sunset Rollercoaster', cover: 'assets/cover-bluebird.jpg', spotify: 'https://open.spotify.com/track/3jgZYDYIEthcx7BrDOzPCl' } },
      { name: 'the walking man', img: 'assets/walking-man.webp', note: '[why the walking man goes with this song]',
        pos: { left: '71%', top: '82%', size: 'min(240px, 32vw)' }, mpos: { left: '74%', top: '86%', size: '30vw' },
        song: { title: 'Vanilla', artist: '落日飛車 Sunset Rollercoaster', cover: 'assets/cover-vanilla.jpg', spotify: 'https://open.spotify.com/track/5GYVRgPzH63t7i0873LwYm' } },
      { name: 'the mirror', img: 'assets/mirror.webp', note: '[why the mirror goes with this song]',
        pos: { left: '72%', top: '16%', size: 'min(230px, 30vw)' }, mpos: { left: '84%', top: '26%', size: '24vw' },
        song: { title: 'Finger', artist: 'Elephant Gym', cover: 'assets/cover-finger.jpg', spotify: 'https://open.spotify.com/track/3Of8Z34kYIFKzm025HtkiH' } }
    ]
  }
};
// the 3×3 sheet: a memory id, 'readme', or null for an empty pocket
const GRID = ['taiwan', null, null, null, 'readme', null, null, null, null];

/* ============================================================ */
const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const isPhone = () => window.matchMedia('(max-width: 760px)').matches;

/* ---------- worn paper: each card gets its own seeded texture ---------- */
const CARD_TEX = "<filter id=\"card-tex\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\">\n<feTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"3\" seed=\"5\" result=\"fine\"></feTurbulence>\n<feDiffuseLighting in=\"fine\" lighting-color=\"#FFFFFF\" surfaceScale=\"1.4\" result=\"lit\"><feDistantLight azimuth=\"45\" elevation=\"60\"></feDistantLight></feDiffuseLighting>\n<feTurbulence type=\"fractalNoise\" baseFrequency=\"0.018\" numOctaves=\"2\" seed=\"11\" result=\"mottle\"></feTurbulence>\n<feColorMatrix in=\"mottle\" type=\"matrix\" values=\"0 0 0 0 0.90  0 0 0 0 0.86  0 0 0 0 0.76  0.6 0 0 0 -0.28\" result=\"stain\"></feColorMatrix>\n<feTurbulence type=\"turbulence\" baseFrequency=\"0.04 0.9\" numOctaves=\"1\" seed=\"21\" result=\"fib\"></feTurbulence>\n<feColorMatrix in=\"fib\" type=\"matrix\" values=\"0 0 0 0 0.6  0 0 0 0 0.56  0 0 0 0 0.5  0 0 0 -1.6 0.34\" result=\"fibers\"></feColorMatrix>\n<feMerge result=\"marks\"><feMergeNode in=\"stain\"></feMergeNode><feMergeNode in=\"fibers\"></feMergeNode></feMerge>\n<feBlend in=\"marks\" in2=\"lit\" mode=\"multiply\"></feBlend>\n</filter>";
const WORN_TEX = "<filter id=\"worn-tex\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\">\n<feTurbulence type=\"fractalNoise\" baseFrequency=\"0.011\" numOctaves=\"3\" seed=\"7\" result=\"big\"></feTurbulence>\n<feColorMatrix in=\"big\" type=\"matrix\" values=\"0 0 0 0 0.93  0 0 0 0 0.9  0 0 0 0 0.84  0 0 0 2.2 -1.15\" result=\"patches\"></feColorMatrix>\n<feTurbulence type=\"fractalNoise\" baseFrequency=\"0.45 0.03\" numOctaves=\"3\" seed=\"3\" result=\"scr\"></feTurbulence>\n<feColorMatrix in=\"scr\" type=\"matrix\" values=\"0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 14 -9.6\" result=\"scratches\"></feColorMatrix>\n<feTurbulence type=\"fractalNoise\" baseFrequency=\"1.6\" numOctaves=\"1\" seed=\"11\" result=\"dust\"></feTurbulence>\n<feColorMatrix in=\"dust\" type=\"matrix\" values=\"0 0 0 0 1  0 0 0 0 0.98  0 0 0 0 0.94  0 0 0 10 -6.9\" result=\"specks\"></feColorMatrix>\n<feMerge><feMergeNode in=\"patches\"></feMergeNode><feMergeNode in=\"specks\"></feMergeNode></feMerge>\n</filter>";
(function makeTextures() {
  let out = '';
  for (let k = 0; k < 10; k++) {
    const seed = (src) => src.replace(/seed="(\d+)"/g, (_, n) => `seed="${+n + k * 17 + 3}"`);
    out += seed(CARD_TEX.replace('id="card-tex"', `id="card-tex-${k}"`)) + seed(WORN_TEX.replace('id="worn-tex"', `id="worn-tex-${k}"`));
  }
  $('fx').insertAdjacentHTML('beforeend', out);
})();
function paper(k) {
  return `<svg class="tex grain-layer" aria-hidden="true"><rect width="100%" height="100%" filter="url(#card-tex-${k})"/></svg>` +
         `<svg class="tex wear-layer" aria-hidden="true"><rect width="100%" height="100%" filter="url(#worn-tex-${k})"/></svg>`;
}
document.querySelectorAll('.card-dark').forEach((el, i) => el.insertAdjacentHTML('afterbegin', paper(i === 0 ? 4 : 0)));

/* ---------- sound ---------- */
let ac = null;
function audio() {
  if (!ac) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ac = new AC(); }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}
function noise(c, dur) {
  const b = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(); s.buffer = b; return s;
}
function env(g, t, peak, a, r) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + r); }
function filtered(type, freq, q) { const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; if (q) f.Q.value = q; return f; }
const sfx = {
  tick() { const c = ac; if (!c || c.state !== 'running') return; const t = c.currentTime, s = noise(c, .03), f = filtered('bandpass', 5200, 2), g = c.createGain(); env(g, t, .05, .003, .03); s.connect(f).connect(g).connect(c.destination); s.start(t); s.stop(t + .035); },
  rustle() { const c = audio(); if (!c) return; const t = c.currentTime, s = noise(c, .35), f = filtered('highpass', 1800), g = c.createGain(); env(g, t, .06, .05, .33); s.connect(f).connect(g).connect(c.destination); s.start(t); s.stop(t + .36); },
  snap() { const c = audio(); if (!c) return; const t = c.currentTime; [0, .045].forEach((o, k) => { const s = noise(c, .05), f = filtered('bandpass', k ? 2400 : 3600, 1.4), g = c.createGain(); env(g, t + o, k ? .18 : .3, .003, .045); s.connect(f).connect(g).connect(c.destination); s.start(t + o); s.stop(t + o + .06); }); },
  tap() { const c = audio(); if (!c) return; const t = c.currentTime, o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(950, t); o.frequency.exponentialRampToValueAtTime(480, t + .05); env(g, t, .12, .004, .07); o.connect(g).connect(c.destination); o.start(t); o.stop(t + .08); },
  whir() { const c = audio(); if (!c) return; const t = c.currentTime, o = c.createOscillator(), lp = filtered('lowpass', 600), g = c.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(50, t); o.frequency.exponentialRampToValueAtTime(190, t + 1.1); env(g, t, .05, .25, 1.5); o.connect(lp).connect(g).connect(c.destination); o.start(t); o.stop(t + 1.6); const n = noise(c, 1.5), nf = filtered('lowpass', 900), ng = c.createGain(); env(ng, t, .035, .3, 1.4); n.connect(nf).connect(ng).connect(c.destination); n.start(t); n.stop(t + 1.5); },
  swell() { const c = audio(); if (!c) return; const t = c.currentTime, s = noise(c, 1.6), f = c.createBiquadFilter(), g = c.createGain(); f.type = 'lowpass'; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(1600, t + 1.2); env(g, t, .07, .4, 1.5); s.connect(f).connect(g).connect(c.destination); s.start(t); s.stop(t + 1.6); }
};

/* ---------- your recorded swipe, played when a card lifts out ---------- */
const swipeSound = new Audio('assets/swipe.mp3');
swipeSound.preload = 'auto';
function playSwipe() {
  try { swipeSound.currentTime = 0; swipeSound.volume = 0.85; const p = swipeSound.play(); if (p) p.catch(() => sfx.rustle()); }
  catch (e) { sfx.rustle(); }
}

/* ---------- the sheet ---------- */
function buildGrid() {
  const grid = $('grid');
  GRID.forEach((id, k) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    const sleeve = document.createElement('div');
    sleeve.className = 'sleeve';
    if (!id || (id !== 'readme' && !MEMORIES[id])) { cell.append(sleeve); grid.append(cell); return; }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'slide card-dark';
    let inner = paper(k);
    if (id === 'readme') {
      btn.setAttribute('aria-label', 'Open read me');
      inner += '<div class="labels" aria-hidden="true"><span>00</span><span>read me</span></div><div class="win"><img src="assets/readme-photo.jpg" alt="" style="object-position:50% 50%"><span class="holo"></span></div><p class="stamp" aria-hidden="true">THE ARCHIVES</p>';
    } else {
      const c = MEMORIES[id].card;
      btn.setAttribute('aria-label', 'Open memory: ' + MEMORIES[id].title);
      inner += `<div class="labels" aria-hidden="true"><span>${c.num}</span><span>${c.date}</span></div><div class="win"><img src="${c.photo}" alt=""><span class="holo"></span></div><p class="stamp" aria-hidden="true">${c.stamp}</p>`;
    }
    btn.innerHTML = inner;
    cell.append(btn, sleeve);
    grid.append(cell);

    const holo = btn.querySelector('.holo');
    const reset = () => { if (cell.dataset.busy) return; btn.style.transform = ''; btn.classList.remove('up'); cell.classList.remove('lifted'); };
    cell.addEventListener('pointermove', (e) => {
      if (cell.dataset.busy || e.pointerType !== 'mouse') return;
      const r = cell.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      if (!btn.classList.contains('up')) sfx.tick();
      cell.classList.add('lifted'); btn.classList.add('up');
      btn.style.transform = `translateY(-30%) perspective(800px) rotateX(${((.5 - y) * 14).toFixed(2)}deg) rotateY(${((x - .5) * 16.8).toFixed(2)}deg) scale(1.05)`;
      if (holo) holo.style.background = `radial-gradient(circle at ${Math.round(x * 100)}% ${Math.round(y * 100)}%, rgba(255,255,255,.55), rgba(255,255,255,0) 38%)`;
    });
    cell.addEventListener('pointerleave', reset);
    btn.addEventListener('click', () => {
      if (id === 'readme') openReadme();
      else enterMemory(id, cell, btn, k);
    });
  });
}

/* ---------- read me ---------- */
function openReadme() { playSwipe(); $('readme').hidden = false; $('readme-close').focus(); }
function closeReadme() { sfx.tap(); $('readme').hidden = true; }
$('readme-close').addEventListener('click', closeReadme);
$('readme').addEventListener('click', (e) => { if (e.target === $('readme') || e.target === $('readme').firstElementChild) closeReadme(); });

/* ---------- memory scene ---------- */
let current = null, track = -1, busy = false, lastCell = null, lastBtn = null;

function setRect(el, r) { el.style.left = r.l + 'px'; el.style.top = r.t + 'px'; el.style.width = r.w + 'px'; el.style.height = r.h + 'px'; }

async function enterMemory(id, cell, btn, k) {
  if (busy) return; busy = true;
  const m = MEMORIES[id]; current = m; lastCell = cell; lastBtn = btn;
  playSwipe();
  $('hazy').src = m.background;                       // load the street early so it's ready under the dots
  cell.dataset.busy = '1'; cell.classList.add('lifted');
  btn.style.transform = 'translateY(-118%) scale(1.04)';
  await wait(520);

  // the flying slide keeps the same worn paper as its card
  const r = btn.getBoundingClientRect();
  const fly = $('fly');
  fly.querySelectorAll('.tex').forEach((t) => t.remove());
  fly.insertAdjacentHTML('afterbegin', paper(k));
  $('fly-num').textContent = m.card.num; $('fly-date').textContent = m.card.date; $('fly-stamp').textContent = m.card.stamp; $('fly-img').src = m.card.photo;
  fly.className = 'flyslide card-dark'; fly.style.transition = 'none';
  setRect(fly, { l: r.left, t: r.top, w: r.width, h: r.height });
  $('memory').hidden = false; $('memory').classList.remove('closing');
  btn.style.visibility = 'hidden';
  void fly.offsetWidth; fly.style.transition = '';
  const vw = window.innerWidth, vh = window.innerHeight, S = Math.min(380, vw * .62, vh * .62);
  const C = { l: (vw - S) / 2, t: (vh - S) / 2, w: S, h: S };
  setRect(fly, C); fly.classList.add('centered');
  await wait(860);

  // a soft black oval fades in around the photo, then closes to black
  const wr = fly.querySelector('.win').getBoundingClientRect();
  const iris = $('iris'); iris.className = 'iris';
  iris.style.setProperty('--cx', (wr.left + wr.width / 2) + 'px');
  iris.style.setProperty('--cy', (wr.top + wr.height / 2) + 'px');
  iris.style.setProperty('--rx', (wr.width * .62) + 'px');
  iris.style.setProperty('--ry', (wr.height * .7) + 'px');
  await wait(150);
  sfx.swell();
  void iris.offsetWidth; iris.classList.add('on');
  await wait(1300);
  iris.classList.add('close');
  await wait(1250);

  // the street dissolves in, in fine grains, like drifting into a dream
  fly.classList.add('gone');
  $('hazy').classList.add('dolly', 'on', 'instant');
  $('mem-title').textContent = m.title; $('mem-date').textContent = m.date; $('mem-blurb').textContent = m.blurb;
  setTrack(-1, true);
  buildItems(m);
  $('scene').hidden = false; void $('scene').offsetWidth; $('scene').classList.add('loaded');
  const dream = dreamIn();
  iris.style.transition = 'none'; iris.style.opacity = '0';
  await dream;
  iris.className = 'iris'; iris.style.transition = ''; iris.style.opacity = '';
  $('explore').focus({ preventScroll: true });
  busy = false;
}

function dreamIn() {
  return new Promise((done) => {
    const cv = $('dream');
    const W = Math.round(window.innerWidth), H = Math.round(window.innerHeight);
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    const img = g.createImageData(W, H), px = img.data, n = W * H;
    const thr = new Float32Array(n);
    for (let q = 0; q < n; q++) { thr[q] = Math.random(); px[q * 4 + 3] = 255; }
    g.putImageData(img, 0, 0);
    cv.className = 'dream on';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { cv.className = 'dream'; done(); return; }
    const DUR = 1000, SOFT = 0.12, start = performance.now();
    (function frame(now) {
      const t = Math.min(1, (now - start) / DUR) * (1 + SOFT);
      for (let q = 0; q < n; q++) {
        const a = (thr[q] - t + SOFT) / SOFT;            // each grain fades out over a short moment
        px[q * 4 + 3] = a >= 1 ? 255 : a <= 0 ? 0 : a * 255;
      }
      g.putImageData(img, 0, 0);
      if (t < 1 + SOFT) requestAnimationFrame(frame);
      else { cv.className = 'dream'; done(); }
    })(start);
  });
}

async function exitMemory() {
  if (busy) return; busy = true;
  sfx.tap(); stopSpotify();
  $('memory').classList.add('closing');
  await wait(700);
  $('dream').className = 'dream';
  $('memory').hidden = true; $('scene').hidden = true; $('scene').classList.remove('loaded');
  $('veil').classList.remove('on'); $('hazy').className = 'hazy'; $('iris').className = 'iris'; $('zoom').className = 'zoom'; $('zoom').removeAttribute('style');
  $('items').innerHTML = '';
  if (lastBtn) { lastBtn.style.visibility = ''; lastBtn.style.transform = ''; lastBtn.classList.remove('up'); }
  if (lastCell) { delete lastCell.dataset.busy; lastCell.classList.remove('lifted'); }
  current = null; busy = false;
  if (lastBtn) lastBtn.focus({ preventScroll: true });
}
$('explore').addEventListener('click', exitMemory);
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!$('readme').hidden) closeReadme();
  else if (current) exitMemory();
});

/* ---------- floating things ---------- */
const DRIFT = [
  { dx: 23, ax: 34, dy: 13, ay: 20, sw: 9, rot: 3 }, { dx: 29, ax: 26, dy: 17, ay: 26, sw: 12, rot: 2.2 },
  { dx: 19, ax: 40, dy: 11, ay: 16, sw: 10, rot: 3.6 }, { dx: 31, ax: 22, dy: 19, ay: 28, sw: 14, rot: 1.6 },
  { dx: 26, ax: 30, dy: 15, ay: 22, sw: 11, rot: 2.8 }, { dx: 21, ax: 36, dy: 12, ay: 18, sw: 8, rot: 3.2 },
  { dx: 27, ax: 28, dy: 16, ay: 24, sw: 13, rot: 2.4 }
];
function buildItems(m) {
  const wrap = $('items'); wrap.innerHTML = '';
  const phone = isPhone();
  m.items.forEach((it, i) => {
    const p = phone ? it.mpos : it.pos, d = DRIFT[i % DRIFT.length];
    const el = document.createElement('div');
    el.className = 'mitem';
    el.style.left = p.left; el.style.top = p.top; el.style.width = p.size;
    if (it.tilt) el.style.rotate = it.tilt;
    el.style.zIndex = it.z || 3;
    const songLabel = `${it.song.title} — ${it.song.artist}`;
    el.innerHTML = `
      <div class="mitem-in">
        <div class="dx" style="animation-duration:${d.dx}s;animation-delay:${-i * 4.3}s;--ax:${d.ax}px">
          <div class="dy" style="animation-duration:${d.dy}s;animation-delay:${-i * 2.9}s;--ay:${d.ay}px">
            <div class="sw" style="animation-duration:${d.sw}s;animation-delay:${-i * 1.7}s;--rot:${d.rot}deg">
              <div class="mwrap">
                <button class="mbtn" type="button" aria-label="Play ${songLabel} (${it.name})"><img src="${it.img}" alt=""></button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    const b = el.querySelector('.mbtn');
    b.addEventListener('pointerenter', () => { if (!el.classList.contains('hot')) sfx.tick(); el.classList.add('hot'); });
    b.addEventListener('pointerleave', () => el.classList.remove('hot'));
    b.addEventListener('focus', () => el.classList.add('hot'));
    b.addEventListener('blur', () => el.classList.remove('hot'));
    b.addEventListener('click', () => { if (track !== i) setTrack(i); });
    wrap.append(el);
  });
}

/* ---------- spotify player (inside the tag) ---------- */
let spApi = null, spCtl = null, spWanted = null;
window.onSpotifyIframeApiReady = (api) => { spApi = api; if (spWanted) playSpotify(spWanted); };
const spUri = (link) => { const m = String(link || '').match(/track[/:]([A-Za-z0-9]{22})/); return m ? 'spotify:track:' + m[1] : ''; };
function playSpotify(link) {
  const uri = spUri(link);
  $('sp-wrap').hidden = !uri;
  if (!uri) { if (spCtl) spCtl.pause(); return; }
  spWanted = link;
  if (!spApi) return;                       // script still loading; plays when ready
  if (!spCtl) {
    spApi.createController($('sp-embed'), { uri, width: '100%', height: 80 }, (c) => {
      spCtl = c;
      c.addListener('ready', () => c.play());
    });
  } else {
    spCtl.loadUri(uri);
    setTimeout(() => spCtl.play(), 350);
  }
}
function stopSpotify() { spWanted = null; if (spCtl) spCtl.pause(); }

/* ---------- cd player + tag ---------- */
let flipT1 = null, flipT2 = null, discT = null;
function fillTag(i) {
  if (i < 0) { $('tag-idle').hidden = false; $('tag-playing').hidden = true; $('sp-wrap').hidden = true; return; }
  const it = current.items[i];
  $('np-thing').textContent = it.name; $('np-title').textContent = it.song.title; $('np-artist').textContent = it.song.artist; $('np-note').textContent = it.note;
  $('tag-idle').hidden = true; $('tag-playing').hidden = false;
}
function setTrack(i, silent) {
  track = i;
  document.querySelectorAll('.mitem').forEach((el, k) => el.classList.toggle('sel', k === i));
  clearTimeout(flipT1); clearTimeout(flipT2); clearTimeout(discT);
  const disc = $('disc'), link = $('disc-link');
  if (i < 0) {
    disc.hidden = true; $('sheen').hidden = true; link.hidden = true; $('spindle').hidden = false;
    fillTag(-1);
    return;
  }
  const it = current.items[i];
  if (!silent) sfx.rustle();
  // the tag spins on its string; the words change while it's edge-on
  const flip = $('tag-flip');
  flip.classList.remove('flip'); void flip.offsetWidth; flip.classList.add('flip');
  playSpotify(it.song.spotify);
  flipT1 = setTimeout(() => fillTag(i), 340);
  flipT2 = setTimeout(() => flip.classList.remove('flip'), 760);
  // the cd rolls in from the right, inside the hole
  disc.hidden = true; void disc.offsetWidth;
  $('disc-img').src = it.song.cover;
  disc.hidden = false; $('sheen').hidden = false; $('spindle').hidden = true;
  link.hidden = !it.song.spotify;
  link.href = it.song.spotify || '#';
  link.setAttribute('aria-label', `Open ${it.song.title} by ${it.song.artist} on Spotify`);
  discT = setTimeout(() => { sfx.snap(); setTimeout(sfx.whir, 140); }, 860);
}

buildGrid();
