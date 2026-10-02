/* Prototype only: a cube "head" with two sphere "eyes" that turns
   to face the cursor anywhere on the page. Swap headMesh/eye geometry
   for an imported model later (e.g. a GLTF export from Blender via
   THREE.GLTFLoader) without touching the tracking logic below. */
(function(){
  const container = document.getElementById("face-canvas");
  if(!container || typeof THREE === "undefined") return;

  const aboutPage = document.getElementById("page-about");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(2, 3, 4);
  scene.add(dirLight);

  const head = new THREE.Group();
  scene.add(head);

  const headMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 1.4),
    new THREE.MeshStandardMaterial({ color: 0xe8e8e8, roughness: 0.85 })
  );
  head.add(headMesh);

  const eyeGeo = new THREE.SphereGeometry(0.14, 20, 20);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 });

  const eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
  eyeLeft.position.set(-0.32, 0.15, 0.72);
  head.add(eyeLeft);

  const eyeRight = new THREE.Mesh(eyeGeo, eyeMat);
  eyeRight.position.set(0.32, 0.15, 0.72);
  head.add(eyeRight);

  const LERP_RATE = 0.08;
  const MAX_YAW = 0.5;
  const MAX_PITCH = 0.35;

  // Fallback used only if the About button can't be found.
  const FALLBACK = { yaw: 0.45, pitch: -0.3 };

  let targetYaw = FALLBACK.yaw;
  let targetPitch = FALLBACK.pitch;
  let isAboutActive = false;

  // The last click position on the page. A capture listener on document
  // always runs before the nav button handlers in main.js, so this is
  // already up to date when "pagechange" fires.
  let lastClick = null;
  document.addEventListener("click", (e) => {
    let x = e.clientX;
    let y = e.clientY;
    // Keyboard activation reports 0,0, so use the center of the element.
    if(!x && !y && e.target && e.target.getBoundingClientRect){
      const r = e.target.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    }
    lastClick = { x, y };
  }, true);

  // Center of the canvas as it will be once About is at rest on screen.
  // While About is slid off-screen, the canvas rect is shifted by the
  // page offset, so subtract the page's own left offset to undo that.
  function restCenter(){
    const rect = container.getBoundingClientRect();
    const pageLeft = aboutPage ? aboutPage.getBoundingClientRect().left : 0;
    return {
      x: rect.left - pageLeft + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  // Turn a screen point into a head orientation and set it as the target.
  function aimAt(x, y, snap){
    const c = restCenter();
    const dx = (x - c.x) / window.innerWidth;
    const dy = (y - c.y) / window.innerHeight;
    targetYaw = Math.max(-MAX_YAW, Math.min(MAX_YAW, dx * 1.2));
    targetPitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, dy * 1.2));
    if(snap){
      head.rotation.set(targetPitch, targetYaw, 0);
    }
  }

  function aboutButtonCenter(){
    const btn = document.querySelector('.nav-link[data-page="1"]');
    if(!btn) return null;
    const r = btn.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  document.addEventListener("pagechange", (e) => {
    const { index } = e.detail;
    const nowActive = index === 1;

    if(nowActive && !isAboutActive){
      // Arriving: look at the About button right away (no easing), so
      // it feels like the head was already following your cursor.
      const p = aboutButtonCenter();
      if(p){
        aimAt(p.x, p.y, true);
      } else {
        targetYaw = FALLBACK.yaw;
        targetPitch = FALLBACK.pitch;
        head.rotation.set(FALLBACK.pitch, FALLBACK.yaw, 0);
      }
    }

    if(!nowActive && isAboutActive){
      // Leaving: look at wherever you just clicked (logo, Work or
      // Contact) and hold that during the slide away.
      if(lastClick) aimAt(lastClick.x, lastClick.y, false);
    }

    isAboutActive = nowActive;
  });

  function resize(){
    const w = container.clientWidth;
    const h = container.clientHeight;
    if(w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  resize();
  window.addEventListener("resize", resize);

  // Only track the cursor while About is the active page. While it is
  // sliding away or off-screen, the head holds its last target.
  document.addEventListener("mousemove", (e) => {
    if(!isAboutActive) return;
    aimAt(e.clientX, e.clientY, false);
  });

  function animate(){
    requestAnimationFrame(animate);
    head.rotation.y += (targetYaw - head.rotation.y) * LERP_RATE;
    head.rotation.x += (targetPitch - head.rotation.x) * LERP_RATE;
    renderer.render(scene, camera);
  }
  animate();
})();