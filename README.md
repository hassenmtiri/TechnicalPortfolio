# Hassen Mtiri — Portfolio prototype

3D Artist & Unity Developer. Vite + TypeScript + plain CSS. Three.js is used **only** for the optional door demo and is lazy-loaded.

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build into /dist
npm run preview      # serve the build on :4173
npm run placeholders # regenerate the temporary SVG placeholders (public/media)
# with `npm run preview` running and Chrome installed:
node scripts/check.mjs   # smoke test + load measurements + screenshots (scratch-shots/)
```

## Where things live

| What | Where |
|---|---|
| **All content** (text, media paths, figures, door settings) | `src/data/projects.ts` |
| Media files | `public/media/<project-folder>/` |
| Home layouts (one per project) | `src/home.ts` |
| Project detail layouts (one per kind) | `src/detail.ts` |
| Before/after slider | `src/compare.ts` |
| Film viewer dialog | `src/viewer.ts` |
| 3D door (lazy) | `src/door3d.ts` |
| Styling / design tokens | `src/styles.css` (`:root` at the top) |

## Replacing placeholders

Every media field in `projects.ts` is a path **relative to `public/media/`**. Put your file in the folder, change the string. Set a field to `null` and the layout shows a labelled "Replace:" slot instead of breaking. Placeholder files are SVGs generated locally; your own JPG/WebP/PNG/MP4 can replace them under any name — just update the path.

Image advice: 1600 px wide, WebP or JPG, under ~250 KB each. Preview clips: 3–5 s, muted, 720p, H.264 MP4 or WebM, under ~3 MB. Full videos: any size, they load only after a click.

| Need | Field(s) in `projects.ts` | Suggested file |
|---|---|---|
| Hero images | `site.hero.render / wire / detail` | `hero/hero-render.webp`, `hero-wire.webp` (same framing as the render, wireframe view), `hero-detail.webp` |
| Cover image (home + detail header) | `cover` | `<project>/cover.webp` |
| Film posters | `films[i].poster` | `films-eevee/film-1-poster.webp` |
| Film hover preview | `films[i].previewVideo` | `films-eevee/film-1-preview.mp4` |
| Full film | `films[i].video` | `films-eevee/film-1.mp4` |
| Unity cinematic / water result video | `video` (and `previewVideo`) | `unity-cinematic/fight.mp4`, `underwater-flood/flood.mp4` |
| Workflow stages (Result → Process → Technical → Final) | `stages[i].image` / `.video` | `<project>/stage-*.webp` |
| Water breakdown (5 parts) | `breakdown[i].image` / `.video` | `underwater-flood/breakdown-*.webp` |
| Before / after | `optimization.before / after` | `asset-optimization/original.webp`, `optimized.webp` (same camera, same size) |
| Optimization figures | `optimization.original / optimized`, then `isDemoData: false` | — |
| Optimization workflow images | `optimization.workflow[i].image` | `topology.webp`, `cleanup.webp`, `final.webp` |
| Door GLB | `door.glb` | `sci-fi-doors/door.glb` (name nodes `door_left`, `door_right`, `indicator`, or edit `door.nodeNames`) |
| Door colours / dissolve | `door.openColor / closedColor / dissolve` | — |
| VR items | `vr[i].image` / `.video` / `.note` | `vr-applications/dental-hygiene.webp` |
| Environment & VFX shots | `shots[i].image` | `environments-vfx/shot-1.webp` |
| Role, technical decisions, tools, summaries | `role`, `technical`, `tools`, `summary`, stage `text` | text — everything marked `[Placeholder]` is not real information |

Contact email and links: `site.email`, `site.links`.

## Media checklist (what to prepare)

1. **Films (Eevee):** 3 posters (best frame each); optionally a 3–5 s preview loop per film; the full films; title/year/duration notes.
2. **Unity cinematic fight:** 1 final video; 3–4 stills: finished frame, scene setup / timeline screenshot, lighting/volume settings, final capture.
3. **Underwater / flood:** final video; 5 breakdown items — environment alone, water shader close-up (+ graph screenshot), water rising clip, pipe + particle clip, Unity editor screenshot of the real scene.
4. **Sci-fi doors:** short screen capture of the doors in Unity (open/close, shader change, dissolve); Animator / shader graph screenshots; optionally a small GLB (door + two panels + indicator).
5. **Asset optimization:** original and optimized renders from the same camera; wireframe/topology screenshot; cleanup (UV / normals) screenshot; final in-engine shot; real file sizes and triangle counts.
6. **VR:** per project (dental-hygiene + others): one still, one short capture, what the user does, your contribution, target headset.
7. **Environments & VFX:** 4–6 environment stills, 1–3 effect clips or stills, wireframe or lighting-only variants if you have them.
8. **General:** one render + one wireframe of the same piece for the hero lens; short bio, email, profile links.

## Known limitations

- No real videos are bundled (none are licensed/available offline), so films, the Unity cinematic and the water result show explicit "Video slot" placeholders. The hover-preview, viewer playback and click-to-play code paths are implemented but have only been exercised on the empty-slot path until you add clips.
- The door demo uses a procedural stand-in door. The GLB loading path is implemented but untested with a real model.
- Optimization figures are blank ("— MB / — tris") until you fill them in.
- Shared-element morph between home and project uses the View Transitions API (Chromium/Safari); other browsers get a simple fade.
- Texts, roles and technical notes are placeholders by design; nothing about your actual contribution has been invented.
- Project routes use hashes (`#/project/<slug>`), so it deploys on any static host without server rules.
