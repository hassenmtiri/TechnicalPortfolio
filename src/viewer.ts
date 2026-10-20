import { media, type Film } from './data/projects';
import { esc, mountVideo, pic } from './ui';

const dlg = () => document.getElementById('viewer') as HTMLDialogElement;
let opener: HTMLElement | null = null;

export interface ViewerItem {
  title: string;
  kicker: string;
  note: string;
  poster: string | null;
  video?: string | null;
  imageOnly?: boolean;
  workflow?: string[];
}

let list: ViewerItem[] = [];
let idx = 0;
let mode: 'film' | 'workflow' = 'film';
let wfIdx = 0;

export function filmsToItems(project: { title: string }, films: Film[]): ViewerItem[] {
  return films.map((f) => ({
    title: f.title,
    kicker: project.title,
    note: f.note,
    poster: f.poster,
    video: f.video,
    workflow: f.workflow,
  }));
}

function preloadImage(path: string | null | undefined) {
  const src = media(path);
  if (!src) return;
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
}

function render() {
  const d = dlg();
  const it = list[idx];
  const v = media(it.video);
  const wf = it.workflow ?? [];
  const hasWf = wf.length > 0;
  const hasVideo = Boolean(v);
  const activeMode = hasWf && (!hasVideo || mode === 'workflow') ? 'workflow' : 'film';
  const curWfPath = hasWf ? wf[wfIdx] : null;
  const curWfSrc = media(curWfPath);

  if (activeMode === 'workflow' && hasWf) {
    preloadImage(wf[(wfIdx + 1) % wf.length]);
  }

  const modeTabs =
    hasWf && hasVideo
      ? `<div class="viewer__modes" role="tablist" aria-label="View mode">
          <button role="tab" aria-selected="${activeMode === 'film'}" data-viewer-mode="film" class="viewer__mode"><span class="mono">▶</span> Film</button>
          <button role="tab" aria-selected="${activeMode === 'workflow'}" data-viewer-mode="workflow" class="viewer__mode"><span class="mono">I1–I${wf.length}</span> Workflow (${wf.length})</button>
        </div>`
      : hasWf
        ? `<span class="mono" style="color:var(--accent)">Pictures I1–I${wf.length} (${wf.length} shots)</span>`
        : '';

  const mediaContent =
    activeMode === 'workflow' && curWfSrc
      ? `<div class="viewer__wf">
          <div class="viewer__wfstage" data-viewer-wfstep="1" title="Click to advance to next picture">
            <img class="viewer__wfimg" src="${curWfSrc}" alt="${esc(it.title)} — picture I${wfIdx + 1}" width="1600" height="1000" decoding="async" />
            <span class="viewer__wfbadge mono">Picture I${wfIdx + 1} / I${wf.length}</span>
            <button class="viewer__wfarrow viewer__wfarrow--prev" data-viewer-wfstep="-1" aria-label="Previous picture">←</button>
            <button class="viewer__wfarrow viewer__wfarrow--next" data-viewer-wfstep="1" aria-label="Next picture">→</button>
          </div>
          <div class="viewer__wfpills" role="tablist" aria-label="Pictures">
            ${wf
              .map(
                (_, k) =>
                  `<button role="tab" aria-selected="${k === wfIdx}" data-viewer-wfidx="${k}" class="viewer__wfpill mono">I${k + 1}</button>`
              )
              .join('')}
          </div>
        </div>`
      : v
        ? ''
        : `<div class="vslot ${it.imageOnly ? '' : 'vslot--empty'} vslot--viewer">${pic(it.poster, it.title, 'poster')}${
            it.imageOnly ? '' : '<div class="vslot__chip"><b>Video slot</b><span>Set <code>video</code> for this item in projects.ts</span></div>'
          }</div>`;

  d.innerHTML = `
    <div class="viewer__inner">
      <div class="viewer__top">
        <span class="mono">${esc(it.kicker)} — ${idx + 1} / ${list.length}</span>
        ${modeTabs}
        <button class="viewer__close" data-viewer-close aria-label="Close viewer">Close <kbd>Esc</kbd></button>
      </div>
      <div class="viewer__media" id="viewer-media">
        ${mediaContent}
      </div>
      <div class="viewer__info">
        <h2 id="viewer-title">${esc(it.title)}</h2>
        <p>${esc(it.note)}</p>
        ${
          list.length > 1
            ? `<div class="viewer__nav"><button data-viewer-step="-1" aria-label="Previous">← Prev</button><button data-viewer-step="1" aria-label="Next">Next →</button></div>`
            : ''
        }
      </div>
    </div>`;

  if (activeMode === 'film' && v) {
    mountVideo(d.querySelector<HTMLElement>('#viewer-media')!, v, media(it.poster) ?? '');
  }
}

export function openViewer(
  items: ViewerItem[],
  start: number,
  from: HTMLElement | null,
  initialMode: 'film' | 'workflow' = 'film',
  initialWfIdx = 0
) {
  list = items;
  idx = start;
  opener = from;
  mode = initialMode;
  wfIdx = initialWfIdx;
  render();
  const d = dlg();
  if (!d.open) d.showModal();
  document.documentElement.classList.add('is-locked');
  d.querySelector<HTMLElement>('[data-viewer-close]')?.focus();
}

export function closeViewer() {
  const d = dlg();
  if (d.open) d.close();
}

export function initViewer() {
  const d = dlg();
  d.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t === d || t.closest('[data-viewer-close]')) {
      closeViewer();
      return;
    }
    const modeBtn = t.closest<HTMLElement>('[data-viewer-mode]');
    if (modeBtn) {
      d.querySelectorAll('video').forEach((v) => {
        v.pause();
        v.removeAttribute('src');
        v.load();
      });
      mode = modeBtn.dataset.viewerMode as 'film' | 'workflow';
      render();
      return;
    }
    const wfStepBtn = t.closest<HTMLElement>('[data-viewer-wfstep]');
    if (wfStepBtn) {
      const wf = list[idx]?.workflow ?? [];
      if (wf.length > 0) {
        wfIdx = (wfIdx + Number(wfStepBtn.dataset.viewerWfstep) + wf.length) % wf.length;
        render();
      }
      return;
    }
    const wfIdxBtn = t.closest<HTMLElement>('[data-viewer-wfidx]');
    if (wfIdxBtn) {
      wfIdx = Number(wfIdxBtn.dataset.viewerWfidx);
      render();
      return;
    }
    const step = t.closest<HTMLElement>('[data-viewer-step]');
    if (step) {
      idx = (idx + Number(step.dataset.viewerStep) + list.length) % list.length;
      wfIdx = 0;
      render();
      d.querySelector<HTMLElement>('[data-viewer-step]')?.focus();
    }
  });
  d.addEventListener('close', () => {
    d.querySelectorAll('video').forEach((v) => {
      v.pause();
      v.removeAttribute('src');
      v.load();
    });
    d.innerHTML = '';
    document.documentElement.classList.remove('is-locked');
    opener?.focus({ preventScroll: true });
  });
}
