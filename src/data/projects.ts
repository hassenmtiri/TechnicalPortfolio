/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CENTRAL CONTENT FILE — everything you need to replace lives here.
 *  Media files go in /public/media/<project-folder>/ and are referenced by
 *  a path relative to that folder root, e.g. media('underwater-flood/cover.webp').
 *  Set any media field to `null` (or delete it) and the layout shows a clearly
 *  labelled "replace me" slot instead of breaking.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const media = (p: string | null | undefined) =>
  p ? `${import.meta.env.BASE_URL}media/${p}` : null;

export const site = {
  name: 'Hassen Mtiri',
  title: '3D Artist & Unity Developer',
  intro:
    'I build detailed 3D visuals and interactive real-time experiences, with close attention to optimization and performance.',
  email: 'hassenmtiri09@gmail.com',
  links: [
    { label: 'ArtStation', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'GitHub', href: 'https://github.com/hassenmtiri' },
  ],
  about:
    'Hassen Mtiri is a 3D artist and Unity developer. The work here spans cinematic films, real-time environments, shaders, interactive systems, 3D applications and asset optimization.',
  hero: {
    detail: 'hero/hero-detail.webp',
    wire: 'hero/Hero-Wire.webp',
    render: 'hero/hero-render.webp',
  },
};

export type Kind =
  | 'films'
  | 'unity-cinematic'
  | 'water'
  | 'door'
  | 'optimization'
  | 'vr'
  | 'environment';

export interface Stage {
  label: 'Result' | 'Process' | 'Technical details' | 'Final result' | string;
  title: string;
  text: string;
  image?: string | null;
  video?: string | null;
}

export interface Film {
  title: string;
  poster: string | null;
  previewVideo?: string | null;
  video?: string | null;
  note: string;
  workflow?: string[];
}

export interface DoorItem {
  title: string;
  label: string;
  note: string;
  glb: string;
  nodeNames: { left: string; right: string; indicator: string };
  openColor: string;
  closedColor: string;
  dissolve: boolean;
}

export interface VrAppItem {
  title: string;
  image: string | null;
  video?: string | null;
  previewVideo?: string | null;
  link?: string | null;
  linkLabel?: string;
  note: string;
  workflow?: string[];
}

export interface WaterActionConfig {
  idleBtn: string;
  playingBtn: string;
  pausedBtn: string;
  endedBtn: string;
  idleStatus: string;
  playingStatus: string;
  pausedStatus: string;
  endedStatus: string;
  barTitle: string;
  wfTitle: string;
  bdTitle: string;
}

export interface Project {
  slug: string;
  no: string;
  kind: Kind;
  title: string;
  short: string;
  summary: string;
  year?: string;
  cover: string | null;
  wide?: string | null;
  video?: string | null;
  previewVideo?: string | null;
  role: string[];
  technical: string[];
  tools: string[];
  stages: Stage[];
  related: string[];
  // kind-specific
  films?: Film[];
  workflow?: string[];
  waterAction?: WaterActionConfig;
  breakdown?: { key: string; label: string; text: string; image: string | null; video?: string | null }[];
  door?: {
    glb: string | null;
    nodeNames: { left: string; right: string; indicator: string };
    openColor: string;
    closedColor: string;
    dissolve: boolean;
  };
  doors?: DoorItem[];
  optimization?: {
    before: string | null;
    after: string | null;
    originalRendered?: string | null;
    final?: string | null;
    finalStat?: string;
    isDemoData: boolean;
    original: { fileSize: string; triangles: string };
    optimized: { fileSize: string; triangles: string };
    workflow: { label: string; image: string | null; text: string }[];
  };
  vr?: VrAppItem[];
  shots?: { title: string; image: string | null; type: 'Environment' | 'VFX'; note: string }[];
  environments?: { title: string; note: string; images: string[] }[];
}

export const projects: Project[] = [
  {
    slug: 'films-eevee',
    no: '01',
    kind: 'films',
    title: 'Cinematic Films in Blender Eevee',
    short: 'Short cinematic films rendered in Eevee, with full step-by-step scene workflows.',
    summary: 'Three cinematic films created in Blender Eevee. Watch each film below and step through its creation workflow from I1 to the final shot.',
    cover: 'films-eevee/PortfolioMainIsland.webp',
    role: ['Direction, environment & asset modelling, lighting, camera animation, Eevee rendering & compositing'],
    technical: ['Real-time Eevee lighting, volumetrics and screen-space reflections', 'Shot-by-shot scene assembly and camera staging', 'Color grading and post-processing workflow'],
    tools: ['Blender', 'Eevee'],
    stages: [
      { label: 'Result', title: 'Final cinematic frames', text: 'Finished frames rendered in Blender Eevee with atmospheric lighting and compositing.', image: 'films-eevee/HighScutiFilm1.webp' },
      { label: 'Process', title: 'Scene blockout & assembly', text: 'Building the environment, props and lighting progression from initial layout to textured scene.', image: 'films-eevee/Film1/i2.webp' },
      { label: 'Technical details', title: 'Shaders, lighting & FX', text: 'Custom materials, volumetric fog and real-time lighting passes configured in Eevee.', image: 'films-eevee/Film2/I5.webp' },
      { label: 'Final result', title: 'Completed island & cinematic world', text: 'Final environment and cinematic sequences across all three films.', image: 'films-eevee/PortfolioMainIsland.webp' },
    ],
    related: ['unity-cinematic', 'environments-vfx'],
    films: [
      {
        title: 'Film One',
        poster: 'films-eevee/Film1/Poster.webp',
        previewVideo: 'films-eevee/Film1/Film1Preview.mp4',
        video: 'films-eevee/Film1/Film1.mp4',
        note: 'Cinematic short rendered in Blender Eevee — includes 6-step scene & lighting breakdown (I1–I6).',
        workflow: [
          'films-eevee/Film1/i1.webp',
          'films-eevee/Film1/i2.webp',
          'films-eevee/Film1/i3.webp',
          'films-eevee/Film1/i4.webp',
          'films-eevee/Film1/i5.webp',
          'films-eevee/Film1/i6.webp',
        ],
      },
      {
        title: 'Film Two',
        poster: 'films-eevee/Film2/Poster.webp',
        previewVideo: 'films-eevee/Film2/Film2Preview.mp4',
        video: 'films-eevee/Film2/Film2.mp4',
        note: 'Cinematic short rendered in Blender Eevee — includes 13-step production workflow (I1–I13).',
        workflow: [
          'films-eevee/Film2/I1.webp',
          'films-eevee/Film2/I2.webp',
          'films-eevee/Film2/I3.webp',
          'films-eevee/Film2/I4.webp',
          'films-eevee/Film2/I5.webp',
          'films-eevee/Film2/I6.webp',
          'films-eevee/Film2/I7.webp',
          'films-eevee/Film2/I8.webp',
          'films-eevee/Film2/I9.webp',
          'films-eevee/Film2/I10.webp',
          'films-eevee/Film2/I11.webp',
          'films-eevee/Film2/I12.webp',
          'films-eevee/Film2/I13.webp',
        ],
      },
      {
        title: 'Film Three',
        poster: 'films-eevee/Film3/Poster.webp',
        previewVideo: 'films-eevee/Film3/Film3Preview.mp4',
        video: 'films-eevee/Film3/Film3.mp4',
        note: 'Cinematic short rendered in Blender Eevee — includes 8-step production workflow (I1–I8).',
        workflow: [
          'films-eevee/Film3/i1.webp',
          'films-eevee/Film3/i2.webp',
          'films-eevee/Film3/i3.webp',
          'films-eevee/Film3/i4.webp',
          'films-eevee/Film3/i5.webp',
          'films-eevee/Film3/i6.webp',
          'films-eevee/Film3/i7.webp',
          'films-eevee/Film3/i8.webp',
        ],
      },
    ],
  },
  {
    slug: 'unity-cinematic',
    no: '02',
    kind: 'unity-cinematic',
    title: 'Cinematic Fight in Unity',
    short: 'Real-time cinematic battle sequence captured directly on Meta Quest 3 and optimized for standalone VR performance.',
    summary: 'A large-scale cinematic fight and real-time scene workflow developed in Unity, recorded directly from Meta Quest 3 hardware and heavily optimized to run smoothly on standalone XR.',
    cover: 'unity-cinematic/HannibalProject/Poster.webp',
    wide: 'unity-cinematic/HannibalProject/Poster.webp',
    video: 'unity-cinematic/HannibalProject/Film.mp4',
    previewVideo: 'unity-cinematic/HannibalProject/Preview.mp4',
    workflow: [
      'unity-cinematic/HannibalProject/I1.webp',
      'unity-cinematic/HannibalProject/I2.webp',
      'unity-cinematic/HannibalProject/I3.webp',
      'unity-cinematic/HannibalProject/I4.webp',
      'unity-cinematic/HannibalProject/I5.webp',
      'unity-cinematic/HannibalProject/I6.webp',
      'unity-cinematic/HannibalProject/I7.webp',
      'unity-cinematic/HannibalProject/I8.webp',
      'unity-cinematic/HannibalProject/I9.webp',
      'unity-cinematic/HannibalProject/I10.webp',
      'unity-cinematic/HannibalProject/I11.webp',
      'unity-cinematic/HannibalProject/I12.webp',
    ],
    role: [
      'Scene assembly, formation & combat prefabs, animator state machines, interactive triggers and real-time lighting',
      'Full performance optimization and direct on-device capture on Meta Quest 3',
    ],
    technical: [
      'Recorded directly on Meta Quest 3 standalone hardware — not a PC offline render',
      'Optimized enemy & Hannibal troop formations, war elephant prefabs and Animator controllers to maintain target VR frame rates',
      'Streamlined draw calls, geometry budgets, materials and lighting for standalone mobile XR GPU constraints',
    ],
    tools: ['Unity', 'Meta Quest 3', 'Animator', 'Timeline', 'Optimization'],
    stages: [
      { label: 'Result', title: 'Captured live on Meta Quest 3', text: 'Final real-time cinematic battle sequence recorded directly from Meta Quest 3 at target standalone performance.', image: 'unity-cinematic/HannibalProject/I12.webp' },
      { label: 'Process', title: 'Formations, prefabs & combat staging', text: 'Assembling Hannibal and enemy troop formations, elephant prefabs and cinematic fight choreography.', image: 'unity-cinematic/HannibalProject/I3.webp' },
      { label: 'Technical details', title: 'Animator graphs & Quest 3 optimization', text: 'State machines, interactive scene triggers and aggressive draw-call/mesh optimization for standalone VR.', image: 'unity-cinematic/HannibalProject/I7.webp' },
      { label: 'Final result', title: 'Optimized real-time sequence in Unity', text: 'Completed battle scene running smoothly on Meta Quest 3 with full formation animations and effects.', image: 'unity-cinematic/HannibalProject/I11.webp' },
    ],
    related: ['scifi-gun', 'films-eevee'],
  },
  {
    slug: 'scifi-gun',
    no: '03',
    kind: 'water',
    title: 'Sci-Fi Gun & Shader VFX',
    short: 'Modeled from scratch in Blender to live Unity firing VFX — click Fire to shoot plasma bursts from frame 01, with full topology and VFX breakdown.',
    summary: 'Custom 3D sci-fi blaster modeled from scratch in Blender by Hassen Mtiri, retopologized and brought into Unity with a custom C# VFX controller, HDR emission overcharge shaders, plasma projectiles, shockwave rings, ricochet sparks, and impact crater decals.',
    cover: 'UnityScifiGun/i0.webp',
    video: 'UnityScifiGun/UnityGun.mp4',
    previewVideo: null,
    waterAction: {
      idleBtn: 'Fire sci-fi gun ▶',
      playingBtn: 'Pause firing ❚❚',
      pausedBtn: 'Resume firing ▶',
      endedBtn: 'Fire again ↻',
      idleStatus: 'Paused at frame 01 · Click "Fire sci-fi gun" to shoot',
      playingStatus: 'Firing plasma bursts & HDR shader overcharge in real time…',
      pausedStatus: 'Firing paused · Click "Resume" or "Reset"',
      endedStatus: 'Firing sequence complete · Click "Reset" to return to frame 01',
      barTitle: 'Interactive Sci-Fi Gun VFX video (Recorded in Unity)',
      wfTitle: 'UnityScifiGun breakdown pictures',
      bdTitle: 'Detailed explanation of the Sci-Fi Gun modeling, topology & Unity VFX systems',
    },
    workflow: [
      'UnityScifiGun/i0.webp',
      'UnityScifiGun/i1.webp',
      'UnityScifiGun/i2.webp',
      'UnityScifiGun/Unity1.webp',
      'UnityScifiGun/i4.webp',
      'UnityScifiGun/i5.webp',
      'UnityScifiGun/Unity2.webp',
      'UnityScifiGun/i3.webp',
      'UnityScifiGun/i6.webp',
    ],
    role: [
      'Original 3D modeling from scratch in Blender by Hassen Mtiri: concept blockout (I0), hard-surface detailing, bevel-to-quad topology cleanup, UV unwrapping, and PBR/emission material baking',
      'Custom SciFiGunVfxController C# script, HDR emission overcharge shaders, plasma projectiles and multi-layered surface impact particle systems in Unity',
    ],
    technical: [
      'Weapon model designed and 3D modeled from scratch in Blender (I0 blockout → I1 textured asset)',
      'Optimized hard-surface topology in Blender from 18,326 tris down to 16,644 tris by reducing dense bevel loops into clean quad poles',
      'Custom SciFiGunVfxController driving dual HDR emission channels (Emission & Emission2) with dynamic peak multiplier (4.5x) and decay curves on each shot',
      'Multi-layered impact VFX hierarchy (ImpactCoreFlash_PS, ImpactShockwaveRing_PS, ImpactRicochetSparks_PS, ImpactDebrisChunks_PS, ImpactFlashLight) plus CraterDecal projection',
    ],
    tools: ['Blender (Modeled from scratch)', 'Unity', 'Shader Graph / HDR', 'Particle System', 'C# Scripting'],
    stages: [
      { label: 'Result', title: 'Original 3D modeling blockout (Modeled by Hassen)', text: 'Modeled completely from scratch in Blender — starting with the clean hard-surface receiver, barrel, and canister blockout.', image: 'UnityScifiGun/i0.webp' },
      { label: 'Process', title: 'Blender materials & textured weapon', text: 'Constructing receiver, barrel and canisters with separated PBR & emissive material assignments (AllMAts, Alpha glass, Emission, CablePulse).', image: 'UnityScifiGun/i1.webp' },
      { label: 'Technical details', title: 'Topology reduction pass (18.3K → 16.6K tris)', text: 'Collapsing redundant parallel bevel loops into clean quad poles in Blender before export.', image: 'UnityScifiGun/i5.webp' },
      { label: 'Final result', title: 'Unity real-time weapon VFX system', text: 'Custom C# controller driving dual HDR overcharge, plasma projectiles and impact particles recorded in Unity.', image: 'UnityScifiGun/Unity2.webp' },
    ],
    related: ['underwater-flood', 'fire-simulation'],
    breakdown: [
      { key: 'blockout', label: 'I0 · Initial 3D Model Blockout (Modeled by Hassen)', text: 'Weapon designed and modeled completely from scratch in Blender by Hassen Mtiri: hard-surface concept blockout and initial geometry proportions.', image: 'UnityScifiGun/i0.webp' },
      { key: 'blender-mat', label: 'I1 · Blender Shaded Model & Material Slots', text: 'Textured hard-surface model in Blender showing emissive plasma canister, barrel coils, and glowing cable pulse materials.', image: 'UnityScifiGun/i1.webp' },
      { key: 'wire-ortho', label: 'I2 · 2D Orthographic Wireframe & Topology', text: 'Side-profile wireframe inspection after topology cleanup (8,683 vertices / 16,644 triangles).', image: 'UnityScifiGun/i2.webp' },
      { key: 'unity-ctrl', label: 'I3 · Unity Scene & SciFiGunVfxController', text: 'Custom C# weapon VFX inspector in Unity with live fire trigger, auto-fire interval, and dual HDR emission overcharge sliders.', image: 'UnityScifiGun/Unity1.webp' },
      { key: 'topo-before', label: 'I4 · Blender Topology Before Cleanup (18,326 Tris)', text: 'Dense parallel bevel edges along flat housing faces that add vertex cost without silhouette contribution.', image: 'UnityScifiGun/i4.webp' },
      { key: 'topo-after', label: 'I5 · Blender Quad-Pole Reduction (16,644 Tris)', text: 'Collapsing redundant parallel loops into clean quad poles to preserve crisp chamfers with minimal geometry.', image: 'UnityScifiGun/i5.webp' },
      { key: 'unity-fire', label: 'I6 · Unity Live Muzzle Flash & Impact VFX', text: 'Active shot in Unity showing barrel emission spike, plasma projectile, ricochet sparks, shockwave ring and dynamic impact flash on the target wall.', image: 'UnityScifiGun/Unity2.webp' },
      { key: 'wire-3d', label: 'I7 · 3D Perspective Wireframe', text: 'Full 3D wireframe showing even quad distribution across the receiver, grip, and cylindrical barrel housing.', image: 'UnityScifiGun/i3.webp' },
      { key: 'clay', label: 'I8 · Clean Solid Clay Shading', text: 'Viewport matcap/clay pass verifying zero shading pinches or normal artifacts after vertex reduction.', image: 'UnityScifiGun/i6.webp' },
    ],
  },
  {
    slug: 'underwater-flood',
    no: '04',
    kind: 'water',
    title: 'Underwater Environment',
    short: 'Interactive real-time flooding scene — click Fill to start the water video from the first frame, with full Unity shader & particle breakdown.',
    summary: 'A real-time flooding environment in Unity with a custom water surface and underwater body shader, rising water level, pipe splash & bubble particle systems, and optimized real-time FPS.',
    cover: 'underwater-flood/WaterUnity/I2WaterSurface.webp',
    video: 'underwater-flood/WaterUnity/WaterVideo.mp4',
    previewVideo: null,
    workflow: [
      'underwater-flood/WaterUnity/I1PArticleSystem.webp',
      'underwater-flood/WaterUnity/I2WaterSurface.webp',
      'underwater-flood/WaterUnity/I3BubblesParticleSystem.webp',
      'underwater-flood/WaterUnity/I4FineFps.webp',
      'underwater-flood/WaterUnity/WaterBody.webp',
    ],
    role: ['Environment setup, custom water surface & underwater body shaders, rising water controller, pipe splash & bubble particle systems, performance optimization'],
    technical: [
      'Custom water surface shader (I2WaterSurface) and underwater volume body (WaterBody) with depth, refraction and surface ripples',
      'Pipe burst splash particle system (I1PArticleSystem) and underwater rising bubbles particle system (I3BubblesParticleSystem)',
      'Optimized real-time rendering maintaining high, stable frame rate (I4FineFps) as water fills the scene',
    ],
    tools: ['Unity', 'Shader Graph / HLSL', 'Particle System'],
    stages: [
      { label: 'Result', title: 'Interactive flooding sequence', text: 'The scene starts dry on the first frame and progressively floods as the water level rises.', image: 'underwater-flood/WaterUnity/I2WaterSurface.webp' },
      { label: 'Process', title: 'Pipe splash & bubble particle systems', text: 'Configuring the pressurized pipe water emitters and underwater bubble particle systems in Unity.', image: 'underwater-flood/WaterUnity/I1PArticleSystem.webp' },
      { label: 'Technical details', title: 'Water surface & underwater body shaders', text: 'Combining the surface mesh shader with the underwater volume body and bubble particles.', image: 'underwater-flood/WaterUnity/WaterBody.webp' },
      { label: 'Final result', title: 'High-FPS real-time performance', text: 'Running smoothly at high FPS in Unity with all shaders and particle systems active.', image: 'underwater-flood/WaterUnity/I4FineFps.webp' },
    ],
    related: ['scifi-gun', 'fire-simulation'],
    breakdown: [
      { key: 'particles', label: 'I1 · Pipe Particle System', text: 'Pressurized water particle system emitting from the pipe to drive the flooding interaction.', image: 'underwater-flood/WaterUnity/I1PArticleSystem.webp' },
      { key: 'surface', label: 'I2 · Water Surface Shader', text: 'Custom real-time water surface shader with refraction, ripples and rising height control.', image: 'underwater-flood/WaterUnity/I2WaterSurface.webp' },
      { key: 'bubbles', label: 'I3 · Bubbles Particle System', text: 'Underwater bubble particle system reacting to the inflow and rising water volume.', image: 'underwater-flood/WaterUnity/I3BubblesParticleSystem.webp' },
      { key: 'fps', label: 'I4 · Real-Time FPS & Optimization', text: 'Profiler and frame-rate capture showing smooth real-time performance during full flooding.', image: 'underwater-flood/WaterUnity/I4FineFps.webp' },
      { key: 'body', label: 'I5 · Underwater Body Volume', text: 'The underwater body volume and shading pass when the camera and room are submerged.', image: 'underwater-flood/WaterUnity/WaterBody.webp' },
    ],
  },
  {
    slug: 'fire-simulation',
    no: '05',
    kind: 'water',
    title: 'Fire & Extinguisher Simulation',
    short: 'Interactive real-time fire & suppression simulation — click Start Fire to ignite and extinguish the blaze from frame 01.',
    summary: 'A real-time Unity fire and extinguisher particle simulation featuring multi-layered flame, glow and smoke emitters, dynamic fire lighting and audio, and a pressurized extinguisher stream that suppresses the fire on contact.',
    cover: 'UnityFireSimulation/I2.webp',
    video: 'UnityFireSimulation/FireVideo.mp4',
    previewVideo: null,
    waterAction: {
      idleBtn: 'Start fire ▶',
      playingBtn: 'Pause fire ❚❚',
      pausedBtn: 'Resume fire ▶',
      endedBtn: 'Replay simulation ↻',
      idleStatus: 'Paused at frame 01 · Click "Start fire" to ignite',
      playingStatus: 'Simulating fire & extinguisher suppression in real time…',
      pausedStatus: 'Simulation paused · Click "Resume" or "Reset"',
      endedStatus: 'Fire extinguished · Click "Reset" to return to frame 01',
      barTitle: 'Interactive Fire & Extinguisher video',
      wfTitle: 'UnityFireSimulation breakdown pictures',
      bdTitle: 'Detailed explanation of the Fire & Extinguisher particle systems',
    },
    workflow: [
      'UnityFireSimulation/I1.webp',
      'UnityFireSimulation/I2.webp',
      'UnityFireSimulation/I3.webp',
    ],
    role: [
      'Multi-layered fire, glow and smoke particle systems, pressurized extinguisher stream with sub-emitters, and C# FireExtinguisher suppression controller',
    ],
    technical: [
      'Custom FireExtinguisher C# script coordinating Fire, Glow, and Smoke particle systems alongside Fire Light intensity, AudioSource attenuation, and a 1.5s fade-out + 30-particle smoke puff on suppression',
      'Multi-layered fire emitter (start lifetime 1.5–2s, start speed 2–3, size 2.5–3) paired with rising volumetric smoke column',
      'High-velocity FireEstin extinguisher nozzle stream (speed 20–25, 200 primary particles + 400 sub-emitter particles) targeting the fire capsule collider',
    ],
    tools: ['Unity', 'Particle System', 'C# Scripting', 'Physics & Colliders'],
    stages: [
      { label: 'Result', title: 'Interactive fire & suppression sequence', text: 'Starts paused on frame 01 — clicking Start Fire ignites the multi-layer flame and triggers the pressurized extinguisher stream.', image: 'UnityFireSimulation/I3.webp' },
      { label: 'Process', title: 'FireExtinguisher script & collider setup', text: 'Configuring the C# controller linking Fire, Glow, and Smoke particle references with light, audio and capsule collider bounds.', image: 'UnityFireSimulation/I1.webp' },
      { label: 'Technical details', title: 'Flame & smoke particle tuning', text: 'Balancing particle lifetime, upward velocity, rotation and alpha-over-lifetime curves for natural flame and smoke motion.', image: 'UnityFireSimulation/I2.webp' },
      { label: 'Final result', title: 'Pressurized extinguisher stream & puff fade', text: 'Spraying the fire with the 200-particle stream + 400 sub-emitter foam particles to smoothly fade out the blaze.', image: 'UnityFireSimulation/I3.webp' },
    ],
    related: ['underwater-flood', 'sci-fi-doors'],
    breakdown: [
      { key: 'script', label: 'I1 · FireExtinguisher C# Controller & Collider', text: 'Inspector setup showing the FireExtinguisher script linking Fire, Glow, and Smoke particle systems, point light, audio source, 1.5s fade duration, and capsule collider.', image: 'UnityFireSimulation/I1.webp' },
      { key: 'fire-ps', label: 'I2 · Multi-Layer Fire & Smoke Particle System', text: 'Active flame and rising black smoke column in Unity with tuned start lifetime (1.5–2s), speed (2–3), and rotational variance.', image: 'UnityFireSimulation/I2.webp' },
      { key: 'ext-ps', label: 'I3 · FireEstin Pressurized Extinguisher Stream', text: 'High-speed extinguisher particle jet (200 particles + 400 sub-emitter particles at speed 20–25) suppressing the fire.', image: 'UnityFireSimulation/I3.webp' },
    ],
  },
  {
    slug: 'sci-fi-doors',
    no: '06',
    kind: 'door',
    title: 'Interactive Sci-Fi Doors',
    short: 'Three interactive 3D sci-fi doors with baked mechanical animations, status light transitions and wireframe dissolve effects.',
    summary: 'Three game-ready interactive sci-fi doors built and baked in Blender for real-time engines. Click any of the three 3D doors below (or use its controls) to play its baked opening/closing animation, switch its indicator light between closed and open states, and dissolve its panels into wireframe.',
    cover: 'asset-optimization/Result.webp',
    video: null,
    role: ['Hard-surface 3D modeling, mechanical rigging & multi-action keyframe baking, indicator shader logic, and real-time 3D WebGL/Unity integration across all three door systems'],
    technical: [
      'Three distinct baked GLB door assemblies (Door1BakedReady, Door2BakedReady, Door3BakedReadyOptomized) driven by synchronized AnimationMixer clip actions',
      'Dynamic emissive indicator materials (emission, MaterialREdToGreen, emission.008) smoothly lerping from closed vermilion (#ff5a1f) to open emerald (#3ddc84)',
      'Interactive panel dissolve mode toggling real-time wireframe and opacity while preserving semi-transparent glass visor materials',
    ],
    tools: ['Blender', 'Unity', 'Three.js / WebGL', 'GLTF / Draco', 'Shaders'],
    stages: [
      { label: 'Result', title: 'Three interactive 3D door assemblies', text: 'Operate Door 01 (Industrial Iris Bulkhead), Door 02 (Security Lever Airlock), and Door 03 (Optimized Pressurized Hatch) directly in 3D.', image: 'asset-optimization/Result.webp' },
      { label: 'Process', title: 'High-to-low poly topology cleanup', text: 'Cleaning dense subdivided geometry down to game-ready vertex budgets before rigging and baking.', image: 'asset-optimization/Optomized1kVertices.webp' },
      { label: 'Technical details', title: 'Multi-part animation & emissive state control', text: 'Synchronizing rotating valves, levers, hydraulic cylinders and sliding leaves with real-time emissive color transitions.', image: 'WorflowOptomizeGame/I2Dooris156k.webp' },
      { label: 'Final result', title: 'Optimized game-ready GLB exports', text: 'All three doors exported with baked animations and PBR materials ready for Unity and WebGL.', image: 'WorflowOptomizeGame/I7RepeatwhatwedidUntilWegotthisDoor1K.webp' },
    ],
    related: ['asset-optimization', 'fire-simulation'],
    door: {
      glb: 'sci-fi-doors/Door1BakedReady.glb',
      nodeNames: { left: 'LeftSide', right: 'RightSide', indicator: 'Rolette' },
      openColor: '#3ddc84',
      closedColor: '#ff5a1f',
      dissolve: true,
    },
    doors: [
      {
        title: 'Door 01 — Industrial Iris Bulkhead',
        label: 'DOOR 01',
        note: 'Heavy double-leaf industrial bulkhead with rotating valve wheel, iris contour, and emissive status rings (15 baked animation tracks).',
        glb: 'sci-fi-doors/Door1BakedReady.glb',
        nodeNames: { left: 'LeftSide', right: 'RightSide', indicator: 'Rolette' },
        openColor: '#3ddc84',
        closedColor: '#ff5a1f',
        dissolve: true,
      },
      {
        title: 'Door 02 — Security Lever Airlock',
        label: 'DOOR 02',
        note: 'Reinforced security airlock door featuring animated handle & lever mechanism, glass viewport visor, and red-to-green overhead status bar.',
        glb: 'sci-fi-doors/Door2BakedReady.glb',
        nodeNames: { left: 'Door_LP1', right: 'handle', indicator: 'polySurface53.001' },
        openColor: '#3ddc84',
        closedColor: '#ff5a1f',
        dissolve: true,
      },
      {
        title: 'Door 03 — Optimized Pressurized Hatch',
        label: 'DOOR 03',
        note: 'Topology-optimized sci-fi pressurized door with chrome paneling, hydraulic cylinders, rotating valve lock, and emissive ring indicator.',
        glb: 'sci-fi-doors/Door3BakedReadyOptomized.glb',
        nodeNames: { left: 'Plane.015', right: 'Valve', indicator: 'Valve' },
        openColor: '#3ddc84',
        closedColor: '#ff5a1f',
        dissolve: true,
      },
    ],
  },
  {
    slug: 'asset-optimization',
    no: '07',
    kind: 'optimization',
    title: '3D Asset Optimization',
    short: '01 Original vs 02 Optimized vs 03 Original Rendered 45k vs 04 Optimized Rendered 4k — plus the interactive 14-step Game Optimization quest.',
    summary: 'Complete 3D optimization showcase: compare 01 Original against 02 Optimized (−90.5% verts), compare 03 Original Rendered 45k against 04 Optimized Rendered 4k, and play through the 14-step full-scene Game Optimization quest.',
    cover: 'asset-optimization/Original.webp',
    role: ['Retopology, edge-loop dissolution, UV unwrapping, normal/PBR texture baking, and full-scene vertex & draw-call budget optimization'],
    technical: [
      'Reduced the hallway bulkhead panel from 42,368 vertices (108,932 triangles) down to 4,038 vertices (7,088 triangles) — a 93.5% triangle reduction',
      'Preserved full visual fidelity in the final rendered asset by baking high-frequency surface details and wire materials onto clean low-poly quads',
      'Applied the same optimization pipeline across an entire 2.09M-vertex scene to reach a game-ready 900K vertex budget and a 7.4 MB GLB export',
    ],
    tools: ['Blender', 'Unity', 'Retopology', 'PBR Baking', 'GLB Compression'],
    stages: [
      { label: '01 · Original', title: 'Original dense wireframe (42,368 verts)', text: 'Dense unoptimized mesh before cleanup with 42,368 vertices and 108,932 triangles.', image: 'asset-optimization/Original.webp' },
      { label: '02 · Optimized', title: 'Optimized topology cage (4,038 verts)', text: 'Retopologized wireframe cage reduced to 4,038 vertices and 7,088 triangles (−93.5% reduction).', image: 'asset-optimization/Optomized.webp' },
      { label: '03 · Original Rendered 45k', title: 'Original rendered high-poly (~45k verts)', text: 'Heavy subdivided geometry rendered with individual modeled wire loops.', image: 'asset-optimization/OriginalRendered40kVertices.webp' },
      { label: '04 · Optimized Rendered 4k', title: 'Optimized rendered final (4,038 verts)', text: 'Finished baked hallway bulkhead asset rendered on the 4k topology with zero visual loss.', image: 'asset-optimization/Optomized4kvertices.webp' },
    ],
    related: ['sci-fi-doors', 'vr-applications'],
    optimization: {
      before: 'asset-optimization/Original.webp',
      after: 'asset-optimization/Optomized.webp',
      originalRendered: 'asset-optimization/OriginalRendered40kVertices.webp',
      final: 'asset-optimization/Optomized4kvertices.webp',
      finalStat: '4,038 verts · 7,088 tris · Baked PBR',
      isDemoData: false,
      original: { fileSize: '42,368 verts', triangles: '108,932 tris' },
      optimized: { fileSize: '4,038 verts (−90.5%)', triangles: '7,088 tris (−93.5%)' },
      workflow: [
        { label: '01 · Original', image: 'asset-optimization/Original.webp', text: 'Original dense wireframe with 42,368 vertices, 108,812 edges, and 108,932 triangles before cleanup.' },
        { label: '02 · Optimized', image: 'asset-optimization/Optomized.webp', text: 'Cleaned retopologized wireframe reduced to 4,038 vertices and 7,088 triangles (−93.5% triangle reduction).' },
        { label: '03 · Original Rendered 45k', image: 'asset-optimization/OriginalRendered40kVertices.webp', text: 'High-poly subdivided geometry with modeled physical wire coils and heavy surface mesh (~45k vertices).' },
        { label: '04 · Optimized Rendered 4k', image: 'asset-optimization/Optomized4kvertices.webp', text: 'Final textured and shaded asset rendered on the clean 4,038-vertex topology with baked PBR materials.' },
      ],
    },
  },
  {
    slug: 'vr-applications',
    no: '08',
    kind: 'vr',
    title: '3D Applications',
    short: 'Three interactive 3D & XR applications: VR Teeth Cleaning simulator, Score Jam 3D football game, and the live Interactive 3D Island Portfolio.',
    summary: 'Three complete 3D applications built with Unity, Blender and WebGL: a VR Dental Hygiene training simulator with custom shape keys, a 3D arcade football Game Jam title, and an interactive 3D floating-islands portfolio live on the web.',
    cover: 'vr-applications/DentalHygiene/UpperTeethCleaning.webp',
    role: [
      'Base DAZ starter model integration (used as an efficient time-saver for the short internship), custom Blender shape-key authoring & character rigging, Unity C# gameplay & XR interaction scripting, UI systems, and real-time WebGL/VR optimization across all three applications',
    ],
    technical: [
      'VR Teeth Cleaning: Leveraged a DAZ starter base mesh to save critical development time during the short internship timeline; authored all custom Blender shape keys (toothpaste squeeze & plaque removal transitions), character rigging, Unity VR brush tracking, and the optimized export pipeline',
      'Score Jam (Game Jam): Custom C# player movement, ball physics, stadium terrain, and progressive obstacle challenge stages in Unity',
      'Interactive 3D Portfolio: Multi-island 3D world (Films, Models, Games, Music, Websites) optimized for instant browser loading at https://mainisland.pages.dev',
    ],
    tools: ['Unity', 'XR Interaction', 'Blender (Shape Keys & Rigging)', 'DAZ (Starter Base)', 'C#', 'WebGL'],
    stages: [
      { label: 'Result', title: 'VR Teeth Cleaning Simulator', text: 'Interactive VR dental training guiding users through toothpaste application, upper/lower arch brushing, and tongue cleaning.', image: 'vr-applications/DentalHygiene/UpperTeethCleaning.webp' },
      { label: 'Process', title: 'DAZ base mesh & custom Blender shape keys', text: 'Used a DAZ starter mesh as a time-saver for the short internship; sculpted and authored custom shape keys in Blender (Key 0 → Key 1) for dynamic toothpaste extrusion and progressive plaque cleaning.', image: 'vr-applications/DentalHygiene/BlenderShapekeys.webp' },
      { label: 'Technical details', title: 'Score Jam — Unity gameplay & C# controllers', text: 'Building arcade football mechanics, stadium environments, and obstacle challenges in Unity.', image: 'vr-applications/GameJAm/PlayerDuringGamePaly.webp' },
      { label: 'Final result', title: 'Interactive 3D Island Portfolio (Live WebGL)', text: 'Explore the stylized 3D floating islands directly in the browser at https://mainisland.pages.dev.', image: 'vr-applications/InterractivePortfolio/0.webp' },
    ],
    related: ['unity-cinematic', 'asset-optimization'],
    vr: [
      {
        title: 'VR Teeth Cleaning Simulator',
        image: 'vr-applications/DentalHygiene/UpperTeethCleaning.webp',
        video: 'vr-applications/DentalHygiene/Video.mp4',
        previewVideo: 'vr-applications/DentalHygiene/Video.mp4',
        note: 'Educational VR dental hygiene simulator built in Unity & Blender. Leveraged a DAZ starter base mesh to maximize development speed during a short internship; authored custom Blender shape keys (toothpaste squeeze & plaque transitions), character rigging & animations, Unity VR brush tracking, and the full real-time export pipeline. Includes full video preview and 23 production shots.',
        workflow: [
          'vr-applications/DentalHygiene/UpperTeethCleaning.webp',
          'vr-applications/DentalHygiene/UpperTeethBeforeCleaning.webp',
          'vr-applications/DentalHygiene/UpperTeethAfterCleaning.webp',
          'vr-applications/DentalHygiene/TongueCleaning.webp',
          'vr-applications/DentalHygiene/BlenderToothPaste.webp',
          'vr-applications/DentalHygiene/BlenderToothPasteKey0.webp',
          'vr-applications/DentalHygiene/BlenderToothPasteKey1.webp',
          'vr-applications/DentalHygiene/BlenderShapekeys.webp',
          'vr-applications/DentalHygiene/BlenderShapekeys2.webp',
          'vr-applications/DentalHygiene/BlenderShapekeys3.webp',
          'vr-applications/DentalHygiene/PlayerTpose.webp',
          'vr-applications/DentalHygiene/i1.webp',
          'vr-applications/DentalHygiene/i2.webp',
          'vr-applications/DentalHygiene/i3.webp',
          'vr-applications/DentalHygiene/i4.webp',
          'vr-applications/DentalHygiene/i5.webp',
          'vr-applications/DentalHygiene/i6.webp',
          'vr-applications/DentalHygiene/i7.webp',
          'vr-applications/DentalHygiene/i8.webp',
          'vr-applications/DentalHygiene/i9.webp',
          'vr-applications/DentalHygiene/i10.webp',
          'vr-applications/DentalHygiene/i11.webp',
          'vr-applications/DentalHygiene/i12.webp',
          'vr-applications/DentalHygiene/i13.webp',
        ],
      },
      {
        title: 'Game Jam — Score Jam 3D',
        image: 'vr-applications/GameJAm/PlayerDuringGamePaly.webp',
        video: 'vr-applications/GameJAm/Video.mp4',
        previewVideo: 'vr-applications/GameJAm/Video.mp4',
        note: '3D arcade football challenge game created in Unity for a Game Jam. Includes gameplay video and 10 breakdown pictures showing live gameplay, custom C# player & ball scripts, stadium terrain, and obstacle challenge levels.',
        workflow: [
          'vr-applications/GameJAm/PlayerDuringGamePaly.webp',
          'vr-applications/GameJAm/Terrain.webp',
          'vr-applications/GameJAm/Challenges.webp',
          'vr-applications/GameJAm/Ball.webp',
          'vr-applications/GameJAm/PlayerCodes.webp',
          'vr-applications/GameJAm/I6.webp',
          'vr-applications/GameJAm/I7.webp',
          'vr-applications/GameJAm/I8.webp',
          'vr-applications/GameJAm/I9.webp',
          'vr-applications/GameJAm/I10.webp',
        ],
      },
      {
        title: 'Interactive 3D Portfolio',
        image: 'vr-applications/InterractivePortfolio/0.webp',
        video: null,
        link: 'https://mainisland.pages.dev',
        linkLabel: 'Launch live 3D portfolio (mainisland.pages.dev) ↗',
        note: 'Interactive 3D floating-islands portfolio built in Blender and WebGL — no video preview needed because you can explore it live in your browser at https://mainisland.pages.dev, alongside 18 breakdown renders of the islands.',
        workflow: [
          'vr-applications/InterractivePortfolio/0.webp',
          'vr-applications/InterractivePortfolio/FilmsIsland.webp',
          'vr-applications/InterractivePortfolio/1.webp',
          'vr-applications/InterractivePortfolio/3.webp',
          'vr-applications/InterractivePortfolio/4.webp',
          'vr-applications/InterractivePortfolio/5.webp',
          'vr-applications/InterractivePortfolio/6.webp',
          'vr-applications/InterractivePortfolio/7.webp',
          'vr-applications/InterractivePortfolio/8.webp',
          'vr-applications/InterractivePortfolio/11.webp',
          'vr-applications/InterractivePortfolio/12.webp',
          'vr-applications/InterractivePortfolio/14.webp',
          'vr-applications/InterractivePortfolio/15.webp',
          'vr-applications/InterractivePortfolio/16.webp',
          'vr-applications/InterractivePortfolio/17.webp',
          'vr-applications/InterractivePortfolio/18.webp',
          'vr-applications/InterractivePortfolio/20.webp',
          'vr-applications/InterractivePortfolio/21.webp',
        ],
      },
    ],
  },
  {
    slug: 'environments-vfx',
    no: '09',
    kind: 'environment',
    title: '3D Environments',
    short: 'Five standalone 3D environments, each presented individually with its complete sequence of renders and construction breakdown shots.',
    summary: '3D environment creation across five distinct worlds — each environment is presented in its own dedicated section with its full sequence of pictures from blockout and wireframe to final lighting.',
    cover: 'environments-vfx/Env1/I2.webp',
    role: ['Environment design, 3D modelling, modular assembly, texturing, lighting and rendering across all five environments'],
    technical: [
      'Modular and unique environment assets with custom materials and surface detailing',
      'Atmospheric lighting, composition and camera staging tailored to each environment',
      'Progressive scene construction documented step by step across all five environments',
    ],
    tools: ['Blender', 'Unity', 'Lighting', 'Environment Art'],
    stages: [
      { label: 'Result', title: 'Environment 01 — Final scene', text: 'Completed lighting and composition from the first environment.', image: 'environments-vfx/Env1/I2.webp' },
      { label: 'Process', title: 'Environment 02 — 24-step progression', text: 'Full environment construction from layout and modelling to final atmospheric pass.', image: 'environments-vfx/Env2/I23.webp' },
      { label: 'Technical details', title: 'Environment 03 & 04 — Sanctuary & Sci-Fi Hub', text: 'Architectural assembly, sculpted statues, holographic command consoles and lighting progression.', image: 'environments-vfx/Env4/I1.webp' },
      { label: 'Final result', title: 'Environment 05 — Architectural interior render', text: 'Completed interior hallway scene with realistic reflections and daylighting.', image: 'environments-vfx/Env5/I2.webp' },
    ],
    related: ['underwater-flood', 'films-eevee'],
    environments: [
      {
        title: 'Environment 01',
        note: 'Sci-fi hallway environment — 14 shots (I1–I14): final scene, then the modular pieces (blocks, floor, ceilings) and the material / normal views that build it.',
        images: [
          'environments-vfx/Env1/I1.webp',
          'environments-vfx/Env1/I2.webp',
          'environments-vfx/Env1/Hallway.webp',
          'environments-vfx/Env1/AllMaterialView.webp',
          'environments-vfx/Env1/AllNormalVew.webp',
          'environments-vfx/Env1/Floor.webp',
          'environments-vfx/Env1/block.webp',
          'environments-vfx/Env1/block1.webp',
          'environments-vfx/Env1/block2.webp',
          'environments-vfx/Env1/block3.webp',
          'environments-vfx/Env1/ceiling1.webp',
          'environments-vfx/Env1/ceiling2.webp',
          'environments-vfx/Env1/I3.webp',
          'environments-vfx/Env1/I4.webp',
        ],
      },
      {
        title: 'Environment 02',
        note: 'Detailed environment production — 33 shots stepping through the complete build, then each machine (modelling, materials, render previews) and the full machine lineup.',
        images: [
          'environments-vfx/Env2/I1.webp',
          'environments-vfx/Env2/I2.webp',
          'environments-vfx/Env2/i3.webp',
          'environments-vfx/Env2/I4.webp',
          'environments-vfx/Env2/I5.webp',
          'environments-vfx/Env2/I6.webp',
          'environments-vfx/Env2/I7.webp',
          'environments-vfx/Env2/I8.webp',
          'environments-vfx/Env2/I9.webp',
          'environments-vfx/Env2/I10.webp',
          'environments-vfx/Env2/I11.webp',
          'environments-vfx/Env2/I12.webp',
          'environments-vfx/Env2/I13.webp',
          'environments-vfx/Env2/I14.webp',
          'environments-vfx/Env2/I16.webp',
          'environments-vfx/Env2/I17.webp',
          'environments-vfx/Env2/I18.webp',
          'environments-vfx/Env2/I19.webp',
          'environments-vfx/Env2/I20.webp',
          'environments-vfx/Env2/I21.webp',
          'environments-vfx/Env2/I22.webp',
          'environments-vfx/Env2/I23.webp',
          'environments-vfx/Env2/I24.webp',
          'environments-vfx/Env2/I25.webp',
          'environments-vfx/Env2/Machine1.webp',
          'environments-vfx/Env2/mACHINE2.webp',
          'environments-vfx/Env2/Machine2MaterialPReview.webp',
          'environments-vfx/Env2/Machine2RenderPReview.webp',
          'environments-vfx/Env2/Machine2RenderPReview2.webp',
          'environments-vfx/Env2/Machine1and3RenderPreview.webp',
          'environments-vfx/Env2/machine6.webp',
          'environments-vfx/Env2/machine6solidview.webp',
          'environments-vfx/Env2/AllMachines.webp',
        ],
      },
      {
        title: 'Environment 03',
        note: 'Ancient sanctuary & multi-level chamber — 16 shots (I1–I16) detailing carved pillars, angel statues, wall murals, industrial stairs and lighting.',
        images: [
          'environments-vfx/Env3/i1.webp',
          'environments-vfx/Env3/i2.webp',
          'environments-vfx/Env3/i3.webp',
          'environments-vfx/Env3/i4.webp',
          'environments-vfx/Env3/i5.webp',
          'environments-vfx/Env3/i6.webp',
          'environments-vfx/Env3/i7.webp',
          'environments-vfx/Env3/i8.webp',
          'environments-vfx/Env3/i9.webp',
          'environments-vfx/Env3/i10.webp',
          'environments-vfx/Env3/i11.webp',
          'environments-vfx/Env3/i12.webp',
          'environments-vfx/Env3/i13.webp',
          'environments-vfx/Env3/i14.webp',
          'environments-vfx/Env3/i16.webp',
          'environments-vfx/Env3/i17.webp',
        ],
      },
      {
        title: 'Environment 04',
        note: 'Sci-Fi Command Bridge & Tower — 7 shots covering the holographic core, mission status displays, spiral stairs, and exterior neon tower.',
        images: [
          'environments-vfx/Env4/I1.webp',
          'environments-vfx/Env4/I2.webp',
          'environments-vfx/Env4/I3.webp',
          'environments-vfx/Env4/I4.webp',
          'environments-vfx/Env4/I5.webp',
          'environments-vfx/Env4/I7.webp',
          'environments-vfx/Env4/I8.webp',
        ],
      },
      {
        title: 'Environment 05',
        note: 'Architectural interior hallway — 6 shots (I1–I6) from scene blockout and wireframe/shading passes to final physically based render.',
        images: [
          'environments-vfx/Env5/I1.webp',
          'environments-vfx/Env5/I2.webp',
          'environments-vfx/Env5/I3.webp',
          'environments-vfx/Env5/I4.webp',
          'environments-vfx/Env5/I5.webp',
          'environments-vfx/Env5/I6.webp',
        ],
      },
    ],
  },
];

export const bySlug = (s: string) => projects.find((p) => p.slug === s);
