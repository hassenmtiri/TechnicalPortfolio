import { bySlug, media, projects, type Project } from './data/projects';
import { compareHTML } from './compare';
import { optGameHTML } from './optgame';
import { esc, framePoster, pic, videoSlot } from './ui';

const list = (items: string[]) => `<ul>${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;

function doorDemo(p: Project) {
  const doorList = p.doors ?? [
    {
      title: 'Operate the door',
      label: 'Interactive demo',
      note: `Click the 3D door, or use the buttons to play the baked animation. The light switches colour with the door state${p.door!.dissolve ? ' and the panels can dissolve' : ''}.`,
      glb: p.door!.glb ?? '',
      nodeNames: p.door!.nodeNames,
      openColor: p.door!.openColor,
      closedColor: p.door!.closedColor,
      dissolve: p.door!.dissolve,
    },
  ];
  return `<div class="ddoors">${doorList
    .map(
      (d, idx) => `<section class="doordemo rv" data-doordemo="${p.slug}" data-door-idx="${idx}" aria-labelledby="dd-h-${idx}">
      <div class="doordemo__side"><span class="mono">${esc(d.label)} · Interactive 3D</span><h2 id="dd-h-${idx}">${esc(d.title)}</h2>
        <p>${esc(d.note)}</p>
        <div class="doordemo__ctrl">
          <button class="btn" data-door-toggle aria-pressed="false">Open door</button>
          ${d.dissolve ? '<button class="btn btn--ghost" data-door-dissolve aria-pressed="false">Dissolve panels</button>' : ''}
        </div>
        <p class="doordemo__status mono" aria-live="polite"><i class="swatch" style="--c:${d.closedColor}"></i><span data-door-status>Door closed · light ${esc(d.closedColor)}</span></p>
      </div>
      <div class="doordemo__view" data-door-view>
        <div class="doorstage__loader mono"><span>⚡ LOADING 3D REAL-TIME DOOR…</span></div>
        <p class="doorstage__hint mono">Interactive 3D WebGL · Click to open / close</p>
      </div></section>`
    )
    .join('')}</div>`;
}

function waterBlock(p: Project) {
  const b = p.breakdown!;
  const v = media(p.video);
  const wf = p.workflow ?? [];
  const firstWf = wf[0] ? media(wf[0]) : null;
  const wa = p.waterAction;
  const idleBtn = wa?.idleBtn ?? 'Fill with water ▶';
  const idleStatus = wa?.idleStatus ?? 'Paused at frame 01 · Click "Fill" to start flooding';
  const barTitle = wa?.barTitle ?? 'Interactive flooding video';
  const wfTitle = wa?.wfTitle ?? 'WaterUnity breakdown pictures';
  const bdTitle = wa?.bdTitle ?? 'Detailed explanation of the WaterUnity systems';
  const dataAttrs = wa
    ? ` data-idle-btn="${esc(wa.idleBtn)}" data-playing-btn="${esc(wa.playingBtn)}" data-paused-btn="${esc(wa.pausedBtn)}" data-ended-btn="${esc(wa.endedBtn)}" data-idle-status="${esc(wa.idleStatus)}" data-playing-status="${esc(wa.playingStatus)}" data-paused-status="${esc(wa.pausedStatus)}" data-ended-status="${esc(wa.endedStatus)}"`
    : '';
  return `<section class="wblock rv">
    <article class="dfilm" data-fblock="${p.slug}:main" data-wf-idx="0">
      <div class="dfilm__grid">
        <div class="dfilm__player">
          <div class="dfilm__bar mono"><span>${esc(barTitle)}</span><span data-water-status-bar>Stuck on frame 01 · Click button to start</span></div>
          <div class="flood flood--detail" data-water-stage${dataAttrs}>
            ${v ? `<video class="flood__vid" data-water-vid src="${v}" poster="${framePoster(p.video)}" preload="none" playsinline></video>` : pic(p.cover, p.title, 'cover')}
            <span class="flood__level" aria-hidden="true"></span>
            <span class="flood__ruler mono" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
            <div class="flood__ctrl">
              <button class="btn flood__btn" data-water-fill aria-pressed="false">${esc(idleBtn)}</button>
              <button class="btn btn--ghost flood__reset" data-water-reset hidden>Reset to frame 1 ↺</button>
            </div>
            <span class="flood__badge mono" data-water-status>${esc(idleStatus)}</span>
          </div>
        </div>
        ${
          wf.length && firstWf
            ? `<div class="dfilm__wf" data-fwf>
                <div class="dfilm__bar mono">
                  <span>${esc(wfTitle)}</span>
                  <span data-fwf-stat>Step I1 / I${wf.length}</span>
                </div>
                <div class="dfilm__wfstage">
                  <img class="dfilm__wfimg" data-fwf-img src="${firstWf}" alt="${esc(p.title)} — workflow step I1" width="1600" height="1000" loading="lazy" decoding="async" />
                  <button class="dfilm__wfarrow dfilm__wfarrow--prev" data-fwf-step="-1" aria-label="Previous workflow image">←</button>
                  <button class="dfilm__wfarrow dfilm__wfarrow--next" data-fwf-step="1" aria-label="Next workflow image">→</button>
                </div>
                <div class="dfilm__wfpills" role="tablist" aria-label="${esc(p.title)} workflow steps">
                  ${wf
                    .map(
                      (_, k) =>
                        `<button role="tab" aria-selected="${k === 0}" data-fwf-idx="${k}" class="dfilm__wfpill mono">I${k + 1}</button>`
                    )
                    .join('')}
                </div>
              </div>`
            : ''
        }
      </div>
    </article>
    <details class="bd" open><summary><span><span class="mono">Breakdown</span> ${esc(bdTitle)}</span><i aria-hidden="true">＋</i></summary>
      <div class="bd__wrap">
        <div class="bd__tabs" role="tablist" aria-label="Breakdown parts">${b.map((x, i) => `<button role="tab" aria-selected="${i === 0}" data-bd="${i}"><span class="mono">0${i + 1}</span>${esc(x.label)}</button>`).join('')}</div>
        ${b.map((x, i) => `<div class="bd__panel" role="tabpanel" ${i ? 'hidden' : ''} data-bdp="${i}">${x.video ? videoSlot({ video: x.video, poster: x.image, title: x.label, label: x.label }) : pic(x.image, x.label, x.label + ' image or clip')}<p>${esc(x.text)}</p></div>`).join('')}
      </div></details></section>`;
}

function optBlock(p: Project) {
  const o = p.optimization!;
  return `<section class="optblock rv">
    <div class="opt">${compareHTML(o)}</div>
    <div class="optflow">${o.workflow.map((w, i) => `<figure>${pic(w.image, w.label, w.label + ' image')}<figcaption><span class="mono">0${i + 1} ${esc(w.label)}</span>${esc(w.text)}</figcaption></figure>`).join('')}</div>
    ${optGameHTML('detail')}
  </section>`;
}

function filmsBlock(p: Project) {
  return `<section class="dfilms">${p
    .films!.map((f, i) => {
      const wf = f.workflow ?? [];
      const firstWf = wf[0] ? media(wf[0]) : null;
      return `<article class="dfilm rv" data-fblock="${p.slug}:${i}" data-wf-idx="0">
        <header class="dfilm__head">
          <div>
            <span class="mono dfilm__no">F${String(i + 1).padStart(2, '0')}</span>
            <h2 class="dfilm__title">${esc(f.title)}</h2>
          </div>
          <p class="dfilm__note">${esc(f.note)}</p>
        </header>
        <div class="dfilm__grid">
          <div class="dfilm__player">
            <div class="dfilm__bar mono"><span>Final film</span><span>Click poster to play</span></div>
            ${videoSlot({ video: f.video, poster: f.poster, title: f.title, label: f.title, ratio: '16/9' })}
          </div>
          ${
            wf.length && firstWf
              ? `<div class="dfilm__wf" data-fwf>
                  <div class="dfilm__bar mono">
                    <span>Workflow breakdown</span>
                    <span data-fwf-stat>Step I1 / I${wf.length}</span>
                  </div>
                  <div class="dfilm__wfstage">
                    <img class="dfilm__wfimg" data-fwf-img src="${firstWf}" alt="${esc(f.title)} — workflow step I1" width="1600" height="1000" loading="lazy" decoding="async" />
                    <button class="dfilm__wfarrow dfilm__wfarrow--prev" data-fwf-step="-1" aria-label="Previous workflow image">←</button>
                    <button class="dfilm__wfarrow dfilm__wfarrow--next" data-fwf-step="1" aria-label="Next workflow image">→</button>
                  </div>
                  <div class="dfilm__wfpills" role="tablist" aria-label="${esc(f.title)} workflow steps">
                    ${wf
                      .map(
                        (_, k) =>
                          `<button role="tab" aria-selected="${k === 0}" data-fwf-idx="${k}" class="dfilm__wfpill mono">I${k + 1}</button>`
                      )
                      .join('')}
                  </div>
                </div>`
              : ''
          }
        </div>
      </article>`;
    })
    .join('')}</section>`;
}

function unityBlock(p: Project) {
  const wf = p.workflow ?? [];
  const firstWf = wf[0] ? media(wf[0]) : null;
  return `<section class="ucin rv">
    <div class="ucin__callout">
      <span class="mono ucin__tag">REC ● Meta Quest 3 Capture · Standalone VR Optimization</span>
      <p>This entire cinematic fight sequence was <b>recorded directly on a Meta Quest 3 headset</b> running in real time in Unity — heavily optimized across troop formations, war elephant prefabs, Animator controllers, draw calls and shaders to hit standalone VR performance targets.</p>
    </div>
    <article class="dfilm" data-fblock="${p.slug}:main" data-wf-idx="0">
      <div class="dfilm__grid">
        <div class="dfilm__player">
          <div class="dfilm__bar mono"><span>Meta Quest 3 real-time capture</span><span>Click poster to play</span></div>
          ${videoSlot({ video: p.video, poster: p.cover, title: p.title, label: 'Cinematic fight — Meta Quest 3 capture', ratio: '16/9' })}
        </div>
        ${
          wf.length && firstWf
            ? `<div class="dfilm__wf" data-fwf>
                <div class="dfilm__bar mono">
                  <span>Unity workflow breakdown</span>
                  <span data-fwf-stat>Step I1 / I${wf.length}</span>
                </div>
                <div class="dfilm__wfstage">
                  <img class="dfilm__wfimg" data-fwf-img src="${firstWf}" alt="${esc(p.title)} — workflow step I1" width="1600" height="1000" loading="lazy" decoding="async" />
                  <button class="dfilm__wfarrow dfilm__wfarrow--prev" data-fwf-step="-1" aria-label="Previous workflow image">←</button>
                  <button class="dfilm__wfarrow dfilm__wfarrow--next" data-fwf-step="1" aria-label="Next workflow image">→</button>
                </div>
                <div class="dfilm__wfpills" role="tablist" aria-label="${esc(p.title)} workflow steps">
                  ${wf
                    .map(
                      (_, k) =>
                        `<button role="tab" aria-selected="${k === 0}" data-fwf-idx="${k}" class="dfilm__wfpill mono">I${k + 1}</button>`
                    )
                    .join('')}
                </div>
              </div>`
            : ''
        }
      </div>
    </article>
  </section>`;
}

function vrBlock(p: Project) {
  const apps = p.vr ?? [];
  return `<section class="dfilms dvrapps">${apps
    .map((v, i) => {
      const wf = v.workflow ?? [];
      const firstWf = wf[0] ? media(wf[0]) : null;
      const leftPanel = v.video
        ? `<div class="dfilm__player">
            <div class="dfilm__bar mono"><span>Gameplay &amp; preview video</span><span>Click poster to play</span></div>
            ${videoSlot({ video: v.video, poster: v.image, title: v.title, label: v.title, ratio: '16/9' })}
          </div>`
        : v.link
        ? `<div class="dfilm__player">
            <div class="dfilm__bar mono"><span>Live interactive 3D web experience</span><span>WebGL · Browser</span></div>
            <div class="vrlive">
              ${pic(v.image, v.title, v.title)}
              <div class="vrlive__overlay">
                <span class="mono vrlive__badge">LIVE IN BROWSER · WEBGL</span>
                <h3>${esc(v.title)}</h3>
                <p>Explore the floating 3D islands directly in your browser — no video preview needed.</p>
                <a class="btn vrlive__btn" href="${esc(v.link)}" target="_blank" rel="noopener noreferrer" data-cursor="Launch">${esc(v.linkLabel ?? v.link)}</a>
              </div>
            </div>
          </div>`
        : `<div class="dfilm__player">
            <div class="dfilm__bar mono"><span>Application cover</span><span>3D Application</span></div>
            ${pic(v.image, v.title, v.title)}
          </div>`;

      return `<article class="dfilm rv" data-fblock="${p.slug}:vr:${i}" data-wf-idx="0">
        <header class="dfilm__head">
          <div>
            <span class="mono dfilm__no">APP 0${i + 1}</span>
            <h2 class="dfilm__title">${esc(v.title)}</h2>
          </div>
          <p class="dfilm__note">${esc(v.note)}</p>
        </header>
        <div class="dfilm__grid">
          ${leftPanel}
          ${
            wf.length && firstWf
              ? `<div class="dfilm__wf" data-fwf>
                  <div class="dfilm__bar mono">
                    <span>${esc(v.title)} — Pictures (${wf.length})</span>
                    <span data-fwf-stat>Step I1 / I${wf.length}</span>
                  </div>
                  <div class="dfilm__wfstage denv__stage">
                    <img class="dfilm__wfimg" data-fwf-img src="${firstWf}" alt="${esc(v.title)} — picture I1" width="1600" height="1000" loading="lazy" decoding="async" />
                    <button type="button" class="dfilm__wfarrow dfilm__wfarrow--prev" data-fwf-step="-1" aria-label="Previous picture">←</button>
                    <button type="button" class="dfilm__wfarrow dfilm__wfarrow--next" data-fwf-step="1" aria-label="Next picture">→</button>
                  </div>
                  <div class="dfilm__wfpills" role="tablist" aria-label="${esc(v.title)} pictures">
                    ${wf
                      .map(
                        (_, k) =>
                          `<button type="button" role="tab" aria-selected="${k === 0}" data-fwf-idx="${k}" class="dfilm__wfpill mono">I${k + 1}</button>`
                      )
                      .join('')}
                  </div>
                </div>`
              : ''
          }
        </div>
      </article>`;
    })
    .join('')}</section>`;
}

function envBlock(p: Project) {
  const envs = p.environments ?? [];
  return `<section class="dfilms denvs">${envs
    .map((e, i) => {
      const wf = e.images;
      const firstWf = wf[0] ? media(wf[0]) : null;
      return `<article class="dfilm denv rv" data-fblock="${p.slug}:env:${i}" data-wf-idx="0">
        <header class="dfilm__head">
          <div>
            <span class="mono dfilm__no">ENV 0${i + 1}</span>
            <h2 class="dfilm__title">${esc(e.title)}</h2>
          </div>
          <p class="dfilm__note">${esc(e.note)}</p>
        </header>
        ${
          wf.length && firstWf
            ? `<div class="dfilm__wf denv__wf" data-fwf>
                <div class="dfilm__bar mono">
                  <span>${esc(e.title)} — Pictures (${wf.length})</span>
                  <div class="denv__barright">
                    <span data-fwf-stat>Step I1 / I${wf.length}</span>
                    <button type="button" class="denv__zoom mono" data-env-zoom="${p.slug}:${i}" aria-label="Enlarge ${esc(e.title)} pictures">Enlarge ⤢</button>
                  </div>
                </div>
                <div class="dfilm__wfstage denv__stage">
                  <img class="dfilm__wfimg" data-fwf-img src="${firstWf}" alt="${esc(e.title)} — picture I1" width="1600" height="1000" loading="lazy" decoding="async" />
                  <button type="button" class="dfilm__wfarrow dfilm__wfarrow--prev" data-fwf-step="-1" aria-label="Previous picture">←</button>
                  <button type="button" class="dfilm__wfarrow dfilm__wfarrow--next" data-fwf-step="1" aria-label="Next picture">→</button>
                </div>
                <div class="dfilm__wfpills" role="tablist" aria-label="${esc(e.title)} pictures">
                  ${wf
                    .map(
                      (_, k) =>
                        `<button type="button" role="tab" aria-selected="${k === 0}" data-fwf-idx="${k}" class="dfilm__wfpill mono">I${k + 1}</button>`
                      )
                      .join('')}
                </div>
                <div class="denv__thumbs" aria-label="${esc(e.title)} thumbnails">
                  ${wf
                    .map(
                      (imgPath, k) =>
                        `<button type="button" class="denv__thumb" data-fwf-idx="${k}" aria-selected="${k === 0}" aria-label="Show ${esc(e.title)} picture I${k + 1}">${pic(imgPath, `${e.title} I${k + 1}`, `I${k + 1}`, '', false, '120px')}<span class="mono">I${k + 1}</span></button>`
                    )
                    .join('')}
                </div>
              </div>`
            : ''
        }
      </article>`;
    })
    .join('')}</section>`;
}

function body(p: Project): string {
  switch (p.kind) {
    case 'films':
      return filmsBlock(p);
    case 'unity-cinematic':
      return unityBlock(p);
    case 'water':
      return waterBlock(p);
    case 'door':
      return doorDemo(p);
    case 'optimization':
      return optBlock(p);
    case 'vr':
      return vrBlock(p);
    case 'environment':
      return envBlock(p);
  }
}

export function renderDetail(p: Project): string {
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length]!;
  const total = String(projects.length).padStart(2, '0');
  const related = p.related.map((s) => bySlug(s)!).filter(Boolean);
  return `
  <div class="d">
    <nav class="crumbs" aria-label="Project navigation"><a href="#/work" data-back>← All work</a><span class="mono">${p.no} / ${total}</span></nav>
    <header class="dhead">
      <p class="mono dhead__k">${p.no} — ${esc(p.title)}</p>
      <h1 class="dhead__t">${esc(p.title)}</h1>
      <p class="dhead__s">${esc(p.summary)}</p>
    </header>
    ${body(p)}
    <section class="info rv">
      <div><h2 class="mono">My role</h2>${list(p.role)}</div>
      <div><h2 class="mono">Technical decisions &amp; constraints</h2>${list(p.technical)}</div>
      <div><h2 class="mono">Tools</h2><ul class="tags">${p.tools.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
    </section>
    <section class="more rv" aria-label="Related work">
      <h2 class="mono">Related work</h2>
      <div class="more__row">
        ${related.map((r) => `<a class="more__i" href="#/project/${r.slug}" data-open="${r.slug}" data-cursor="View"><span class="more__img">${pic(r.cover, r.title, 'cover', '', false, '(max-width: 960px) 100vw, 33vw')}</span><span><span class="mono">${r.no}</span> ${esc(r.title)}</span></a>`).join('')}
        <a class="more__i more__i--next" href="#/project/${next.slug}" data-open="${next.slug}" data-cursor="Next"><span class="mono">Next project</span><b>${esc(next.title)} →</b></a>
      </div>
    </section>
  </div>`;
}
