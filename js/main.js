/* ---------- CONFIG ---------- */
const CONFIG = {

  /* Text reveal (the blur-to-sharp effect on all headings and paragraphs) */
  reveal: {
    wordStaggerMs: 45,          // delay between one word (or letter) starting and the next
    blockGapMs: 140,            // pause between one text block and the next block
    initialDelayMs: 260,        // hold before the first word starts revealing
    visibleRatio: 0.4,          // how much of a Work text block must be on screen before it reveals (0 to 1)
    stuckTimeoutMs: 2500,       // safety net: on-screen text still hidden after this long gets shown
    fallbackDurationMs: 1600,   // fade length if --reveal-duration can't be read from the CSS
    playOnceSelector: "#dump-heading, #page-about .reveal-text"   // text that reveals once, then stays visible
  },

  /* Intro screen */
  intro: {
    holdMs: 1600,               // how long the intro stays if the intro icon fails to load
    leaveMs: 900,               // slide-up time when the intro leaves (auto, or Skip)
    enterMs: 350                // slide-down time when the home button replays the intro
  },

  /* Work page: gentle snap to the start of a row */
  workSnap: {
    thresholdPx: 50,            // only snap when the scroll position is within this distance of a row start
    idleMs: 140                 // wait this long after scrolling stops before snapping
  },

  /* Work page: image cycling while hovering a project */
  projectCycle: {
    defaultDwellMs: 1500        // how long each slide shows (a slide can override with data-duration in ms)
  },

  /* Dump lightbox caption */
  lightbox: {
    captionHideMs: 2500,        // caption stays visible this long after an image opens or changes
    captionLeaveHideMs: 1200    // caption hides this long after the pointer leaves the image
  },

  /* Contact page */
  contact: {
    pulseDelayMs: 150           // pause after the text has revealed before the email address pulses
  },

  /* Animated icons (all distances are in SVG units, all times in ms) */
  icons: {

    /* Eye geometry: must match the SVG drawing */
    eye: {
      cx: 43.16,                // eye center, x
      cy: 43.16,                // eye center, y
      shellR: 25.41,            // outer radius of the ring
      shellInnerR: 22.91,       // inner radius of the ring
      coreR: 4.2                // radius of the pupil core
    },

    /* Highlight in the pupil (home and intro icons) */
    glint: {
      baseX: 2.8,               // resting position next to the pupil center, x
      baseY: -2.8,              // resting position next to the pupil center, y
      follow: 0.5,              // 0 = moves with the pupil, 1 = stays fixed on screen
      shake: 0.2,               // how much the quick little shakes affect it (0 = none)
      maxR: 4.4                 // furthest it may slide from the pupil center
    },

    /* Work icon: the three bars */
    work: {
      size: 64,                 // size of the icon drawing
      gap: 8,                   // space between the bars (must match the drawing)
      narrow: 8,                // width of the bars that are not focused
      restInset: 4,             // how much shorter the narrow bars are at top and bottom (must match the drawing)
      focusSequence: [1, 2, 0, 1],   // which bar goes wide at each step: 0 left, 1 middle, 2 right
      stepMs: 600,              // duration of each move
      returnMs: 350,            // way back to rest when the pointer leaves
      clickReturnMs: 800,       // way back to rest after the button was clicked
      ease: "cubic-bezier(.65,0,.35,1)"   // easing of every move
    },

    /* About icon: the head swinging on its neck */
    aboutHead: {
      radius: 24,               // distance from the head center to the neck pivot
      swingDeg: 30,             // angle of a swing with size 1
      lobes: [0.9, 1, 0.8, 0.65, 0.35, 0.15],   // size of each swing in order (left, right, left...); add or remove numbers for more or fewer swings
      edgeEase: 1,              // 1 = soft start and stop, lower = more even timing with a sharper start
      lean: true,               // true = head dips as it leans, false = head lifts
      durationMs: 1700,         // total time of the swinging
      samples: 60,              // smoothness of the motion (higher = smoother, heavier)
      returnMs: 300,            // way back to rest when the pointer leaves
      ease: "cubic-bezier(.37,0,.63,1)"   // easing of that way back
    },

    /* Contact icon: three dots that shrink away and pop back in */
    contactDots: {
      order: ["dot_left", "dot_mid", "dot_right"],   // ids of the dots, in the order they pop back in
      shrinkMs: 200,            // time the dots take to shrink away when hover starts
      firstMs: 400,             // when the first dot starts popping back in (keep at least shrinkMs)
      staggerMs: 350,           // delay between one dot and the next
      popMs: 550,               // time each dot takes to pop in
      peak: 1.05,               // how far a dot overshoots when it pops in (1 = no overshoot)
      samples: 70,              // smoothness of the motion (higher = smoother, heavier)
      returnMs: 300,            // way back to rest when the pointer leaves
      ease: "cubic-bezier(.25,1,.5,1)"   // easing of that way back
    },

    /* Home icon: an arrow swoops around the eye ring, then the eye looks around */
    home: {
      popMs: 200,               // arrow pops in and the ring opens
      swoopStartMs: 260,        // pause before the arrow starts to travel around
      swoopMs: 850,             // time the arrow takes to travel around
      startDeg: 57,             // where the arrow appears and ends up, degrees clockwise from 12 o'clock
      turns: 1,                 // laps the arrow makes around the ring
      gapDeg: 36,               // size of the break in the ring around the arrow
      reach: 6.5,               // how far the pupil and iris travel
      lookDelayMs: 100,         // the eye notices the arrow this long after it appears
      lookInMs: 380,            // time the eye takes to turn toward the arrow (bigger = slower)
      settleMs: 350,            // after the swoop, time the eye takes to drift away from the arrow
      idleMs: 20000,            // how long the eye keeps looking around while hovered
      lookHoldMs: 900,          // how long each look is held
      looks: [                  // directions the eye looks in, in order, on repeat (1 = full reach)
        { x: -1, y: 0 },        // left
        { x: 1, y: 0 },         // right
        { x: 0, y: 1 },         // down
        { x: 0, y: -1 }         // up
      ],
      gaze: {
        stiffness: 220,         // higher = the eye follows its target sooner
        damping: 27             // higher = less wobble and overshoot
      },
      gazeStepMs: 6,            // precision of the eye simulation (lower = smoother, heavier)
      sampleStepMs: 20,         // spacing of animation keyframes (lower = smoother, heavier)
      returnMs: 400,            // way back to rest when the pointer leaves
      ease: "cubic-bezier(.65,0,.35,1)"   // easing of that way back
    },

    /* Intro icon: a dot shrinks into the eye, which looks around, then the page slides away */
    intro: {
      speed: 1,                 // 1 = as designed, 1.3 = 30% faster overall
      shrinkStartMs: 600,       // when the dot starts shrinking into the pupil
      shrinkMs: 380,            // how long that shrink takes
      glintStartMs: 880,        // when the highlight pops in
      glintMs: 340,             // how long the highlight takes to pop in
      reach: 8,                 // how far the pupil and iris travel
      looks: [                  // where the eye looks and when (at = ms, x and y = direction, 1 = full reach)
        { at: 1250, x: 1, y: 0 },       // right
        { at: 1850, x: -1, y: 0.1 },    // left
        { at: 2450, x: 0, y: 1 }        // down
      ],
      leaveDelayMs: 100,        // the page starts sliding away this long after the last look begins
      tailMs: 800,              // the animation keeps running this long after the last look begins
      wobbleAmp: 0.12,          // size of the small drift so the eye is never perfectly on target (0 = off)
      wobbleRampMs: 300         // time the drift takes to build up after the first look
    }
  }
};

/* ---------- UTILITIES ---------- */
const DEG = Math.PI / 180;

const byId = id => document.getElementById(id);
const clamp01 = value => Math.max(0, Math.min(1, value));
const easeInOut = p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const easeInOutQuad = p => p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
const easeOutBack = (p, c1 = 1.70158) => {
  const c3 = c1 + 1;
  const q = p - 1;
  return 1 + c3 * q * q * q + c1 * q * q;
};

function lockScroll(locked){
  document.body.style.overflow = locked ? "hidden" : "";
}

function isInViewport(el){
  const r = el.getBoundingClientRect();
  return r.width > 0
    && r.bottom > 0 && r.top < window.innerHeight
    && r.right > 0 && r.left < window.innerWidth;
}

function readCssDurationMs(name, fallbackMs){
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = parseFloat(raw);
  if(Number.isNaN(value)) return fallbackMs;
  return raw.endsWith("ms") ? value : value * 1000;
}

/* ---------- DERIVED VALUES ---------- */
const {
  eye: EYE,
  glint: GLINT,
  work: WORK_ICON,
  aboutHead: ABOUT_HEAD,
  contactDots: CONTACT_DOTS,
  home: HOME_ICON,
  intro: INTRO_ICON
} = CONFIG.icons;

const REVEAL_DURATION_MS = readCssDurationMs("--reveal-duration", CONFIG.reveal.fallbackDurationMs);

const EYE_CENTER = { x: EYE.cx, y: EYE.cy };
const RING_LENGTH = 2 * Math.PI * EYE.shellR;
const CORE_START_SCALE = (EYE.shellInnerR + 0.4) / EYE.coreR;

const CONTACT_TOTAL_MS = CONTACT_DOTS.firstMs
  + (CONTACT_DOTS.order.length - 1) * CONTACT_DOTS.staggerMs
  + CONTACT_DOTS.popMs;

const HOME_COMMIT_MS = HOME_ICON.swoopStartMs + HOME_ICON.swoopMs + HOME_ICON.settleMs;
const HOME_TOTAL_MS = HOME_COMMIT_MS + HOME_ICON.idleMs;

const INTRO_LAST_LOOK_MS = INTRO_ICON.looks[INTRO_ICON.looks.length - 1].at;
const INTRO_LEAVE_AT_MS = INTRO_LAST_LOOK_MS + INTRO_ICON.leaveDelayMs;
const INTRO_TOTAL_MS = INTRO_LAST_LOOK_MS + INTRO_ICON.tailMs;

/* ---------- ELEMENTS ---------- */
const introEl = byId("intro");
const introMark = byId("intro-mark");
const introTitle = introEl.querySelector("h1");
const introSubtitle = introEl.querySelector("p");

const pagesEl = byId("pages");
const pageEls = document.querySelectorAll(".page");
const workPage = byId("page-work");
const contactPage = byId("page-contact");
const navLinks = document.querySelectorAll(".nav-link");
const contactEmail = document.querySelector(".contact-email");

/* ---------- TEXT REVEAL ---------- */
function revealFailsafe(){
  document.documentElement.classList.add("reveal-failed");
  document.querySelectorAll(".reveal-word.pending").forEach(word => word.classList.remove("pending"));
}
window.addEventListener("error", (e) => {
  if(!e.filename || e.filename.includes("main.js")) revealFailsafe();
});

function wrapUnits(el){
  const byLetter = el.classList.contains("reveal-letters");
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while(walker.nextNode()) textNodes.push(walker.currentNode);

  const makeUnit = text => {
    const span = document.createElement("span");
    span.className = "reveal-word pending";
    span.textContent = text;
    return span;
  };

  textNodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    const parts = byLetter ? Array.from(node.textContent) : node.textContent.split(/(\s+)/);
    parts.forEach(part => {
      if(part === "") return;
      fragment.appendChild(/^\s+$/.test(part) ? document.createTextNode(part) : makeUnit(part));
    });
    node.replaceWith(fragment);
  });
}
document.querySelectorAll(".reveal-text").forEach(wrapUnits);

const unitsOf = block => {
  const words = block.querySelectorAll(".reveal-word");
  return words.length ? Array.from(words) : [block];
};

const pendingTimers = new WeakMap();
const revealedOnce = new WeakSet();

function cancelReveal(el){
  const timer = pendingTimers.get(el);
  if(timer === undefined) return;
  clearTimeout(timer);
  pendingTimers.delete(el);
}

function scheduleReveal(el, delayMs){
  cancelReveal(el);
  el.style.transition = "none";
  el.classList.add("pending");
  void el.offsetWidth;
  el.style.transition = "";
  pendingTimers.set(el, setTimeout(() => {
    el.classList.remove("pending");
    pendingTimers.delete(el);
  }, delayMs));
}

function forceReveal(block){
  unitsOf(block).forEach(unit => {
    cancelReveal(unit);
    unit.classList.remove("pending");
  });
}

function hideReveal(block){
  const units = unitsOf(block);
  units.forEach(unit => {
    cancelReveal(unit);
    unit.style.transition = "none";
    unit.classList.add("pending");
  });
  void block.offsetWidth;
  units.forEach(unit => { unit.style.transition = ""; });
}

function revealGroup(elements){
  const { wordStaggerMs, blockGapMs, initialDelayMs, playOnceSelector } = CONFIG.reveal;

  const blocks = Array.from(elements).filter(block => {
    if(!block.matches(playOnceSelector)) return true;
    if(revealedOnce.has(block)) return false;
    revealedOnce.add(block);
    return true;
  });
  if(!blocks.length) return initialDelayMs + REVEAL_DURATION_MS;

  const groups = new Map();
  blocks.forEach(block => {
    const key = block.closest(".project-caption") || block;
    if(!groups.has(key)) groups.set(key, []);
    groups.get(key).push(block);
  });

  const topOf = key => groups.get(key)[0].getBoundingClientRect().top;
  const order = Array.from(groups.keys()).sort((a, b) => topOf(a) - topOf(b));

  let cursor = initialDelayMs;
  let lastFinishMs = cursor + REVEAL_DURATION_MS;

  order.forEach(key => {
    const isCaption = key.classList.contains("project-caption");
    groups.get(key).forEach(block => {
      const units = unitsOf(block);

      if(isCaption){
        units.forEach(unit => scheduleReveal(unit, cursor));
        lastFinishMs = Math.max(lastFinishMs, cursor + REVEAL_DURATION_MS);
        return;
      }

      const stagger = parseInt(block.dataset.stagger, 10) || wordStaggerMs;
      units.forEach((unit, i) => {
        const delay = cursor + i * stagger;
        scheduleReveal(unit, delay);
        lastFinishMs = Math.max(lastFinishMs, delay + REVEAL_DURATION_MS);
      });
      cursor += units.length * stagger + blockGapMs;
    });
  });

  return lastFinishMs;
}

const stuckSince = new WeakMap();
setInterval(() => {
  const now = performance.now();
  document.querySelectorAll(".reveal-word.pending").forEach(word => {
    if(pendingTimers.has(word)) return;
    if(!isInViewport(word)){
      stuckSince.delete(word);
      return;
    }
    const since = stuckSince.get(word) ?? now;
    stuckSince.set(word, since);
    if(now - since > CONFIG.reveal.stuckTimeoutMs){
      word.classList.remove("pending");
      stuckSince.delete(word);
    }
  });
}, 1000);

const workObserver = new IntersectionObserver((entries) => {
  const toReveal = [];
  entries.forEach(entry => {
    const block = entry.target;
    if(entry.isIntersecting && entry.intersectionRatio >= CONFIG.reveal.visibleRatio){
      toReveal.push(block);
    } else if(!entry.isIntersecting && !revealedOnce.has(block)){
      hideReveal(block);
    }
  });
  if(toReveal.length) revealGroup(toReveal);
}, { threshold: [0, CONFIG.reveal.visibleRatio] });

let workRevealStarted = false;
function startWorkReveal(){
  if(workRevealStarted) return;
  workRevealStarted = true;
  workPage.querySelectorAll(".reveal-text").forEach(el => workObserver.observe(el));
}

/* ---------- ICON MOTION: SHARED ---------- */
async function inlineIcon(img){
  try{
    const res = await fetch(img.src);
    if(!res.ok) throw new Error(res.status);
    const doc = new DOMParser().parseFromString(await res.text(), "image/svg+xml");
    if(doc.documentElement.nodeName !== "svg") throw new Error("not an svg");
    const svg = document.importNode(doc.documentElement, true);
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("class", img.className);
    svg.setAttribute("aria-hidden", "true");
    svg.dataset.icon = img.dataset.icon;
    img.replaceWith(svg);
    return svg;
  }catch(err){
    console.warn("Icon could not be inlined, keeping static image:", img.src, err);
    return null;
  }
}

function centerOf(el){
  try{
    const b = el.getBBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }catch(err){
    return { x: 0, y: 0 };
  }
}

function boxTransform(el, box){
  const b = el.getBBox();
  const sx = box.w / b.width;
  const sy = box.h / b.height;
  return `translate(${box.x - b.x * sx}px, ${box.y - b.y * sy}px) scale(${sx}, ${sy})`;
}

function motionTransform(m, center){
  const list = [];
  if(m.dx !== undefined || m.dy !== undefined){
    list.push(`translate(${(m.dx || 0).toFixed(3)}px, ${(m.dy || 0).toFixed(3)}px)`);
  }
  if(m.rotate !== undefined){
    const o = m.origin || center;
    list.push(`translate(${o.x}px, ${o.y}px) rotate(${m.rotate.toFixed(3)}deg) translate(${-o.x}px, ${-o.y}px)`);
  }
  if(m.scale !== undefined){
    list.push(`translate(${center.x}px, ${center.y}px) scale(${m.scale.toFixed(4)}) translate(${-center.x}px, ${-center.y}px)`);
  }
  return list.length ? list.join(" ") : "none";
}

function motionProps(m, center){
  const props = {};
  if(m.dx !== undefined || m.dy !== undefined || m.rotate !== undefined || m.scale !== undefined){
    props.transform = motionTransform(m, center);
  }
  if(m.opacity !== undefined) props.opacity = m.opacity.toFixed(4);
  if(m.dash !== undefined) props.strokeDasharray = `${m.dash[0].toFixed(3)}px ${m.dash[1].toFixed(3)}px`;
  return props;
}

const wobble = (ms, amp) => ({
  x: amp * (Math.sin(ms * 0.011) + 0.6 * Math.sin(ms * 0.027 + 1.3)),
  y: amp * (Math.cos(ms * 0.013 + 0.7) + 0.6 * Math.sin(ms * 0.031))
});

function makeGazeTrack(totalMs, targetAt, { stiffness = 240, damping = 21, steps = 320, slowMs = 180 } = {}){
  const dt = totalMs / steps;
  const s = dt / 1000;
  const k = 1 - Math.exp(-dt / slowMs);
  let x = 0, y = 0, vx = 0, vy = 0, sx = 0, sy = 0;
  const table = [{ x, y }];
  const slowTable = [{ x: 0, y: 0 }];

  for(let i = 1; i <= steps; i++){
    const target = targetAt(i * dt);
    vx += (stiffness * (target.x - x) - damping * vx) * s;
    vy += (stiffness * (target.y - y) - damping * vy) * s;
    x += vx * s;
    y += vy * s;
    sx += (x - sx) * k;
    sy += (y - sy) * k;
    table.push({ x, y });
    slowTable.push({ x: sx, y: sy });
  }

  const reader = tbl => ms => {
    const f = clamp01(ms / totalMs) * steps;
    const i = Math.min(steps - 1, Math.floor(f));
    const p = f - i;
    return {
      x: tbl[i].x + (tbl[i + 1].x - tbl[i].x) * p,
      y: tbl[i].y + (tbl[i + 1].y - tbl[i].y) * p
    };
  };
  const gaze = reader(table);
  gaze.slow = reader(slowTable);
  return gaze;
}

function glintShift(gaze, slow){
  const sx = slow.x + GLINT.shake * (gaze.x - slow.x);
  const sy = slow.y + GLINT.shake * (gaze.y - slow.y);
  let px = GLINT.baseX - GLINT.follow * sx;
  let py = GLINT.baseY - GLINT.follow * sy;
  const len = Math.hypot(px, py);
  if(len > GLINT.maxR){
    px *= GLINT.maxR / len;
    py *= GLINT.maxR / len;
  }
  return { x: px - GLINT.baseX, y: py - GLINT.baseY };
}

/* ---------- ICON MOTION: WORK ---------- */
function focusBoxes(focus){
  const { size, gap, narrow, restInset } = WORK_ICON;
  const wide = size - 2 * narrow - 2 * gap;
  const boxes = {};
  let x = 0;
  ["bar_left", "bar_middle", "bar_right"].forEach((id, i) => {
    const isFocus = i === focus;
    const w = isFocus ? wide : narrow;
    boxes[id] = isFocus
      ? { x, y: 0, w, h: size }
      : { x, y: restInset, w, h: size - 2 * restInset };
    x += w + gap;
  });
  return boxes;
}

/* ---------- ICON MOTION: ABOUT ---------- */
function lobeEnvelope(tau, lobes){
  const n = lobes.length;
  const pos = tau * n - 0.5;
  if(pos <= 0) return lobes[0];
  if(pos >= n - 1) return lobes[n - 1];
  const i = Math.floor(pos);
  const f = pos - i;
  const s = (1 - Math.cos(Math.PI * f)) / 2;
  return lobes[i] + (lobes[i + 1] - lobes[i]) * s;
}

function headSwing(t){
  const a = ABOUT_HEAD;
  const smooth = t * t * (3 - 2 * t);
  const tau = t + a.edgeEase * (smooth - t);
  const theta = -a.swingDeg * DEG
              * lobeEnvelope(tau, a.lobes)
              * Math.sin(a.lobes.length * Math.PI * tau);
  return {
    dx: a.radius * Math.sin(theta),
    dy: a.radius * (1 - Math.cos(theta)) * (a.lean ? 1 : -1)
  };
}

/* ---------- ICON MOTION: CONTACT ---------- */
function popCurve(p, peak){
  if(p < 0.6){
    const q = p / 0.6;
    return peak * (1 - Math.pow(1 - q, 3));
  }
  const q = (p - 0.6) / 0.4;
  return peak + (1 - peak) * (1 - Math.cos(Math.PI * q)) / 2;
}

function dotPop(id, t){
  const c = CONTACT_DOTS;
  const i = c.order.indexOf(id);
  if(i < 0) return null;

  const ms = t * CONTACT_TOTAL_MS;
  const start = c.firstMs + i * c.staggerMs;
  let scale;
  if(ms < c.shrinkMs){
    const p = ms / c.shrinkMs;
    scale = 1 - p * p;
  } else if(ms < start){
    scale = 0;
  } else {
    scale = popCurve(Math.min(1, (ms - start) / c.popMs), c.peak);
  }
  return { scale: Math.max(scale, 0.001) };
}

/* ---------- ICON MOTION: HOME ---------- */
function idleLook(ms){
  const h = HOME_ICON;
  return h.looks[Math.floor(Math.max(ms, 0) / h.lookHoldMs) % h.looks.length];
}

function arrowDeg(ms){
  const h = HOME_ICON;
  return h.startDeg + 360 * h.turns * easeInOutQuad(clamp01((ms - h.swoopStartMs) / h.swoopMs));
}

const homeGaze = makeGazeTrack(HOME_TOTAL_MS, ms => {
  const h = HOME_ICON;
  const swoopEnd = h.swoopStartMs + h.swoopMs;

  const appear = easeInOut(clamp01((ms - h.lookDelayMs) / h.lookInMs));
  const a = arrowDeg(ms) * DEG;
  const fx = h.reach * appear * Math.sin(a);
  const fy = -h.reach * appear * Math.cos(a);

  const calm = easeInOut(clamp01((ms - swoopEnd) / h.settleMs));
  const idle = idleLook(ms - swoopEnd);
  return {
    x: fx + (idle.x * h.reach - fx) * calm,
    y: fy + (idle.y * h.reach - fy) * calm
  };
}, { ...HOME_ICON.gaze, steps: Math.round(HOME_TOTAL_MS / HOME_ICON.gazeStepMs) });

function homeIconMotion(id, t){
  const h = HOME_ICON;
  const ms = t * HOME_TOTAL_MS;
  const open = easeInOut(clamp01(ms / h.popMs));
  const psi = arrowDeg(ms);

  if(id === "gaze"){
    const g = homeGaze(ms);
    return { dx: g.x, dy: g.y };
  }
  if(id === "glint"){
    const s = glintShift(homeGaze(ms), homeGaze.slow(ms));
    return { dx: s.x, dy: s.y };
  }
  if(id === "shell"){
    return { opacity: ms <= 0 ? 1 : 0 };
  }
  if(id === "shell_gap"){
    const gapUnits = Math.max(h.gapDeg * DEG * EYE.shellR * open, 0.01);
    const gapDegNow = gapUnits / EYE.shellR / DEG;
    return {
      opacity: ms <= 0 ? 0 : 1,
      dash: [RING_LENGTH - gapUnits, gapUnits],
      rotate: (psi - 8) - 90 + gapDegNow / 2,
      origin: EYE_CENTER
    };
  }
  if(id === "arrow"){
    return {
      opacity: clamp01(ms / (h.popMs * 0.5)),
      scale: Math.max(easeOutBack(clamp01(ms / h.popMs)), 0.001),
      rotate: psi,
      origin: EYE_CENTER
    };
  }
  return null;
}

function homeRestMotion(id, now){
  if(id === "arrow")     return { opacity: 0, scale: 0.001, rotate: now.rotate, origin: now.origin };
  if(id === "shell_gap") return { opacity: 0, dash: [RING_LENGTH - 0.01, 0.01], rotate: now.rotate, origin: now.origin };
  if(id === "shell")     return { opacity: 1 };
  if(id === "gaze" || id === "glint") return { dx: 0, dy: 0 };
  return null;
}

/* ---------- ICON MOTION: INTRO ---------- */
const introGaze = makeGazeTrack(INTRO_TOTAL_MS, ms => {
  const e = INTRO_ICON;
  let look = { x: 0, y: 0 };
  for(const l of e.looks){
    if(ms >= l.at) look = l;
  }
  const w = wobble(ms, e.wobbleAmp * clamp01((ms - e.looks[0].at) / e.wobbleRampMs));
  return { x: e.reach * look.x + w.x, y: e.reach * look.y + w.y };
});

function introIconMotion(id, t){
  const e = INTRO_ICON;
  const ms = t * INTRO_TOTAL_MS;

  if(id === "core"){
    const p = clamp01((ms - e.shrinkStartMs) / e.shrinkMs);
    return { scale: CORE_START_SCALE + (1 - CORE_START_SCALE) * easeOutBack(p, 0.9) };
  }
  if(id === "gaze"){
    const g = introGaze(ms);
    return { dx: g.x, dy: g.y };
  }
  if(id === "glint"){
    const s = glintShift(introGaze(ms), introGaze.slow(ms));
    return {
      dx: s.x,
      dy: s.y,
      scale: Math.max(easeOutBack(clamp01((ms - e.glintStartMs) / e.glintMs)), 0.001)
    };
  }
  return null;
}

const svgTransform = css => css.replace(/px/g, "").replace(/deg/g, "");

let introRaf = null;
function stopIntroIcon(){
  cancelAnimationFrame(introRaf);
  introRaf = null;
}

function runIntroIcon(svg){
  stopIntroIcon();
  const duration = INTRO_TOTAL_MS / INTRO_ICON.speed;
  const parts = [];
  svg.querySelectorAll("[id]").forEach(el => {
    if(introIconMotion(el.id, 0)) parts.push({ el, center: centerOf(el) });
  });

  function apply(t){
    parts.forEach(({ el, center }) => {
      const props = motionProps(introIconMotion(el.id, t), center);
      if(props.transform) el.setAttribute("transform", svgTransform(props.transform));
      if(props.opacity !== undefined) el.setAttribute("opacity", props.opacity);
    });
  }

  const t0 = performance.now();
  apply(0);
  function frame(now){
    const t = clamp01((now - t0) / duration);
    apply(t);
    if(t < 1) introRaf = requestAnimationFrame(frame);
  }
  introRaf = requestAnimationFrame(frame);
}

/* ---------- NAV ICONS: HOVER ANIMATION ---------- */
const ICON_ANIMATIONS = {
  work: {
    hold: true,
    stepMs: WORK_ICON.stepMs,
    returnMs: WORK_ICON.returnMs,
    clickReturnMs: WORK_ICON.clickReturnMs,
    ease: WORK_ICON.ease,
    steps: WORK_ICON.focusSequence.map(focusBoxes)
  },
  about: {
    motion: (id, t) => id === "head" ? headSwing(t) : null,
    durationMs: ABOUT_HEAD.durationMs,
    samples: ABOUT_HEAD.samples,
    returnMs: ABOUT_HEAD.returnMs,
    ease: ABOUT_HEAD.ease
  },
  contact: {
    motion: dotPop,
    durationMs: CONTACT_TOTAL_MS,
    samples: CONTACT_DOTS.samples,
    returnMs: CONTACT_DOTS.returnMs,
    ease: CONTACT_DOTS.ease
  },
  home: {
    motion: homeIconMotion,
    restMotion: homeRestMotion,
    hold: true,
    durationMs: HOME_TOTAL_MS,
    commitMs: HOME_COMMIT_MS,
    samples: Math.round(HOME_TOTAL_MS / HOME_ICON.sampleStepMs),
    returnMs: HOME_ICON.returnMs,
    ease: HOME_ICON.ease
  }
};

function setupIconHover(svg, button, anim){
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const parts = Array.from(svg.querySelectorAll("[id]"));
  const fill = anim.hold ? "forwards" : "none";
  const stepCount = anim.steps ? anim.steps.length : 0;
  const mainMs = anim.commitMs || (anim.motion ? anim.durationMs : anim.stepMs * stepCount);

  let running = [];
  let hovering = false;
  let committed = false;
  let clicked = false;
  let phase = "idle";
  let playStart = 0;
  let commitTimer = null;

  const isPlaying = () => running.some(a => a.playState === "running");
  const returnTime = () => (clicked && anim.clickReturnMs) || anim.returnMs;

  function stopRunning(){
    clearTimeout(commitTimer);
    running.forEach(a => a.cancel());
    running = [];
  }

  function restProps(el, center){
    if(!anim.motion) return { transform: "none" };
    const m = anim.motion(el.id, 0);
    return m ? motionProps(m, center) : null;
  }

  function liveProps(el, props){
    const cs = getComputedStyle(el);
    const out = {};
    Object.keys(props).forEach(key => { out[key] = cs[key]; });
    return out;
  }

  function motionAnimation(el, center, from){
    const samples = anim.samples || 60;
    const frames = [{ ...from, offset: 0, easing: "linear" }];
    for(let k = 1; k <= samples; k++){
      const t = k / samples;
      frames.push({ ...motionProps(anim.motion(el.id, t), center), offset: t, easing: "linear" });
    }
    return el.animate(frames, { duration: anim.durationMs, fill });
  }

  function sequenceAnimation(el, from){
    const frames = [{ ...from, offset: 0 }];
    anim.steps.forEach((boxes, s) => {
      const box = boxes[el.id];
      frames.push({ transform: box ? boxTransform(el, box) : "none", offset: (s + 1) / stepCount });
    });
    frames.forEach(frame => { frame.easing = anim.ease; });
    return el.animate(frames, { duration: anim.stepMs * stepCount, fill });
  }

  function play(){
    const centers = parts.map(centerOf);
    const rests = parts.map((el, i) => restProps(el, centers[i]));
    const froms = parts.map((el, i) => {
      if(!rests[i]) return null;
      const mid = anim.motion && anim.motion(el.id, 0.5);
      return (mid && mid.rotate !== undefined) ? rests[i] : liveProps(el, rests[i]);
    });

    stopRunning();
    committed = false;
    clicked = false;
    phase = "play";
    playStart = performance.now();

    parts.forEach((el, i) => {
      if(!rests[i]) return;
      running.push(anim.motion
        ? motionAnimation(el, centers[i], froms[i])
        : sequenceAnimation(el, froms[i]));
    });

    Promise.all(running.map(a => a.finished)).then(settle).catch(() => {});
  }

  function rest(ms = anim.returnMs){
    const centers = parts.map(centerOf);
    const returns = [];

    if(anim.motion && anim.restMotion && phase === "play" && running.length){
      const current = running[0].currentTime;
      const tNow = clamp01((current == null ? 0 : current) / anim.durationMs);
      parts.forEach((el, i) => {
        const now = anim.motion(el.id, tNow);
        const target = now && anim.restMotion(el.id, now);
        if(target) returns.push({ el, from: motionProps(now, centers[i]), to: motionProps(target, centers[i]) });
      });
    } else {
      const rests = parts.map((el, i) => restProps(el, centers[i]));
      parts.forEach((el, i) => {
        if(rests[i]) returns.push({ el, from: liveProps(el, rests[i]), to: rests[i] });
      });
    }

    stopRunning();
    returns.forEach(({ el, from, to }) => {
      running.push(el.animate([from, to], { duration: ms, easing: anim.ease }));
    });
    phase = "rest";
  }

  function settle(){
    committed = false;
    if(hovering) return;
    rest(returnTime());
    clicked = false;
  }

  function enter(){
    hovering = true;
    play();
  }

  function leave(){
    hovering = false;
    if(committed){
      const remaining = mainMs - (performance.now() - playStart);
      if(remaining > 30){
        clearTimeout(commitTimer);
        commitTimer = setTimeout(settle, remaining);
        return;
      }
    }
    settle();
  }

  button.addEventListener("mouseenter", () => {
    if(window.matchMedia("(hover: hover)").matches) enter();
  });
  button.addEventListener("mouseleave", leave);
  button.addEventListener("focus", () => { if(button.matches(":focus-visible")) enter(); });
  button.addEventListener("blur", leave);
  button.addEventListener("click", () => {
    if(!hovering) play();
    clicked = true;
    committed = isPlaying();
  });
}

document.querySelectorAll("img.nav-icon[data-icon]").forEach(async img => {
  const anim = ICON_ANIMATIONS[img.dataset.icon];
  const button = img.closest("button");
  const svg = await inlineIcon(img);
  if(svg && anim) setupIconHover(svg, button, anim);
});

/* ---------- PAGE NAVIGATION ---------- */
let currentPage = 0;
let emailPulseTimer = null;

function goToPage(index){
  if(index === currentPage){
    if(index === 0) workPage.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  currentPage = index;
  pagesEl.style.setProperty("--i", index);
  navLinks.forEach(btn => btn.classList.toggle("active", Number(btn.dataset.page) === index));
  document.dispatchEvent(new CustomEvent("pagechange", { detail: { index } }));

  const page = pageEls[index];
  if(page === workPage) return;

  const finishMs = revealGroup(page.querySelectorAll(".reveal-text"));
  if(page === contactPage){
    clearTimeout(emailPulseTimer);
    contactEmail.classList.remove("pulse");
    emailPulseTimer = setTimeout(() => contactEmail.classList.add("pulse"), finishMs + CONFIG.contact.pulseDelayMs);
  }
}
navLinks.forEach(btn => btn.addEventListener("click", () => goToPage(Number(btn.dataset.page))));

/* ---------- NAV PILLS ---------- */
const siteNav = byId("site-nav");
const navPill = byId("nav-pill");
const navHover = byId("nav-hover");

let hoverItem = null;
let hoverShown = false;

function placePill(pill, li, animate){
  if(!animate) pill.style.transition = "none";
  const r = li.getBoundingClientRect();
  const n = siteNav.getBoundingClientRect();
  pill.style.width = r.width + "px";
  pill.style.transform = `translateX(${r.left - n.left}px)`;
  if(!animate){
    void pill.offsetWidth;
    pill.style.transition = "";
  }
}

function moveNavPill(animate = true){
  const active = siteNav.querySelector(".nav-link.active");
  if(active) placePill(navPill, active.parentElement, animate);
}

function setHoverClass(li){
  siteNav.querySelectorAll("li.is-hover").forEach(el => el.classList.remove("is-hover"));
  if(li) li.classList.add("is-hover");
}

function showHover(li){
  placePill(navHover, li, hoverShown);
  navHover.style.opacity = "1";
  setHoverClass(li);
  hoverShown = true;
  hoverItem = li;
}

function hideHover(){
  navHover.style.opacity = "0";
  setHoverClass(null);
  hoverShown = false;
}

function relayoutNav(){
  moveNavPill(false);
  if(hoverShown && hoverItem) placePill(navHover, hoverItem, false);
}

const navObserver = new MutationObserver(() => moveNavPill(true));
navLinks.forEach(btn => navObserver.observe(btn, { attributes: true, attributeFilter: ["class"] }));

siteNav.addEventListener("pointermove", (e) => {
  if(e.pointerType !== "mouse") return;
  const li = e.target.closest("li");
  if(li) showHover(li);
});
siteNav.addEventListener("pointerleave", hideHover);
siteNav.addEventListener("focusin", (e) => {
  const btn = e.target.closest(".nav-link");
  if(btn && btn.matches(":focus-visible")) showHover(btn.parentElement);
});
siteNav.addEventListener("focusout", hideHover);

window.addEventListener("resize", relayoutNav);
moveNavPill(false);
if(document.fonts && document.fonts.ready) document.fonts.ready.then(relayoutNav);

/* ---------- INTRO ---------- */
let introIconSvg = null;
let introLeaveTimer = null;
let introCleanupTimer = null;

function setIntroSlideMs(ms){
  introEl.style.setProperty("--intro-slide-ms", ms + "ms");
}

function startIntroSequence(){
  clearTimeout(introLeaveTimer);
  requestAnimationFrame(() => introMark.classList.add("visible"));
  revealGroup([introTitle, introSubtitle]);

  let leaveAfterMs = CONFIG.intro.holdMs;
  if(introIconSvg){
    runIntroIcon(introIconSvg);
    leaveAfterMs = INTRO_LEAVE_AT_MS / INTRO_ICON.speed;
  }
  introLeaveTimer = setTimeout(leaveIntro, leaveAfterMs);
}

function leaveIntro(){
  clearTimeout(introLeaveTimer);
  clearTimeout(introCleanupTimer);
  forceReveal(introTitle);
  forceReveal(introSubtitle);

  setIntroSlideMs(CONFIG.intro.leaveMs);
  introEl.classList.add("leaving");
  startWorkReveal();

  introCleanupTimer = setTimeout(() => {
    introEl.style.display = "none";
    stopIntroIcon();
  }, CONFIG.intro.leaveMs + 50);
}

function replayIntro(){
  forceReveal(introTitle);
  forceReveal(introSubtitle);

  workPage.scrollTo({ top: 0, behavior: "instant" });
  goToPage(0);

  clearTimeout(introCleanupTimer);
  setIntroSlideMs(CONFIG.intro.enterMs);
  introEl.style.display = "flex";
  void introEl.offsetWidth;
  introEl.classList.remove("leaving");

  introMark.classList.remove("visible");
  void introMark.offsetWidth;
  startIntroSequence();
}

window.addEventListener("load", async () => {
  const iconImg = byId("intro-icon");
  if(iconImg) introIconSvg = await inlineIcon(iconImg);
  startIntroSequence();
});
byId("skip-intro").addEventListener("click", leaveIntro);
byId("logo-btn").addEventListener("click", replayIntro);

/* ---------- WORK: SCROLL SNAP ---------- */
const workRows = Array.from(workPage.querySelectorAll(".work-row"));
let snapTimer = null;

function snapToNearestRow(){
  const position = workPage.scrollTop;
  let closest = null;
  let minDistance = Infinity;
  workRows.forEach(row => {
    const distance = Math.abs(row.offsetTop - position);
    if(distance < minDistance){
      minDistance = distance;
      closest = row.offsetTop;
    }
  });
  if(closest !== null && minDistance > 2 && minDistance < CONFIG.workSnap.thresholdPx){
    workPage.scrollTo({ top: closest, behavior: "smooth" });
  }
}

workPage.addEventListener("scroll", () => {
  clearTimeout(snapTimer);
  snapTimer = setTimeout(snapToNearestRow, CONFIG.workSnap.idleMs);
});

/* ---------- WORK: PROJECT CARDS ---------- */
const overlay = byId("overlay");
const overlayTitle = byId("overlay-title");
const overlayBody = byId("overlay-body");

function setupProject(project){
  const slides = Array.from(project.querySelectorAll(".project-frame img, .project-frame video"));
  const dotsEl = project.querySelector(".dots");
  const dots = slides.map(() => dotsEl.appendChild(document.createElement("span")));
  let index = 0;
  let cycleTimer = null;

  function setDots(i){
    dots.forEach((dot, n) => dot.classList.toggle("active", n === i));
  }

  function show(i){
    slides.forEach((slide, n) => {
      slide.classList.toggle("active", n === i);
      if(slide.tagName === "VIDEO" && n !== i) slide.pause();
    });
    setDots(i);

    const active = slides[i];
    if(active.tagName === "VIDEO"){
      active.currentTime = 0;
      active.play().catch(() => {});
    }
  }

  function scheduleNext(){
    clearTimeout(cycleTimer);
    if(slides.length < 2) return;
    const dwellMs = parseInt(slides[index].dataset.duration, 10) || CONFIG.projectCycle.defaultDwellMs;
    cycleTimer = setTimeout(() => {
      index = (index + 1) % slides.length;
      show(index);
      scheduleNext();
    }, dwellMs);
  }

  setDots(0);

  project.addEventListener("mouseenter", () => {
    if(window.matchMedia("(hover: hover)").matches) scheduleNext();
  });
  project.addEventListener("mouseleave", () => {
    clearTimeout(cycleTimer);
    index = 0;
    show(0);
  });
  project.addEventListener("click", () => openOverlay(project));
}
document.querySelectorAll(".project").forEach(setupProject);

function openOverlay(project){
  const title = project.querySelector(".project-caption h2").innerText.replace(/\n/g, " ");
  const role = project.querySelector(".project-caption > span").innerText.replace(/\n/g, " ");

  overlayTitle.textContent = title;
  overlayBody.innerHTML = "";

  project.querySelectorAll(".project-frame img").forEach(img => {
    const clone = document.createElement("img");
    clone.src = img.src;
    overlayBody.appendChild(clone);
  });

  const textBlock = document.createElement("div");
  textBlock.className = "overlay-text";
  textBlock.textContent = role + " — full write-up goes here: process, context, and outcome for this project.";
  overlayBody.appendChild(textBlock);

  overlay.classList.add("open");
  lockScroll(true);
}

function closeOverlay(){
  overlay.classList.remove("open");
  lockScroll(false);
}
byId("close-overlay").addEventListener("click", closeOverlay);

/* ---------- WORK: DUMP LIGHTBOX ---------- */
const dumpImages = Array.from(document.querySelectorAll(".dump-grid img"));
const lightbox = byId("dump-lightbox");
const lightboxImg = byId("lightbox-img");
const lightboxTitle = byId("lightbox-title");
const lightboxInfo = byId("lightbox-info");
const lightboxCaption = byId("lightbox-caption");
const lightboxImageWrap = document.querySelector(".lightbox-image-wrap");

let dumpIndex = 0;
let captionTimer = null;

function hideCaptionAfter(ms){
  clearTimeout(captionTimer);
  captionTimer = setTimeout(() => lightboxCaption.classList.add("hidden"), ms);
}

function showCaption(){
  lightboxCaption.classList.remove("hidden");
  hideCaptionAfter(CONFIG.lightbox.captionHideMs);
}

function updateLightbox(){
  const img = dumpImages[dumpIndex];
  lightboxImg.src = img.src;
  lightboxTitle.textContent = img.dataset.title || "";
  lightboxInfo.textContent = img.dataset.info || "";
  showCaption();
}

function openLightbox(i){
  dumpIndex = i;
  updateLightbox();
  lightbox.classList.add("open");
  lockScroll(true);
}

function closeLightbox(){
  lightbox.classList.remove("open");
  lockScroll(false);
  clearTimeout(captionTimer);
}

function stepLightbox(delta){
  dumpIndex = (dumpIndex + delta + dumpImages.length) % dumpImages.length;
  updateLightbox();
}

dumpImages.forEach((img, i) => img.addEventListener("click", () => openLightbox(i)));
byId("lightbox-close").addEventListener("click", closeLightbox);
byId("lightbox-prev").addEventListener("click", () => stepLightbox(-1));
byId("lightbox-next").addEventListener("click", () => stepLightbox(1));

lightbox.addEventListener("click", (e) => {
  if(e.target === lightbox) closeLightbox();
});

lightboxImageWrap.addEventListener("mouseenter", () => {
  clearTimeout(captionTimer);
  lightboxCaption.classList.remove("hidden");
});
lightboxImageWrap.addEventListener("mouseleave", () => hideCaptionAfter(CONFIG.lightbox.captionLeaveHideMs));

document.addEventListener("keydown", (e) => {
  if(!lightbox.classList.contains("open")) return;
  if(e.key === "Escape") closeLightbox();
  if(e.key === "ArrowLeft") stepLightbox(-1);
  if(e.key === "ArrowRight") stepLightbox(1);
});

/* ---------- ABOUT ---------- */
const aboutText = document.querySelector(".about-text");
const aboutDivider = document.querySelector(".about-divider");
const faqItems = Array.from(document.querySelectorAll(".faq-item"));

function syncAboutDivider(){
  aboutDivider.style.height = aboutText.offsetHeight + "px";
}
syncAboutDivider();
new ResizeObserver(syncAboutDivider).observe(aboutText);

function setFaqOpen(item, open){
  const answer = item.querySelector(".faq-a");
  item.classList.toggle("open", open);
  answer.style.maxHeight = open ? answer.scrollHeight + "px" : "0px";
}

faqItems.forEach(item => {
  item.querySelector(".faq-q").addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");
    faqItems.forEach(other => { if(other !== item) setFaqOpen(other, false); });
    setFaqOpen(item, willOpen);
  });
});

/* ---------- CONTACT FORM ---------- */
const contactForm = byId("contact-form");
const contactStatus = byId("cf-status");
const contactMessage = byId("cf-message");
const contactAddress = contactEmail.getAttribute("href").replace(/^mailto:/, "");

function autoGrowMessage(){
  contactMessage.style.height = "auto";
  contactMessage.style.height = contactMessage.scrollHeight + "px";
}
contactMessage.addEventListener("input", autoGrowMessage);
autoGrowMessage();

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = byId("cf-name").value;
  const email = byId("cf-email").value;

  const subject = encodeURIComponent("Portfolio contact from " + name);
  const body = encodeURIComponent(contactMessage.value + "\n\n— " + name + " (" + email + ")");
  window.location.href = "mailto:" + contactAddress + "?subject=" + subject + "&body=" + body;

  contactStatus.textContent = "Opening your mail app…";
});
