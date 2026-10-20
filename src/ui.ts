import { media } from './data/projects';

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Frame-01 still that sits next to an interactive video ("<folder>/poster.webp"),
 *  so the stage shows instantly without downloading any video bytes. */
export const framePoster = (video: string | null | undefined) =>
  media(video ? video.replace(/[^/]+$/, 'poster.webp') : null) ?? '';

/** Image if a path is set, otherwise a clearly labelled replaceable slot.
 *  WebP images get a responsive srcset: every "x.webp" has a 480px "x.sm.webp" sibling
 *  (scripts/make-thumbs.mjs), so small slots only download the small file. */
export function pic(path: string | null | undefined, alt: string, slotLabel: string, cls = '', eager = false, sizes = '(max-width: 960px) 100vw, 50vw'): string {
  const src = media(path);
  if (!src)
    return `<div class="slot ${cls}" role="img" aria-label="${esc(alt)} — media slot empty"><span>Replace: ${esc(slotLabel)}</span></div>`;
  const srcset = src.endsWith('.webp') && !src.endsWith('.sm.webp')
    ? ` srcset="${src.replace(/\.webp$/, '.sm.webp')} 480w, ${src} 1600w" sizes="${sizes}"`
    : '';
  return `<img class="${cls}" src="${src}"${srcset} alt="${esc(alt)}" width="1600" height="1000" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />`;
}

/** Poster-first video slot. The <video> element is only created after a click. */
export function videoSlot(opts: { video?: string | null; poster?: string | null; title: string; label: string; ratio?: string }): string {
  const v = media(opts.video);
  const poster = pic(opts.poster, `${opts.title} — poster`, `${opts.label} poster`);
  const style = opts.ratio ? ` style="--ratio:${opts.ratio}"` : '';
  if (!v)
    return `<div class="vslot vslot--empty"${style}>${poster}<div class="vslot__chip"><b>Video slot</b><span>${esc(opts.label)} — set <code>video</code> in projects.ts</span></div></div>`;
  return `<div class="vslot"${style}>${poster}<button class="vslot__play" data-play="${v}" data-poster="${media(opts.poster) ?? ''}" data-cursor="Play" aria-label="Play video: ${esc(opts.title)}"><i aria-hidden="true"></i></button></div>`;
}

export function mountVideo(host: HTMLElement, src: string, poster: string, autoplay = true) {
  stopAllVideos(document);
  const v = document.createElement('video');
  v.src = src;
  v.controls = true;
  v.playsInline = true;
  if (poster) v.poster = poster;
  v.preload = 'metadata';
  host.replaceChildren(v);
  if (autoplay) v.play().catch(() => undefined);
  return v;
}

export function stopAllVideos(root: ParentNode = document) {
  root.querySelectorAll('video').forEach((v) => {
    v.pause();
    if (v.dataset.preview) v.remove();
  });
}
