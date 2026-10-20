import './styles.css';
import { bySlug, media } from './data/projects';
import { renderHome } from './home';
import { renderDetail } from './detail';
import { initCompare } from './compare';
import {
  OPT_STEPS,
  advanceOptGame,
  openOptGameViewer,
  setOptGameStep,
  stopOptGameAutoPlay,
  toggleOptGameAutoPlay,
  toggleOptGameSound,
} from './optgame';
import { filmsToItems, initViewer, openViewer, closeViewer, type ViewerItem } from './viewer';
import { mountVideo, prefersReducedMotion, stopAllVideos } from './ui';
import type { DoorApi } from './door3d';

const $ = <T extends HTMLElement = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const homeEl = $('#home')!;
const detailEl = $('#detail')!;

type VT = { finished: Promise<void> };
const startVT = (document as unknown as { startViewTransition?: (cb: () => void) => VT }).startViewTransition?.bind(document);

let homeScroll = 0;
let lastClicked: HTMLElement | null = null;
let navIntent = false;
let cameFromHome = false;
let view: 'home' | 'detail' = 'home';
let currentSlug = '';

/* ───────────── reveal (image masks / text) ───────────── */
let io: IntersectionObserver | null = null;
function observeReveals(root: ParentNode) {
  const els = root.querySelectorAll<HTMLElement>('.rv:not(.in)');
  if (!('IntersectionObserver' in window) || prefersReducedMotion()) return els.forEach((e) => e.classList.add('in'));
  io ??= new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io!.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((e) => io!.observe(e));
}

/* ───────────── door demos ───────────── */
interface DoorState { open: boolean; dissolved: boolean; api: DoorApi | null; busy: boolean }
const doors = new Map<HTMLElement, DoorState>();

function getDoorCfg(demo: HTMLElement) {
  const p = bySlug(demo.dataset.doordemo!)!;
  const idx = Number(demo.dataset.doorIdx ?? 0);
  return p.doors?.[idx] ?? p.door!;
}

function syncDoor(demo: HTMLElement, st: DoorState) {
  const dCfg = getDoorCfg(demo);
  const c = st.open ? dCfg.openColor : dCfg.closedColor;
  demo.querySelectorAll('[data-doorcss]').forEach((d) => {
    d.classList.toggle('open', st.open);
    d.classList.toggle('dissolve', st.dissolved);
    d.setAttribute('aria-pressed', String(st.open));
    const s = d.querySelector('.doorcss__state');
    if (s) s.textContent = st.open ? 'Open' : 'Closed';
    (d as HTMLElement).style.setProperty('--ind', c);
  });
  const t = $('[data-door-toggle]', demo);
  if (t) { t.setAttribute('aria-pressed', String(st.open)); t.firstChild!.textContent = st.open ? 'Close door' : 'Open door'; }
  $('[data-door-dissolve]', demo)?.setAttribute('aria-pressed', String(st.dissolved));
  const sw = $('.swatch', demo);
  sw?.style.setProperty('--c', c);
  const stat = $('[data-door-status]', demo);
  if (stat) stat.textContent = `Door ${st.open ? 'open' : 'closed'} · light ${c}${st.dissolved ? ' · panels dissolved' : ''}`;
  const hint = $('.doorstage__hint', demo);
  if (hint) hint.textContent = st.open ? 'Door open — click to close' : 'Try it — click the door';
}

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

async function launch3D(demo: HTMLElement, st: DoorState, _btn?: HTMLElement | null) {
  const viewEl = demo.matches('[data-door-view]') ? demo : $('[data-door-view]', demo)!;
  if (!viewEl || st.api || st.busy) return;
  const status = $('[data-door-status]', demo);
  if (!webglOK()) {
    if (status) status.textContent = 'WebGL is unavailable on this device.';
    return;
  }
  st.busy = true;
  try {
    const dCfg = getDoorCfg(demo);
    const { mountDoor } = await import('./door3d');
    if (!demo.isConnected) return;
    st.open = false; st.dissolved = false;
    viewEl.classList.add('is-3d');
    const loader = viewEl.querySelector('.doorstage__loader');
    if (loader) loader.remove();
    st.api = await mountDoor(viewEl, {
      glbUrl: media(dCfg.glb), nodeNames: dCfg.nodeNames, openColor: dCfg.openColor, closedColor: dCfg.closedColor,
      reduceMotion: prefersReducedMotion(),
      onState: (s) => { st.open = s.open; st.dissolved = s.dissolved; syncDoor(demo, st); },
    });
    syncDoor(demo, st);
  } catch (err) {
    console.error('Door 3D load error:', err);
    if (status) status.textContent = 'Could not load the 3D demo.';
  } finally { st.busy = false; }
}

function initDoors(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-doordemo]').forEach((demo) => {
    let st = doors.get(demo);
    if (!st) {
      st = { open: false, dissolved: false, api: null, busy: false };
      doors.set(demo, st);
    }
    if (!st.api && !st.busy) {
      void launch3D(demo, st);
    }
  });
}

function teardownDoors() {
  doors.forEach((st, demo) => {
    st.api?.dispose();
    st.api = null;
    const viewEl = demo.matches('[data-door-view]') ? demo : $('[data-door-view]', demo);
    viewEl?.classList.remove('is-3d');
  });
  doors.clear();
}

function teardownDetail() {
  teardownDoors();
  stopAllVideos(detailEl);
}

/* ───────────── delegated clicks ───────────── */
document.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;

  const nav = t.closest<HTMLAnchorElement>('.bar__nav a, .bar__mark');
  if (nav) navIntent = true;

  const open = t.closest<HTMLElement>('[data-open]');
  if (open) lastClicked = open.querySelector('img, .slot') ?? open.closest('.proj')?.querySelector<HTMLElement>('img') ?? null;

  const back = t.closest<HTMLElement>('[data-back]');
  if (back && cameFromHome) { e.preventDefault(); history.back(); return; }

  const film = t.closest<HTMLElement>('[data-film]');
  if (film) {
    const [slug, i] = film.dataset.film!.split(':');
    const p = bySlug(slug)!;
    openViewer(filmsToItems(p, p.films!), Number(i), film);
    return;
  }
  const envCard = t.closest<HTMLElement>('[data-env]');
  if (envCard) {
    const [slug, i] = envCard.dataset.env!.split(':');
    const p = bySlug(slug)!;
    const envs = p.environments ?? [];
    const items: ViewerItem[] = envs.map((e) => ({
      title: e.title,
      kicker: p.title,
      note: e.note,
      poster: e.images[0] ?? null,
      workflow: e.images,
      imageOnly: true,
    }));
    openViewer(items, Number(i), envCard, 'workflow', 0);
    return;
  }
  const shot = t.closest<HTMLElement>('[data-shot]');
  if (shot) {
    const [slug, i] = shot.dataset.shot!.split(':');
    const p = bySlug(slug)!;
    const items: ViewerItem[] = p.shots!.map((s) => ({ title: s.title, kicker: p.title, note: `${s.type}. ${s.note}`, poster: s.image, imageOnly: true }));
    openViewer(items, Number(i), shot);
    return;
  }
  const play = t.closest<HTMLElement>('[data-play]');
  if (play) { mountVideo(play.parentElement!, play.dataset.play!, play.dataset.poster ?? ''); return; }

  /* doors */
  const demo = t.closest<HTMLElement>('[data-doordemo]');
  if (demo) {
    let st = doors.get(demo);
    if (!st) { st = { open: false, dissolved: false, api: null, busy: false }; doors.set(demo, st); }
    if (t.closest('[data-door-launch]')) { void launch3D(demo, st, t.closest<HTMLElement>('[data-door-launch]')!); return; }
    if (t.closest('[data-door-dissolve]')) { if (st.api) st.api.toggleDissolve(); else { st.dissolved = !st.dissolved; syncDoor(demo, st); } return; }
    if (t.closest('[data-door-toggle]') || (t.closest('[data-doorcss]') && !st.api)) { if (st.api) st.api.toggle(); else { st.open = !st.open; syncDoor(demo, st); } return; }
  }

  /* workflow reveal */
  const flow = t.closest<HTMLElement>('[data-flow]');
  if (flow) {
    const body = $('.flow__body', flow)!;
    const toggle = $('[data-flow-toggle]', flow)!;
    const show = (i: number, focus = false) => {
      const tabs = [...flow.querySelectorAll<HTMLElement>('[data-flow-tab]')];
      const n = (i + tabs.length) % tabs.length;
      tabs.forEach((b, k) => { b.setAttribute('aria-selected', String(k === n)); b.tabIndex = k === n ? 0 : -1; });
      flow.querySelectorAll<HTMLElement>('.flow__panel').forEach((pn, k) => { pn.hidden = k !== n; });
      if (focus) tabs[n].focus();
      flow.dataset.i = String(n);
    };
    const setOpen = (o: boolean) => {
      body.hidden = !o; toggle.setAttribute('aria-expanded', String(o));
      toggle.firstChild!.textContent = o ? 'Hide the process ' : 'Show the process ';
      if (o) show(0); else stopAllVideos(flow);
    };
    if (t.closest('[data-flow-toggle]')) setOpen(body.hidden);
    else if (t.closest('[data-flow-close]')) { setOpen(false); toggle.focus(); }
    else if (t.closest('[data-flow-tab]')) show(Number(t.closest<HTMLElement>('[data-flow-tab]')!.dataset.flowTab));
    else if (t.closest('[data-flow-step]')) show(Number(flow.dataset.i ?? 0) + Number(t.closest<HTMLElement>('[data-flow-step]')!.dataset.flowStep));
    return;
  }

  /* water breakdown */
  const bd = t.closest<HTMLElement>('[data-bd]');
  if (bd) {
    const wrap = bd.closest('.bd__wrap')!;
    wrap.querySelectorAll<HTMLElement>('[data-bd]').forEach((b) => b.setAttribute('aria-selected', String(b === bd)));
    wrap.querySelectorAll<HTMLElement>('[data-bdp]').forEach((pn) => { pn.hidden = pn.dataset.bdp !== bd.dataset.bd; });
    return;
  }

  /* interactive water video: stuck on frame 1 until Fill is clicked */
  const wstage = t.closest<HTMLElement>('[data-water-stage]');
  if (wstage && !t.closest('[data-open]')) {
    const vid = $<HTMLVideoElement>('[data-water-vid]', wstage);
    const fillBtn = $<HTMLButtonElement>('[data-water-fill]', wstage);
    const resetBtn = $<HTMLButtonElement>('[data-water-reset]', wstage);
    const status = $('[data-water-status]', wstage);
    const statusBar = wstage.closest('.dfilm__player')?.querySelector<HTMLElement>('[data-water-status-bar]');
    if (!vid || !fillBtn) return;

    const syncWaterUI = (state: 'idle' | 'playing' | 'paused' | 'ended') => {
      const idleBtn = wstage.dataset.idleBtn ?? 'Fill with water ▶';
      const playingBtn = wstage.dataset.playingBtn ?? 'Pause flooding ❚❚';
      const pausedBtn = wstage.dataset.pausedBtn ?? 'Resume fill ▶';
      const endedBtn = wstage.dataset.endedBtn ?? 'Replay fill ↻';
      const idleStat = wstage.dataset.idleStatus ?? 'Paused at frame 01 · Click "Fill" to flood the scene';
      const playingStat = wstage.dataset.playingStatus ?? 'Flooding scene in real time…';
      const pausedStat = wstage.dataset.pausedStatus ?? 'Flooding paused · Click "Resume" or "Reset"';
      const endedStat = wstage.dataset.endedStatus ?? 'Scene flooded · Click "Reset" to return to frame 01';

      wstage.classList.toggle('is-filling', state === 'playing' || state === 'ended');
      fillBtn.setAttribute('aria-pressed', String(state === 'playing'));
      if (state === 'idle') {
        fillBtn.textContent = idleBtn;
        if (resetBtn) resetBtn.hidden = true;
        if (status) status.textContent = idleStat;
        if (statusBar) statusBar.textContent = 'Stuck on frame 01 · Click button to start';
      } else if (state === 'playing') {
        fillBtn.textContent = playingBtn;
        if (resetBtn) resetBtn.hidden = false;
        if (status) status.textContent = playingStat;
        if (statusBar) statusBar.textContent = playingStat;
      } else if (state === 'paused') {
        fillBtn.textContent = pausedBtn;
        if (resetBtn) resetBtn.hidden = false;
        if (status) status.textContent = pausedStat;
        if (statusBar) statusBar.textContent = 'Paused';
      } else if (state === 'ended') {
        fillBtn.textContent = endedBtn;
        if (resetBtn) resetBtn.hidden = false;
        if (status) status.textContent = endedStat;
        if (statusBar) statusBar.textContent = 'Sequence complete';
      }
    };

    if (!vid.dataset.bound) {
      vid.dataset.bound = '1';
      vid.addEventListener('ended', () => syncWaterUI('ended'));
    }

    if (t.closest('[data-water-reset]')) {
      vid.pause();
      vid.currentTime = 0.001;
      syncWaterUI('idle');
      return;
    }

    if (t.closest('[data-water-fill]') || t.closest('[data-water-vid]')) {
      if (vid.paused) {
        stopAllVideos(document);
        if (vid.ended) vid.currentTime = 0;
        vid.play().catch(() => undefined);
        syncWaterUI('playing');
      } else {
        vid.pause();
        syncWaterUI('paused');
      }
      return;
    }
  }

  /* enlarge standalone environment pictures in viewer */
  const envZoom = t.closest<HTMLElement>('[data-env-zoom]');
  if (envZoom) {
    const [slug, ei] = envZoom.dataset.envZoom!.split(':');
    const proj = bySlug(slug);
    const envs = proj?.environments ?? [];
    if (proj && envs.length) {
      const fblockEl = envZoom.closest<HTMLElement>('[data-fblock]');
      const curIdx = Number(fblockEl?.dataset.wfIdx ?? 0);
      const items: ViewerItem[] = envs.map((e) => ({
        title: e.title,
        kicker: proj.title,
        note: e.note,
        poster: e.images[0] ?? null,
        workflow: e.images,
        imageOnly: true,
      }));
      openViewer(items, Number(ei), envZoom, 'workflow', curIdx);
    }
    return;
  }

  /* per-film / project / environment / vr workflow stepper (I1..IN) */
  const fblock = t.closest<HTMLElement>('[data-fblock]');
  if (fblock && (t.closest('[data-fwf-step]') || t.closest('[data-fwf-idx]') || t.closest('[data-fwf-img]'))) {
    const [slug, fi, subIdx] = fblock.dataset.fblock!.split(':');
    const proj = bySlug(slug);
    const envItem = fi === 'env' ? proj?.environments?.[Number(subIdx)] : undefined;
    const vrItem = fi === 'vr' ? proj?.vr?.[Number(subIdx)] : undefined;
    const item = fi === 'main' ? proj : fi === 'env' ? envItem : fi === 'vr' ? vrItem : proj?.films?.[Number(fi)];
    const wf = envItem ? envItem.images : (item as { workflow?: string[] } | undefined)?.workflow ?? [];
    if (!wf.length) return;
    const cur = Number(fblock.dataset.wfIdx ?? 0);
    const stepBtn = t.closest<HTMLElement>('[data-fwf-step]');
    const idxBtn = t.closest<HTMLElement>('[data-fwf-idx]');
    const nextIdx = idxBtn
      ? Number(idxBtn.dataset.fwfIdx)
      : (cur + (stepBtn ? Number(stepBtn.dataset.fwfStep) : 1) + wf.length) % wf.length;
    fblock.dataset.wfIdx = String(nextIdx);
    const imgEl = $<HTMLImageElement>('[data-fwf-img]', fblock);
    const nextSrc = media(wf[nextIdx]);
    if (imgEl && nextSrc) {
      imgEl.src = nextSrc;
      imgEl.alt = `${item!.title} — workflow step I${nextIdx + 1}`;
    }
    const stat = $('[data-fwf-stat]', fblock);
    if (stat) stat.textContent = `Step I${nextIdx + 1} / I${wf.length}`;
    fblock.querySelectorAll<HTMLElement>('[data-fwf-idx]').forEach((b) => {
      b.setAttribute('aria-selected', String(Number(b.dataset.fwfIdx) === nextIdx));
    });
    const preloadSrc = media(wf[(nextIdx + 1) % wf.length]);
    if (preloadSrc) {
      const pre = new Image();
      pre.decoding = 'async';
      pre.src = preloadSrc;
    }
    return;
  }

  /* interactive topology optimization game (I1..I14) */
  const ogame = t.closest<HTMLElement>('[data-ogame]');
  if (ogame) {
    const cur = Number(ogame.dataset.step ?? 0);

    if (t.closest('[data-og-zoom]')) {
      stopOptGameAutoPlay(ogame);
      openOptGameViewer(t.closest<HTMLElement>('[data-og-zoom]')!, cur);
      return;
    }
    if (t.closest('[data-og-autoplay]')) {
      toggleOptGameAutoPlay(ogame);
      return;
    }
    if (t.closest('[data-og-sound]')) {
      toggleOptGameSound(ogame);
      return;
    }
    if (t.closest('[data-og-close-victory]')) {
      const vic = $('[data-og-victory]', ogame);
      if (vic) vic.hidden = true;
      return;
    }
    if (t.closest('[data-og-reset]') || t.closest('[data-og-restart]')) {
      stopOptGameAutoPlay(ogame);
      ogame.dataset.xp = '0';
      setOptGameStep(ogame, 0);
      return;
    }
    const navBtn = t.closest<HTMLElement>('[data-og-nav]');
    if (navBtn) {
      stopOptGameAutoPlay(ogame);
      setOptGameStep(ogame, cur + Number(navBtn.dataset.ogNav));
      return;
    }
    const pillBtn = t.closest<HTMLElement>('[data-og-idx]');
    if (pillBtn) {
      stopOptGameAutoPlay(ogame);
      setOptGameStep(ogame, Number(pillBtn.dataset.ogIdx));
      return;
    }
    const missionBtn = t.closest<HTMLElement>('[data-og-mission]');
    if (missionBtn) {
      stopOptGameAutoPlay(ogame);
      const mId = Number(missionBtn.dataset.ogMission);
      const firstIdx = OPT_STEPS.findIndex((s) => s.mission === mId);
      if (firstIdx >= 0) setOptGameStep(ogame, firstIdx);
      return;
    }
    if (
      t.closest('[data-og-hotspot]') ||
      t.closest('[data-og-action]') ||
      t.closest('[data-og-toolbtn]') ||
      t.closest('[data-og-img]')
    ) {
      stopOptGameAutoPlay(ogame);
      const vp = $('[data-og-viewport]', ogame);
      let xPct: number | undefined;
      let yPct: number | undefined;
      if (vp && e.clientX && e.clientY) {
        const r = vp.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          xPct = ((e.clientX - r.left) / r.width) * 100;
          yPct = ((e.clientY - r.top) / r.height) * 100;
        }
      }
      advanceOptGame(ogame, xPct, yPct);
      return;
    }
  }
});

document.addEventListener('keydown', (e) => {
  const tab = (e.target as HTMLElement).closest<HTMLElement>('[data-flow-tab]');
  if (tab && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
    e.preventDefault();
    const flow = tab.closest<HTMLElement>('[data-flow]')!;
    const tabs = [...flow.querySelectorAll<HTMLElement>('[data-flow-tab]')];
    const n = (tabs.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[n].click(); tabs[n].focus();
  }
  if (e.key === 'Escape' && view === 'detail' && !(document.getElementById('viewer') as HTMLDialogElement).open) {
    const open = $('[data-flow-toggle][aria-expanded="true"]');
    if (open) { $('[data-flow-close]')?.click(); }
  }
});

/* ───────────── film & unity hover previews (mouse only) ───────────── */
document.addEventListener('pointerover', (e) => {
  const card = (e.target as HTMLElement).closest<HTMLElement>('.film, .cine');
  if (!card || (e as PointerEvent).pointerType !== 'mouse' || card.contains(e.relatedTarget as Node)) return;
  const src = media(card.dataset.preview);
  const host = $('.film__preview, .cine__preview', card);
  if (!host) return;
  card.classList.add('is-hover');
  if (src && !$('video', host)) {
    const v = document.createElement('video');
    v.dataset.preview = '1'; v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'none'; v.src = src;
    host.appendChild(v); v.play().catch(() => undefined);
  }
});
document.addEventListener('pointerout', (e) => {
  const card = (e.target as HTMLElement).closest<HTMLElement>('.film, .cine');
  if (!card || card.contains(e.relatedTarget as Node)) return;
  card.classList.remove('is-hover');
  const v = $<HTMLVideoElement>('video', card);
  if (v) { v.pause(); v.remove(); }
});

/* ───────────── hero: render ↔ wireframe lens, gentle parallax ───────────── */
(() => {
  const lens = $('#lens');
  const main = $('.hero__main');
  if (!lens || !main) return;
  let raf = 0, px = 0, py = 0, mx = 50, my = 50;
  const paint = () => {
    raf = 0;
    main.style.setProperty('--x', mx + '%'); main.style.setProperty('--y', my + '%');
    lens.style.setProperty('--px', px.toFixed(3)); lens.style.setProperty('--py', py.toFixed(3));
  };
  const move = (e: PointerEvent) => {
    const r = main.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width) * 100; my = ((e.clientY - r.top) / r.height) * 100;
    const l = lens.getBoundingClientRect();
    px = (e.clientX - l.left) / l.width - 0.5; py = (e.clientY - l.top) / l.height - 0.5;
    lens.classList.add('is-lens');
    if (!raf) raf = requestAnimationFrame(paint);
  };
  lens.addEventListener('pointermove', move);
  lens.addEventListener('pointerdown', move);
  lens.addEventListener('pointerleave', () => { lens.classList.remove('is-lens'); px = py = 0; if (!raf) raf = requestAnimationFrame(paint); });
})();

/* ───────────── restrained cursor label (fine pointers only) ───────────── */
(() => {
  if (!matchMedia('(pointer: fine)').matches) return;
  const c = $('#cursor')!;
  const label = $('span', c)!;
  let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
  const loop = () => {
    cx += (x - cx) * 0.25; cy += (y - cy) * 0.25;
    c.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.5 ? requestAnimationFrame(loop) : 0;
  };
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]');
    if (el) { label.textContent = el.dataset.cursor!; c.classList.add('on'); } else c.classList.remove('on');
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener('pointerleave', () => c.classList.remove('on'));
})();

/* ───────────── routing + continuous view transitions ───────────── */
function swap(fn: () => void, before?: () => HTMLElement | null, after: () => HTMLElement | null = () => null) {
  const el = before?.();
  if (!startVT || prefersReducedMotion()) { fn(); return; }
  el?.style.setProperty('view-transition-name', 'cover');
  const vt = startVT(() => { el?.style.removeProperty('view-transition-name'); fn(); const n = after(); n?.style.setProperty('view-transition-name', 'cover'); });
  vt.finished.finally(() => document.querySelectorAll<HTMLElement>('*').forEach((x) => x.style.getPropertyValue('view-transition-name') && x.style.removeProperty('view-transition-name')));
}

function showDetail(slug: string) {
  const p = bySlug(slug);
  if (!p) { location.hash = '#/'; return; }
  if (view === 'home') { homeScroll = scrollY; cameFromHome = true; }
  swap(() => {
    teardownDetail();
    homeEl.hidden = true; detailEl.hidden = false;
    detailEl.innerHTML = renderDetail(p);
    view = 'detail'; currentSlug = slug;
    scrollTo(0, 0);
    initCompare(detailEl);
    initDoors(detailEl);
    observeReveals(detailEl);
    document.title = `${p.title} — Hassen Mtiri`;
    detailEl.focus({ preventScroll: true });
  }, () => lastClicked, () => $('.dhero__img', detailEl));
  lastClicked = null;
}

function showHome(section: string) {
  const wasDetail = view === 'detail';
  const slug = currentSlug;
  const fn = () => {
    teardownDetail();
    detailEl.hidden = true; detailEl.innerHTML = ''; homeEl.hidden = false;
    view = 'home';
    initDoors(homeEl);
    document.title = 'Hassen Mtiri — 3D Artist & Unity Developer';
    const target = section && document.getElementById(section);
    if (wasDetail && !navIntent) scrollTo(0, homeScroll);
    else if (target) target.scrollIntoView({ behavior: prefersReducedMotion() || wasDetail ? 'auto' : 'smooth' });
    else if (wasDetail) scrollTo(0, 0);
  };
  if (wasDetail) swap(fn, () => $('.dhero__img', detailEl), () => $(`#${slug} img`, homeEl));
  else fn();
  navIntent = false;
}

function route() {
  closeViewer();
  const h = location.hash.replace(/^#\/?/, '');
  const m = h.match(/^project\/([\w-]+)/);
  if (m) showDetail(m[1]); else showHome(h);
}

/* ───────────── boot ───────────── */
$('#yr')!.textContent = String(new Date().getFullYear());
renderHome();
initCompare(document);
initViewer();
observeReveals(document);
addEventListener('hashchange', route);
addEventListener('scroll', () => $('#bar')!.classList.toggle('is-scrolled', scrollY > 12), { passive: true });
if (location.hash) route();
else initDoors(homeEl);
