const WORD_STAGGER_MS = 45;           // default pace of the flow within one sentence
const BLOCK_GAP_MS = 140;             // default pause between one text block finishing and the next
const REVEAL_INITIAL_DELAY_MS = 260;  // brief hold before anything starts un-blurring

const INTRO_HOLD_MS = 1600;
const INTRO_LEAVE_MS = 1150;  // slow, unhurried — auto-advance, skip button
const INTRO_ENTER_MS = 350;   // fast, responsive — logo/home button replay

const REVEAL_DURATION_MS = parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue("--reveal-duration")
) * 1000 || 1600;

/* ---------- Failsafe: never leave text hidden ---------- */
function revealFailsafe(){
  document.documentElement.classList.add("reveal-failed");
  document.querySelectorAll(".reveal-word.pending").forEach(w => w.classList.remove("pending"));
}
// Any error thrown from this file turns the effect off and shows all text.
window.addEventListener("error", (e) => {
  if(!e.filename || e.filename.includes("main.js")) revealFailsafe();
});

/* ---------- Word/letter wrapping ---------- */
function wrapUnits(el){
  const byLetter = el.classList.contains("reveal-letters");
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while(node = walker.nextNode()) textNodes.push(node);

  textNodes.forEach(textNode => {
    const frag = document.createDocumentFragment();

    if(byLetter){
      Array.from(textNode.textContent).forEach(ch => {
        if(ch === " "){
          frag.appendChild(document.createTextNode(ch));
        } else {
          const span = document.createElement("span");
          span.className = "reveal-word pending";
          span.textContent = ch;
          frag.appendChild(span);
        }
      });
    } else {
      textNode.textContent.split(/(\s+)/).forEach(part => {
        if(part === "") return;
        if(/^\s+$/.test(part)){
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement("span");
          span.className = "reveal-word pending";
          span.textContent = part;
          frag.appendChild(span);
        }
      });
    }

    textNode.parentNode.replaceChild(frag, textNode);
  });
}
document.querySelectorAll(".reveal-text").forEach(wrapUnits);

/* ---------- Reveal scheduling ---------- */
const pendingTimers = new WeakMap();

function scheduleReveal(el, delayMs){
  const existing = pendingTimers.get(el);
  if(existing) clearTimeout(existing);

  el.style.transition = "none";
  el.classList.add("pending");
  void el.offsetWidth;
  el.style.transition = "";

  const timerId = setTimeout(() => {
    el.classList.remove("pending");
    pendingTimers.delete(el);
  }, delayMs);
  pendingTimers.set(el, timerId);
}

function forceReveal(blockEl){
  const words = blockEl.querySelectorAll(".reveal-word");
  const targets = words.length ? Array.from(words) : [blockEl];
  targets.forEach(w => {
    const existing = pendingTimers.get(w);
    if(existing){ clearTimeout(existing); pendingTimers.delete(w); }
    w.classList.remove("pending");
  });
}

// Instantly re-hides a block (no fade-out), used when it has left the
// viewport so it is already invisible the next time it scrolls into view.
function hideReveal(blockEl){
  const words = blockEl.querySelectorAll(".reveal-word");
  const targets = words.length ? Array.from(words) : [blockEl];
  targets.forEach(w => {
    const existing = pendingTimers.get(w);
    if(existing){ clearTimeout(existing); pendingTimers.delete(w); }
    w.style.transition = "none";
    w.classList.add("pending");
  });
  void blockEl.offsetWidth;
  targets.forEach(w => { w.style.transition = ""; });
}

// Catches the quieter failure: a word that is on screen, hidden, and has
// no reveal scheduled (observer didn't fire, timer got lost). After 2.5s
// it just shows it.
const stuckSince = new WeakMap();
setInterval(() => {
  const now = performance.now();
  document.querySelectorAll(".reveal-word.pending").forEach(w => {
    if(pendingTimers.has(w)) return;  // a reveal is coming, leave it
    const r = w.getBoundingClientRect();
    const inView = r.width > 0 && r.bottom > 0 && r.top < window.innerHeight
                && r.right > 0 && r.left < window.innerWidth;
    if(!inView){ stuckSince.delete(w); return; }
    const since = stuckSince.get(w) ?? now;
    stuckSince.set(w, since);
    if(now - since > 2500){
      w.classList.remove("pending");
      stuckSince.delete(w);
    }
  });
}, 1000);

// Text matching this selector fades in once, then stays visible until
// the page is refreshed. Add more selectors here to extend it.
const REVEAL_ONCE_SELECTOR = "#dump-heading, #page-about .reveal-text";
const revealedOnce = new WeakSet();

// Blocks sharing a .project-caption ancestor (a Work page title + its
// description) are grouped and revealed together, all at once — and
// crucially, ALL such caption groups in one batch share the same
// moment too (no stagger between different projects), since a slight
// gap between them was reading as "desynced" even though it was
// intentional. Everything else (About/Contact text, the dump heading)
// flows normally: word by word or letter by letter, using its own
// data-stagger if set. Returns the time (ms) at which the last unit
// finishes fading in, so callers can schedule something for after.
function revealGroup(elements){
  const els = Array.from(elements).filter(el => {
    if(!el.matches(REVEAL_ONCE_SELECTOR)) return true;  // normal: replays every time
    if(revealedOnce.has(el)) return false;              // already played, leave it visible
    revealedOnce.add(el);
    return true;
  });
  if(!els.length) return REVEAL_INITIAL_DELAY_MS + REVEAL_DURATION_MS;

  const groups = new Map();
  const order = [];
  els.forEach(el => {
    const caption = el.closest(".project-caption");
    const key = caption || el;
    if(!groups.has(key)){ groups.set(key, []); order.push(key); }
    groups.get(key).push(el);
  });

  order.sort((a, b) => {
    const topOf = k => groups.get(k)[0].getBoundingClientRect().top;
    return topOf(a) - topOf(b);
  });

  let cursor = REVEAL_INITIAL_DELAY_MS;
  let maxFinish = cursor + REVEAL_DURATION_MS;

  order.forEach(key => {
    const blocksInGroup = groups.get(key);
    const isCaptionGroup = key.classList && key.classList.contains("project-caption");

    if(isCaptionGroup){
      blocksInGroup.forEach(blockEl => {
        const words = blockEl.querySelectorAll(".reveal-word");
        const targets = words.length ? Array.from(words) : [blockEl];
        targets.forEach(w => scheduleReveal(w, cursor));
      });
      maxFinish = Math.max(maxFinish, cursor + REVEAL_DURATION_MS);
      // cursor is NOT advanced here — every caption group in this batch
      // reveals at the same moment, on purpose.
    } else {
      blocksInGroup.forEach(blockEl => {
        const stagger = parseInt(blockEl.dataset.stagger, 10) || WORD_STAGGER_MS;
        const words = blockEl.querySelectorAll(".reveal-word");
        const targets = words.length ? Array.from(words) : [blockEl];
        targets.forEach((w, i) => {
          const delay = cursor + i * stagger;
          scheduleReveal(w, delay);
          maxFinish = Math.max(maxFinish, delay + REVEAL_DURATION_MS);
        });
        cursor += targets.length * stagger + BLOCK_GAP_MS;
      });
    }
  });

  return maxFinish;
}

/* ---------- Work page: repeatable, scroll-position-driven reveal ---------- */
const workIO = new IntersectionObserver((entries) => {
  const toReveal = [];
  entries.forEach(entry => {
    const el = entry.target;
    if(entry.isIntersecting && entry.intersectionRatio >= 0.4){
      toReveal.push(el);
    } else if(!entry.isIntersecting && !revealedOnce.has(el)){
      hideReveal(el);  // fully out of view: reset, except play-once text
    }
  });
  if(toReveal.length) revealGroup(toReveal);
}, { threshold: [0, 0.4] });

let workRevealStarted = false;
function startWorkReveal(){
  if(workRevealStarted) return;
  workRevealStarted = true;
  document.querySelectorAll("#page-work .reveal-text").forEach(el => workIO.observe(el));
}

/* ---------- Intro ---------- */
const intro = document.getElementById("intro");
const introMark = document.getElementById("intro-mark");
const introH1 = intro.querySelector("h1");
const introP = intro.querySelector("p");
const workPage = document.getElementById("page-work");

window.addEventListener("load", () => {
  requestAnimationFrame(() => introMark.classList.add("visible"));
  revealGroup([introH1, introP]);
});

function leaveIntro(){
  forceReveal(introH1);
  forceReveal(introP);
  intro.classList.add("leaving");
  startWorkReveal();
  setTimeout(() => intro.style.display = "none", INTRO_LEAVE_MS);
}
document.getElementById("skip-intro").addEventListener("click", leaveIntro);
setTimeout(leaveIntro, INTRO_HOLD_MS);

function replayIntro(){
  forceReveal(introH1);
  forceReveal(introP);

  workPage.scrollTo({ top: 0, behavior: "instant" });
  goToPage(0, "logo");

  intro.style.transition = `transform ${INTRO_ENTER_MS}ms cubic-bezier(.65,0,.35,1)`;
  intro.style.display = "flex";
  void intro.offsetWidth;
  intro.classList.remove("leaving");
  setTimeout(() => { intro.style.transition = ""; }, INTRO_ENTER_MS + 50);

  introMark.classList.remove("visible");
  void introMark.offsetWidth;
  requestAnimationFrame(() => introMark.classList.add("visible"));

  revealGroup([introH1, introP]);
  setTimeout(leaveIntro, INTRO_HOLD_MS);
}
document.getElementById("logo-btn").addEventListener("click", replayIntro);

/* ---------- Page navigation ---------- */
const pagesEl = document.getElementById("pages");
const pageEls = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");
let currentPage = 0;
let emailPulseTimer = null;

function goToPage(index, via = "nav"){
  if(index === currentPage){
    if(index === 0) workPage.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  currentPage = index;
  pagesEl.style.setProperty("--i", index);
  navLinks.forEach((btn, i) => btn.classList.toggle("active", i === index));

  // Lets other scripts (face-model.js) react to which page is active,
  // and how we got there (via the logo, top-left, or a nav link,
  // top-right) — without needing to know anything about the nav
  // internals themselves.
  document.dispatchEvent(new CustomEvent("pagechange", { detail: { index, via } }));

  const targetPage = pageEls[index];
  if(targetPage.id === "page-contact"){
    const finishTime = revealGroup(targetPage.querySelectorAll(".reveal-text"));
    const emailEl = document.querySelector(".contact-email");
    clearTimeout(emailPulseTimer);
    emailEl.classList.remove("pulse");
    emailPulseTimer = setTimeout(() => emailEl.classList.add("pulse"), finishTime + 150);
  } else if(targetPage.id !== "page-work"){
    revealGroup(targetPage.querySelectorAll(".reveal-text"));
  }
}
navLinks.forEach((btn, i) => btn.addEventListener("click", () => goToPage(i, "nav")));

/* ---------- Work page: gentle proximity-only snap ---------- */
const SNAP_THRESHOLD_PX = 50;
const SNAP_IDLE_MS = 140;
let snapTimer = null;

function workRowSnapPoints(){
  return Array.from(document.querySelectorAll("#page-work .work-row")).map(el => el.offsetTop);
}

workPage.addEventListener("scroll", () => {
  clearTimeout(snapTimer);
  snapTimer = setTimeout(() => {
    const pos = workPage.scrollTop;
    const points = workRowSnapPoints();
    let closest = null;
    let minDist = Infinity;
    points.forEach(p => {
      const d = Math.abs(p - pos);
      if(d < minDist){ minDist = d; closest = p; }
    });
    if(closest !== null && minDist > 2 && minDist < SNAP_THRESHOLD_PX){
      workPage.scrollTo({ top: closest, behavior: "smooth" });
    }
  }, SNAP_IDLE_MS);
});

/* ---------- About: FAQ accordion + live-synced divider ---------- */
const aboutText = document.querySelector(".about-text");
const aboutDivider = document.querySelector(".about-divider");

function updateDivider(){
  if(!aboutText || !aboutDivider) return;
  aboutDivider.style.height = aboutText.offsetHeight + "px";
}
updateDivider();

if("ResizeObserver" in window && aboutText){
  new ResizeObserver(updateDivider).observe(aboutText);
} else {
  window.addEventListener("resize", updateDivider);
}

document.querySelectorAll(".faq-item").forEach(item => {
  const btn = item.querySelector(".faq-q");
  const answer = item.querySelector(".faq-a");

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach(openItem => {
      if(openItem !== item){
        openItem.classList.remove("open");
        openItem.querySelector(".faq-a").style.maxHeight = "0px";
      }
    });

    if(isOpen){
      item.classList.remove("open");
      answer.style.maxHeight = "0px";
    } else {
      item.classList.add("open");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

/* ---------- Project hover / tap cycling (images AND video slides) ---------- */
const projects = document.querySelectorAll(".project");

projects.forEach(project => {
  const slides = project.querySelectorAll(".project-frame img, .project-frame video");
  const dots = project.querySelectorAll(".dots span");
  let index = 0;
  let cycleTimer = null;

  function show(i){
    slides.forEach(s => {
      s.classList.remove("active");
      if(s.tagName === "VIDEO") s.pause();
    });
    dots.forEach(d => d.classList.remove("active"));

    slides[i].classList.add("active");
    if(dots[i]) dots[i].classList.add("active");

    if(slides[i].tagName === "VIDEO"){
      slides[i].currentTime = 0;
      slides[i].play().catch(() => {});
    }
  }

  function scheduleNext(){
    clearTimeout(cycleTimer);
    if(slides.length < 2) return;
    const dwell = parseInt(slides[index].dataset.duration, 10) || 1500;
    cycleTimer = setTimeout(() => {
      index = (index + 1) % slides.length;
      show(index);
      scheduleNext();
    }, dwell);
  }

  project.addEventListener("mouseenter", () => {
    if(!window.matchMedia("(hover: hover)").matches) return;
    scheduleNext();
  });
  project.addEventListener("mouseleave", () => {
    clearTimeout(cycleTimer);
    index = 0;
    show(0);
  });

  project.addEventListener("click", () => openOverlay(project));
});

/* ---------- Project overlay open/close ---------- */
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayBody = document.getElementById("overlay-body");

function openOverlay(project){
  const titleEl = project.querySelector(".project-caption h2");
  const roleEl = project.querySelector(".project-caption span");
  const title = titleEl.innerText.replace(/\n/g, " ");
  const role = roleEl.innerText.replace(/\n/g, " ");
  const imgs = project.querySelectorAll(".project-frame img");

  overlayTitle.textContent = title;
  overlayBody.innerHTML = "";

  imgs.forEach(img => {
    const clone = document.createElement("img");
    clone.src = img.src;
    overlayBody.appendChild(clone);
  });

  const textBlock = document.createElement("div");
  textBlock.className = "overlay-text";
  textBlock.textContent = role + " — full write-up goes here: process, context, and outcome for this project.";
  overlayBody.appendChild(textBlock);

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

document.getElementById("close-overlay").addEventListener("click", () => {
  overlay.classList.remove("open");
  document.body.style.overflow = "";
});

/* ---------- Dump lightbox ---------- */
const dumpImages = Array.from(document.querySelectorAll(".dump-grid img"));
const lightbox = document.getElementById("dump-lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxInfo = document.getElementById("lightbox-info");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxImageWrap = document.querySelector(".lightbox-image-wrap");

let dumpIndex = 0;
let captionTimer = null;

function showCaption(){
  lightboxCaption.classList.remove("hidden");
  clearTimeout(captionTimer);
  captionTimer = setTimeout(() => lightboxCaption.classList.add("hidden"), 2500);
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
  document.body.style.overflow = "hidden";
}
function closeLightbox(){
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  clearTimeout(captionTimer);
}

dumpImages.forEach((img, i) => img.addEventListener("click", () => openLightbox(i)));

document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox-prev").addEventListener("click", (e) => {
  e.stopPropagation();
  dumpIndex = (dumpIndex - 1 + dumpImages.length) % dumpImages.length;
  updateLightbox();
});
document.getElementById("lightbox-next").addEventListener("click", (e) => {
  e.stopPropagation();
  dumpIndex = (dumpIndex + 1) % dumpImages.length;
  updateLightbox();
});

lightbox.addEventListener("click", (e) => {
  if(e.target === lightbox) closeLightbox();
});

// Hovering anywhere over the enlarged image keeps the caption visible,
// not just the strip at the bottom.
lightboxImageWrap.addEventListener("mouseenter", () => {
  clearTimeout(captionTimer);
  lightboxCaption.classList.remove("hidden");
});
lightboxImageWrap.addEventListener("mouseleave", () => {
  captionTimer = setTimeout(() => lightboxCaption.classList.add("hidden"), 1200);
});

document.addEventListener("keydown", (e) => {
  if(!lightbox.classList.contains("open")) return;
  if(e.key === "Escape") closeLightbox();
  if(e.key === "ArrowLeft") document.getElementById("lightbox-prev").click();
  if(e.key === "ArrowRight") document.getElementById("lightbox-next").click();
});

/* ---------- Contact form ---------- */
const contactForm = document.getElementById("contact-form");
const cfStatus = document.getElementById("cf-status");
const cfMessage = document.getElementById("cf-message");

function autoGrowMessage(){
  cfMessage.style.height = "auto";
  cfMessage.style.height = cfMessage.scrollHeight + "px";
}
cfMessage.addEventListener("input", autoGrowMessage);
autoGrowMessage();

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("cf-name").value;
  const email = document.getElementById("cf-email").value;
  const message = cfMessage.value;

  const subject = encodeURIComponent("Portfolio contact from " + name);
  const body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
  window.location.href = "mailto:desmitjurgen@gmail.com?subject=" + subject + "&body=" + body;

  cfStatus.textContent = "Opening your mail app…";
});

/* ---------- Nav icons: load SVG assets inline, animate parts on hover ---------- */

// Tunable numbers for the work icon, in viewBox units.
// gap and restInset must match the drawing.
const WORK_ICON = { size: 64, gap: 8, narrow: 8, restInset: 4 };

// One bar is "focused": wide and full height. The others are narrow and keep their rest height.
function focusBoxes(focus, { size, gap, narrow, restInset }){
  const wide = size - 2 * narrow - 2 * gap;
  const boxes = {};
  let x = 0;
  ["bar_left", "bar_middle", "bar_right"].forEach((id, i) => {
    const isFocus = i === focus;
    const w = isFocus ? wide : narrow;
    boxes[id] = isFocus
      ? { x, y: 0,         w, h: size }
      : { x, y: restInset, w, h: size - 2 * restInset };
    x += w + gap;
  });
  return boxes;
}

// About head: swings on an arc around the neck and settles.
const ABOUT_HEAD_ARC = {
  radius: 24,                       // head center to neck pivot, in units
  swingDeg: 30,                     // angle of a swing with size 1
  lobes: [0.9, 1, 0.8, 0.65, 0.35, 0.15],      // size of each swing in order: left, right, left, right.
                                    // Add or remove numbers for more or fewer swings
  edgeEase: 1,                      // 1 = soft start and stop; lower = more even timing, more abrupt start
  lean: true                        // true: head dips as it leans, false: head lifts
};

// Smooth size curve through the swing sizes: each swing peaks at exactly its listed size.
function lobeEnvelope(tau, lobes){
  const n = lobes.length;
  const pos = tau * n - 0.5;                    // 0 at the first peak, n-1 at the last
  if(pos <= 0) return lobes[0];
  if(pos >= n - 1) return lobes[n - 1];
  const i = Math.floor(pos);
  const f = pos - i;
  const s = (1 - Math.cos(Math.PI * f)) / 2;    // flat at each peak, so peaks keep their size
  return lobes[i] + (lobes[i + 1] - lobes[i]) * s;
}

function headSwing(t){
  const a = ABOUT_HEAD_ARC;
  const smooth = t * t * (3 - 2 * t);
  const tau = t + a.edgeEase * (smooth - t);    // eased time
  const n = a.lobes.length;
  const theta = -a.swingDeg * Math.PI / 180
              * lobeEnvelope(tau, a.lobes)
              * Math.sin(n * Math.PI * tau);    // n swings, ending exactly at rest
  return {
    dx: a.radius * Math.sin(theta),
    dy: a.radius * (1 - Math.cos(theta)) * (a.lean ? 1 : -1)
  };
}

// Contact dots: shrink away on hover, then pop back in one by one.
const CONTACT_DOTS = {
  order: ["dot_left", "dot_mid", "dot_right"],
  shrinkMs: 200,     // dots pop out when hover starts
  firstMs: 400,      // when the first dot starts to pop back in (keep at least shrinkMs)
  staggerMs: 350,    // delay between dots
  popMs: 550,        // time each dot takes to pop in
  peak: 1.05         // how big the pop overshoots (1 = no pop)
};
// whole animation: ends exactly when the last dot has finished popping in
CONTACT_DOTS.totalMs = CONTACT_DOTS.firstMs
  + (CONTACT_DOTS.order.length - 1) * CONTACT_DOTS.staggerMs
  + CONTACT_DOTS.popMs;

// Fast rise to the peak, then settle back to 1.
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
  const ms = t * c.totalMs;
  const start = c.firstMs + i * c.staggerMs;
  let scale;
  if(ms < c.shrinkMs){
    const p = ms / c.shrinkMs;
    scale = 1 - p * p;                              // quick ease-in shrink
  } else if(ms < start){
    scale = 0;                                      // waiting its turn
  } else {
    scale = popCurve(Math.min(1, (ms - start) / c.popMs), c.peak);
  }
  return { scale: Math.max(scale, 0.001) };         // never exactly 0, so it can blend back cleanly
}

// Home icon: the core shrinks into a pupil, the iris ring tightens around it,
// the pupil looks around, and the outer ring turns into dashes.
const HOME_EYE = {
  totalMs: 1500,        // whole animation
  formMs: 450,          // core shrinks and iris tightens
  coreScale: 12 / 3 / 4 / 1,   // placeholder, replaced below
  irisScale: 14 / 18,   // iris ring radius 18 -> 14
  irisStroke: 4,        // iris line stays 4 units wide while it scales
  dashStartMs: 200,     // outer ring starts turning into dashes
  dashMs: 600,          // how long that takes
  glanceMs: 120,        // how fast the eye jumps from one look to the next
  gaze: [               // where it looks, and when it jumps there (2 units = 1px at 32px)
    { at: 560,  x: -4.5, y: 0 },
    { at: 900,  x:  4.5, y: -2 },
    { at: 1240, x: 0,    y: 0 }
  ]
};
HOME_EYE.coreScale = 4 / 12;   // core radius 12 -> pupil radius 4

const easeInOut = p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const clamp01 = v => Math.max(0, Math.min(1, v));

// Where the pupil is looking at a given time: quick jumps with a pause on each look.
function gazeAt(ms){
  let prev = { x: 0, y: 0 };
  for(const step of HOME_EYE.gaze){
    if(ms <= step.at) return prev;
    const p = (ms - step.at) / HOME_EYE.glanceMs;
    if(p < 1){
      const e = easeInOut(p);
      return { x: prev.x + (step.x - prev.x) * e, y: prev.y + (step.y - prev.y) * e };
    }
    prev = step;
  }
  return prev;
}

function eyeMotion(id, t){
  const h = HOME_EYE;
  const ms = t * h.totalMs;
  const form = easeInOut(clamp01(ms / h.formMs));
  const dash = easeInOut(clamp01((ms - h.dashStartMs) / h.dashMs));
  const gaze = gazeAt(ms);
  if(id === "core"){
    return { dx: gaze.x, dy: gaze.y, scale: 1 + (h.coreScale - 1) * form };
  }
  if(id === "iris"){
    const s = 1 + (h.irisScale - 1) * form;
    return { dx: gaze.x, dy: gaze.y, scale: s, strokeWidth: h.irisStroke / s };  // keeps the line width constant
  }
  if(id === "ring_outer") return { opacity: 1 - dash };
  if(id === "ring_dash")  return { opacity: dash };
  return null;
}

// Per icon: a sequence of states, and per state a target box for each element id.
const ICON_ANIMATIONS = {
  work: {
    hold: true,
    stepMs: 600,                         // duration of each move
    returnMs: 350,                       // way back to the resting bars on mouse-out
    clickReturnMs: 800,                  // way back after the button was clicked (longer)
    ease: "cubic-bezier(.65,0,.35,1)",   // each move accelerates and settles
    sequence: ["m", "r", "l", "m"],      // middle, right, left, back to middle
    states: {
      m: focusBoxes(1, WORK_ICON),
      r: focusBoxes(2, WORK_ICON),
      l: focusBoxes(0, WORK_ICON)
    }
  },
  about: {
    motion: (id, t) => id === "head" ? headSwing(t) : null,   // only the head moves
    durationMs: 1700,
    samples: 60,
    returnMs: 300,                          // way back on mouse-out
    ease: "cubic-bezier(.37,0,.63,1)"       // easing for that return
  },
  contact: {
    motion: (id, t) => dotPop(id, t),
    durationMs: CONTACT_DOTS.totalMs,
    samples: 70,
    returnMs: 300,
    ease: "cubic-bezier(.25,1,.5,1)"
  },
  home: {
    motion: eyeMotion,
    hold: true,                         // stays an eye while hovered
    durationMs: HOME_EYE.totalMs,
    samples: 120,
    returnMs: 450,
    ease: "cubic-bezier(.65,0,.35,1)"
  }
};

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

// CSS transform that moves and scales an element so its own bounding box lands on `box`.
function boxTransform(el, box){
  const b = el.getBBox();
  const sx = box.w / b.width;
  const sy = box.h / b.height;
  return `translate(${box.x - b.x * sx}px, ${box.y - b.y * sy}px) scale(${sx}, ${sy})`;
}

// Turns a motion result ({dx, dy} and/or {scale}) into a CSS transform.
// Scaling happens around `center`, so a part grows and shrinks in place.
function motionTransform(m, center){
  const list = [];
  if(m.dx !== undefined || m.dy !== undefined){
    list.push(`translate(${(m.dx || 0).toFixed(3)}px, ${(m.dy || 0).toFixed(3)}px)`);
  }
  if(m.scale !== undefined){
    list.push(`translate(${center.x}px, ${center.y}px) scale(${m.scale.toFixed(4)}) translate(${-center.x}px, ${-center.y}px)`);
  }
  return list.length ? list.join(" ") : "none";
}

// A motion result as keyframe properties: transform, opacity and/or stroke width.
function motionProps(m, center){
  const p = {};
  if(m.dx !== undefined || m.dy !== undefined || m.scale !== undefined){
    p.transform = motionTransform(m, center);
  }
  if(m.opacity !== undefined) p.opacity = m.opacity.toFixed(4);
  if(m.strokeWidth !== undefined) p.strokeWidth = `${m.strokeWidth.toFixed(4)}px`;
  return p;
}

function setupIconHover(svg, button, anim){
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const parts = Array.from(svg.querySelectorAll("[id]"));
  let running = [];
  let hovering = false;     // pointer or keyboard focus is on the button
  let committed = false;    // button was clicked mid-animation: let it finish
  let clicked = false;      // button was clicked since the hover began

  const isPlaying = () => running.some(a => a.playState === "running");
  const returnTime = () => (clicked && anim.clickReturnMs) || anim.returnMs;
  function stopRunning(){ running.forEach(a => a.cancel()); running = []; }

  function centerOf(el){
    try{
      const b = el.getBBox();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }catch(err){
      return { x: 0, y: 0 };
    }
  }

  // The resting values of the properties a part animates (null: this part stays still).
  function restProps(el, center){
    if(!anim.motion) return { transform: "none" };
    const m = anim.motion(el.id, 0);
    return m ? motionProps(m, center) : null;
  }
  // The live values of those same properties right now.
  function liveProps(el, props){
    const cs = getComputedStyle(el);
    const out = {};
    Object.keys(props).forEach(k => { out[k] = cs[k]; });
    return out;
  }

  function play(){
    const centers = parts.map(centerOf);
    const rests = parts.map((el, i) => restProps(el, centers[i]));
    const froms = parts.map((el, i) => rests[i] ? liveProps(el, rests[i]) : null);
    stopRunning();
    committed = false;
    clicked = false;
    const fill = anim.hold ? "forwards" : "none";
    const weights = anim.weights || (anim.sequence ? anim.sequence.map(() => 1) : []);
    const total = weights.reduce((a, b) => a + b, 0);

    parts.forEach((el, i) => {
      if(!rests[i]) return;
      // motion-function icons (About, Contact, Home)
      if(anim.motion){
        const N = anim.samples || 60;
        const frames = [{ ...froms[i], offset: 0, easing: "linear" }];
        for(let k = 1; k <= N; k++){
          const t = k / N;
          frames.push({ ...motionProps(anim.motion(el.id, t), centers[i]), offset: t, easing: "linear" });
        }
        running.push(el.animate(frames, { duration: anim.durationMs, fill }));
        return;
      }
      // state-sequence icons (Work)
      const frames = [{ ...froms[i], offset: 0 }];
      let acc = 0;
      anim.sequence.forEach((name, s) => {
        acc += weights[s];
        const box = anim.states[name][el.id];
        frames.push({ transform: box ? boxTransform(el, box) : "none", offset: acc / total });
      });
      frames.forEach(f => { f.easing = anim.ease; });
      running.push(el.animate(frames, { duration: anim.stepMs * total, fill }));
    });

    // When it has played to its end: if the pointer already left, ease back to rest.
    Promise.all(running.map(a => a.finished)).then(() => {
      committed = false;
      if(!hovering){
        rest(returnTime());
        clicked = false;
      }
    }).catch(() => {});   // cancelled by a newer play or rest: ignore
  }

  function rest(ms = anim.returnMs){
    const centers = parts.map(centerOf);
    const rests = parts.map((el, i) => restProps(el, centers[i]));
    const froms = parts.map((el, i) => rests[i] ? liveProps(el, rests[i]) : null);
    stopRunning();
    parts.forEach((el, i) => {
      if(!rests[i]) return;
      running.push(el.animate([froms[i], rests[i]], { duration: ms, easing: anim.ease }));
    });
  }

  function enter(){ hovering = true; play(); }
  function leave(){
    hovering = false;
    if(committed && isPlaying()) return;   // clicked: let it finish, it eases back by itself
    committed = false;
    rest(returnTime());
    clicked = false;
  }

  button.addEventListener("mouseenter", () => {
    if(window.matchMedia("(hover: hover)").matches) enter();
  });
  button.addEventListener("mouseleave", leave);
  button.addEventListener("focus", () => { if(button.matches(":focus-visible")) enter(); });
  button.addEventListener("blur", leave);
  button.addEventListener("click", () => {
    if(!hovering) play();            // touch tap: no hover happened, so play it once
    clicked = true;                  // the eventual way back uses clickReturnMs
    committed = isPlaying();         // clicked mid-animation: keep going even if the pointer leaves
  });
}

document.querySelectorAll("img.nav-icon[data-icon]").forEach(async img => {
  const anim = ICON_ANIMATIONS[img.dataset.icon];
  const button = img.closest("button");
  const svg = await inlineIcon(img);
  if(svg && anim) setupIconHover(svg, button, anim);
});

/* ---------- Nav: selected pill + hover pill that follows the cursor ---------- */
const siteNav = document.getElementById("site-nav");
const navPill = document.getElementById("nav-pill");
const navHover = document.getElementById("nav-hover");
const NAV_MAGNET = 0;    // how far the hover pill leans toward the cursor (0 = off)
const NAV_MAGNET_MAX = 4;   // cap in px

function setHoverClass(li){
  siteNav.querySelectorAll("li.is-hover").forEach(el => el.classList.remove("is-hover"));
  if(li) li.classList.add("is-hover");
}

function placePill(pill, li, animate, offsetX = 0){
  if(!animate) pill.style.transition = "none";
  const r = li.getBoundingClientRect();     // fractional sizes, no rounding gaps
  const n = siteNav.getBoundingClientRect();
  pill.style.width = r.width + "px";
  pill.style.transform = `translateX(${r.left - n.left + offsetX}px)`;
  if(!animate){ void pill.offsetWidth; pill.style.transition = ""; }
}

/* selected pill: follows the .active class that goToPage() already toggles */
function moveNavPill(animate = true){
  const active = siteNav.querySelector(".nav-link.active");
  if(active) placePill(navPill, active.parentElement, animate);
}
const navObserver = new MutationObserver(() => moveNavPill(true));
siteNav.querySelectorAll(".nav-link").forEach(btn =>
  navObserver.observe(btn, { attributes: true, attributeFilter: ["class"] }));

/* hover pill */
let hoverLi = null;
let hoverShown = false;

function showHover(li, e){
  let offset = 0;
  if(e && NAV_MAGNET){
    const r = li.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    offset = Math.max(-NAV_MAGNET_MAX, Math.min(NAV_MAGNET_MAX, dx * NAV_MAGNET));
  }
  placePill(navHover, li, hoverShown, offset);
  navHover.style.opacity = "1";
  setHoverClass(li);
  hoverShown = true;
  hoverLi = li;
}
function hideHover(){
  navHover.style.opacity = "0";
  setHoverClass(null);
  hoverShown = false;
}

siteNav.addEventListener("pointermove", (e) => {
  if(e.pointerType !== "mouse") return;
  const li = e.target.closest("li");
  if(li) showHover(li, e);
});
siteNav.addEventListener("pointerleave", hideHover);
siteNav.addEventListener("focusin", (e) => {
  const btn = e.target.closest(".nav-link");
  if(btn && btn.matches(":focus-visible")) showHover(btn.parentElement);
});
siteNav.addEventListener("focusout", hideHover);

function relayoutNav(){
  moveNavPill(false);
  if(hoverShown && hoverLi) placePill(navHover, hoverLi, false);
}
window.addEventListener("resize", relayoutNav);
moveNavPill(false);
if(document.fonts && document.fonts.ready) document.fonts.ready.then(relayoutNav);