(function(){
  const container = document.getElementById("face-canvas");
  if(!container || typeof THREE === "undefined") return;

  /* ---------- CONFIG ---------- */
  const CONFIG = {
    camera: {
      fov: 35,                  // field of view in degrees (lower = flatter, more zoomed in)
      distance: 4               // how far the camera sits from the head
    },
    pixelRatioMax: 2,           // cap on render sharpness for high-density screens (lower = lighter)
    light: {
      ambient: 0.7,             // overall soft light
      directional: 0.6,         // strength of the main light
      position: [2, 3, 4]       // where the main light sits: x (right), y (up), z (toward the viewer)
    },
    head: {
      size: 1.4,                // width, height and depth of the cube head
      color: 0xe8e8e8,          // head colour
      roughness: 0.85           // 0 = glossy, 1 = matte
    },
    eye: {
      radius: 0.14,             // size of each eye
      segments: 20,             // how round the eyes are (higher = smoother, heavier)
      color: 0x111111,          // eye colour
      roughness: 0.4,           // 0 = glossy, 1 = matte
      offsetX: 0.32,            // how far each eye sits from the middle, left and right
      offsetY: 0.15,            // eye height on the face (positive = up)
      offsetZ: 0.72             // how far the eyes sit out from the head center (just past the face)
    },
    tracking: {
      lerpRate: 0.08,           // how fast the head turns toward the cursor (0 to 1, higher = snappier)
      gain: 1.2,                // how strongly the cursor distance turns the head
      maxYaw: 0.5,              // furthest left/right turn, in radians
      maxPitch: 0.35            // furthest up/down tilt, in radians
    },
    fallbackPose: {
      yaw: 0.45,                // left/right turn used if the About button can't be found
      pitch: -0.3               // up/down tilt used in that case
    },
    aboutPageIndex: 1           // position of the About page (0 Work, 1 About, 2 Contact)
  };

  /* ---------- SCENE ---------- */
  const aboutPage = document.getElementById("page-about");
  const aboutNavButton = document.querySelector(`.nav-link[data-page="${CONFIG.aboutPageIndex}"]`);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, 1, 0.1, 100);
  camera.position.z = CONFIG.camera.distance;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, CONFIG.pixelRatioMax));
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, CONFIG.light.ambient));
  const keyLight = new THREE.DirectionalLight(0xffffff, CONFIG.light.directional);
  keyLight.position.set(...CONFIG.light.position);
  scene.add(keyLight);

  const head = new THREE.Group();
  scene.add(head);

  const { size, color, roughness } = CONFIG.head;
  head.add(new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshStandardMaterial({ color, roughness })
  ));

  const eyeConfig = CONFIG.eye;
  const eyeGeometry = new THREE.SphereGeometry(eyeConfig.radius, eyeConfig.segments, eyeConfig.segments);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: eyeConfig.color, roughness: eyeConfig.roughness });
  [-1, 1].forEach(side => {
    const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye.position.set(side * eyeConfig.offsetX, eyeConfig.offsetY, eyeConfig.offsetZ);
    head.add(eye);
  });

  /* ---------- TRACKING ---------- */
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  let targetYaw = CONFIG.fallbackPose.yaw;
  let targetPitch = CONFIG.fallbackPose.pitch;
  let aboutActive = false;
  let lastClick = null;

  function setPose(yaw, pitch, snap){
    targetYaw = yaw;
    targetPitch = pitch;
    if(snap) head.rotation.set(pitch, yaw, 0);
  }

  function restCenter(){
    const rect = container.getBoundingClientRect();
    const pageLeft = aboutPage ? aboutPage.getBoundingClientRect().left : 0;
    return {
      x: rect.left - pageLeft + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function aimAt(x, y, snap){
    const { gain, maxYaw, maxPitch } = CONFIG.tracking;
    const center = restCenter();
    const yaw = clamp(((x - center.x) / window.innerWidth) * gain, -maxYaw, maxYaw);
    const pitch = clamp(((y - center.y) / window.innerHeight) * gain, -maxPitch, maxPitch);
    setPose(yaw, pitch, snap);
  }

  function aboutNavButtonCenter(){
    if(!aboutNavButton) return null;
    const rect = aboutNavButton.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  document.addEventListener("click", (e) => {
    let { clientX: x, clientY: y } = e;
    if(!x && !y && e.target && e.target.getBoundingClientRect){
      const rect = e.target.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
    lastClick = { x, y };
  }, true);

  document.addEventListener("pagechange", (e) => {
    const nowActive = e.detail.index === CONFIG.aboutPageIndex;

    if(nowActive && !aboutActive){
      const point = aboutNavButtonCenter();
      if(point) aimAt(point.x, point.y, true);
      else setPose(CONFIG.fallbackPose.yaw, CONFIG.fallbackPose.pitch, true);
    } else if(!nowActive && aboutActive && lastClick){
      aimAt(lastClick.x, lastClick.y, false);
    }

    aboutActive = nowActive;
  });

  document.addEventListener("mousemove", (e) => {
    if(aboutActive) aimAt(e.clientX, e.clientY, false);
  });

  /* ---------- RENDER LOOP ---------- */
  function resize(){
    const width = container.clientWidth;
    const height = container.clientHeight;
    if(width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  resize();
  window.addEventListener("resize", resize);

  function animate(){
    requestAnimationFrame(animate);
    head.rotation.y += (targetYaw - head.rotation.y) * CONFIG.tracking.lerpRate;
    head.rotation.x += (targetPitch - head.rotation.x) * CONFIG.tracking.lerpRate;
    renderer.render(scene, camera);
  }
  animate();
})();
