import { media } from './data/projects';
import { esc } from './ui';

export interface CompareData {
  before: string | null;
  after: string | null;
  final?: string | null;
  isDemoData: boolean;
  original: { fileSize: string; triangles: string };
  optimized: { fileSize: string; triangles: string };
  finalStat?: string;
}

export function compareHTML(d: CompareData): string {
  const b = media(d.before),
    a = media(d.after),
    f = media(d.final);
  const img = (s: string | null, label: string, cls = '') =>
    s
      ? `<img class="${cls}" src="${s}" alt="${esc(label)}" width="1600" height="1000" draggable="false" decoding="async" />`
      : `<div class="slot ${cls}"><span>Replace: ${esc(label)}</span></div>`;

  const modeBar = f
    ? `<div class="cmp__modes" role="tablist" aria-label="Comparison stages">
        <button type="button" role="tab" class="cmp__mode mono" aria-selected="true" data-cmp-pair="before-after" data-left="${b ?? ''}" data-right="${a ?? ''}" data-ltag="01 · Original (59,194 verts)" data-rtag="02 · Cleaned Topology (1,026 verts)">01 Original ↔ 02 Cleaned</button>
        <button type="button" role="tab" class="cmp__mode mono" aria-selected="false" data-cmp-pair="after-final" data-left="${a ?? ''}" data-right="${f}" data-ltag="02 · Cleaned Topology (1,026 verts)" data-rtag="03 · Rendered Final (Baked)">02 Cleaned ↔ 03 Rendered</button>
        <button type="button" role="tab" class="cmp__mode mono" aria-selected="false" data-cmp-pair="before-final" data-left="${b ?? ''}" data-right="${f}" data-ltag="01 · Original (59,194 verts)" data-rtag="03 · Rendered Final (1,026 verts)">01 Original ↔ 03 Rendered</button>
      </div>`
    : '';

  return `
  <div class="cmpwrap" data-cmpwrap>
    <div class="cmp__header">
      ${modeBar}
      <div class="cmp__stats mono">
        <span class="cmp__stat"><span class="cmp__stat-label">VERTS</span> <b>${esc(d.original.fileSize)}</b> <span class="cmp__arrow">→</span> <b class="cmp__val-highlight">${esc(d.optimized.fileSize)}</b></span>
        <span class="cmp__stat-sep">/</span>
        <span class="cmp__stat"><span class="cmp__stat-label">TRIS</span> <b>${esc(d.original.triangles)}</b> <span class="cmp__arrow">→</span> <b class="cmp__val-highlight">${esc(d.optimized.triangles)}</b></span>
        <span class="cmp__badge mono">−98.3% OPTIMIZED</span>
      </div>
    </div>
    <div class="cmp" style="--p:50%" data-cmp>
      <div class="cmp__layer cmp__after">${img(a, 'Cleaned topology image', 'cmp__img-after')}</div>
      <div class="cmp__layer cmp__before">${img(b, 'Original topology image', 'cmp__img-before')}</div>
      <span class="cmp__tag cmp__tag--l" data-cmp-ltag>01 · Original (59,194 verts)</span><span class="cmp__tag cmp__tag--r" data-cmp-rtag>02 · Cleaned Topology (1,026 verts)</span>
      <div class="cmp__handle" role="slider" tabindex="0" aria-label="Comparison divider: original on the left, optimized on the right" aria-orientation="horizontal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="50% original" data-cursor="Drag"><i aria-hidden="true"></i></div>
    </div>
  </div>`;
}

export function initCompare(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-cmp]').forEach((el) => {
    if (el.dataset.ready) return;
    el.dataset.ready = '1';
    const handle = el.querySelector<HTMLElement>('.cmp__handle')!;
    const set = (pct: number) => {
      const p = Math.max(0, Math.min(100, pct));
      el.style.setProperty('--p', p + '%');
      handle.setAttribute('aria-valuenow', String(Math.round(p)));
      handle.setAttribute('aria-valuetext', `${Math.round(p)}% left stage visible`);
    };
    const fromEvent = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    };
    el.addEventListener('pointerdown', (e) => {
      el.setPointerCapture(e.pointerId);
      el.classList.add('is-drag');
      fromEvent(e);
      handle.focus({ preventScroll: true });
    });
    el.addEventListener('pointermove', (e) => el.hasPointerCapture(e.pointerId) && fromEvent(e));
    const end = (e: PointerEvent) => {
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.classList.remove('is-drag');
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    handle.addEventListener('keydown', (e) => {
      const cur = Number(handle.getAttribute('aria-valuenow'));
      const step = e.shiftKey ? 10 : 2;
      const map: Record<string, number> = { ArrowLeft: cur - step, ArrowDown: cur - step, ArrowRight: cur + step, ArrowUp: cur + step, Home: 0, End: 100, PageDown: cur - 10, PageUp: cur + 10 };
      if (e.key in map) { e.preventDefault(); set(map[e.key]); }
    });

    const wrap = el.closest<HTMLElement>('[data-cmpwrap]');
    if (wrap) {
      const applyPair = (btn: HTMLElement) => {
        wrap.querySelectorAll<HTMLElement>('[data-cmp-pair]').forEach((b) => {
          b.setAttribute('aria-selected', String(b === btn));
        });
        const leftImg = el.querySelector<HTMLImageElement>('.cmp__img-before');
        const rightImg = el.querySelector<HTMLImageElement>('.cmp__img-after');
        const lTag = el.querySelector<HTMLElement>('[data-cmp-ltag]');
        const rTag = el.querySelector<HTMLElement>('[data-cmp-rtag]');
        if (leftImg && btn.dataset.left) leftImg.src = btn.dataset.left;
        if (rightImg && btn.dataset.right) rightImg.src = btn.dataset.right;
        if (lTag && btn.dataset.ltag) lTag.textContent = btn.dataset.ltag;
        if (rTag && btn.dataset.rtag) rTag.textContent = btn.dataset.rtag;
      };
      wrap.querySelectorAll<HTMLElement>('[data-cmp-pair]').forEach((btn) => {
        btn.addEventListener('click', () => applyPair(btn));
      });
    }
  });
}
