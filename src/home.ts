import { media, projects, site, type Project } from './data/projects';
import { compareHTML } from './compare';
import { optGameHTML } from './optgame';
import { esc, framePoster, pic } from './ui';

export const doorCss = (cls = '') => `
  <button class="doorcss ${cls}" data-doorcss aria-pressed="false" aria-label="Sci-fi door: toggle open or closed" data-cursor="Open">
    <span class="doorcss__frame"><span class="doorcss__ind"></span><i class="doorcss__p doorcss__p--l"></i><i class="doorcss__p doorcss__p--r"></i></span>
    <span class="doorcss__state" aria-live="polite">Closed</span>
  </button>`;

const head = (p: Project, extra = '') => `
  <header class="ph ${extra}">
    <span class="ph__no">${p.no}</span>
    <h3 class="ph__title"><a href="#/project/${p.slug}" data-open="${p.slug}">${esc(p.title)}</a></h3>
    <p class="ph__short">${esc(p.short)}</p>
    <a class="ph__go" href="#/project/${p.slug}" data-open="${p.slug}" aria-label="Open project: ${esc(p.title)}">Open <span aria-hidden="true">→</span></a>
  </header>`;

export const filmCard = (p: Project, i: number, big = false) => {
  const f = p.films![i];
  const wfCount = f.workflow?.length ?? 0;
  return `<button class="film ${big ? 'film--big' : ''} rv" data-film="${p.slug}:${i}" data-preview="${f.previewVideo ? esc(f.previewVideo) : ''}" data-cursor="Play" aria-label="Play film: ${esc(f.title)}">
    <span class="film__frame">${pic(f.poster, f.title + ' poster', 'film poster', '', false, '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px')}<span class="film__preview" aria-hidden="true">${f.previewVideo ? '' : '<b>Hover preview slot</b>'}</span></span>
    <span class="film__cap"><span class="mono">F${String(i + 1).padStart(2, '0')}</span> ${esc(f.title)}${wfCount ? `<span class="film__wf mono">I1–I${wfCount}</span>` : ''}<i aria-hidden="true">▶</i></span>
  </button>`;
};

const open = (p: Project) => `data-open="${p.slug}" href="#/project/${p.slug}"`;

function films(p: Project) {
  return `<article class="proj proj--films" id="${p.slug}">${head(p)}
    <div class="films">${p.films!.map((_, i) => filmCard(p, i)).join('')}</div></article>`;
}
function unity(p: Project) {
  const wfCount = p.workflow?.length ?? 0;
  return `<article class="proj proj--unity" id="${p.slug}">
    <a class="cine rv" ${open(p)} data-preview="${p.previewVideo ? esc(p.previewVideo) : ''}" data-cursor="View" aria-label="Open project: ${esc(p.title)}">${pic(p.cover, p.title, 'cover')}<span class="cine__preview" aria-hidden="true"></span><span class="cine__bars" aria-hidden="true"></span><span class="cine__tc mono" aria-hidden="true">REC ● Recorded in Unity · Meta Quest 3 capture · Optimized${wfCount ? ` · I1–I${wfCount}` : ''}</span></a>
    ${head(p, 'ph--right')}</article>`;
}
function water(p: Project) {
  const v = media(p.video);
  const wa = p.waterAction;
  const idleBtn = wa?.idleBtn ?? 'Fill with water ▶';
  const idleStatus = wa?.idleStatus ?? 'Paused at frame 01 · Click "Fill" to flood the scene';
  const wfCount = (p.workflow ?? p.breakdown ?? []).length || 5;
  const dataAttrs = wa
    ? ` data-idle-btn="${esc(wa.idleBtn)}" data-playing-btn="${esc(wa.playingBtn)}" data-paused-btn="${esc(wa.pausedBtn)}" data-ended-btn="${esc(wa.endedBtn)}" data-idle-status="${esc(wa.idleStatus)}" data-playing-status="${esc(wa.playingStatus)}" data-paused-status="${esc(wa.pausedStatus)}" data-ended-status="${esc(wa.endedStatus)}"`
    : '';
  return `<article class="proj proj--water" id="${p.slug}">
    <div class="flood rv" data-water-stage${dataAttrs}>
      <span class="rec-badge mono" aria-label="Video recorded in Unity">Recorded in Unity</span>
      ${v ? `<video class="flood__vid" data-water-vid src="${v}" poster="${framePoster(p.video)}" preload="none" muted playsinline></video>` : pic(p.cover, p.title, 'cover')}
      <span class="flood__level" aria-hidden="true"></span>
      <span class="flood__ruler mono" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
      <div class="flood__ctrl">
        <button class="btn flood__btn" data-water-fill aria-pressed="false">${esc(idleBtn)}</button>
        <button class="btn btn--ghost flood__reset" data-water-reset hidden>Reset to frame 1 ↺</button>
        <a class="btn btn--ghost flood__open" ${open(p)}>Breakdown (I1–I${wfCount}) →</a>
      </div>
      <span class="flood__badge mono" data-water-status>${esc(idleStatus)}</span>
    </div>
    ${head(p, 'ph--light')}</article>`;
}
function door(p: Project) {
  const doorList = p.doors ?? [
    {
      title: p.title,
      label: 'DOOR 01',
      note: p.short,
      glb: p.door!.glb ?? '',
      nodeNames: p.door!.nodeNames,
      openColor: p.door!.openColor,
      closedColor: p.door!.closedColor,
      dissolve: p.door!.dissolve,
    },
  ];
  return `<article class="proj proj--door proj--doors" id="${p.slug}">
    ${head(p)}
    <div class="doorgrid">
      ${doorList
        .map(
          (d, idx) => `<div class="doorcard rv" data-doordemo="${p.slug}" data-door-idx="${idx}">
            <div class="doorcard__bar mono">
              <span>${esc(d.label)} · ${esc(d.title)}</span>
              <span class="doorcard__status"><i class="swatch" style="--c:${d.closedColor}"></i><span data-door-status>Door closed · light ${esc(d.closedColor)}</span></span>
            </div>
            <div class="doorstage" data-door-view>
              <div class="doorstage__loader mono"><span>⚡ LOADING 3D REAL-TIME DOOR…</span></div>
              <p class="doorstage__hint mono">3D model · Drag to rotate · Click to open</p>
              <button type="button" class="doorstage__expand mono" data-door-expand aria-label="Enlarge this 3D door" aria-pressed="false">⤢ Enlarge</button>
            </div>
            <div class="doorcard__ctrl">
              <button type="button" class="btn" data-door-toggle aria-pressed="false">Open door</button>
              ${d.dissolve ? '<button type="button" class="btn btn--ghost" data-door-dissolve aria-pressed="false">Dissolve panels</button>' : ''}
            </div>
          </div>`
        )
        .join('')}
    </div>
  </article>`;
}
function optimization(p: Project) {
  return `<article class="proj proj--opt" id="${p.slug}">${head(p)}<div class="opt rv">${compareHTML(p.optimization!)}</div>${optGameHTML('home')}</article>`;
}
function vr(p: Project) {
  return `<article class="proj proj--vr" id="${p.slug}">${head(p, 'ph--light')}
    <ul class="vrlist">${p.vr!.map((v, i) => {
      const wfCount = v.workflow?.length ?? 0;
      return `<li class="rv">
        <a class="cine vrlist__card" ${open(p)} data-preview="${v.previewVideo ? esc(v.previewVideo) : ''}" data-cursor="${v.previewVideo ? 'Preview / Open' : 'View'}" aria-label="Open 3D application: ${esc(v.title)}">
          <span class="vrlist__img">${pic(v.image, v.title, '3D application image', '', false, i === 0 ? '(max-width: 960px) 100vw, 1336px' : '(max-width: 960px) 100vw, 660px')}<span class="cine__preview" aria-hidden="true"></span></span>
          <span class="vrlist__t">
            <span><span class="mono">APP/0${i + 1}</span> ${esc(v.title)}</span>
            <span class="vrlist__meta mono">${v.video ? '▶ Video + ' : ''}${wfCount ? `I1–I${wfCount}` : ''}</span>
          </span>
          <p class="vrlist__note">${esc(v.note)}</p>
        </a>
        ${v.link ? `<a class="vrlist__ext mono" href="${esc(v.link)}" target="_blank" rel="noopener noreferrer" data-cursor="Launch">${esc(v.linkLabel ?? v.link)}</a>` : ''}
      </li>`;
    }).join('')}</ul></article>`;
}
function env(p: Project) {
  const envs = p.environments ?? [];
  return `<article class="proj proj--env" id="${p.slug}">${head(p)}
    <div class="strip" tabindex="0" role="group" aria-label="3D Environments, scrollable">${envs.map((e, i) => `<button type="button" class="shot rv" data-env="${p.slug}:${i}" data-cursor="View pictures" aria-label="View ${esc(e.title)} pictures (${e.images.length} shots)"><span class="shot__img">${pic(e.images[0], e.title, 'environment shot', '', false, '(max-width: 640px) 100vw, 360px')}</span><span class="shot__cap"><span class="mono">ENV 0${i + 1}</span> ${esc(e.title)} <span class="film__wf mono">I1–I${e.images.length}</span></span></button>`).join('')}</div></article>`;
}

const renderers: Record<Project['kind'], (p: Project) => string> = {
  films, 'unity-cinematic': unity, water, door, optimization, vr, environment: env,
};

export function renderHome() {
  const work = document.getElementById('work')!;
  const total = String(projects.length).padStart(2, '0');
  work.innerHTML = `<div class="sec-head rv"><span class="mono">01 — ${total}</span><h2>Selected work</h2><p>Nine bodies of work, each shown the way it makes most sense — not as a grid of thumbnails.</p></div>${projects.map((p) => renderers[p.kind](p)).join('')}`;

  document.getElementById('about')!.innerHTML = `<div class="about__grid"><span class="mono rv">About</span>
    <h2 id="about-h" class="rv">${esc(site.name)} makes 3D work and the real-time systems that run it.</h2>
    <p class="rv">${esc(site.about)}</p>
    <ul class="tags rv" aria-label="Tools"><li>Blender</li><li>Eevee</li><li>Unity</li><li>Shaders</li><li>VFX</li><li>3D Apps &amp; VR</li><li>Optimization</li></ul></div>`;
  document.getElementById('contact')!.innerHTML = `<div class="contact__grid"><span class="mono rv">Contact</span>
    <h2 id="contact-h" class="rv">Let’s talk about your project.</h2>
    <a class="contact__mail rv" href="mailto:${esc(site.email)}" data-cursor="Write">${esc(site.email)}</a>
    <ul class="contact__links rv">${site.links.map((l) => `<li><a href="${l.href}">${esc(l.label)} ↗</a></li>`).join('')}</ul></div>`;
}
