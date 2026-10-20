import { media } from './data/projects';
import { esc } from './ui';
import { openViewer, type ViewerItem } from './viewer';

export type ToolKey = 'inspect' | 'dissolve' | 'retopo' | 'decimate' | 'cli';

export interface OptStep {
  id: string;
  code: string;
  mission: 0 | 1 | 2 | 3;
  title: string;
  file: string;
  toolKey: ToolKey;
  toolName: string;
  shortcut: string;
  actionLabel: string;
  objective: string;
  explanation: string;
  verts: number;
  tris: number;
  fps: number;
  mb: number;
  bossName: string;
  bossVertsCurrent: number;
  bossVertsMax: number;
  hitText: string;
  xpGain: number;
  hotspot: { x: number; y: number; w: number; h: number; label: string };
}

export interface OptMission {
  id: number;
  code: string;
  boss: string;
  title: string;
  beforeStat: string;
  afterStat: string;
}

export const OPT_TOOLS: { key: ToolKey; icon: string; label: string; keybind: string }[] = [
  { key: 'inspect', icon: '🔍', label: 'Profiler / Isolate', keybind: '1' },
  { key: 'dissolve', icon: '✂️', label: 'Dissolve & Strip Mod', keybind: '2' },
  { key: 'retopo', icon: '➰', label: 'Curve ↔ Mesh & UV', keybind: '3' },
  { key: 'decimate', icon: '🔨', label: 'Weld & Decimate 0.1x', keybind: '4' },
  { key: 'cli', icon: '💻', label: 'GLB Export & CLI', keybind: '5' },
];

export const OPT_MISSIONS: OptMission[] = [
  {
    id: 0,
    code: 'STAGE 01',
    boss: 'BOSS 1 · 156K SCI-FI DOOR',
    title: 'Door & 13K Bolt Cleanup',
    beforeStat: '129,267 verts',
    afterStat: '11,212 verts (−91%)',
  },
  {
    id: 1,
    code: 'STAGE 02',
    boss: 'BOSS 2 · 110K CEILING GRILLE',
    title: 'Curve-to-Mesh Retopology',
    beforeStat: '110,852 verts',
    afterStat: '36,673 verts (−67%)',
  },
  {
    id: 2,
    code: 'STAGE 03',
    boss: 'BOSS 3 · 1.31M STATUE CHAMBER',
    title: 'Weld & 0.1x Decimation',
    beforeStat: '1,317,355 verts',
    afterStat: '223,711 verts (−83%)',
  },
  {
    id: 3,
    code: 'STAGE 04',
    boss: 'BOSS 4 · 505 MB GLB PAYLOAD',
    title: 'Full Scene & CLI Compression',
    beforeStat: '504.94 MB',
    afterStat: '106.35 MB (−79%)',
  },
];

const FOLDER = 'WorflowOptomizeGame/';

export const OPT_STEPS: OptStep[] = [
  // ─── STAGE 1: THE 156K DOOR & 13K HEX BOLT (I1 – I7) ───
  {
    id: 'i1',
    code: 'I1',
    mission: 0,
    title: 'Whole Scene Overloaded: 2M+ Visible Vertices at 2 FPS',
    file: `${FOLDER}I1WholeScene2millionVertices.webp`,
    toolKey: 'inspect',
    toolName: 'Scene Statistics Profiler',
    shortcut: 'Overlays ▸ Statistics',
    actionLabel: 'Scan Corridor Door',
    objective: 'The level crawls at 2 FPS with 2,068,546 visible vertices (3.11M total). Click the glowing target on the corridor door to hunt down the first topology bottleneck!',
    explanation: 'Step 1 of my workflow is profiling the whole scene in Blender (375 objects, 3.8M visible triangles) to spot which modular assets are destroying the framerate.',
    verts: 3113108,
    tris: 5910476,
    fps: 2,
    mb: 504.94,
    bossName: 'Sci-Fi Valve Door (13 Objects)',
    bossVertsCurrent: 129267,
    bossVertsMax: 129267,
    hitText: '🎯 TARGET LOCKED: 129K DOOR!',
    xpGain: 100,
    hotspot: { x: 23, y: 54, w: 14, h: 18, label: 'Click Door Module (2 FPS!)' },
  },
  {
    id: 'i2',
    code: 'I2',
    mission: 0,
    title: 'One Door = 129,267 Vertices (258,117 Triangles)!',
    file: `${FOLDER}I2Dooris156k.webp`,
    toolKey: 'inspect',
    toolName: 'Object Isolation',
    shortcut: 'Shift + Click',
    actionLabel: 'Zoom Into Valve Wheel',
    objective: 'Just 13 objects on this single door cost 129,267 vertices! Click the orange-highlighted circular valve door to inspect its tiny hardware.',
    explanation: 'A single doorway was consuming ~150K vertices. Zooming into the central valve mechanism reveals where all that hidden geometry is concentrated.',
    verts: 3113108,
    tris: 5910476,
    fps: 4,
    mb: 504.94,
    bossName: 'Sci-Fi Valve Door (13 Objects)',
    bossVertsCurrent: 129267,
    bossVertsMax: 129267,
    hitText: '🔍 129,267 VERTS ON 1 DOOR!',
    xpGain: 120,
    hotspot: { x: 65, y: 41, w: 16, h: 24, label: 'Click Orange Valve Door' },
  },
  {
    id: 'i3',
    code: 'I3',
    mission: 0,
    title: 'Found a 13,056-Vertex Hex Bolt!',
    file: `${FOLDER}I3CleanThedoorButton13k.webp`,
    toolKey: 'inspect',
    toolName: 'Local View (Numpad /)',
    shortcut: 'Numpad /',
    actionLabel: 'Isolate 13K Hex Nut',
    objective: 'Look at that tiny hex nut next to the wheel (ValveBoulouna.001): 13,056 vertices and 26,112 triangles for one bolt! Click the orange hex nut to open Edit Mode.',
    explanation: 'Small kitbashed bolts and buttons are the #1 hidden polygon trap in 3D scenes. One tiny bolt had more polygons than a hero character!',
    verts: 3100052,
    tris: 5884364,
    fps: 9,
    mb: 502.0,
    bossName: 'Hex Nut (ValveBoulouna.001)',
    bossVertsCurrent: 13056,
    bossVertsMax: 13056,
    hitText: '⚠️ 13,056 VERTS ON 1 TINY NUT!',
    xpGain: 150,
    hotspot: { x: 48, y: 51, w: 10, h: 15, label: 'Click 13K Hex Nut' },
  },
  {
    id: 'i4',
    code: 'I4',
    mission: 0,
    title: 'Select Unneeded Interior Edge Loops',
    file: `${FOLDER}I4DeleteuneededEdges.webp`,
    toolKey: 'dissolve',
    toolName: 'Edge Loop Select & Dissolve',
    shortcut: 'Alt + Click ▸ Ctrl + X',
    actionLabel: 'Dissolve Yellow Edge Loops',
    objective: 'In Edit Mode, 240 vertices of redundant yellow support loops are selected along flat bevels. Click the yellow edge loops to dissolve them!',
    explanation: 'These inner support rings add zero silhouette improvement on a 3cm bolt. We select the loops with Alt+Click and dissolve them cleanly.',
    verts: 3099812,
    tris: 5883884,
    fps: 9,
    mb: 501.5,
    bossName: 'Hex Nut (ValveBoulouna.001)',
    bossVertsCurrent: 9216,
    bossVertsMax: 13056,
    hitText: '✂️ −3,840 SUBDIVIDED VERTS!',
    xpGain: 200,
    hotspot: { x: 53, y: 46, w: 28, h: 42, label: 'Click to Dissolve Yellow Loops' },
  },
  {
    id: 'i4-done',
    code: 'I4.5',
    mission: 0,
    title: 'Edges Dissolved — Now Spot the Modifier Stack!',
    file: `${FOLDER}I4Done.webp`,
    toolKey: 'dissolve',
    toolName: 'Dissolve Vertices (180°)',
    shortcut: 'Modifier Stack Check',
    actionLabel: 'Inspect Subdivision Modifier',
    objective: 'Base cage is down from 816 to 576 vertices! But look at the right-side Modifier panel—there is an active Catmull-Clark Subdivision modifier (Level 2). Click it!',
    explanation: 'Dissolving the loops cleaned the base mesh to 576 vertices, but an unapplied Level 2 Subdivision Surface modifier was still multiplying the bolt by 16×.',
    verts: 3096212,
    tris: 5876684,
    fps: 10,
    mb: 500.0,
    bossName: 'Hex Nut (ValveBoulouna.001)',
    bossVertsCurrent: 9216,
    bossVertsMax: 13056,
    hitText: '✂️ BASE CAGE: 816 → 576 VERTS!',
    xpGain: 180,
    hotspot: { x: 91, y: 45, w: 15, h: 22, label: 'Click Subdivision Modifier' },
  },
  {
    id: 'i5',
    code: 'I5',
    mission: 0,
    title: 'Delete Unneeded Subdivision Surface Modifier',
    file: `${FOLDER}I5DeleteNoneededSubdivisionSurface.webp`,
    toolKey: 'dissolve',
    toolName: 'Delete Modifier (✕)',
    shortcut: 'Subdivision ▸ Remove',
    actionLabel: 'Destroy Subsurf Modifier ✕',
    objective: 'That Level-2 Subdivision modifier inflates our 576-vertex nut to 9,216 vertices (18,432 tris)! Click the ✕ button on the modifier header to delete it!',
    explanation: 'Small mechanical props never need live Catmull-Clark level-2 subdivision in a game engine. Deleting this single modifier saves 8,640 vertices instantly.',
    verts: 3087572,
    tris: 5859404,
    fps: 12,
    mb: 495.0,
    bossName: 'Hex Nut (ValveBoulouna.001)',
    bossVertsCurrent: 576,
    bossVertsMax: 13056,
    hitText: '💥 −8,640 SUBSURF VERTS!',
    xpGain: 300,
    hotspot: { x: 93, y: 27, w: 12, h: 12, label: 'Click ✕ to Delete Subsurf' },
  },
  {
    id: 'i6',
    code: 'I6',
    mission: 0,
    title: 'Bolt Cleaned: 13,056 → 576 Vertices (−95.6%)!',
    file: `${FOLDER}I6DoneAndverticesdownto800.webp`,
    toolKey: 'dissolve',
    toolName: 'Clean Low-Poly Hardware',
    shortcut: '576 Verts / 1,152 Tris',
    actionLabel: 'Repeat on All 13 Door Parts',
    objective: 'Look at the bolt now: 576 vertices (under 800!) instead of 13,056, and the silhouette & smooth shading look identical! Click the bolt to repeat across the whole door.',
    explanation: 'With clean bevels and smooth normals, 576 vertices look identical to 13,056 vertices in-game. Now we apply this exact cleanup to the rest of the door.',
    verts: 3045000,
    tris: 5770000,
    fps: 13,
    mb: 486.0,
    bossName: 'Hex Nut (ValveBoulouna.001)',
    bossVertsCurrent: 576,
    bossVertsMax: 13056,
    hitText: '✨ 13,056 → 576 VERTS (−95.6%)!',
    xpGain: 250,
    hotspot: { x: 44, y: 42, w: 18, h: 28, label: 'Click to Clean Whole Door' },
  },
  {
    id: 'i7',
    code: 'I7',
    mission: 0,
    title: 'STAGE 1 CLEAR: Full Door Down from 129K to 11.2K Verts!',
    file: `${FOLDER}I7RepeatwhatwedidUntilWegotthisDoor1K.webp`,
    toolKey: 'dissolve',
    toolName: 'Stage 01 Boss Defeated',
    shortcut: '129,267 → 11,212 Verts',
    actionLabel: 'Advance to Stage 02: Ceiling →',
    objective: 'Stage 1 Cleared! Repeating what we did across all 13 door objects dropped the entire door from 129,267 vertices to 11,212 vertices (~1K per part). Click the door to attack Stage 2!',
    explanation: 'Over 118,000 vertices and 235,000 triangles were stripped from a single door assembly without losing any visual detail.',
    verts: 2995053,
    tris: 5674690,
    fps: 15,
    mb: 472.0,
    bossName: 'Sci-Fi Valve Door (13 Objects)',
    bossVertsCurrent: 11212,
    bossVertsMax: 129267,
    hitText: '🏆 BOSS 1 CLEARED: −118,055 VERTS!',
    xpGain: 500,
    hotspot: { x: 46, y: 44, w: 22, h: 36, label: 'Stage 1 Complete! Next: Ceiling →' },
  },

  // ─── STAGE 2: CEILING WIRE RETOPOLOGY (I8 – I8Step8) ───
  {
    id: 'i8',
    code: 'I8',
    mission: 1,
    title: 'Stage 2 Boss: Corridor Ceiling Is Over 110,852 Vertices!',
    file: `${FOLDER}I8NoweCeilingISover100k.webp`,
    toolKey: 'inspect',
    toolName: 'Corridor Ceiling Audit',
    shortcut: '110,852 Verts / 243,842 Tris',
    actionLabel: 'Inspect Under Ceiling',
    objective: 'Selecting just 2 ceiling objects reveals 110,852 vertices and 243,842 triangles! Click the orange-outlined corridor ceiling to see why a flat hallway roof is so heavy.',
    explanation: 'Modular ceiling segments repeat across the whole facility. Finding 110K+ vertices here means huge savings once retopologized.',
    verts: 2995053,
    tris: 5674690,
    fps: 15,
    mb: 472.0,
    bossName: 'Corridor Ceiling (Cube.049)',
    bossVertsCurrent: 110852,
    bossVertsMax: 110852,
    hitText: '🎯 TARGET: 110,852-VERT CEILING!',
    xpGain: 120,
    hotspot: { x: 56, y: 51, w: 36, h: 28, label: 'Click 110K Corridor Ceiling' },
  },
  {
    id: 'i8-wire',
    code: 'I8.0',
    mission: 1,
    title: 'The Ceiling Wire Grating Problem: 51,272 Vertices!',
    file: `${FOLDER}I8NowTheCeilingWireIstheProblemsowemustretopologyit.webp`,
    toolKey: 'inspect',
    toolName: 'Wireframe Bottleneck Detection',
    shortcut: '51,272 Verts / 132,512 Tris',
    actionLabel: 'Start Curve Retopology Trick',
    objective: 'Every tiny wire cross-bar in the ceiling grille is modeled as real 3D geometry (51,272 verts / 132,512 tris)! Click the dense orange wire grates to retopologize them.',
    explanation: 'Instead of keeping 132,512 triangles of tiny wire bars, we will retopologize the 3 angled panels into 3 pure quads with a grille texture.',
    verts: 2995053,
    tris: 5674690,
    fps: 15,
    mb: 470.0,
    bossName: 'Ceiling Wire Grille (Cube.049)',
    bossVertsCurrent: 87933,
    bossVertsMax: 110852,
    hitText: '⚠️ 132,512 TRIS IN WIRE GRATES!',
    xpGain: 150,
    hotspot: { x: 48, y: 45, w: 38, h: 36, label: 'Click Dense Orange Wire Grating' },
  },
  {
    id: 'i8-s1',
    code: 'I8.1',
    mission: 1,
    title: 'Step 1 — Convert Wire Grille to Curve',
    file: `${FOLDER}I8Step1ConvertToCurve.webp`,
    toolKey: 'retopo',
    toolName: 'Object ▸ Convert To ▸ Curve',
    shortcut: 'Right-Click ▸ Convert To',
    actionLabel: 'Click "Convert To ▸ Curve"',
    objective: 'Creative Blender trick: instead of manually snapping new planes to angled ceiling bays, click "Convert To ▸ Curve" in the menu to strip all interior faces!',
    explanation: 'Converting the mesh to a Curve automatically discards interior polygon fills while preserving the exact outer perimeter in 3D space.',
    verts: 2972000,
    tris: 5600000,
    fps: 16,
    mb: 468.0,
    bossName: 'Ceiling Wire Grille (Cube.049)',
    bossVertsCurrent: 65000,
    bossVertsMax: 110852,
    hitText: '➰ CONVERTED TO CURVE!',
    xpGain: 200,
    hotspot: { x: 50, y: 57, w: 24, h: 12, label: 'Click "Convert To ▸ Curve"' },
  },
  {
    id: 'i8-s2',
    code: 'I8.2',
    mission: 1,
    title: 'Step 2 — Convert Back to Mesh to Keep Exact Shape',
    file: `${FOLDER}I8Step2ConvertTomeshTogetthesamesahpe.webp`,
    toolKey: 'retopo',
    toolName: 'Object ▸ Convert To ▸ Mesh',
    shortcut: 'Right-Click ▸ Convert To',
    actionLabel: 'Click "Convert To ▸ Mesh"',
    objective: 'Now convert that Curve right back into a Mesh! Click "Convert To ▸ Mesh" to get a clean wire outline with the exact same shape and zero interior faces.',
    explanation: 'Curve → Mesh gives us the exact boundary frame of all three ceiling bays in two clicks, eliminating 132,512 triangles immediately.',
    verts: 2944042,
    tris: 5542178,
    fps: 17,
    mb: 465.0,
    bossName: 'Ceiling Wire Grille (Cube.049)',
    bossVertsCurrent: 36922,
    bossVertsMax: 110852,
    hitText: '💥 −132,512 INTERIOR TRIS!',
    xpGain: 250,
    hotspot: { x: 67, y: 59, w: 22, h: 10, label: 'Click "Convert To ▸ Mesh"' },
  },
  {
    id: 'i8-s3',
    code: 'I8.3',
    mission: 1,
    title: 'Step 3 — Select the 12 Corner Vertices of the 3 Squares',
    file: `${FOLDER}I8Step3SelectTheHeadOfeverySquare.webp`,
    toolKey: 'retopo',
    toolName: 'Vertex Corner Selection',
    shortcut: '12 / 261 Vertices Selected',
    actionLabel: 'Keep Only 12 Corner Verts',
    objective: 'In Edit Mode, select the 4 corner ("head") vertices of each of the 3 rectangular bays (12 vertices total out of 261) and delete the subdivided edge points. Click the frame corners!',
    explanation: 'Three rectangular frames only need 4 corner vertices each = 12 vertices total (down from 51,272 vertices!).',
    verts: 2943793,
    tris: 5542178,
    fps: 18,
    mb: 464.0,
    bossName: 'Ceiling Wire Grille (Cube.049)',
    bossVertsCurrent: 36673,
    bossVertsMax: 110852,
    hitText: '✂️ 51,272 → 12 VERTICES!',
    xpGain: 250,
    hotspot: { x: 49, y: 45, w: 42, h: 24, label: 'Click the 12 Corner Points' },
  },
  {
    id: 'i8-s4',
    code: 'I8.4',
    mission: 1,
    title: 'Step 4 — Fill the Corner Points Into Pure Quads (F)',
    file: `${FOLDER}I8Step4FillThePoints.webp`,
    toolKey: 'retopo',
    toolName: 'Make Face (F)',
    shortcut: 'Press F (4 Verts = 1 Quad)',
    actionLabel: 'Fill 3 Quad Faces (F)',
    objective: 'Select 4 corners at a time and press F to fill clean single-quad faces! Click the filled quad in the center to finish filling all 3 ceiling bays.',
    explanation: 'Each ceiling panel is now a single 4-vertex quad (2 triangles)—meaning all 3 panels together cost just 6 triangles instead of 132,512!',
    verts: 2943793,
    tris: 5542184,
    fps: 18,
    mb: 464.0,
    bossName: 'Ceiling Wire Grille (Cube.049)',
    bossVertsCurrent: 36673,
    bossVertsMax: 110852,
    hitText: '✨ 3 PURE QUADS (ONLY 6 TRIS)!',
    xpGain: 220,
    hotspot: { x: 58, y: 31, w: 34, h: 24, label: 'Click to Fill Quad Faces (F)' },
  },
  {
    id: 'i8-s5',
    code: 'I8.5',
    mission: 1,
    title: 'Step 5 — Flip Normals So Faces Point Downward',
    file: `${FOLDER}I8Step5FlipNormals.webp`,
    toolKey: 'retopo',
    toolName: 'Mesh ▸ Normals ▸ Flip',
    shortcut: 'Alt + N ▸ Flip Normals',
    actionLabel: 'Flip Face Normals',
    objective: 'Check the yellow normal indicator line—we must flip the face normals so all 3 panels face downward toward the player camera. Click the faces to Flip Normals!',
    explanation: 'Real-time engines use backface culling; flipping normals ensures the ceiling panels are visible from below inside the corridor.',
    verts: 2943793,
    tris: 5542184,
    fps: 18,
    mb: 464.0,
    bossName: 'Ceiling Wire Grille (Cube.049)',
    bossVertsCurrent: 36673,
    bossVertsMax: 110852,
    hitText: '🔄 NORMALS FLIPPED DOWNWARD!',
    xpGain: 180,
    hotspot: { x: 43, y: 38, w: 36, h: 28, label: 'Click to Flip Normals' },
  },
  {
    id: 'i8-s6',
    code: 'I8.6',
    mission: 1,
    title: 'Step 6 — Unwrap the 3 Faces with Smart UV Project',
    file: `${FOLDER}I8Step6UnwraptheFaces.webp`,
    toolKey: 'retopo',
    toolName: 'Smart UV Project (66°)',
    shortcut: 'U ▸ Smart UV Project',
    actionLabel: 'Click Blue "Unwrap" Button',
    objective: 'With all 3 quads selected (12 verts, 3 faces, 6 tris), open Smart UV Project and click the blue "Unwrap" button!',
    explanation: 'Unwrapping the 3 clean quads with Correct Aspect creates flat, unstretched UV islands ready for our repeatable grille texture.',
    verts: 2943793,
    tris: 5542184,
    fps: 18,
    mb: 464.0,
    bossName: 'Ceiling Wire Grille (Cube.049)',
    bossVertsCurrent: 36673,
    bossVertsMax: 110852,
    hitText: '📐 SMART UV UNWRAPPED!',
    xpGain: 200,
    hotspot: { x: 52.5, y: 64, w: 14, h: 8, label: 'Click "Unwrap"' },
  },
  {
    id: 'i8-s7',
    code: 'I8.7',
    mission: 1,
    title: 'Step 7 — Apply the Grille UV Map in UV Editor',
    file: `${FOLDER}I8Step7ApplyTheUv.webp`,
    toolKey: 'retopo',
    toolName: 'UV Editor Alignment',
    shortcut: 'UV Editing Workspace',
    actionLabel: 'Apply Grille UV Texture',
    objective: 'In the UV Editor on the left, align the UV islands over the wire-grille texture so the grid pattern projects onto our 3 low-poly planes. Click the UV map!',
    explanation: 'A crisp 2D grille texture on 6 triangles replaces 132,512 triangles of 3D wire geometry with zero visual difference from the floor.',
    verts: 2943793,
    tris: 5542184,
    fps: 19,
    mb: 462.0,
    bossName: 'Ceiling Wire Grille (Cube.049)',
    bossVertsCurrent: 36673,
    bossVertsMax: 110852,
    hitText: '🎨 GRILLE UV TEXTURE APPLIED!',
    xpGain: 220,
    hotspot: { x: 23, y: 55, w: 22, h: 42, label: 'Click UV Map to Apply' },
  },
  {
    id: 'i8-s8',
    code: 'I8.8',
    mission: 1,
    title: 'STAGE 2 CLEAR: Ceiling Down to 36K Verts (Grille = 12 Verts)!',
    file: `${FOLDER}I8Step8EvertytihngDoneand theceilingisonly30k.webp`,
    toolKey: 'retopo',
    toolName: 'Stage 02 Boss Defeated',
    shortcut: '110,852 → 36,673 Verts',
    actionLabel: 'Advance to Stage 03: Statues →',
    objective: 'Stage 2 Cleared! The wire grille is now 12 vertices & 6 triangles, bringing the ceiling assembly down to 36,673 vertices while looking identical! Click to enter the Statue Chamber.',
    explanation: 'Repeating this Curve-to-Mesh + UV workflow across the corridor ceilings eliminated over 74,000 vertices.',
    verts: 2920874,
    tris: 5501230,
    fps: 20,
    mb: 458.0,
    bossName: 'Corridor Ceiling (Cube.049)',
    bossVertsCurrent: 36673,
    bossVertsMax: 110852,
    hitText: '🏆 BOSS 2 CLEARED: −74,179 VERTS!',
    xpGain: 500,
    hotspot: { x: 53, y: 44, w: 42, h: 28, label: 'Stage 2 Complete! Next: Statues →' },
  },

  // ─── STAGE 3: THE 1.3M STATUE CHAMBER (I9Step0 – I9Step3) ───
  {
    id: 'i9-0a',
    code: 'I9.0',
    mission: 2,
    title: 'Stage 3 Boss: This Wing Alone Is Over 1,317,355 Vertices!',
    file: `${FOLDER}I9Step0ThisScenealoneisoverMillion.webp`,
    toolKey: 'inspect',
    toolName: 'Wing Geometry Audit',
    shortcut: '1,317,355 Verts / 2.59M Tris',
    actionLabel: 'Zoom Into Ritual Chamber',
    objective: 'Selecting the lab room and octagonal chamber (48 objects) shows 1,317,355 vertices and 2,594,180 triangles! Click the octagonal room on the right to investigate.',
    explanation: 'Over 40% of the entire level’s polygon budget is trapped inside that octagonal room at the end of the hall.',
    verts: 2920874,
    tris: 5501230,
    fps: 18,
    mb: 458.0,
    bossName: 'Lab & Statue Wing (48 Objects)',
    bossVertsCurrent: 1317355,
    bossVertsMax: 1317355,
    hitText: '🎯 1,317,355 VERTS IN THIS WING!',
    xpGain: 150,
    hotspot: { x: 67, y: 34, w: 22, h: 32, label: 'Click Octagonal Chamber' },
  },
  {
    id: 'i9-0b',
    code: 'I9.1',
    mission: 2,
    title: '4 Angel Statues = 1,050,027 Vertices (2.1M Triangles)!',
    file: `${FOLDER}I9Step0thissceneistoomanyVerticesbecauseofthestatues.webp`,
    toolKey: 'inspect',
    toolName: 'High-Poly Sculpt Detection',
    shortcut: '1,050,027 Verts · 6 FPS',
    actionLabel: 'Isolate Single Angel Statue',
    objective: 'Found the monster: the 4 angel statues alone cost 1,050,027 vertices and 2,100,526 triangles, dragging the viewport down to 6 FPS! Click one of the statues to clean it.',
    explanation: 'Each statue was an unoptimized ~250K-vertex sculpt (~500K triangles). Four of them in one small room exceeded 2.1 million triangles.',
    verts: 2920874,
    tris: 5501230,
    fps: 6,
    mb: 458.0,
    bossName: '4 Angel Statues (Mesh_0.012)',
    bossVertsCurrent: 1050027,
    bossVertsMax: 1050027,
    hitText: '⚠️ 4 STATUES = 1,050,027 VERTS!',
    xpGain: 200,
    hotspot: { x: 52, y: 35, w: 14, h: 32, label: 'Click Angel Statue (243K verts)' },
  },
  {
    id: 'i9-s1',
    code: 'I9.2',
    mission: 2,
    title: 'Step 1 — Clean Split Vertices with Merge by Distance',
    file: `${FOLDER}I9Step1CleanTheVerticesMErgeDistance.webp`,
    toolKey: 'decimate',
    toolName: 'Mesh ▸ Merge ▸ By Distance',
    shortcut: 'M ▸ By Distance',
    actionLabel: 'Click "By Distance" to Weld',
    objective: 'One statue has 243,093 vertices (486,210 tris) with disconnected triangle seams. Click "By Distance" in the Merge menu to weld overlapping vertices first!',
    explanation: 'Always run Merge by Distance before decimating imported sculpts—otherwise Decimate will rip holes along unwelded UV/mesh seams.',
    verts: 2860000,
    tris: 5380000,
    fps: 15,
    mb: 448.0,
    bossName: 'Angel Statue (Mesh_0.012)',
    bossVertsCurrent: 243093,
    bossVertsMax: 243093,
    hitText: '🔨 WELDED SPLIT VERTICES!',
    xpGain: 250,
    hotspot: { x: 59, y: 65, w: 16, h: 8, label: 'Click "Merge ▸ By Distance"' },
  },
  {
    id: 'i9-s2',
    code: 'I9.3',
    mission: 2,
    title: 'Step 2 — Apply Collapse Decimate at 0.1000 Ratio (−90%)',
    file: `${FOLDER}I9Step2ApplyDecimate.webp`,
    toolKey: 'decimate',
    toolName: 'Decimate Modifier (Ratio 0.1)',
    shortcut: '243,093 → 24,298 Verts',
    actionLabel: 'Apply 0.1x Decimate to All 4',
    objective: 'With Collapse Decimate set to Ratio 0.1000, the statue drops from 243,093 vertices to 24,298 vertices (48,620 tris) while keeping every detail! Click the Decimate modifier to apply to all 4 statues.',
    explanation: 'A 0.1 ratio Collapse Decimate cuts 90% of the vertices (~218K saved per statue!) while preserving the sculpted feathers, drapery, and normal map shading.',
    verts: 2045000,
    tris: 3750000,
    fps: 22,
    mb: 410.0,
    bossName: 'Angel Statue (Mesh_0.012)',
    bossVertsCurrent: 24298,
    bossVertsMax: 243093,
    hitText: '💥 −218,795 VERTS PER STATUE (−90%)!',
    xpGain: 350,
    hotspot: { x: 91, y: 40, w: 15, h: 24, label: 'Click Decimate (Ratio 0.1000)' },
  },
  {
    id: 'i9-s3',
    code: 'I9.4',
    mission: 2,
    title: 'STAGE 3 CLEAR: Wing Down from 1.31M to 223K Verts (27 FPS)!',
    file: `${FOLDER}I9Step3Downto250kfrommillions.webp`,
    toolKey: 'decimate',
    toolName: 'Stage 03 Boss Defeated',
    shortcut: '1,317,355 → 223,711 Verts',
    actionLabel: 'Advance to Stage 04: Full Level & CLI →',
    objective: 'Stage 3 Cleared! The entire room + statue chamber dropped from 1,317,355 vertices down to 223,711 vertices (~250K) and viewport FPS jumped from 6 to 27 FPS! Click to finish the whole level.',
    explanation: 'Cleaning and decimating the statues removed over 1,093,000 vertices from this section alone.',
    verts: 1827230,
    tris: 3400000,
    fps: 27,
    mb: 390.0,
    bossName: 'Lab & Statue Wing (48 Objects)',
    bossVertsCurrent: 223711,
    bossVertsMax: 1317355,
    hitText: '🏆 BOSS 3 CLEARED: −1,093,644 VERTS!',
    xpGain: 500,
    hotspot: { x: 50, y: 56, w: 44, h: 36, label: 'Stage 3 Complete! Next: Full Scene →' },
  },

  // ─── STAGE 4: FULL SCENE + EXPORT + CLI CODE OPTIMIZATION (I10 – I14) ───
  {
    id: 'i10',
    code: 'I10',
    mission: 3,
    title: 'Whole 320-Object Scene Down to 996,777 Vertices (~900K)!',
    file: `${FOLDER}I10afterReapeatingwhatwelearnedNowTheWholeSceneis900Kwhicchisgoodcusalotofobjects.webp`,
    toolKey: 'cli',
    toolName: 'Full Level Topology Complete',
    shortcut: '320 Objects · 996,777 Verts',
    actionLabel: 'Open glTF 2.0 Export Dialog',
    objective: 'After repeating what we learned across all 320 objects in the facility, the entire scene is down from 3.11M+ vertices to 996,777 vertices (~900K)! Click the level to export to GLB.',
    explanation: 'With 320 detailed objects across multiple rooms and corridors, ~900K–996K vertices (1.84M tris) is clean and ready for export.',
    verts: 996777,
    tris: 1849314,
    fps: 40,
    mb: 481.0,
    bossName: 'Full Scene Payload (504.94 MB Raw)',
    bossVertsCurrent: 504,
    bossVertsMax: 505,
    hitText: '✨ FULL LEVEL: −2,116,331 VERTS SAVED!',
    xpGain: 400,
    hotspot: { x: 55, y: 45, w: 46, h: 36, label: 'Click Clean 996K Scene to Export' },
  },
  {
    id: 'i11',
    code: 'I11',
    mission: 3,
    title: 'Configure Clean glTF 2.0 (.glb) Export Settings',
    file: `${FOLDER}I11ExportSettings.webp`,
    toolKey: 'cli',
    toolName: 'Blender glTF 2.0 Exporter',
    shortcut: 'Selected + Apply Modifiers + UVs',
    actionLabel: 'Click "Export glTF 2.0"',
    objective: 'In Blender’s glTF 2.0 exporter, we check Selected Objects, Apply Modifiers, UVs, and Normals (leaving Tangents, Loose Edges & Lights unchecked). Click the blue "Export glTF 2.0" button!',
    explanation: 'Stripping unrequired vertex attributes (like tangents and loose points) keeps the exported GLB buffers lean.',
    verts: 996777,
    tris: 1849314,
    fps: 42,
    mb: 481.0,
    bossName: 'Full Scene Payload (504.94 MB Raw)',
    bossVertsCurrent: 481,
    bossVertsMax: 505,
    hitText: '📦 EXPORTED Level2ReadyOptomized.glb!',
    xpGain: 250,
    hotspot: { x: 81.5, y: 95, w: 12, h: 6, label: 'Click "Export glTF 2.0"' },
  },
  {
    id: 'i12',
    code: 'I12',
    mission: 3,
    title: 'Check Export Size on Disk: 493,110 KB (481 MB / 504.94 MB)!',
    file: `${FOLDER}I12WholeSceneExportSize.webp`,
    toolKey: 'cli',
    toolName: 'Binary Payload Audit',
    shortcut: '481 MB (504.94 MB Raw)',
    actionLabel: 'Run CLI Code Optimization #1',
    objective: 'Look at File Explorer: Level2ReadyOptomized.glb is 493,110 KB (~481–505 MB) because of uncompressed high-res textures! Click the GLB file row to launch our CLI code optimizer.',
    explanation: 'Clean topology isn’t enough if the GLB weighs half a gigabyte. Next, we use command-line code optimization (gltf-transform) to crush the file size.',
    verts: 996777,
    tris: 1849314,
    fps: 45,
    mb: 504.94,
    bossName: 'Full Scene Payload (504.94 MB Raw)',
    bossVertsCurrent: 505,
    bossVertsMax: 505,
    hitText: '💻 LAUNCHING GLTF-TRANSFORM CLI!',
    xpGain: 200,
    hotspot: { x: 22, y: 13.5, w: 38, h: 6, label: 'Click 481 MB GLB File to Compress' },
  },
  {
    id: 'i13',
    code: 'I13',
    mission: 3,
    title: 'CLI Code Pass 1 — Texture Resize (504.94 MB → 180.78 MB)!',
    file: `${FOLDER}I13WholescenetexturesCodeOptimization.webp`,
    toolKey: 'cli',
    toolName: 'gltf-transform resize 1024',
    shortcut: '504.94 MB → 180.78 MB',
    actionLabel: 'Run CLI Code Optimization #2',
    objective: 'In CMD, running `gltf-transform resize --width 1024 --height 1024` resizes all scene textures to 1K, dropping Room_raw.glb from 504.94 MB to 180.78 MB! Click the terminal output for Pass 2.',
    explanation: 'A single CLI command saves 324.16 MB (−64%) across all embedded materials in seconds.',
    verts: 996777,
    tris: 1849314,
    fps: 55,
    mb: 180.78,
    bossName: 'Full Scene Payload (504.94 MB Raw)',
    bossVertsCurrent: 181,
    bossVertsMax: 505,
    hitText: '🔥 −324.16 MB! (504.9 → 180.8 MB)',
    xpGain: 450,
    hotspot: { x: 45, y: 22, w: 68, h: 12, label: 'Click Terminal: Run Pass 2 (Meshopt)' },
  },
  {
    id: 'i14',
    code: 'I14',
    mission: 3,
    title: 'CLI Code Pass 2 — Meshopt & Quantize (180.78 MB → 106.35 MB)!',
    file: `${FOLDER}I14SecondCodeMEshOptDown.webp`,
    toolKey: 'cli',
    toolName: 'gltf-transform prune + quantize',
    shortcut: '180.78 MB → 106.35 MB Final',
    actionLabel: 'Finish & Claim Optimization Rank ★',
    objective: 'The second CLI code optimization pass prunes unused textures and quantizes vertex buffers, shrinking Room_resized.glb from 180.78 MB down to 106.35 MB! Click the final output line to complete the game!',
    explanation: 'Total transformation: 3.11M+ vertices → 996K vertices (−68%), 5.91M triangles → 1.85M triangles (−69%), and 504.94 MB → 106.35 MB (−79%) running smoothly in real time!',
    verts: 996777,
    tris: 1849314,
    fps: 60,
    mb: 106.35,
    bossName: 'Full Scene Payload (504.94 MB Raw)',
    bossVertsCurrent: 106,
    bossVertsMax: 505,
    hitText: '🏆 FINAL BUILD: 106.35 MB · 60 FPS!',
    xpGain: 1000,
    hotspot: { x: 26, y: 96, w: 48, h: 6, label: 'Click Final 106.35 MB Output ★' },
  },
];

const START_VERTS = 3113108;
const fmtNum = (n: number) => n.toLocaleString('en-US');

/* ─── WebAudio Synthesizer for tactile game clicks & level-up chimes ─── */
let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function playGameSfx(type: 'hit' | 'boss' | 'victory' | 'step') {
  if (!soundEnabled) return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    audioCtx ??= new Ctx();
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    const now = audioCtx.currentTime;

    if (type === 'hit') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.09);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'boss' || type === 'victory') {
      const notes = type === 'victory' ? [440, 554.37, 659.25, 880] : [392, 523.25, 659.25];
      notes.forEach((freq, i) => {
        const osc = audioCtx!.createOscillator();
        const gain = audioCtx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.07, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.22);
        osc.connect(gain).connect(audioCtx!.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.22);
      });
    } else {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch {
    // Ignore audio errors on restricted devices
  }
}

export function optGameHTML(instanceId = 'main'): string {
  const s0 = OPT_STEPS[0];
  const firstSrc = media(s0.file) ?? '';

  return `
  <section class="ogame rv" data-ogame="${esc(instanceId)}" data-step="0" data-xp="0" aria-label="Interactive Topology Optimization Game">
    <header class="ogame__header">
      <div class="ogame__titlewrap">
        <div class="ogame__eyebrow mono">
          <span class="ogame__live">● MINI-GAME</span>
          <span>TOPOLOGY HUNTER: 2 FPS → 60 FPS (28 INTERACTIVE STEPS · I1–I14)</span>
        </div>
        <h3 class="ogame__title">Play My Topology &amp; GLB Cleanup Workflow</h3>
        <p class="ogame__lead">Click the <b>pulsing orange target zones</b> directly inside my Blender &amp; CLI screenshots—or use the toolbelt below—to hunt down a 13K-vertex bolt, retopologize 110K ceiling wire grates with Curves, decimate 1.05M-vertex statues, and crush a 504.94 MB GLB down to 106.35 MB.</p>
      </div>

      <div class="ogame__controls-top mono">
        <button type="button" class="ogame__topbtn" data-og-autoplay aria-pressed="false" title="Auto-play all 28 optimization steps">
          <span data-og-autotext>▶ Auto-Play Walkthrough</span>
        </button>
        <button type="button" class="ogame__topbtn" data-og-sound aria-pressed="true" title="Toggle game sound effects">
          <span data-og-soundtext>🔊 SFX: ON</span>
        </button>
        <button type="button" class="ogame__topbtn" data-og-zoom title="Open current screenshot in high-res viewer">
          <span>Enlarge ⤢</span>
        </button>
      </div>
    </header>

    <!-- LIVE GAME TELEMETRY HUD -->
    <div class="ogame__hud" aria-live="polite">
      <div class="ogame__stat">
        <span class="mono ogame__slabel">Scene Vertices</span>
        <strong class="ogame__sval" data-og-verts>${fmtNum(s0.verts)}</strong>
        <span class="mono ogame__sdelta" data-og-verts-delta>Peak bloat · 3.11M</span>
      </div>
      <div class="ogame__stat">
        <span class="mono ogame__slabel">Scene Triangles</span>
        <strong class="ogame__sval" data-og-tris>${fmtNum(s0.tris)}</strong>
        <span class="mono ogame__sdelta" data-og-tris-delta>Target: 1.85M tris</span>
      </div>
      <div class="ogame__stat">
        <span class="mono ogame__slabel">Exported GLB Size</span>
        <strong class="ogame__sval" data-og-mb>${s0.mb.toFixed(2)} MB</strong>
        <span class="mono ogame__sdelta" data-og-mb-delta>Target: 106.35 MB</span>
      </div>
      <div class="ogame__stat ogame__stat--fps" data-og-fps-box data-fps-tier="low">
        <span class="mono ogame__slabel">Viewport / Runtime FPS</span>
        <strong class="ogame__sval" data-og-fps>${s0.fps} FPS</strong>
        <span class="mono ogame__sdelta" data-og-fps-delta>CRITICAL LAG (2 FPS)</span>
      </div>
      <div class="ogame__stat ogame__stat--xp">
        <span class="mono ogame__slabel">Optimizer Score</span>
        <strong class="ogame__sval" data-og-score>0 XP</strong>
        <span class="mono ogame__sdelta" data-og-rank>Rank: Apprentice</span>
      </div>
    </div>

    <!-- 4 BOSS STAGES SELECTOR -->
    <div class="ogame__missions" role="tablist" aria-label="4 Optimization Boss Stages">
      ${OPT_MISSIONS.map(
        (m, idx) => `
        <button type="button" role="tab" class="ogame__mission" aria-selected="${idx === 0}" data-og-mission="${m.id}">
          <div class="ogame__mtop mono">
            <span class="ogame__mcode">${esc(m.code)}</span>
            <span class="ogame__mstat">${esc(m.beforeStat)} → ${esc(m.afterStat)}</span>
          </div>
          <strong class="ogame__mtitle">${esc(m.title)}</strong>
        </button>`
      ).join('')}
    </div>

    <!-- MAIN GAME ARENA -->
    <div class="ogame__arena">
      <!-- INTERACTIVE VIEWPORT STAGE -->
      <div class="ogame__stage" data-og-stage>
        <!-- BOSS HEALTH / BLOAT BAR -->
        <div class="ogame__bossbar mono">
          <div class="ogame__bossinfo">
            <span class="ogame__bosstag">CURRENT TARGET:</span>
            <strong data-og-bossname>${esc(s0.bossName)}</strong>
          </div>
          <div class="ogame__bosshp">
            <span data-og-bosshp-text>Bloat: 100%</span>
            <div class="ogame__bosstrack">
              <div class="ogame__bossfill" style="width: 100%" data-og-bossfill></div>
            </div>
          </div>
          <span class="ogame__stepcount" data-og-step-counter>STEP 01 / ${OPT_STEPS.length}</span>
        </div>

        <!-- VIEWPORT CANVAS WITH CLICKABLE TARGET HITBOX -->
        <div class="ogame__viewport" data-og-viewport data-cursor="Click Target ⚡">
          <img
            class="ogame__img"
            data-og-img
            src="${firstSrc}"
            alt="${esc(s0.code)} — ${esc(s0.title)}"
            width="1600"
            height="1000"
            draggable="false"
            decoding="async"
          />

          <!-- Interactive Target Box on the Blender/CLI Screenshot -->
          <button
            type="button"
            class="ogame__target"
            data-og-hotspot
            style="left: ${s0.hotspot.x}%; top: ${s0.hotspot.y}%; width: ${s0.hotspot.w}%; height: ${s0.hotspot.h}%"
            aria-label="Target action: ${esc(s0.hotspot.label)}"
          >
            <span class="ogame__tcorner ogame__tcorner--tl" aria-hidden="true"></span>
            <span class="ogame__tcorner ogame__tcorner--tr" aria-hidden="true"></span>
            <span class="ogame__tcorner ogame__tcorner--bl" aria-hidden="true"></span>
            <span class="ogame__tcorner ogame__tcorner--br" aria-hidden="true"></span>
            <span class="ogame__tping" aria-hidden="true"></span>
            <span class="ogame__tlabel mono" data-og-hlabel>⚡ ${esc(s0.hotspot.label)}</span>
          </button>

          <!-- Floating Hit/Damage FX Layer -->
          <div class="ogame__fx" data-og-fx aria-hidden="true"></div>

          <!-- Victory Overlay when Step 28 is completed -->
          <div class="ogame__victory" data-og-victory hidden>
            <div class="ogame__vbox">
              <span class="mono ogame__vkicker">★ ALL 4 BOSSES OPTIMIZED · LEVEL READY FOR ENGINE ★</span>
              <h4>Scene Rescued: 3.11M Verts (2 FPS) → 996K Verts &amp; 106.35 MB!</h4>
              <p>You stepped through every real topology &amp; CLI pass: stripped the 13K bolt down to 576 verts, converted the 132K-triangle ceiling grates into 6-triangle UV quads, welded &amp; 0.1x decimated the 1.05M-vertex statues, and ran two-pass <code>gltf-transform</code> compression!</p>
              <dl class="ogame__vstats mono">
                <div><dt>Door Assembly</dt><dd>129,267 → 11,212 verts (−91%)</dd></div>
                <div><dt>Corridor Ceiling</dt><dd>110,852 → 36,673 verts (−67%)</dd></div>
                <div><dt>Statue Wing</dt><dd>1,317,355 → 223,711 verts (−83%)</dd></div>
                <div><dt>Exported GLB</dt><dd>504.94 MB → 106.35 MB (−79%)</dd></div>
              </dl>
              <div class="ogame__vbtns">
                <button type="button" class="btn" data-og-restart>Play Again from I1 ↺</button>
                <button type="button" class="btn btn--ghost" data-og-close-victory>Inspect Final Screenshot</button>
              </div>
            </div>
          </div>

          <button type="button" class="dfilm__wfarrow dfilm__wfarrow--prev" data-og-nav="-1" aria-label="Previous step">←</button>
          <button type="button" class="dfilm__wfarrow dfilm__wfarrow--next" data-og-nav="1" aria-label="Next step">→</button>
        </div>

        <!-- BLENDER / CLI TOOLBELT -->
        <div class="ogame__toolbelt" role="group" aria-label="Active Blender and CLI optimization toolbelt">
          <span class="mono ogame__tblabel">ACTIVE TOOL:</span>
          <div class="ogame__tools">
            ${OPT_TOOLS.map(
              (t) => `
              <button type="button" class="ogame__tool ${t.key === s0.toolKey ? 'is-recommended' : ''}" data-og-toolbtn="${t.key}" title="Use ${esc(t.label)}">
                <span class="ogame__ticon" aria-hidden="true">${t.icon}</span>
                <span class="mono ogame__tname">${esc(t.label)}</span>
              </button>`
            ).join('')}
          </div>
        </div>

        <!-- 28-STEP SCRUBBER TIMELINE (I1 .. I14) -->
        <div class="ogame__pills" role="tablist" aria-label="All 28 workflow images from I1 to I14">
          ${OPT_STEPS.map(
            (st, idx) =>
              `<button type="button" role="tab" aria-selected="${idx === 0}" data-og-idx="${idx}" class="ogame__pill mono" title="${esc(st.code)}: ${esc(st.title)}">${esc(st.code)}</button>`
          ).join('')}
        </div>
      </div>

      <!-- RIGHT-SIDE MISSION BRIEFING & ACTION DECK -->
      <aside class="ogame__deck" aria-label="Step mission briefing and execution controls">
        <div class="ogame__card">
          <div class="ogame__cardhead mono">
            <span class="ogame__badgecode" data-og-code>${esc(s0.code)}</span>
            <span data-og-tool>${esc(s0.toolName)}</span>
            <kbd data-og-shortcut>${esc(s0.shortcut)}</kbd>
          </div>

          <h4 class="ogame__stitle" data-og-title>${esc(s0.title)}</h4>

          <div class="ogame__missionbox">
            <span class="mono ogame__mblabel">🎯 PLAYER OBJECTIVE</span>
            <p class="ogame__prompt" data-og-prompt>${esc(s0.objective)}</p>
          </div>

          <div class="ogame__why">
            <span class="mono">🛠️ HOW I CLEAN THIS IN PRODUCTION</span>
            <p data-og-explain>${esc(s0.explanation)}</p>
          </div>

          <div class="ogame__hitbadge mono" data-og-badge>${esc(s0.hitText)}</div>
        </div>

        <div class="ogame__actions">
          <button type="button" class="btn ogame__actbtn" data-og-action>
            <span data-og-acttext>${esc(s0.actionLabel)}</span>
            <span aria-hidden="true">⚡</span>
          </button>
          <div class="ogame__subnav">
            <button type="button" class="btn btn--ghost" data-og-nav="-1">← Prev</button>
            <button type="button" class="btn btn--ghost" data-og-nav="1">Skip →</button>
            <button type="button" class="btn btn--ghost" data-og-reset>Reset ↺</button>
          </div>
        </div>
      </aside>
    </div>
  </section>`;
}

const autoPlayTimers = new Map<HTMLElement, number>();

export function stopOptGameAutoPlay(root: HTMLElement) {
  const timer = autoPlayTimers.get(root);
  if (timer) {
    window.clearInterval(timer);
    autoPlayTimers.delete(root);
  }
  const btn = root.querySelector<HTMLElement>('[data-og-autoplay]');
  const txt = root.querySelector<HTMLElement>('[data-og-autotext]');
  if (btn) btn.setAttribute('aria-pressed', 'false');
  if (txt) txt.textContent = '▶ Auto-Play Walkthrough';
}

export function toggleOptGameAutoPlay(root: HTMLElement) {
  if (autoPlayTimers.has(root)) {
    stopOptGameAutoPlay(root);
    return;
  }
  const btn = root.querySelector<HTMLElement>('[data-og-autoplay]');
  const txt = root.querySelector<HTMLElement>('[data-og-autotext]');
  if (btn) btn.setAttribute('aria-pressed', 'true');
  if (txt) txt.textContent = '❚❚ Pause Auto-Play';

  const id = window.setInterval(() => {
    if (!root.isConnected) {
      stopOptGameAutoPlay(root);
      return;
    }
    const cur = Number(root.dataset.step ?? 0);
    if (cur >= OPT_STEPS.length - 1) {
      stopOptGameAutoPlay(root);
      return;
    }
    advanceOptGame(root);
  }, 2400);
  autoPlayTimers.set(root, id);
}

export function toggleOptGameSound(_root: HTMLElement) {
  soundEnabled = !soundEnabled;
  document.querySelectorAll<HTMLElement>('[data-ogame]').forEach((el) => {
    const btn = el.querySelector<HTMLElement>('[data-og-sound]');
    const txt = el.querySelector<HTMLElement>('[data-og-soundtext]');
    if (btn) btn.setAttribute('aria-pressed', String(soundEnabled));
    if (txt) txt.textContent = soundEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
  });
  if (soundEnabled) playGameSfx('step');
}

function spawnHitFloatingText(root: HTMLElement, text: string, xPct?: number, yPct?: number) {
  const fxLayer = root.querySelector<HTMLElement>('[data-og-fx]');
  if (!fxLayer) return;
  const floater = document.createElement('span');
  floater.className = 'ogame__floater mono';
  floater.textContent = text;
  floater.style.left = `${xPct ?? 50}%`;
  floater.style.top = `${yPct ?? 50}%`;
  fxLayer.appendChild(floater);
  window.setTimeout(() => floater.remove(), 1100);
}

export function advanceOptGame(root: HTMLElement, clickX?: number, clickY?: number) {
  const cur = Number(root.dataset.step ?? 0);
  const st = OPT_STEPS[cur];
  const curXp = Number(root.dataset.xp ?? 0) + st.xpGain;
  root.dataset.xp = String(curXp);

  spawnHitFloatingText(root, `${st.hitText} (+${st.xpGain} XP)`, clickX ?? st.hotspot.x, clickY ?? st.hotspot.y);

  // If on final step (I14), show the Victory modal!
  if (cur === OPT_STEPS.length - 1) {
    playGameSfx('victory');
    setOptGameStep(root, cur);
    const vic = root.querySelector<HTMLElement>('[data-og-victory]');
    if (vic) vic.hidden = false;
    stopOptGameAutoPlay(root);
    return;
  }

  const nextIdx = cur + 1;
  const isBossClear = OPT_STEPS[nextIdx].mission !== st.mission;
  playGameSfx(isBossClear ? 'boss' : 'hit');
  setOptGameStep(root, nextIdx);
}

export function setOptGameStep(root: HTMLElement, nextIdx: number) {
  const total = OPT_STEPS.length;
  const idx = ((nextIdx % total) + total) % total;
  const st = OPT_STEPS[idx];
  root.dataset.step = String(idx);

  const $ = <T extends HTMLElement = HTMLElement>(sel: string) => root.querySelector<T>(sel);

  const vic = $('[data-og-victory]');
  if (vic) vic.hidden = true;

  // Image & preload next
  const img = $<HTMLImageElement>('[data-og-img]');
  const src = media(st.file);
  if (img && src) {
    img.src = src;
    img.alt = `${st.code} — ${st.title}`;
  }
  const preloadSrc = media(OPT_STEPS[(idx + 1) % total].file);
  if (preloadSrc) {
    const pre = new Image();
    pre.decoding = 'async';
    pre.src = preloadSrc;
  }

  // Target hitbox position & label
  const hotspot = $('[data-og-hotspot]');
  const hlabel = $('[data-og-hlabel]');
  if (hotspot) {
    hotspot.style.left = `${st.hotspot.x}%`;
    hotspot.style.top = `${st.hotspot.y}%`;
    hotspot.style.width = `${st.hotspot.w}%`;
    hotspot.style.height = `${st.hotspot.h}%`;
    hotspot.setAttribute('aria-label', `Target action: ${st.hotspot.label}`);
    hotspot.classList.toggle('is-right', st.hotspot.x > 64);
    hotspot.classList.toggle('is-bottom', st.hotspot.y > 76);
  }
  if (hlabel) hlabel.textContent = `⚡ ${st.hotspot.label}`;

  // Boss bar
  const bossName = $('[data-og-bossname]');
  if (bossName) bossName.textContent = st.bossName;
  const bloatPct = Math.max(4, Math.round((st.bossVertsCurrent / st.bossVertsMax) * 100));
  const bossHpText = $('[data-og-bosshp-text]');
  if (bossHpText) bossHpText.textContent = `Bloat: ${bloatPct}%`;
  const bossFill = $('[data-og-bossfill]');
  if (bossFill) {
    bossFill.style.width = `${bloatPct}%`;
    bossFill.dataset.tier = bloatPct > 65 ? 'high' : bloatPct > 25 ? 'mid' : 'clean';
  }
  const stepCounter = $('[data-og-step-counter]');
  if (stepCounter) stepCounter.textContent = `STEP ${String(idx + 1).padStart(2, '0')} / ${total}`;

  // Briefing card
  const codeEl = $('[data-og-code]');
  if (codeEl) codeEl.textContent = st.code;
  const toolEl = $('[data-og-tool]');
  if (toolEl) toolEl.textContent = st.toolName;
  const shortcut = $('[data-og-shortcut]');
  if (shortcut) shortcut.textContent = st.shortcut;
  const titleEl = $('[data-og-title]');
  if (titleEl) titleEl.textContent = st.title;
  const promptEl = $('[data-og-prompt]');
  if (promptEl) promptEl.textContent = st.objective;
  const explainEl = $('[data-og-explain]');
  if (explainEl) explainEl.textContent = st.explanation;
  const badgeEl = $('[data-og-badge]');
  if (badgeEl) badgeEl.textContent = st.hitText;
  const actText = $('[data-og-acttext]');
  if (actText) actText.textContent = st.actionLabel;

  // Telemetry HUD
  const vertsEl = $('[data-og-verts]');
  if (vertsEl) vertsEl.textContent = fmtNum(st.verts);
  const vertsSaved = START_VERTS - st.verts;
  const vertsDelta = $('[data-og-verts-delta]');
  if (vertsDelta) {
    vertsDelta.textContent =
      vertsSaved > 0 ? `−${fmtNum(vertsSaved)} verts (−${Math.round((vertsSaved / START_VERTS) * 100)}%)` : 'Peak bloat · 3.11M';
  }

  const trisEl = $('[data-og-tris]');
  if (trisEl) trisEl.textContent = fmtNum(st.tris);
  const trisDelta = $('[data-og-tris-delta]');
  if (trisDelta) {
    const trisSaved = 5910476 - st.tris;
    trisDelta.textContent = trisSaved > 0 ? `−${fmtNum(trisSaved)} tris` : 'Target: 1.85M tris';
  }

  const mbEl = $('[data-og-mb]');
  if (mbEl) mbEl.textContent = `${st.mb.toFixed(2)} MB`;
  const mbDelta = $('[data-og-mb-delta]');
  if (mbDelta) {
    const mbSaved = 504.94 - st.mb;
    mbDelta.textContent = mbSaved > 1 ? `−${mbSaved.toFixed(1)} MB (−${Math.round((mbSaved / 504.94) * 100)}%)` : 'Target: 106.35 MB';
  }

  const fpsEl = $('[data-og-fps]');
  if (fpsEl) fpsEl.textContent = `${st.fps} FPS`;
  const fpsBox = $('[data-og-fps-box]');
  if (fpsBox) fpsBox.dataset.fpsTier = st.fps < 10 ? 'low' : st.fps < 25 ? 'mid' : 'high';
  const fpsDelta = $('[data-og-fps-delta]');
  if (fpsDelta) {
    fpsDelta.textContent = st.fps < 10 ? 'CRITICAL LAG' : st.fps < 25 ? 'GAINING SPEED…' : 'REAL-TIME READY ✓';
  }

  // Score & Rank
  const xp = Math.max(Number(root.dataset.xp ?? 0), idx * 220);
  const scoreEl = $('[data-og-score]');
  if (scoreEl) scoreEl.textContent = `${fmtNum(xp)} XP`;
  const rankEl = $('[data-og-rank]');
  if (rankEl) {
    const rank =
      idx >= 25
        ? 'Rank: Master Tech Artist ★'
        : idx >= 18
        ? 'Rank: Sculpt Decimator'
        : idx >= 8
        ? 'Rank: Retopo Specialist'
        : 'Rank: Mesh Hunter';
    rankEl.textContent = rank;
  }

  // Toolbelt active highlight
  root.querySelectorAll<HTMLElement>('[data-og-toolbtn]').forEach((b) => {
    b.classList.toggle('is-recommended', b.dataset.ogToolbtn === st.toolKey);
  });

  // Mission tabs highlight
  root.querySelectorAll<HTMLElement>('[data-og-mission]').forEach((btn) => {
    const mId = Number(btn.dataset.ogMission);
    btn.setAttribute('aria-selected', String(mId === st.mission));
    btn.classList.toggle('is-done', mId < st.mission || idx === total - 1);
  });

  // Step pills highlight
  root.querySelectorAll<HTMLElement>('[data-og-idx]').forEach((pill) => {
    const pIdx = Number(pill.dataset.ogIdx);
    pill.setAttribute('aria-selected', String(pIdx === idx));
    pill.classList.toggle('is-visited', pIdx < idx);
  });
}

export function openOptGameViewer(triggerEl: HTMLElement, curIdx: number) {
  const items: ViewerItem[] = [
    {
      title: 'Topology & GLB Optimization Pipeline (I1–I14)',
      kicker: '3D Asset Optimization',
      note: OPT_STEPS[curIdx]?.explanation ?? 'Step-by-step topology cleanup and gltf-transform CLI optimization.',
      poster: OPT_STEPS[0].file,
      workflow: OPT_STEPS.map((s) => s.file),
      imageOnly: true,
    },
  ];
  openViewer(items, 0, triggerEl, 'workflow', curIdx);
}
