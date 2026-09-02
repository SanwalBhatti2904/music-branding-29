/* ============================================
   SLOWED. — Main Script
   ============================================ */

const REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function formatTime(s) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

function showToast(msg, type = "info") {
  const c = document.getElementById("toastContainer");
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => {
    t.classList.add("toast-out");
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

// ============================================
// LENIS
// ============================================
let lenis;
function initLenis() {
  if (REDUCED_MOTION) return;
  lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// ============================================
// GSAP SCROLL REVEALS
// ============================================
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: parseFloat(el.dataset.delay) || 0,
    });
  });
  gsap.utils.toArray(".reveal-stagger").forEach((parent) => {
    gsap.from(parent.children, {
      scrollTrigger: { trigger: parent, start: "top 88%", once: true },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.12,
    });
  });
}

// ============================================
// NAV
// ============================================
function initNav() {
  const nav = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const mobile = document.getElementById("navMobile");
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true },
  );
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    mobile.classList.toggle("open");
  });
  mobile.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      mobile.classList.remove("open");
    });
  });
}

// ============================================
// PAGE LOAD INTRO
// ============================================
function initIntro() {
  if (REDUCED_MOTION) return;
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from("#navbar", { y: -20, opacity: 0, duration: 0.6 })
    .from(
      ".headline-line",
      { y: 50, opacity: 0, duration: 0.7, stagger: 0.12 },
      "-=0.3",
    )
    .from(".hero-sub", { y: 30, opacity: 0, duration: 0.6 }, "-=0.35")
    .from(".hero-ctas", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
    .from("#heroWaveform", { opacity: 0, duration: 0.6 }, "-=0.2");
}

// ============================================
// HERO — SCROLL-DRIVEN FRAME ANIMATION
// ============================================
function initHeroFrames() {
  const TOTAL_FRAMES = 300;
  const canvas = document.getElementById("heroFrameCanvas");
  const ctx = canvas.getContext("2d");
  const loaderFill = document.getElementById("heroLoaderFill");
  const loaderText = document.getElementById("heroLoaderText");
  const loader = document.getElementById("heroLoader");
  const scrollInd = document.getElementById("scrollIndicator");

  const frames = new Array(TOTAL_FRAMES).fill(null);
  let loadedCount = 0;

  const frameProgress = { val: 0 };

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const cur = Math.floor(frameProgress.val);
    if (frames[cur]) drawFrame(frames[cur]);
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  function drawFrame(img) {
    if (!img || !img.naturalWidth) return;
    const cw = canvas.width,
      ch = canvas.height;
    const iw = img.naturalWidth,
      ih = img.naturalHeight;
    const cr = cw / ch,
      ir = iw / ih;
    let sx, sy, sw, sh;
    if (ir > cr) {
      sh = ih;
      sw = sh * cr;
      sx = (iw - sw) / 2;
      sy = 0;
    } else {
      sw = iw;
      sh = sw / cr;
      sx = 0;
      sy = (ih - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }

  function drawCurrentFrame() {
    const targetIdx = Math.round(frameProgress.val);
    let idx = targetIdx;
    while (idx > 0 && !frames[idx]) idx--;
    if (frames[idx]) drawFrame(frames[idx]);
  }

  // --- Fixed Scroll Math & Smooth scrub ---
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      // Calculate scroll duration dynamically based on window height
      end: () => "+=" + window.innerHeight * 5,
      pin: true,
      scrub: 1.5, // Smooth out fast flickers and Lenis wheel deltas
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Frame scrubbing timeline step
  heroTl.to(
    frameProgress,
    {
      val: TOTAL_FRAMES - 1,
      ease: "none",
      duration: 1,
      onUpdate: drawCurrentFrame,
    },
    0,
  );

  // Content fade out during first 20% of scroll
  heroTl.to(
    ".hero-content",
    {
      opacity: 0,
      y: -80,
      ease: "power2.in",
      duration: 0.2,
    },
    0,
  );

  // Lighten overlay so frames become visible
  heroTl.to(
    ".hero-frame-overlay",
    {
      opacity: 0.12,
      ease: "none",
      duration: 0.3,
    },
    0.2,
  );

  // Darken overlay for transition out
  heroTl.to(
    ".hero-frame-overlay",
    {
      opacity: 1,
      ease: "power1.in",
      duration: 0.25,
    },
    0.75,
  );

  // Scroll indicator disappears immediately
  heroTl.to(
    "#scrollIndicator",
    {
      opacity: 0,
      ease: "none",
      duration: 0.02,
    },
    0,
  );

  // --- Scroll-synced text blocks over the frame animation ---
  // Each block fades in, holds, then fades out, filling the gap
  // between the hero headline disappearing and the pin releasing.
  const scrollTextBlocks = [
    { sel: "#scrollText1", in: 0.24, hold: 0.34, out: 0.42 },
    { sel: "#scrollText2", in: 0.48, hold: 0.58, out: 0.66 },
    { sel: "#scrollText3", in: 0.72, hold: 0.82, out: 0.9 },
  ];

  scrollTextBlocks.forEach((block) => {
    heroTl.fromTo(
      block.sel,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, ease: "power2.out", duration: block.hold - block.in },
      block.in,
    );
    heroTl.to(
      block.sel,
      {
        opacity: 0,
        y: -40,
        ease: "power2.in",
        duration: block.out - block.hold,
      },
      block.hold,
    );
  });

  // --- Load all 300 frames ---
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.onload = () => {
      frames[i] = img;
      loadedCount++;
      const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      loaderFill.style.width = pct + "%";
      loaderText.textContent = `Loading frames... ${pct}%`;
      if (loadedCount === 1) {
        drawFrame(img);
        canvas.classList.add("loaded");
        scrollInd.classList.add("visible");
      }
      if (loadedCount >= TOTAL_FRAMES) loader.classList.add("done");
    };
    img.onerror = () => {
      loadedCount++;
      loaderFill.style.width =
        Math.round((loadedCount / TOTAL_FRAMES) * 100) + "%";
      if (loadedCount >= TOTAL_FRAMES) loader.classList.add("done");
    };
    img.src = `frame1/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;
  }

  setTimeout(() => {
    loader.classList.add("done");
  }, 10000);
}

// ============================================
// HERO WAVEFORM (decorative)
// ============================================
function initHeroWaveform() {
  if (REDUCED_MOTION) return;
  const canvas = document.getElementById("heroWaveform");
  const ctx = canvas.getContext("2d");
  const W = canvas.width,
    H = canvas.height;
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let wave = 0; wave < 3; wave++) {
      ctx.beginPath();
      const freq = 0.015 + wave * 0.008;
      const amp = 12 - wave * 3;
      const speed = 0.02 + wave * 0.008;
      const alpha = 0.35 - wave * 0.08;
      for (let x = 0; x < W; x++) {
        const y =
          H / 2 +
          Math.sin(x * freq + t * speed) * amp +
          Math.sin(x * freq * 1.7 + t * speed * 0.7) * (amp * 0.4);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    t++;
    requestAnimationFrame(draw);
  }
  draw();
}

// ============================================
// SOUND MOODS — HORIZONTAL SCROLL CAROUSEL
// ============================================
function initMoodsCarousel() {
  if (window.innerWidth < 768) return;
  const track = document.querySelector("#moods .carousel-track");
  if (!track) return;

  // Read the navbar's actual height so the pinned section lands
  // right underneath it instead of sliding under the fixed header.
  const getNavOffset = () => {
    const val = getComputedStyle(document.documentElement).getPropertyValue(
      "--nav-h",
    );
    return parseInt(val, 10) || 72;
  };

  requestAnimationFrame(() => {
    const totalScroll = track.scrollWidth - window.innerWidth;
    if (totalScroll <= 0) return;
    gsap.to(track, {
      x: -totalScroll,
      ease: "none",
      scrollTrigger: {
        trigger: "#moods",
        start: () => "top " + getNavOffset() + "px",
        end: () => "+=" + totalScroll,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });
}

// ============================================
// STATS — COUNTER ANIMATION ON SCROLL
// ============================================
function initStats() {
  document.querySelectorAll(".stat-number").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const decimals = parseInt(el.dataset.decimals) || 0;
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(
          { val: 0 },
          {
            val: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              const v = this.targets()[0].val;
              el.textContent =
                decimals > 0
                  ? prefix + v.toFixed(decimals) + suffix
                  : prefix + Math.floor(v).toLocaleString() + suffix;
            },
          },
        );
      },
    });
  });
}

// ============================================
// PARALLAX MICRO-ANIMATIONS
// ============================================
function initParallax() {
  if (REDUCED_MOTION) return;
  gsap.to(".stats-orb-1", {
    y: -80,
    ease: "none",
    scrollTrigger: {
      trigger: "#stats",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
  gsap.to(".stats-orb-2", {
    y: -120,
    ease: "none",
    scrollTrigger: {
      trigger: "#stats",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
  gsap.utils.toArray(".section-headline").forEach((h) => {
    gsap.to(h, {
      y: -20,
      ease: "none",
      scrollTrigger: {
        trigger: h,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
  gsap.utils.toArray(".feature-icon").forEach((icon, i) => {
    gsap.from(icon, {
      scale: 0.5,
      opacity: 0,
      rotation: -15,
      scrollTrigger: { trigger: icon, start: "top 90%", once: true },
      duration: 0.6,
      delay: i * 0.08,
      ease: "back.out(1.7)",
    });
  });
  gsap.utils.toArray(".step-num").forEach((num, i) => {
    gsap.from(num, {
      x: -30,
      opacity: 0,
      scrollTrigger: { trigger: num, start: "top 90%", once: true },
      duration: 0.5,
      delay: i * 0.1,
      ease: "power3.out",
    });
  });
}

// ============================================
// AUDIO TOOL
// ============================================
let audioCtx = null;
let audioBuffer = null;
let sourceNode = null;
let dryGainNode = null;
let wetGainNode = null;
let convolverNode = null;
let impulseBuffer = null;
let isPlaying = false;
let bufferPosition = 0;
let lastUpdateTime = 0;
let currentSpeed = 0.8;
let currentReverb = 0.5;
let playheadAnimId = null;

function getAudioCtx() {
  if (!audioCtx)
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function createImpulseResponse(ctx, duration, decay) {
  duration = duration || 2.5;
  decay = decay || 2.0;
  const sr = ctx.sampleRate;
  const length = sr * duration;
  const buf = ctx.createBuffer(2, length, sr);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buf;
}

function audioBufferToWav(buffer) {
  const numCh = buffer.numberOfChannels;
  const sr = buffer.sampleRate;
  const bps = 16;
  const bytesPerSample = bps / 8;
  const blockAlign = numCh * bytesPerSample;
  const numSamples = buffer.length;
  const dataSize = numSamples * blockAlign;
  const totalSize = 44 + dataSize;
  const ab = new ArrayBuffer(totalSize);
  const v = new DataView(ab);

  writeStr(v, 0, "RIFF");
  v.setUint32(4, totalSize - 8, true);
  writeStr(v, 8, "WAVE");
  writeStr(v, 12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, numCh, true);
  v.setUint32(24, sr, true);
  v.setUint32(28, sr * blockAlign, true);
  v.setUint16(32, blockAlign, true);
  v.setUint16(34, bps, true);
  writeStr(v, 36, "data");
  v.setUint32(40, dataSize, true);

  const channels = [];
  for (let c = 0; c < numCh; c++) channels.push(buffer.getChannelData(c));
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numCh; c++) {
      let s = Math.max(-1, Math.min(1, channels[c][i]));
      s = s < 0 ? s * 0x8000 : s * 0x7fff;
      v.setInt16(offset, s, true);
      offset += 2;
    }
  }
  return new Blob([ab], { type: "audio/wav" });
}

function writeStr(dv, offset, str) {
  for (let i = 0; i < str.length; i++)
    dv.setUint8(offset + i, str.charCodeAt(i));
}

// --- MP3 encoding (lamejs, loaded on demand so it never slows down
// the initial page load — only fetched the first time someone
// actually exports an MP3) ---
let lameLoadPromise = null;
function loadLame() {
  if (window.lamejs) return Promise.resolve();
  if (lameLoadPromise) return lameLoadPromise;
  lameLoadPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () =>
      reject(
        new Error("Could not load the MP3 encoder. Check your connection."),
      );
    document.head.appendChild(s);
  });
  return lameLoadPromise;
}

function floatTo16BitPCM(channelData) {
  const out = new Int16Array(channelData.length);
  for (let i = 0; i < channelData.length; i++) {
    const s = Math.max(-1, Math.min(1, channelData[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

async function audioBufferToMp3(buffer, kbps = 192) {
  await loadLame();
  const numCh = Math.min(buffer.numberOfChannels, 2);
  const sr = buffer.sampleRate;
  const encoder = new lamejs.Mp3Encoder(numCh, sr, kbps);
  const blockSize = 1152;
  const left = floatTo16BitPCM(buffer.getChannelData(0));
  const right = numCh > 1 ? floatTo16BitPCM(buffer.getChannelData(1)) : null;
  const chunks = [];

  for (let i = 0; i < left.length; i += blockSize) {
    const leftChunk = left.subarray(i, i + blockSize);
    let mp3buf;
    if (right) {
      const rightChunk = right.subarray(i, i + blockSize);
      mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
    } else {
      mp3buf = encoder.encodeBuffer(leftChunk);
    }
    if (mp3buf.length > 0) chunks.push(new Int8Array(mp3buf));
  }
  const tail = encoder.flush();
  if (tail.length > 0) chunks.push(new Int8Array(tail));

  return new Blob(chunks, { type: "audio/mp3" });
}

function initTool() {
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const toolEmpty = document.getElementById("toolEmpty");
  const toolActive = document.getElementById("toolActive");
  const changeBtn = document.getElementById("changeFileBtn");
  const playBtn = document.getElementById("playBtn");
  const playIcon = document.getElementById("playIcon");
  const speedSlider = document.getElementById("speedSlider");
  const reverbSlider = document.getElementById("reverbSlider");
  const speedVal = document.getElementById("speedValue");
  const reverbVal = document.getElementById("reverbValue");
  const timeDisp = document.getElementById("timeDisplay");
  const exportWavBtn = document.getElementById("exportWavBtn");
  const exportMp3Btn = document.getElementById("exportMp3Btn");
  const wfCanvas = document.getElementById("waveformCanvas");
  const presetButtons = document.querySelectorAll(".preset-btn");

  dropZone.addEventListener("click", () => fileInput.click());
  dropZone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener("change", (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });
  dropZone.addEventListener("dragover", (e) => e.preventDefault());
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  });

  changeBtn.addEventListener("click", () => {
    stopPlayback();
    audioBuffer = null;
    toolActive.classList.remove("visible");
    toolEmpty.classList.remove("hidden");
    fileInput.value = "";
  });

  playBtn.addEventListener("click", () => {
    if (!audioBuffer) return;
    isPlaying ? pausePlayback() : startPlayback();
  });

  wfCanvas.addEventListener("click", (e) => {
    if (!audioBuffer) return;
    const rect = wfCanvas.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    const wasPlaying = isPlaying;
    if (isPlaying) stopPlayback(true);
    bufferPosition = ratio * audioBuffer.duration;
    drawToolWaveform(ratio);
    updateTimeDisplay();
    if (wasPlaying) startPlayback();
  });

  speedSlider.addEventListener("input", () => {
    currentSpeed = parseInt(speedSlider.value) / 100;
    speedVal.textContent = currentSpeed.toFixed(2) + "x";
    clearActivePreset();
    if (isPlaying) {
      const elapsed = getAudioCtx().currentTime - lastUpdateTime;
      bufferPosition = Math.min(
        bufferPosition + elapsed * sourceNode.playbackRate.value,
        audioBuffer.duration,
      );
      lastUpdateTime = getAudioCtx().currentTime;
      sourceNode.playbackRate.value = currentSpeed;
    }
  });

  reverbSlider.addEventListener("input", () => {
    currentReverb = parseInt(reverbSlider.value) / 100;
    reverbVal.textContent = Math.round(currentReverb * 100) + "%";
    clearActivePreset();
    if (dryGainNode) {
      dryGainNode.gain.value = 1 - currentReverb;
      wetGainNode.gain.value = currentReverb;
    }
  });

  function clearActivePreset() {
    presetButtons.forEach((b) => b.classList.remove("active"));
  }

  function applyPreset(btn) {
    const speed = parseInt(btn.dataset.speed, 10);
    const reverb = parseInt(btn.dataset.reverb, 10);

    speedSlider.value = speed;
    reverbSlider.value = reverb;
    currentSpeed = speed / 100;
    currentReverb = reverb / 100;
    speedVal.textContent = currentSpeed.toFixed(2) + "x";
    reverbVal.textContent = Math.round(currentReverb * 100) + "%";

    presetButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    if (isPlaying) {
      const elapsed = getAudioCtx().currentTime - lastUpdateTime;
      bufferPosition = Math.min(
        bufferPosition + elapsed * sourceNode.playbackRate.value,
        audioBuffer.duration,
      );
      lastUpdateTime = getAudioCtx().currentTime;
      sourceNode.playbackRate.value = currentSpeed;
      dryGainNode.gain.value = 1 - currentReverb;
      wetGainNode.gain.value = currentReverb;
    }
  }

  presetButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!audioBuffer) {
        showToast("Upload a track first, then pick a preset.", "error");
        return;
      }
      applyPreset(btn);
    });
  });

  exportWavBtn.addEventListener("click", () => exportAudio("wav"));
  exportMp3Btn.addEventListener("click", () => exportAudio("mp3"));

  async function handleFile(file) {
    if (!file.type.startsWith("audio/")) {
      showToast("Please upload an audio file (MP3, WAV, or M4A).", "error");
      return;
    }
    try {
      const cx = getAudioCtx();
      audioBuffer = await cx.decodeAudioData(await file.arrayBuffer());
      if (!impulseBuffer) impulseBuffer = createImpulseResponse(cx, 2.5, 2.2);

      bufferPosition = 0;
      currentSpeed = 0.8;
      currentReverb = 0.5;
      speedSlider.value = 80;
      reverbSlider.value = 50;
      speedVal.textContent = "0.80x";
      reverbVal.textContent = "50%";
      presetButtons.forEach((b) =>
        b.classList.toggle("active", b === presetButtons[0]),
      );
      updateTimeDisplay();

      document.getElementById("fileName").textContent = file.name;
      sizeWaveformCanvas();
      drawToolWaveform(0);

      toolEmpty.classList.add("hidden");
      setTimeout(() => toolActive.classList.add("visible"), 50);
      showToast("Track loaded — hit play to preview.", "success");
    } catch (err) {
      console.error(err);
      showToast("Could not decode that file. Try a different format.", "error");
    }
  }

  function sizeWaveformCanvas() {
    const wrap = wfCanvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    wfCanvas.width = wrap.clientWidth * dpr;
    wfCanvas.height = 100 * dpr;
    wfCanvas.style.width = wrap.clientWidth + "px";
    wfCanvas.style.height = "100px";
  }
  window.addEventListener("resize", () => {
    if (audioBuffer) {
      sizeWaveformCanvas();
      drawToolWaveform(bufferPosition / audioBuffer.duration);
    }
  });

  function drawToolWaveform(progress) {
    if (!audioBuffer) return;
    const c = wfCanvas.getContext("2d");
    const W = wfCanvas.width,
      H = wfCanvas.height;
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / W);
    c.clearRect(0, 0, W, H);

    c.fillStyle = "rgba(139,92,246,0.2)";
    for (let i = 0; i < W; i++) {
      let mn = 1,
        mx = -1;
      for (let j = 0; j < step && i * step + j < data.length; j++) {
        const d = data[i * step + j];
        if (d < mn) mn = d;
        if (d > mx) mx = d;
      }
      const yTop = ((1 + mn) / 2) * H;
      const yBot = ((1 + mx) / 2) * H;
      c.fillRect(i, yTop, 1, Math.max(1, yBot - yTop));
    }

    const px = Math.floor(progress * W);
    if (px > 0) {
      const g = c.createLinearGradient(0, 0, px, 0);
      g.addColorStop(0, "#8b5cf6");
      g.addColorStop(1, "#22d3ee");
      c.fillStyle = g;
      for (let i = 0; i < px; i++) {
        let mn = 1,
          mx = -1;
        for (let j = 0; j < step && i * step + j < data.length; j++) {
          const d = data[i * step + j];
          if (d < mn) mn = d;
          if (d > mx) mx = d;
        }
        const yTop = ((1 + mn) / 2) * H;
        const yBot = ((1 + mx) / 2) * H;
        c.fillRect(i, yTop, 1, Math.max(1, yBot - yTop));
      }
    }

    if (progress > 0 && progress < 1) {
      c.strokeStyle = "#22d3ee";
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(px, 0);
      c.lineTo(px, H);
      c.stroke();
    }
  }

  function startPlayback() {
    const cx = getAudioCtx();
    if (bufferPosition >= audioBuffer.duration) bufferPosition = 0;

    sourceNode = cx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.playbackRate.value = currentSpeed;

    dryGainNode = cx.createGain();
    dryGainNode.gain.value = 1 - currentReverb;

    wetGainNode = cx.createGain();
    wetGainNode.gain.value = currentReverb;

    convolverNode = cx.createConvolver();
    convolverNode.buffer = impulseBuffer;

    sourceNode.connect(dryGainNode);
    dryGainNode.connect(cx.destination);
    sourceNode.connect(convolverNode);
    convolverNode.connect(wetGainNode);
    wetGainNode.connect(cx.destination);

    sourceNode.start(0, bufferPosition);
    lastUpdateTime = cx.currentTime;
    isPlaying = true;
    playIcon.className = "fas fa-pause";

    sourceNode.onended = () => {
      if (isPlaying) {
        isPlaying = false;
        bufferPosition = 0;
        playIcon.className = "fas fa-play";
        drawToolWaveform(0);
        updateTimeDisplay();
        cancelAnimationFrame(playheadAnimId);
      }
    };

    (function loop() {
      if (!isPlaying) return;
      const elapsed = cx.currentTime - lastUpdateTime;
      const pos = Math.min(
        bufferPosition + elapsed * currentSpeed,
        audioBuffer.duration,
      );
      drawToolWaveform(pos / audioBuffer.duration);
      updateTimeDisplayPos(pos);
      playheadAnimId = requestAnimationFrame(loop);
    })();
  }

  function pausePlayback() {
    if (!isPlaying) return;
    const elapsed = getAudioCtx().currentTime - lastUpdateTime;
    bufferPosition = Math.min(
      bufferPosition + elapsed * currentSpeed,
      audioBuffer.duration,
    );
    sourceNode.onended = null;
    sourceNode.stop();
    isPlaying = false;
    playIcon.className = "fas fa-play";
    cancelAnimationFrame(playheadAnimId);
    updateTimeDisplay();
  }

  function stopPlayback(silent) {
    if (isPlaying) {
      sourceNode.onended = null;
      try {
        sourceNode.stop();
      } catch (e) {}
      isPlaying = false;
      playIcon.className = "fas fa-play";
      cancelAnimationFrame(playheadAnimId);
    }
    if (!silent) {
      bufferPosition = 0;
      drawToolWaveform(0);
      updateTimeDisplay();
    }
  }

  function updateTimeDisplay() {
    updateTimeDisplayPos(bufferPosition);
  }

  function updateTimeDisplayPos(pos) {
    if (!audioBuffer) return;
    const cur = pos / currentSpeed;
    const dur = audioBuffer.duration / currentSpeed;
    timeDisp.textContent = formatTime(cur) + " / " + formatTime(dur);
  }

  async function exportAudio(format) {
    if (!audioBuffer) return;
    const prog = document.getElementById("exportProgress");
    const fill = document.getElementById("progressFill");
    const pText = document.getElementById("progressText");

    exportWavBtn.disabled = true;
    exportMp3Btn.disabled = true;
    exportWavBtn.style.opacity = "0.5";
    exportMp3Btn.style.opacity = "0.5";
    prog.hidden = false;
    fill.style.width = "0%";
    pText.textContent = "Rendering...";

    const outputDuration = audioBuffer.duration / currentSpeed + 2.5;
    const sr = audioBuffer.sampleRate;

    try {
      const offCtx = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        Math.ceil(outputDuration * sr),
        sr,
      );
      const imp = createImpulseResponse(offCtx, 2.5, 2.2);

      const src = offCtx.createBufferSource();
      src.buffer = audioBuffer;
      src.playbackRate.value = currentSpeed;

      const dry = offCtx.createGain();
      dry.gain.value = 1 - currentReverb;
      const wet = offCtx.createGain();
      wet.gain.value = currentReverb;
      const conv = offCtx.createConvolver();
      conv.buffer = imp;

      src.connect(dry);
      dry.connect(offCtx.destination);
      src.connect(conv);
      conv.connect(wet);
      wet.connect(offCtx.destination);
      src.start(0);

      let fp = 0;
      const pi = setInterval(() => {
        fp = Math.min(fp + Math.random() * 8 + 2, format === "mp3" ? 70 : 90);
        fill.style.width = fp + "%";
      }, 200);

      const rendered = await offCtx.startRendering();
      clearInterval(pi);

      const origName = document
        .getElementById("fileName")
        .textContent.replace(/\.[^.]+$/, "");

      let blob;
      if (format === "mp3") {
        pText.textContent = "Encoding MP3...";
        fill.style.width = "85%";
        blob = await audioBufferToMp3(rendered, 192);
      } else {
        pText.textContent = "Encoding WAV...";
        blob = audioBufferToWav(rendered);
      }
      fill.style.width = "100%";
      await new Promise((r) => setTimeout(r, 150));

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = origName + "_slowed." + format;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(
        "Export complete — your " + format.toUpperCase() + " is downloading.",
        "success",
      );
    } catch (err) {
      console.error(err);
      showToast(
        "Export failed. Please try again with a shorter track.",
        "error",
      );
    }

    exportWavBtn.disabled = false;
    exportMp3Btn.disabled = false;
    exportWavBtn.style.opacity = "1";
    exportMp3Btn.style.opacity = "1";
    prog.hidden = true;
  }
}

// ============================================
// EXAMPLES
// ============================================
function initExamples() {
  const ctx = getAudioCtx();

  const exState = [
    { origBuf: null, slowedUrl: null, origUrl: null, playing: null },
    { origBuf: null, slowedUrl: null, origUrl: null, playing: null },
  ];

  exState[0].origBuf = generateAmbientPad(ctx);
  exState[1].origBuf = generateArpeggio(ctx);

  exState.forEach((s) => {
    s.origUrl = URL.createObjectURL(audioBufferToWav(s.origBuf));
  });

  exState.forEach(async (s) => {
    try {
      const buf = s.origBuf;
      const sr = buf.sampleRate;
      const outDur = buf.duration / 0.75 + 2.5;
      const offCtx = new OfflineAudioContext(
        buf.numberOfChannels,
        Math.ceil(outDur * sr),
        sr,
      );
      const imp = createImpulseResponse(offCtx, 2.5, 2.2);

      const src = offCtx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = 0.75;

      const dry = offCtx.createGain();
      dry.gain.value = 0.4;
      const wet = offCtx.createGain();
      wet.gain.value = 0.6;
      const conv = offCtx.createConvolver();
      conv.buffer = imp;

      src.connect(dry);
      dry.connect(offCtx.destination);
      src.connect(conv);
      conv.connect(wet);
      wet.connect(offCtx.destination);
      src.start(0);

      const rendered = await offCtx.startRendering();
      s.slowedUrl = URL.createObjectURL(audioBufferToWav(rendered));
    } catch (e) {
      console.warn("Example render failed:", e);
    }
  });

  document.querySelectorAll(".btn-ex-play").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx);
      const type = btn.dataset.type;
      const state = exState[idx];
      const card = btn.closest(".example-card");

      if (state.playing) {
        state.playing.pause();
        state.playing.currentTime = 0;
        state.playing = null;
        card.querySelectorAll(".btn-ex-play").forEach((b) => {
          b.classList.remove("playing");
          b.querySelector("i").className = "fas fa-play";
        });
        card.querySelectorAll(".ex-progress-fill").forEach((f) => {
          f.style.width = "0%";
        });
        return;
      }

      const url = type === "original" ? state.origUrl : state.slowedUrl;
      if (!url) {
        showToast(
          "Still preparing this example — try again in a moment.",
          "error",
        );
        return;
      }

      const audio = new Audio(url);
      state.playing = audio;
      btn.classList.add("playing");
      btn.querySelector("i").className = "fas fa-pause";

      const pf = btn.parentElement.querySelector(".ex-progress-fill");

      audio.play().catch(() => {
        showToast(
          "Click play again — your browser needs one interaction first.",
          "error",
        );
        state.playing = null;
        btn.classList.remove("playing");
        btn.querySelector("i").className = "fas fa-play";
      });

      (function updateProg() {
        if (audio.paused || audio.ended) return;
        pf.style.width = (audio.currentTime / audio.duration) * 100 + "%";
        requestAnimationFrame(updateProg);
      })();

      audio.onended = () => {
        btn.classList.remove("playing");
        btn.querySelector("i").className = "fas fa-play";
        pf.style.width = "0%";
        state.playing = null;
      };
    });
  });
}

function generateAmbientPad(ctx) {
  const sr = ctx.sampleRate;
  const dur = 5;
  const buf = ctx.createBuffer(2, sr * dur, sr);
  const freqs = [261.63, 329.63, 392.0, 523.25];
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < data.length; i++) {
      const t = i / sr;
      const env = Math.sin((Math.PI * t) / dur);
      let s = 0;
      for (const f of freqs) {
        s += Math.sin(2 * Math.PI * f * t + ch * 0.3);
        s += Math.sin(2 * Math.PI * f * 2.01 * t + ch * 0.5) * 0.3;
      }
      data[i] = (s / freqs.length) * env * 0.2;
    }
  }
  return buf;
}

function generateArpeggio(ctx) {
  const sr = ctx.sampleRate;
  const dur = 5;
  const buf = ctx.createBuffer(2, sr * dur, sr);
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 523.25, 392.0];
  const nd = dur / notes.length;
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let n = 0; n < notes.length; n++) {
      const start = Math.floor(n * nd * sr);
      const len = Math.floor(nd * sr);
      for (let j = 0; j < len && start + j < data.length; j++) {
        const t = j / sr;
        const env = Math.exp(-t * 5);
        data[start + j] +=
          Math.sin(2 * Math.PI * notes[n] * t) * env * 0.3 +
          Math.sin(2 * Math.PI * notes[n] * 3 * t) * env * 0.08;
      }
    }
  }
  return buf;
}

// ============================================
// CARD TILT
// ============================================
function initCardTilt() {
  if (REDUCED_MOTION) return;
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        "perspective(800px) rotateY(" +
        x * 8 +
        "deg) rotateX(" +
        -y * 8 +
        "deg) translateY(-6px)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
function initMagneticButtons() {
  if (REDUCED_MOTION) return;
  document.querySelectorAll(".btn-magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform =
        "translate(" + x * 0.15 + "px, " + y * 0.15 + "px) scale(1.03)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

// ============================================
// SMOOTH SCROLL LINKS
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id === "#") return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(t, { offset: -80 });
      } else {
        t.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ============================================
// NEWSLETTER
// ============================================
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  const status = document.getElementById("newsletterStatus");
  const input = form.querySelector("input[type='email']");
  const btn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!input.value) return;

    const endpoint = form.getAttribute("action");
    if (!endpoint || endpoint.includes("YOUR_FORM_ID")) {
      status.textContent =
        "Newsletter form isn't connected yet — add your Formspree endpoint in index.html.";
      status.className = "nl-status error";
      showToast(
        "Add your Formspree form URL to the newsletter form's action attribute.",
        "error",
      );
      return;
    }

    btn.disabled = true;
    input.disabled = true;
    const originalLabel = btn.textContent;
    btn.textContent = "Sending...";
    status.textContent = "";
    status.className = "nl-status";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        status.textContent = "Thanks for subscribing! We'll keep you updated.";
        status.className = "nl-status success";
        showToast("Thanks for subscribing! We'll keep you updated.", "success");
        form.reset();
      } else {
        const data = await response.json().catch(() => null);
        const message =
          data && data.errors
            ? data.errors.map((er) => er.message).join(", ")
            : "Something went wrong. Please try again.";
        status.textContent = message;
        status.className = "nl-status error";
        showToast(message, "error");
      }
    } catch (err) {
      console.error(err);
      status.textContent = "Network error — please try again.";
      status.className = "nl-status error";
      showToast("Network error — please try again.", "error");
    }

    btn.disabled = false;
    input.disabled = false;
    btn.textContent = originalLabel;
  });
}

// ============================================
// INIT
// ============================================
function init() {
  initLenis();
  initGSAP();
  initNav();
  initIntro();
  initHeroFrames();
  initHeroWaveform();
  initTool();
  initMoodsCarousel();
  initStats();
  initParallax();
  initCardTilt();
  initMagneticButtons();
  initSmoothScroll();
  initNewsletter();
  setTimeout(() => initExamples(), 800);
}

document.addEventListener("DOMContentLoaded", init);
