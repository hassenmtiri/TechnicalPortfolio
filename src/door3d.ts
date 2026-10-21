import {
  ACESFilmicToneMapping,
  AnimationMixer,
  Box3,
  BoxGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  GridHelper,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  LoopOnce,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type AnimationAction,
  type AnimationClip,
  type BufferGeometry,
  type Material,
  type Texture,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface DoorOptions {
  glbUrl: string | null;
  nodeNames: { left: string; right: string; indicator: string };
  openColor: string;
  closedColor: string;
  reduceMotion: boolean;
  onState: (s: { open: boolean; dissolved: boolean }) => void;
}

export interface DoorApi {
  /** Enlarged mode: enables wheel/pinch zoom and re-fits the canvas. */
  setExpanded(on: boolean): void;
  toggle(): void;
  toggleDissolve(): void;
  dispose(): void;
}

export async function mountDoor(host: HTMLElement, o: DoorOptions): Promise<DoorApi> {
  const canvas = document.createElement('canvas');
  canvas.className = 'door3d__canvas';
  canvas.setAttribute('aria-label', '3D door demo. Click or tap to open and close.');
  canvas.setAttribute('role', 'img');
  host.appendChild(canvas);

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;

  const scene = new Scene();

  // Studio PBR environment map for realistic metallic reflections and bevel highlights
  const pmremGenerator = new PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
  scene.environment = envTexture;
  roomEnv.dispose();
  pmremGenerator.dispose();

  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  // Start slightly off-axis and above so the door reads as a 3D object (not a flat picture) at first glance.
  camera.position.set(2.3, 1.1, 7.4);
  camera.lookAt(0, 0, 0);

  // Soft sky/floor ambient hemisphere
  scene.add(new HemisphereLight(0xffffff, 0x1e2838, 2.2));

  // Key light: front-upper-right crisp warm sunlight
  const key = new DirectionalLight(0xfff7ee, 3.6);
  key.position.set(3, 4, 6);
  scene.add(key);

  // Fill light: front-left cool fill to eliminate pitch-black shadows
  const fill = new DirectionalLight(0xdde8ff, 2.8);
  fill.position.set(-4, 1.5, 5);
  scene.add(fill);

  // Front-Center detail headlight: directly illuminates center door panels, locks, and valve hardware
  const front = new DirectionalLight(0xffffff, 2.4);
  front.position.set(0, 0, 7.5);
  scene.add(front);

  // Top Rim / Contour light: brings out the upper bulkhead silhouette
  const rim = new DirectionalLight(0x00f0ff, 2.0);
  rim.position.set(0, 5, -2);
  scene.add(rim);

  // Subtle bottom bounce
  const bounce = new DirectionalLight(0xff7a30, 1.0);
  bounce.position.set(0, -4, 3);
  scene.add(bounce);

  const disposables: { dispose(): void }[] = [renderer, envTexture];
  const track = <T extends { dispose(): void }>(x: T) => (disposables.push(x), x);

  const rig = new Group();
  scene.add(rig);

  /* "3D box" stage: a glowing wireframe cube + floor grid around the door so it clearly reads as a real 3D model. */
  const stage = new Group();
  scene.add(stage);
  const buildStage = (size: Vector3, s: number) => {
    const longest = Math.max(size.x, size.y, size.z) * s;
    const w = size.x * s * 1.2;
    const h = size.y * s * 1.2;
    const d = Math.max(size.z * s * 1.6, longest * 0.5);
    const geo = track(new BoxGeometry(w, h, d));
    const edges = track(new EdgesGeometry(geo));
    const lineMat = track(new LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.5 }));
    stage.add(new LineSegments(edges, lineMat));
    const grid = new GridHelper(Math.max(w, d) * 1.6, 14, 0x00f0ff, 0x2b3a55);
    const gm = grid.material as LineBasicMaterial;
    gm.transparent = true;
    gm.opacity = 0.4;
    gm.depthWrite = false;
    track(gm);
    track(grid.geometry);
    grid.position.y = -h / 2;
    stage.add(grid);
  };

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = false; // keeps the render loop on-demand (zero idle GPU cost)
  controls.enablePan = false;
  controls.enableZoom = false; // wheel zoom only in enlarged mode, so page scrolling is never hijacked
  controls.minDistance = 4.5;
  controls.maxDistance = 13;
  controls.minAzimuthAngle = -1.3;
  controls.maxAzimuthAngle = 1.3;
  controls.minPolarAngle = 0.75;
  controls.maxPolarAngle = 2.1;
  controls.target.set(0, 0, 0);
  controls.update();
  canvas.style.touchAction = 'pan-y'; // vertical swipes still scroll the page on phones
  disposables.push({ dispose: () => controls.dispose() });

  let mixer: AnimationMixer | null = null;
  const actions: AnimationAction[] = [];
  let animDuration = 1.0;
  let hasBakedAnims = false;

  let open = false;
  let dissolved = false;
  let raf = 0;
  let last = performance.now();

  const cClosed = new Color(o.closedColor);
  const cOpen = new Color(o.openColor);
  const indicatorMats: MeshStandardMaterial[] = [];
  const allMeshes: Mesh[] = [];
  const isIndicatorMat = (name?: string) =>
    name === 'emission' ||
    name === 'emission.008' ||
    name === 'MaterialREdToGreen' ||
    Boolean(name?.startsWith('emission.'));

  if (o.glbUrl) {
    try {
      const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/loaders/DRACOLoader.js'),
      ]);

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/gltf/`);
      track(dracoLoader);

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      const gltf = await loader.loadAsync(o.glbUrl);
      const model = gltf.scene;

      // Hide background wall/floor plane so only the door assembly is framed and dissolved
      model.traverse((child) => {
        if (child.name === 'Plane') {
          child.visible = false;
        }
      });

      rig.add(model);

      // Setup all baked animation clips from the GLB first so frame 0 pose is used for bounds
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new AnimationMixer(model);
        hasBakedAnims = true;

        gltf.animations.forEach((clip: AnimationClip) => {
          if (clip.duration > animDuration) {
            animDuration = clip.duration;
          }
        });

        gltf.animations.forEach((clip: AnimationClip) => {
          const act = mixer!.clipAction(clip);
          act.setLoop(LoopOnce, 1);
          act.clampWhenFinished = true;
          actions.push(act);
        });

        // Sample frame 0 so the door starts in its exact baked closed pose
        actions.forEach((act) => {
          act.reset();
          act.play();
          act.paused = true;
          act.time = 0;
        });
        mixer.update(0);
      }

      // Center and normalize scale based on visible door meshes in closed pose
      model.updateMatrixWorld(true);
      const box = new Box3();
      model.traverse((child) => {
        const m = child as Mesh;
        if (m.isMesh && m.visible) {
          box.expandByObject(m);
        }
      });
      if (!box.isEmpty()) {
        const size = new Vector3();
        box.getSize(size);
        const center = new Vector3();
        box.getCenter(center);

        model.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
          const targetSize = 2.9;
          const s = targetSize / maxDim;
          rig.scale.setScalar(s);
          buildStage(size, s);
        }
      }

      // Inspect materials and cache emission & original alpha state
      model.traverse((child) => {
        const m = child as Mesh;
        if (m.isMesh && m.visible) {
          allMeshes.push(m);
          track(m.geometry as BufferGeometry);
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((matItem) => {
            const mat = matItem as Material & {
              map?: Texture | null;
              name?: string;
              emissive?: Color;
              color?: Color;
              emissiveIntensity?: number;
              userData: Record<string, unknown>;
            };
            track(mat);
            if (mat.map) track(mat.map);

            if (mat.userData.origTransparent === undefined) {
              mat.userData.origTransparent = mat.transparent;
              mat.userData.origOpacity = mat.opacity;
            }

            const stdMat = mat as MeshStandardMaterial;
            if (stdMat.isMeshStandardMaterial && !isIndicatorMat(stdMat.name)) {
              stdMat.envMapIntensity = 1.8;
            }

            if (isIndicatorMat(mat.name) && mat.emissive) {
              const stdMat = mat as MeshStandardMaterial;
              if (!indicatorMats.includes(stdMat)) {
                indicatorMats.push(stdMat);
              }
              stdMat.emissive.copy(cClosed);
              if (stdMat.color) stdMat.color.copy(cClosed);
              stdMat.emissiveIntensity = 3.0;
            }
          });
        }
      });
    } catch (err) {
      console.error('Failed to load door GLB:', err);
    }
  }

  const render = () => {
    renderer.render(scene, camera);
  };

  const kick = () => {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };

  const emit = () => o.onState({ open, dissolved });

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    let isPlaying = false;
    if (mixer) {
      mixer.update(dt);
      isPlaying = actions.some((a) => a.isRunning());
    }

    // Indicator color transition
    const targetColor = open ? cOpen : cClosed;
    let colorAnimating = false;
    indicatorMats.forEach((mat) => {
      mat.emissive.lerp(targetColor, Math.min(1, dt * 6));
      if (mat.color) mat.color.lerp(targetColor, Math.min(1, dt * 6));
      if (
        Math.abs(mat.emissive.r - targetColor.r) +
          Math.abs(mat.emissive.g - targetColor.g) +
          Math.abs(mat.emissive.b - targetColor.b) >
        0.005
      ) {
        colorAnimating = true;
      }
    });

    render();

    if (isPlaying || colorAnimating) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
    }
  };

  const toggle = () => {
    open = !open;
    emit();

    if (hasBakedAnims && mixer) {
      actions.forEach((act) => {
        const clipDur = act.getClip().duration || animDuration;
        if (!act.isRunning()) {
          act.enabled = true;
          act.time = open ? 0 : clipDur;
        }
        act.paused = false;
        act.timeScale = open ? 1.0 : -1.0;
        act.play();
      });
      kick();
    } else {
      kick();
    }
  };

  const resize = () => {
    const w = host.clientWidth || 640;
    const h = host.clientHeight || Math.round(w * 0.62);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w / h < 1 ? 46 : 35; // narrower boxes need a wider lens so the whole 3D box stays in frame
    camera.updateProjectionMatrix();
    render();
  };

  const ro = new ResizeObserver(resize);
  ro.observe(host);

  // Orbit drags re-render only while the user is actually moving the camera.
  const onControlsChange = () => {
    if (!raf) render();
  };
  controls.addEventListener('change', onControlsChange);

  // A click opens/closes the door, but a drag (rotating the box) must not.
  let downX = 0;
  let downY = 0;
  const onDown = (e: PointerEvent) => {
    downX = e.clientX;
    downY = e.clientY;
  };
  const onClick = (e: MouseEvent) => {
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
    toggle();
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('click', onClick);

  resize();
  emit();

  return {
    setExpanded(on: boolean) {
      controls.enableZoom = on;
      controls.enablePan = on;
      canvas.style.touchAction = on ? 'none' : 'pan-y';
      if (!on) {
        // return to the default framing when the enlarged view is closed
        camera.position.set(2.3, 1.1, 7.4);
        controls.target.set(0, 0, 0);
        controls.update();
      }
      resize();
    },
    toggle,
    toggleDissolve() {
      dissolved = !dissolved;
      allMeshes.forEach((m) => {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach((mat) => {
          const std = mat as MeshStandardMaterial;
          if (!isIndicatorMat(std.name)) {
            std.wireframe = dissolved;
            std.transparent = dissolved ? true : Boolean(std.userData.origTransparent);
            std.opacity = dissolved ? 0.35 : Number(std.userData.origOpacity ?? 1.0);
            std.needsUpdate = true;
          }
        });
      });
      emit();
      render();
    },
    dispose() {
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      controls.removeEventListener('change', onControlsChange);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('click', onClick);
      disposables.forEach((d) => d.dispose());
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
