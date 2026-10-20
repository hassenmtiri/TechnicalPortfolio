// Generates locally-made, copyright-free SVG placeholders into public/media.
// Run: npm run placeholders   (safe to re-run; it never touches non-.svg files)
import fs from 'node:fs';
import path from 'node:path';

const W = 1600, H = 1000;
const out = path.resolve('public/media');
const ACC = '#ff5a1f';

function rng(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hsl = (h, s, l, a = 1) => `hsla(${Math.round(h) % 360},${s}%,${l}%,${a})`;
const f = (n) => n.toFixed(1);

function smoothPath(pts) {
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C${f(mx)},${f(y0)} ${f(mx)},${f(y1)} ${f(x1)},${f(y1)}`;
  }
  return d;
}

const art = {
  dusk(r, h) {
    let s = `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hsl(h, 35, 14)}"/><stop offset=".6" stop-color="${hsl(h + 20, 45, 34)}"/><stop offset="1" stop-color="${hsl(h + 35, 60, 58)}"/></linearGradient></defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#sk)"/>`;
    s += `<circle cx="${f(W * (0.3 + r() * 0.4))}" cy="${f(H * 0.42)}" r="${f(90 + r() * 60)}" fill="${ACC}" opacity=".9"/>`;
    for (let k = 0; k < 5; k++) {
      const base = H * (0.5 + k * 0.1);
      const pts = [];
      for (let x = 0; x <= W; x += 160) pts.push([x, base - r() * (150 - k * 18)]);
      s += `<path d="${smoothPath(pts)} L${W},${H} L0,${H}Z" fill="${hsl(h + 10, 30, 22 - k * 3.5)}" opacity="${0.55 + k * 0.1}"/>`;
    }
    return s;
  },
  water(r, h) {
    let s = `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hsl(h, 55, 30)}"/><stop offset="1" stop-color="${hsl(h + 10, 60, 7)}"/></linearGradient></defs>`;
    s += `<rect width="${W}" height="${H}" fill="url(#sk)"/>`;
    for (let k = 0; k < 5; k++) {
      const x = r() * W;
      s += `<polygon points="${f(x)},0 ${f(x + 90)},0 ${f(x + 420 - r() * 200)},${H} ${f(x - 200)},${H}" fill="#fff" opacity="${0.025 + r() * 0.04}"/>`;
    }
    for (let k = 0; k < 9; k++) {
      const y = H * (0.18 + k * 0.095);
      const pts = [];
      for (let x = 0; x <= W; x += 100) pts.push([x, y + Math.sin(x / 140 + k) * (14 + k * 2)]);
      s += `<path d="${smoothPath(pts)}" fill="none" stroke="${hsl(h + 15, 70, 70, 0.1 + k * 0.03)}" stroke-width="${1 + k * 0.4}"/>`;
    }
    for (let k = 0; k < 40; k++) s += `<circle cx="${f(r() * W)}" cy="${f(r() * H)}" r="${f(2 + r() * 9)}" fill="none" stroke="#fff" opacity="${0.15 + r() * 0.3}"/>`;
    s += `<rect y="${H * 0.62}" width="${W}" height="${H * 0.38}" fill="${ACC}" opacity=".08"/>`;
    return s;
  },
  corridor(r, h) {
    const cx = W / 2, cy = H * 0.48, bw = 230, bh = 300;
    let s = `<rect width="${W}" height="${H}" fill="${hsl(h, 20, 9)}"/>`;
    s += `<polygon points="0,0 ${W},0 ${cx + bw},${cy - bh} ${cx - bw},${cy - bh}" fill="${hsl(h, 20, 13)}"/>`;
    s += `<polygon points="0,${H} ${W},${H} ${cx + bw},${cy + bh} ${cx - bw},${cy + bh}" fill="${hsl(h, 25, 6)}"/>`;
    s += `<polygon points="0,0 ${cx - bw},${cy - bh} ${cx - bw},${cy + bh} 0,${H}" fill="${hsl(h, 20, 16)}"/>`;
    s += `<polygon points="${W},0 ${cx + bw},${cy - bh} ${cx + bw},${cy + bh} ${W},${H}" fill="${hsl(h, 20, 11)}"/>`;
    for (let k = 1; k < 7; k++) { const t = k / 7; const x = bw + (cx - bw) * 0; s += `<line x1="${f(cx - bw - (cx - bw) * (1 - t))}" y1="${f(cy - bh - (cy - bh) * (1 - t))}" x2="${f(cx - bw - (cx - bw) * (1 - t))}" y2="${f(cy + bh + (H - cy - bh) * (1 - t))}" stroke="#000" opacity=".25"/>`; }
    s += `<rect x="${cx - 120}" y="${cy - 200}" width="120" height="400" fill="${hsl(h, 12, 28)}" stroke="#000" stroke-opacity=".4"/>`;
    s += `<rect x="${cx}" y="${cy - 200}" width="120" height="400" fill="${hsl(h, 12, 24)}" stroke="#000" stroke-opacity=".4"/>`;
    s += `<rect x="${cx - 6}" y="${cy - 200}" width="12" height="400" fill="${ACC}" opacity=".85"/>`;
    s += `<circle cx="${cx}" cy="${cy - 235}" r="14" fill="${ACC}"/><circle cx="${cx}" cy="${cy - 235}" r="40" fill="${ACC}" opacity=".15"/>`;
    return s;
  },
  wire(r, h, dens = 20) {
    let s = `<rect width="${W}" height="${H}" fill="${hsl(h, 12, 9)}"/>`;
    const cx = W / 2, cy = H / 2, R = 330;
    for (let i = 0; i < dens; i++) { const rx = R * Math.abs(Math.cos((i / dens) * Math.PI)); s += `<ellipse cx="${cx}" cy="${cy}" rx="${f(rx)}" ry="${R}" fill="none" stroke="${hsl(h, 20, 80, 0.7)}" stroke-width="1"/>`; }
    for (let i = 1; i < dens / 2; i++) { const y = cy - R + (2 * R * i) / (dens / 2); const half = Math.sqrt(Math.max(R * R - (y - cy) ** 2, 0)); s += `<ellipse cx="${cx}" cy="${f(y)}" rx="${f(half)}" ry="${f(half * 0.18)}" fill="none" stroke="${hsl(h, 20, 80, 0.7)}" stroke-width="1"/>`; }
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${ACC}" stroke-width="3"/>`;
    return s;
  },
  solid(r, h) {
    return `<defs><radialGradient id="sg" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="${hsl(h, 30, 78)}"/><stop offset=".6" stop-color="${hsl(h, 25, 30)}"/><stop offset="1" stop-color="${hsl(h, 25, 8)}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="${hsl(h, 12, 11)}"/><ellipse cx="${W / 2}" cy="${H * 0.82}" rx="360" ry="40" fill="#000" opacity=".4"/><circle cx="${W / 2}" cy="${H / 2}" r="330" fill="url(#sg)"/><circle cx="${W / 2 + 140}" cy="${H / 2 - 120}" r="12" fill="${ACC}"/>`;
  },
  vr(r, h) {
    const cx = W / 2, cy = H / 2;
    let s = `<defs><radialGradient id="g" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="${hsl(h, 45, 28)}"/><stop offset="1" stop-color="${hsl(h, 40, 7)}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>`;
    for (let k = 0; k < 14; k++) s += `<line x1="0" y1="${H * 0.78 + k * 18}" x2="${W}" y2="${H * 0.78 + k * 18}" stroke="#fff" opacity="${0.05 + k * 0.004}"/>`;
    s += `<rect x="${cx - 360}" y="${cy - 150}" width="720" height="300" rx="120" fill="${hsl(h, 10, 14)}" stroke="${hsl(h, 20, 40)}" stroke-width="3"/>`;
    s += `<circle cx="${cx - 150}" cy="${cy}" r="95" fill="${hsl(h, 50, 55, 0.35)}" stroke="${ACC}" stroke-width="3"/><circle cx="${cx + 150}" cy="${cy}" r="95" fill="${hsl(h, 50, 55, 0.35)}" stroke="${ACC}" stroke-width="3"/>`;
    s += `<path d="M${cx - 360},${cy - 20} Q${cx - 520},${cy} ${cx - 440},${cy + 150}" fill="none" stroke="${hsl(h, 10, 30)}" stroke-width="22"/><path d="M${cx + 360},${cy - 20} Q${cx + 520},${cy} ${cx + 440},${cy + 150}" fill="none" stroke="${hsl(h, 10, 30)}" stroke-width="22"/>`;
    return s;
  },
  film(r, h) {
    let s = `<defs><linearGradient id="sk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hsl(h, 50, 16)}"/><stop offset="1" stop-color="${hsl(h + 40, 55, 44)}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#sk)"/>`;
    s += `<ellipse cx="${W * (0.3 + r() * 0.4)}" cy="${H * 0.46}" rx="700" ry="5" fill="#fff" opacity=".7"/>`;
    for (let k = 0; k < 3; k++) s += `<circle cx="${f(r() * W)}" cy="${f(H * (0.55 + r() * 0.3))}" r="${f(70 + r() * 120)}" fill="#000" opacity=".35"/>`;
    s += `<rect width="${W}" height="${H * 0.12}" fill="#000"/><rect y="${H * 0.88}" width="${W}" height="${H * 0.12}" fill="#000"/>`;
    s += `<text x="40" y="${H * 0.94}" fill="#fff" opacity=".6" font-family="monospace" font-size="22">00:00:00:00</text>`;
    return s;
  },
  blocks(r, h) {
    let s = `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hsl(h, 30, 20)}"/><stop offset="1" stop-color="${hsl(h + 20, 35, 55)}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#sk)"/>`;
    const items = [];
    for (let gx = 0; gx < 6; gx++) for (let gy = 0; gy < 5; gy++) if (r() > 0.35) items.push([gx, gy, 40 + r() * 190]);
    items.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
    const ox = W / 2, oy = H * 0.3, tw = 110, th = 55;
    for (const [gx, gy, ht] of items) {
      const x = ox + (gx - gy) * tw, y = oy + (gx + gy) * th;
      const top = `${x},${y - ht} ${x + tw},${y - ht + th} ${x},${y - ht + 2 * th} ${x - tw},${y - ht + th}`;
      s += `<polygon points="${x - tw},${y + th - ht} ${x},${y + 2 * th - ht} ${x},${y + 2 * th} ${x - tw},${y + th}" fill="${hsl(h, 25, 22)}"/>`;
      s += `<polygon points="${x + tw},${y + th - ht} ${x},${y + 2 * th - ht} ${x},${y + 2 * th} ${x + tw},${y + th}" fill="${hsl(h, 25, 14)}"/>`;
      s += `<polygon points="${top}" fill="${hsl(h, 22, 52)}"/>`;
    }
    s += `<circle cx="${W * 0.72}" cy="${H * 0.2}" r="40" fill="${ACC}"/>`;
    return s;
  },
};

function svg(type, seed, hue, label, opt) {
  const r = rng(seed);
  const inner = art[type](r, hue, opt);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><filter id="gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${seed}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .5 0"/></filter>
<radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs>
${inner}
<rect width="${W}" height="${H}" filter="url(#gr)" opacity=".35"/>
<rect width="${W}" height="${H}" fill="url(#vg)"/>
<g font-family="Consolas,monospace" font-size="20" letter-spacing="2"><rect x="32" y="${H - 72}" width="${24 + label.length * 14 + 300}" height="40" fill="#101010" opacity=".78"/><text x="46" y="${H - 46}" fill="#ff5a1f">TEMPORARY PLACEHOLDER</text><text x="${46 + 300}" y="${H - 46}" fill="#ece8df">${label.toUpperCase()}</text></g>
</svg>`;
}

const specs = [];
const add = (p, type, hue, label, opt) => specs.push([p, type, hue, label, opt]);
const stages = (slug, type, hue, opts = {}) => {
  add(`${slug}/stage-result.svg`, type, hue, 'Stage 1 · Result');
  add(`${slug}/stage-process.svg`, opts.processType ?? 'wire', hue, 'Stage 2 · Process', 14);
  add(`${slug}/stage-technical.svg`, opts.techType ?? 'wire', hue + 20, 'Stage 3 · Technical details', 30);
  add(`${slug}/stage-final.svg`, type, hue + 8, 'Stage 4 · Final result');
};

// 01 films (Blender Eevee)
add('films-eevee/cover.svg', 'film', 18, 'Films · cover');
add('films-eevee/film-1-poster.svg', 'film', 18, 'Film 1 poster');
add('films-eevee/film-2-poster.svg', 'film', 210, 'Film 2 poster');
add('films-eevee/film-3-poster.svg', 'film', 320, 'Film 3 poster');
stages('films-eevee', 'film', 18);
// 02 unity cinematic
add('unity-cinematic/cover.svg', 'dusk', 250, 'Unity cinematic · cover');
stages('unity-cinematic', 'dusk', 250, { processType: 'blocks' });
// 03 water
add('underwater-flood/cover.svg', 'water', 195, 'Underwater · cover');
stages('underwater-flood', 'water', 195, { processType: 'wire' });
for (const [k, t] of [['environment', 'blocks'], ['water-shader', 'water'], ['rising-water', 'water'], ['pipe-particles', 'water'], ['unity-scene', 'corridor']])
  add(`underwater-flood/breakdown-${k}.svg`, t, 190 + k.length * 3, `Breakdown · ${k.replace('-', ' ')}`);
// 04 door
add('sci-fi-doors/cover.svg', 'corridor', 22, 'Doors · cover');
stages('sci-fi-doors', 'corridor', 22, { processType: 'blocks' });
// 05 optimisation
add('asset-optimization/cover.svg', 'solid', 150, 'Optimization · cover');
add('asset-optimization/original.svg', 'wire', 200, 'Original · high density', 44);
add('asset-optimization/optimized.svg', 'wire', 200, 'Optimized · low density', 8);
add('asset-optimization/topology.svg', 'wire', 200, 'Workflow · topology', 18);
add('asset-optimization/cleanup.svg', 'wire', 160, 'Workflow · cleanup', 12);
add('asset-optimization/final.svg', 'solid', 150, 'Workflow · final result');
stages('asset-optimization', 'solid', 150);
// 06 VR
add('vr-applications/cover.svg', 'vr', 275, 'VR · cover');
add('vr-applications/dental-hygiene.svg', 'vr', 180, 'VR · dental hygiene');
add('vr-applications/vr-other-1.svg', 'vr', 300, 'VR · project slot 2');
add('vr-applications/vr-other-2.svg', 'vr', 40, 'VR · project slot 3');
stages('vr-applications', 'vr', 275, { processType: 'blocks' });
// 07 environment & VFX
add('environments-vfx/cover.svg', 'blocks', 95, 'Environments · cover');
for (let i = 1; i <= 4; i++) add(`environments-vfx/shot-${i}.svg`, i % 2 ? 'blocks' : 'dusk', 80 + i * 55, `Environment shot ${i}`);
add('environments-vfx/vfx-1.svg', 'water', 300, 'VFX slot 1');
stages('environments-vfx', 'blocks', 95, { processType: 'wire' });
// hero
add('hero/hero-render.svg', 'dusk', 14, 'Hero · render slot');
add('hero/hero-wire.svg', 'wire', 14, 'Hero · wireframe slot', 26);
add('hero/hero-detail.svg', 'corridor', 210, 'Hero · detail slot');

let n = 0;
specs.forEach(([p, type, hue, label, opt], i) => {
  const file = path.join(out, p);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svg(type, 1000 + i * 17, hue, label, opt));
  n++;
});
console.log(`Wrote ${n} placeholder SVGs to ${out}`);
