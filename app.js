/**
 * ONLY FOR MY BORI ♡ — APPLICATION LOGIC
 * Features:
 *  1. Hello Kitty Tap & Explosion Animation (Shocked-Cat meme)
 *  2. Secret Birthday Login with "kookie" password validation
 *  3. Cute Cartoon Creature + Birthday Cake with 5 interactive candles
 *  4. Microphone blowing detection with fallback tap button
 *  5. Web Audio API Music Box Instrumental "Happy Birthday to You"
 *  6. Polaroid Scrapbook Gallery with Lightbox zoom
 *  7. Exact Birthday Letter with authentic formatting
 *  8. Private Owner Dashboard (passcode: lassi123 / ?owner=true / 4 taps on ✨)
 */

// Default settings conforming to exact specifications
const DEFAULT_SETTINGS = {
  nicknamePassword: "kookie",
  websiteTitle: "only for my bori",
  browserTitle: "only for my bori ♡",
  recipientName: "Bori",
  introHeading: "hiiii bori ♡",
  introSubtitle: "kitty has a surprise for uuu",
  reactionText: "hehe did i scare u? okay now real surprise time 😭💗",
  loginSubtitle: "a little something just for u ♡",
  loginMainHeading: "wassupp birthday boii",
  loginQuestion: "what was ur first nickname given by lassi?",
  cakeHeading: "OKAY BIRTHDAY BOII",
  cakeMessage: "make a wish before u get any older pls 😭",
  celebrationHeading: "YAYYY U DID IT!! 🎉",
  celebrationMessage: "THE CANDLES ARE GONEEE!! birthday boy deserves ALL the love, cake and happiness everrr 🎂",
  galleryHeading: "our lil gallery ♡",
  gallerySubtitle: "lil moments with my favourite human",
  photos: [
    {
      id: "photo-1",
      src: "1.jpeg",
      title: "Photo 1 — Roblox",
      caption: "just two sillies existing together ♡",
      badge: "core memory",
      sticker: "us ♡",
      rotation: -1.8,
      washiClass: "washi-pink"
    },
    {
      id: "photo-2",
      src: "2.jpeg",
      title: "Photo 2 — Mobile Legends Emotes",
      caption: "the way we be unserious together HELP 😭",
      badge: "unserious duo",
      sticker: "hehe 😭",
      rotation: 1.6,
      washiClass: "washi-lavender"
    },
    {
      id: "photo-3",
      src: "3.jpeg",
      title: "Photo 3 — Mobile Legends Gameplay",
      caption: "my fav duo partner, unfortunately for u ♡",
      badge: "duo goals",
      sticker: "besties",
      rotation: -1,
      washiClass: "washi-blue"
    }
  ],
  letterHeading: "a letter for u ♡",
  letterSubtitle: "okay fine, i'm being sappy for once. don't get used to it 😭",
  letterText: `Hiiiiii birthdayy boiiii!! HAPPPPYYYYY BIRTHDAYYYYY TO YOUUUUUU OMGGG!! Thank you for being born, unc hehe 😭

Anyways, I hope every day of your life will be filled with lotssss and lotsss of love and happiness!! I hope we get to meet irl and celebrate our birthdays together in real life someday, not just online like thisss.

We've been friends for almost 4 years watdahell oml 😭 hope we stay like this forever.

Sorry for being a bad friend at times. I just want you to know that I cherish you and the bond we have so muchhh, like so muchhh, I can't even describe it in words. I want you to always be happy, and I fr mean ittt (sunshine and lollipopsss).

Sorry for hurting you sometimes, ugh. I'm out of wordsss omg ugh hehe. Just kiddinggg. I hope yk how much I really CHERISH YOU AS MY BESTESTTSTSTST FRIENDDDD. I LOBEEE YOU SO MUCHHHHH 💗

I hope we never become strangers. That would be so badd, like so baddd. Imagine not being able to talk to someone as great as me??? Uhm lmaooo, js kidding.

Anywaysss, js you wait until I get richhh!! I'm gonna spoil ya with so many giftssss, fs! 😛

Anywaysss, lastlyyy, THANK YOU FOR BEING YOUUUU!! #YOUDABESTHB MUHEHEHEHE

( i didn't type anything using chatgpt i swear it js looks like that because i used it only to crct my grammar 😭 )`,
  letterEndMessage: "that's ur tiny lil surprise. hope it made u smile ♡",
  footerText: "made with love by lassi — just for bori",
  ownerPasscode: "lassi123"
};

// Global App State
let state = {
  settings: { ...DEFAULT_SETTINGS },
  soundEnabled: true,
  audioContext: null,
  candlesExtinguished: [false, false, false, false, false],
  micActive: false,
  micStream: null,
  musicPlaying: false,
  musicTimer: null,
  ownerTapCount: 0,
  ownerTapTimeout: null,
  isOwnerAuthenticated: false,
  wishFloodTriggered: false,
  wishFloodActive: false,
  wishFloodTimers: []
};

// ==========================================
// INITIALIZATION & PERSISTENCE
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  loadLocalSettings();
  await loadServerSettings();
  applySettingsToUI();
  initAmbientDecorations();
  initConfettiCanvas();
  setupEventListeners();
  checkOwnerQueryParam();
});

function loadLocalSettings() {
  try {
    const saved = localStorage.getItem("bori_birthday_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      state.settings = { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn("Could not load local storage:", e);
  }
}

async function loadServerSettings() {
  try {
    const res = await fetch("/api/settings");
    if (res.ok) {
      const serverData = await res.json();
      state.settings = { ...state.settings, ...serverData };
      saveSettingsLocally();
    }
  } catch (e) {
    // Backend optional: running statically
  }
}

function saveSettingsLocally() {
  try {
    localStorage.setItem("bori_birthday_settings", JSON.stringify(state.settings));
  } catch (e) {
    console.warn("Failed to save to local storage:", e);
  }
}

async function saveSettingsToServer(updatedFields) {
  try {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields)
    });
  } catch (e) {
    // Offline / static mode
  }
}

function applySettingsToUI() {
  const s = state.settings;
  document.title = s.browserTitle || "only for my bori ♡";
  
  const navTitle = document.getElementById("nav-brand-title");
  if (navTitle) navTitle.textContent = s.websiteTitle;

  const introHeading = document.getElementById("intro-heading");
  if (introHeading) introHeading.textContent = s.introHeading;

  const introSubtitle = document.getElementById("intro-subtitle");
  if (introSubtitle) introSubtitle.textContent = s.introSubtitle;

  const reactionText = document.getElementById("intro-reaction-text");
  if (reactionText) reactionText.textContent = s.reactionText;

  const loginSub = document.getElementById("login-sub-badge");
  if (loginSub) loginSub.textContent = s.loginSubtitle;

  const loginHeading = document.getElementById("login-main-heading");
  if (loginHeading) loginHeading.textContent = s.loginMainHeading;

  const loginQuestion = document.getElementById("login-question-text");
  if (loginQuestion) loginQuestion.textContent = s.loginQuestion;

  const cakeHeading = document.getElementById("cake-heading");
  if (cakeHeading) cakeHeading.textContent = s.cakeHeading;

  const cakeMessage = document.getElementById("cake-message");
  if (cakeMessage) cakeMessage.textContent = s.cakeMessage;

  const celHeading = document.getElementById("celebration-heading");
  if (celHeading) celHeading.textContent = s.celebrationHeading;

  const celMessage = document.getElementById("celebration-message");
  if (celMessage) celMessage.textContent = s.celebrationMessage;

  const galHeading = document.getElementById("gallery-heading");
  if (galHeading) galHeading.textContent = s.galleryHeading;

  const galSubtitle = document.getElementById("gallery-subtitle");
  if (galSubtitle) galSubtitle.textContent = s.gallerySubtitle;

  const letterHeading = document.getElementById("letter-heading");
  if (letterHeading) letterHeading.textContent = s.letterHeading;

  const letterSubtitle = document.getElementById("letter-subtitle");
  if (letterSubtitle) letterSubtitle.textContent = s.letterSubtitle;

  const letterBody = document.getElementById("letter-body");
  if (letterBody && s.letterText) {
    letterBody.innerHTML = formatLetterContent(s.letterText);
  }

  const letterEnd = document.getElementById("letter-end-message");
  if (letterEnd) letterEnd.textContent = s.letterEndMessage;

  const footerText = document.getElementById("public-footer-text");
  if (footerText) footerText.textContent = s.footerText;

  renderGallery();
}

function formatLetterContent(text) {
  const paragraphs = text.split("\n\n").filter(p => p.trim().length > 0);
  return paragraphs.map(p => {
    const trimmed = p.trim();
    if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
      return `<p class="letter-postscript">${escapeHtml(trimmed)}</p>`;
    }
    return `<p>${escapeHtml(trimmed).replace(/\n/g, "<br>")}</p>`;
  }).join("");
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// SCREEN TRANSITIONS
// ==========================================
function showScreen(screenId) {
  if (screenId !== "screen-cake") {
    stopMicrophone();
  }
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.remove("hidden");
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (screenId === "screen-gallery") {
      initGalleryWishFloodTrigger();
    }
  }
}

// ==========================================
// AMBIENT DECORATIONS & PARTICLES
// ==========================================
function initAmbientDecorations() {
  const container = document.getElementById("ambient-decorations");
  if (!container) return;
  const symbols = ["♡", "💗", "✨", "🎀", "🌸", "⭐"];
  
  for (let i = 0; i < 16; i++) {
    const el = document.createElement("span");
    el.className = "floating-particle";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = `${Math.random() * 95}%`;
    el.style.animationDuration = `${8 + Math.random() * 8}s`;
    el.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(el);
  }
}

// ==========================================
// WEB AUDIO API SOUND SYSTEM
// ==========================================
function getAudioContext() {
  if (!state.audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new AudioContextClass();
  }
  if (state.audioContext.state === "suspended") {
    state.audioContext.resume();
  }
  return state.audioContext;
}

// Comedic explosion impact sound
function playExplosionSound() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Sub-bass thump
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);

    // White noise explosion burst
    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to give it that punchy cartoon blast texture
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.55);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.6);
  } catch (e) {
    console.warn("Audio explosion play error:", e);
  }
}

// Sweet chime / sparkle sound
function playChimeSound() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.2, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.6);
    });
  } catch (e) {}
}

// Soft candle puff sound
function playBlowSound() {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(600, now);
    filter.Q.setValueAtTime(3, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.3);
  } catch (e) {}
}

// ========================================================
// MUSIC BOX SYNTHESIZER: "HAPPY BIRTHDAY TO YOU" MELODY
// ========================================================
// Note Frequencies in Hz (Key of C)
const NOTES = {
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99
};

// Sheet melody for "Happy Birthday to You"
// Beat durations: quarter = 0.52s
const BIRTHDAY_MELODY = [
  // "Hap-py birth-day to you"
  { note: NOTES.G4, dur: 0.35, pause: 0.1 },
  { note: NOTES.G4, dur: 0.25, pause: 0.05 },
  { note: NOTES.A4, dur: 0.6, pause: 0.08 },
  { note: NOTES.G4, dur: 0.6, pause: 0.08 },
  { note: NOTES.C5, dur: 0.6, pause: 0.08 },
  { note: NOTES.B4, dur: 1.1, pause: 0.25 },

  // "Hap-py birth-day to you"
  { note: NOTES.G4, dur: 0.35, pause: 0.1 },
  { note: NOTES.G4, dur: 0.25, pause: 0.05 },
  { note: NOTES.A4, dur: 0.6, pause: 0.08 },
  { note: NOTES.G4, dur: 0.6, pause: 0.08 },
  { note: NOTES.D5, dur: 0.6, pause: 0.08 },
  { note: NOTES.C5, dur: 1.1, pause: 0.25 },

  // "Hap-py birth-day dear Bo-ri"
  { note: NOTES.G4, dur: 0.35, pause: 0.1 },
  { note: NOTES.G4, dur: 0.25, pause: 0.05 },
  { note: NOTES.G5, dur: 0.6, pause: 0.08 },
  { note: NOTES.E5, dur: 0.6, pause: 0.08 },
  { note: NOTES.C5, dur: 0.6, pause: 0.08 },
  { note: NOTES.B4, dur: 0.6, pause: 0.08 },
  { note: NOTES.A4, dur: 1.1, pause: 0.25 },

  // "Hap-py birth-day to you!"
  { note: NOTES.F5, dur: 0.35, pause: 0.1 },
  { note: NOTES.F5, dur: 0.25, pause: 0.05 },
  { note: NOTES.E5, dur: 0.6, pause: 0.08 },
  { note: NOTES.C5, dur: 0.6, pause: 0.08 },
  { note: NOTES.D5, dur: 0.6, pause: 0.08 },
  { note: NOTES.C5, dur: 1.5, pause: 0.4 }
];

function playMusicBoxNote(ctx, freq, startTime) {
  // Harmonic 1: Fundamental Sine (Crystal clear chime tone)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(freq, startTime);

  gain1.gain.setValueAtTime(0.35, startTime);
  gain1.gain.exponentialRampToValueAtTime(0.001, startTime + 1.6);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(startTime);
  osc1.stop(startTime + 1.6);

  // Harmonic 2: Octave overtone (gives music-box tines characteristic brightness)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(freq * 2, startTime);

  gain2.gain.setValueAtTime(0.12, startTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(startTime);
  osc2.stop(startTime + 0.9);

  // Harmonic 3: High bell ping (metallic resonance)
  const osc3 = ctx.createOscillator();
  const gain3 = ctx.createGain();
  osc3.type = "sine";
  osc3.frequency.setValueAtTime(freq * 3.8, startTime);

  gain3.gain.setValueAtTime(0.04, startTime);
  gain3.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

  osc3.connect(gain3);
  gain3.connect(ctx.destination);
  osc3.start(startTime);
  osc3.stop(startTime + 0.4);
}

// Birthday Song and Cute Singing Cat State
let melodyNoteIndex = 0;
let melodyNoteTimer = null;

function startBirthdaySong() {
  if (!state.soundEnabled) return;

  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
  } catch (e) {}

  // If song reached the end previously, reset to start fresh
  if (melodyNoteIndex >= BIRTHDAY_MELODY.length) {
    melodyNoteIndex = 0;
  }

  state.musicPlaying = true;
  updateMusicUI(true);
  updateSingingCatAnimation("playing");

  playNextMelodyNote();
}

function playNextMelodyNote() {
  if (!state.musicPlaying) return;

  if (melodyNoteIndex >= BIRTHDAY_MELODY.length) {
    // Song completed!
    state.musicPlaying = false;
    updateMusicUI("finished");
    updateSingingCatAnimation("settled");
    
    // Reveal existing "swipe up for ur memories ↓" prompt
    const cueBox = document.getElementById("gallery-cue-box");
    if (cueBox) {
      cueBox.classList.remove("hidden");
      setTimeout(() => {
        cueBox.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
    return;
  }

  const item = BIRTHDAY_MELODY[melodyNoteIndex];
  try {
    const ctx = getAudioContext();
    playMusicBoxNote(ctx, item.note, ctx.currentTime);
  } catch (e) {
    console.warn("Could not play note:", e);
  }

  melodyNoteIndex++;
  const noteDurationMs = (item.dur + item.pause) * 1000;
  melodyNoteTimer = setTimeout(playNextMelodyNote, noteDurationMs);
}

function pauseBirthdaySong() {
  state.musicPlaying = false;
  if (melodyNoteTimer) {
    clearTimeout(melodyNoteTimer);
    melodyNoteTimer = null;
  }
  updateMusicUI(false);
  updateSingingCatAnimation("paused");
}

function stopBirthdaySong() {
  state.musicPlaying = false;
  if (melodyNoteTimer) {
    clearTimeout(melodyNoteTimer);
    melodyNoteTimer = null;
  }
  melodyNoteIndex = 0;
  updateMusicUI(false);
  updateSingingCatAnimation("settled");
}

function replayBirthdaySong() {
  if (melodyNoteTimer) {
    clearTimeout(melodyNoteTimer);
    melodyNoteTimer = null;
  }
  melodyNoteIndex = 0;
  startBirthdaySong();
}

function updateMusicUI(stateOrStatus) {
  const label = document.getElementById("music-play-label");
  const replayBtn = document.getElementById("btn-music-replay");
  const visualizer = document.getElementById("music-visualizer");

  if (replayBtn) {
    replayBtn.classList.remove("hidden");
  }

  if (stateOrStatus === true) {
    if (label) label.textContent = "⏸ pause song";
    if (visualizer) visualizer.classList.add("playing");
  } else if (stateOrStatus === "finished") {
    if (label) label.textContent = "↺ play again ♡";
    if (visualizer) visualizer.classList.remove("playing");
  } else {
    // Paused or stopped
    if (label) label.textContent = melodyNoteIndex > 0 ? "▶ resume song ♡" : "▶ play ur birthday song ♡";
    if (visualizer) visualizer.classList.remove("playing");
  }
}

function updateSingingCatAnimation(mode) {
  const stage = document.getElementById("singing-cat-stage");
  const singingMouth = document.getElementById("cat-mouth-singing");
  const settledMouth = document.getElementById("cat-mouth-settled");
  if (!stage) return;

  if (mode === "playing") {
    stage.classList.remove("paused", "settled");
    stage.classList.add("playing");
    if (singingMouth) singingMouth.classList.remove("hidden");
    if (settledMouth) settledMouth.classList.add("hidden");
  } else if (mode === "paused") {
    stage.classList.remove("playing");
    stage.classList.add("paused");
  } else if (mode === "settled") {
    stage.classList.remove("playing", "paused");
    stage.classList.add("settled");
    if (singingMouth) singingMouth.classList.add("hidden");
    if (settledMouth) settledMouth.classList.remove("hidden");
  }
}

// ==========================================
// 1. HELLO KITTY INTRO & EXPLOSION MEME
// ==========================================
function setupIntroEvents() {
  const kittyStage = document.getElementById("kitty-stage");
  const explosionOverlay = document.getElementById("explosion-overlay");
  const fireball = document.getElementById("explosion-fireball");
  const smokeRing = document.getElementById("explosion-smoke-ring");
  const blastMemeContainer = document.getElementById("blast-img-container");
  const blastParticles = document.getElementById("blast-particles");
  const screenFlash = document.getElementById("screen-flash");
  const reactionBox = document.getElementById("intro-reaction-box");
  const introCard = document.querySelector(".intro-card");
  const continueBtn = document.getElementById("btn-intro-continue");

  let isExploding = false;

  function triggerExplosion(e) {
    if (e) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }
    if (isExploding) return;
    isExploding = true;

    // 1. Play comedic cartoon punch sound immediately (respects soundEnabled)
    playExplosionSound();

    // 2. Fullscreen blinding bright flash
    if (screenFlash) {
      screenFlash.classList.remove("flash-active");
      void screenFlash.offsetWidth; // force DOM reflow
      screenFlash.classList.add("flash-active");
    }

    // 3. Screen / App Camera Shake
    const shakeTarget = introCard || document.body;
    shakeTarget.classList.remove("screen-shake");
    void shakeTarget.offsetWidth;
    shakeTarget.classList.add("screen-shake");
    setTimeout(() => shakeTarget.classList.remove("screen-shake"), 750);

    // 4. Expand kittyStage out of overflow clipping & ignite fiery glow
    if (kittyStage) kittyStage.classList.add("exploding");

    // 5. Activate Explosion Overlay
    if (explosionOverlay) {
      explosionOverlay.classList.remove("hidden");
      explosionOverlay.classList.add("active");
    }

    // 6. Trigger Fireball Animation behind meme
    if (fireball) {
      fireball.classList.remove("fire-active");
      void fireball.offsetWidth;
      fireball.classList.add("fire-active");
    }

    // 7. Trigger Smoke Ring
    if (smokeRing) {
      smokeRing.classList.remove("smoke-active");
      void smokeRing.offsetWidth;
      smokeRing.classList.add("smoke-active");
    }

    // 8. Trigger Shocked Cat Meme Zoom Punchline in front of fireball
    if (blastMemeContainer) {
      blastMemeContainer.classList.remove("meme-active");
      void blastMemeContainer.offsetWidth;
      blastMemeContainer.classList.add("meme-active");
    }

    // 9. Generate Flying Sparks & Particles
    if (blastParticles) {
      blastParticles.innerHTML = "";
      const particleIcons = ["💥", "🔥", "✨", "⚡", "⭐", "💨"];
      const particleCount = 28;

      for (let i = 0; i < particleCount; i++) {
        const p = document.createElement("span");
        p.className = "blast-particle";
        p.textContent = particleIcons[Math.floor(Math.random() * particleIcons.length)];

        const angle = Math.random() * Math.PI * 2;
        const dist = 110 + Math.random() * 190;
        const dx = `${Math.round(Math.cos(angle) * dist)}px`;
        const dy = `${Math.round(Math.sin(angle) * dist)}px`;
        const rot = `${(Math.random() - 0.5) * 720}deg`;
        const scale = (0.8 + Math.random() * 0.9).toFixed(2);
        const delay = (Math.random() * 0.25).toFixed(2);

        p.style.setProperty("--dx", dx);
        p.style.setProperty("--dy", dy);
        p.style.setProperty("--rot", rot);
        p.style.setProperty("--scale", scale);
        p.style.animationDelay = `${delay}s`;

        blastParticles.appendChild(p);
      }
    }

    // 10. After 3.2 seconds, smoothly return to Hello Kitty & reveal reaction text & "let's gooo ♡"
    setTimeout(() => {
      if (kittyStage) kittyStage.classList.remove("exploding");
      if (explosionOverlay) {
        explosionOverlay.classList.remove("active");
        explosionOverlay.classList.add("hidden");
      }
      if (blastParticles) blastParticles.innerHTML = "";
      if (reactionBox) {
        reactionBox.classList.remove("hidden");
      }
      if (continueBtn) {
        continueBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      isExploding = false;
    }, 3200);
  }

  if (kittyStage) {
    kittyStage.addEventListener("click", triggerExplosion);
    kittyStage.addEventListener("touchend", triggerExplosion, { passive: false });
  }

  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      showScreen("screen-login");
    });
  }
}

// ==========================================
// 2. SECRET BIRTHDAY LOGIN
// ==========================================
function setupLoginEvents() {
  const form = document.getElementById("login-form");
  const input = document.getElementById("login-answer-input");
  const errorMsg = document.getElementById("login-error-msg");
  const successMsg = document.getElementById("login-success-msg");

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const answer = input.value.trim().toLowerCase();
      const expected = (state.settings.nicknamePassword || "kookie").trim().toLowerCase();

      if (answer === expected) {
        // Correct answer!
        if (errorMsg) errorMsg.classList.add("hidden");
        if (successMsg) successMsg.classList.remove("hidden");
        playChimeSound();
        triggerConfetti(60);

        setTimeout(() => {
          showScreen("screen-cake");
        }, 900);
      } else {
        // Incorrect answer
        if (successMsg) successMsg.classList.add("hidden");
        if (errorMsg) {
          errorMsg.textContent = "hmm, try again hehe ♡";
          errorMsg.classList.remove("hidden");
        }
        input.classList.add("shake-input");
        setTimeout(() => input.classList.remove("shake-input"), 400);
      }
    });
  }
}

// ==========================================
// 3. BIRTHDAY CAKE & FIVE CANDLES
// ==========================================
function setupCakeEvents() {
  const tapBlowBtn = document.getElementById("btn-tap-blow");
  const micToggleBtn = document.getElementById("btn-mic-toggle");
  const toGalleryBtn = document.getElementById("btn-to-gallery");
  const musicPlayBtn = document.getElementById("btn-music-play");
  const musicReplayBtn = document.getElementById("btn-music-replay");

  // Allow tapping individual flames directly on the SVG cake
  for (let i = 1; i <= 5; i++) {
    const flame = document.getElementById(`flame-${i}`);
    if (flame) {
      flame.addEventListener("click", () => extinguishCandle(i - 1));
    }
  }

  // Tap to Blow All fallback button
  if (tapBlowBtn) {
    tapBlowBtn.addEventListener("click", () => {
      blowOutAllCandles();
    });
  }

  // Microphone toggle button
  if (micToggleBtn) {
    micToggleBtn.addEventListener("click", toggleMicrophone);
  }

  // Music controls
  if (musicPlayBtn) {
    musicPlayBtn.addEventListener("click", () => {
      if (state.musicPlaying) {
        pauseBirthdaySong();
      } else {
        startBirthdaySong();
      }
    });
  }

  if (musicReplayBtn) {
    musicReplayBtn.addEventListener("click", () => {
      replayBirthdaySong();
    });
  }

  if (toGalleryBtn) {
    toGalleryBtn.addEventListener("click", () => {
      showScreen("screen-gallery");
    });
  }
}

function extinguishCandle(index) {
  if (state.candlesExtinguished[index]) return;
  state.candlesExtinguished[index] = true;

  const candleNum = index + 1;
  const flame = document.getElementById(`flame-${candleNum}`);
  const smoke = document.getElementById(`smoke-${candleNum}`);

  if (flame) {
    flame.classList.add("flame-extinguished");
  }
  if (smoke) {
    smoke.classList.remove("hidden");
    smoke.classList.add("smoke-rise");
  }

  playBlowSound();

  const allGone = state.candlesExtinguished.every(v => v === true);
  if (allGone) {
    triggerCandleCelebration();
  }
}

function blowOutAllCandles() {
  playBlowSound();
  state.candlesExtinguished.forEach((isGone, i) => {
    if (!isGone) {
      setTimeout(() => extinguishCandle(i), i * 140);
    }
  });
}

function triggerCandleCelebration() {
  stopMicrophone();

  // Wiggle character
  const char = document.getElementById("kawaii-character");
  if (char) char.classList.add("happy-wiggle");

  // Hide candle blow controls
  const controls = document.getElementById("candle-controls");
  const preBlow = document.getElementById("cake-pre-blow-group");
  if (controls) controls.classList.add("hidden");
  if (preBlow) preBlow.classList.add("hidden");

  // Show celebration card
  const card = document.getElementById("celebration-card");
  if (card) {
    card.classList.remove("hidden");
    card.scrollIntoView({ behavior: "smooth" });
  }

  // Confetti burst
  triggerConfetti(120);

  // Automatically start cheerful instrumental Happy Birthday melody
  setTimeout(() => {
    startBirthdaySong();
  }, 400);
}

// Microphone Blowing Detection
let micAnimFrameId = null;
let micBaselineLevel = 30;

async function toggleMicrophone() {
  const statusText = document.getElementById("mic-status-text");
  const micLabel = document.getElementById("mic-btn-label");

  if (state.micActive) {
    stopMicrophone();
    if (statusText) statusText.textContent = "microphone stopped. tap 'tap to blow ♡' below instead ♡";
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (statusText) statusText.textContent = "microphone not available on this device. tap 'tap to blow ♡' below ♡";
    return;
  }

  try {
    if (statusText) statusText.textContent = "requesting mic permission...";

    // Request uncompressed audio (turning off noise suppression so breath turbulence isn't suppressed)
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
      });
    } catch (e) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    }

    state.micStream = stream;
    state.micActive = true;

    if (micLabel) micLabel.textContent = "🛑 stop mic";
    if (statusText) statusText.textContent = "calibrating ambient room noise... 🎙️";

    const audioCtx = getAudioContext();
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.35;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount; // 256 bins
    const dataArray = new Uint8Array(bufferLength);

    // Baseline calibration phase: sample ambient noise for ~35 frames (~600ms)
    let calibrationFrames = 0;
    const maxCalibrationFrames = 35;
    let baselineSum = 0;
    let blowFrameCount = 0;

    function detectBlow() {
      if (!state.micActive) return;

      analyser.getByteFrequencyData(dataArray);

      // Low frequency energy (turbulent wind/breath noise against microphone capsule: 20Hz - 350Hz)
      let lowSum = 0;
      for (let i = 0; i < 6; i++) {
        lowSum += dataArray[i];
      }
      const avgLow = lowSum / 6;

      // Mid frequency energy (vocal speech, room chatter, music: 450Hz - 2500Hz)
      let midSum = 0;
      for (let i = 6; i < 28; i++) {
        midSum += dataArray[i];
      }
      const avgMid = midSum / 22;

      // 1. Calibration Phase: measure ambient background room noise
      if (calibrationFrames < maxCalibrationFrames) {
        calibrationFrames++;
        baselineSum += avgLow;
        if (calibrationFrames === maxCalibrationFrames) {
          // Set rolling baseline with safety margin
          micBaselineLevel = Math.max(15, Math.min(80, (baselineSum / maxCalibrationFrames) + 26));
          if (statusText && state.micActive) {
            statusText.textContent = "ready! blow steadily into your mic 🌬️🎂";
          }
        }
        micAnimFrameId = requestAnimationFrame(detectBlow);
        return;
      }

      // 2. Detection Criteria:
      // (a) Sub-bass energy must substantially exceed ambient baseline (+26) and absolute threshold (at least 68)
      const hasSignificantLowEnergy = avgLow > Math.max(68, micBaselineLevel + 26);
      
      // (b) Breath characteristic ratio: air hitting the capsule creates deep broadband turbulence with low vocal formants
      // Voice / speech has high mid-range formants, giving a much lower low/mid ratio
      const isBreathLikeRatio = (avgLow / (avgMid + 1)) > 1.15 || (avgLow > 120 && avgLow > avgMid * 1.05);

      if (hasSignificantLowEnergy && isBreathLikeRatio) {
        blowFrameCount++;
        if (blowFrameCount >= 5 && blowFrameCount < 18) {
          if (statusText && state.micActive) {
            statusText.textContent = "blowing detected! keep blowing... 💨";
          }
        }

        // (c) Sustained duration requirement: ~350ms (18 consecutive frames at 60fps)
        if (blowFrameCount >= 18) {
          stopMicrophone();
          blowOutAllCandles();
          return;
        }
      } else {
        // Natural gradual decay so brief hiccups don't instantly reset, but speech/clicks decay quickly
        blowFrameCount = Math.max(0, blowFrameCount - 2);
        if (blowFrameCount === 0 && statusText && state.micActive) {
          statusText.textContent = "ready! blow steadily into your mic 🌬️🎂";
        }
      }

      micAnimFrameId = requestAnimationFrame(detectBlow);
    }

    micAnimFrameId = requestAnimationFrame(detectBlow);
  } catch (err) {
    console.warn("Microphone access denied or error:", err);
    state.micActive = false;
    if (micLabel) micLabel.textContent = "🎙️ blow with mic";
    if (statusText) statusText.textContent = "microphone permission denied or unavailable. tap 'tap to blow ♡' below! ♡";
  }
}

function stopMicrophone() {
  if (micAnimFrameId) {
    cancelAnimationFrame(micAnimFrameId);
    micAnimFrameId = null;
  }
  if (state.micStream) {
    state.micStream.getTracks().forEach(t => t.stop());
    state.micStream = null;
  }
  state.micActive = false;
  const micLabel = document.getElementById("mic-btn-label");
  if (micLabel) micLabel.textContent = "🎙️ blow with mic";
}

// ==========================================
// 4. PERSONAL PHOTO GALLERY & LIGHTBOX
// ==========================================
function renderGallery() {
  const grid = document.getElementById("polaroid-grid");
  if (!grid) return;

  grid.innerHTML = "";
  const photos = state.settings.photos || DEFAULT_SETTINGS.photos;

  photos.forEach((photo, idx) => {
    const card = document.createElement("article");
    card.className = `polaroid-card`;
    card.style.transform = `rotate(${photo.rotation || 0}deg)`;
    card.setAttribute("data-index", idx);

    card.innerHTML = `
      <div class="washi-tape ${photo.washiClass || 'washi-pink'}"></div>
      <div class="polaroid-img-frame">
        <img src="${photo.src}" alt="${escapeHtml(photo.title || 'Memory')}" class="polaroid-img" loading="lazy" />
        <span class="doodle-badge">${escapeHtml(photo.sticker || 'us ♡')}</span>
      </div>
      <div class="polaroid-footer">
        <p class="polaroid-caption">${escapeHtml(photo.caption || '')}</p>
        <div class="doodle-row">
          <span class="doodle-note">${escapeHtml(photo.badge || 'core memory')}</span>
          <span class="doodle-sparkle">✨</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => openLightbox(photo));
    grid.appendChild(card);
  });
}

function openLightbox(photo) {
  const modal = document.getElementById("lightbox-modal");
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");

  if (modal && img && caption) {
    img.src = photo.src;
    img.alt = photo.title || "Memory";
    caption.textContent = photo.caption || "";
    modal.classList.remove("hidden");
  }
}

// ==========================================
// BIRTHDAY WISH FLOOD & GHOSTIE INVASION
// ==========================================
const BIRTHDAY_WISHES = [
  "HAPPY BIRTHDAYYYY BORIIII!! 🎂💗",
  "HAPPIEST BIRTHDAY TO MY FAV UNC 😭🙏🏻",
  "U DESERVE ALL THE LOVE EVER!! 💗",
  "MORE CAKE MORE HAPPINESS MORE EVERYTHINGGG 🎂",
  "STAY HAPPY FOREVERRR!! 🫶🏻",
  "ANOTHER YEAR OF BEING AN ICON 💅",
  "SENDING U A MILLION HUGS 🫂💗",
  "MAY ALL UR WISHES COME TRUE ✨",
  "BIRTHDAY BOIIIII!!! 🥳",
  "U BETTER EAT LOTS OF CAKE TODAY 😭🎂",
  "SUNSHINE AND LOLLIPOPSSS 🍭☀️",
  "HOPE U SMILE A LOT TODAYYY 💗",
  "U DESERVE THE SOFTEST, HAPPIEST LIFE 🥹",
  "HAPPY BIRTHDAY MY FAV HUMAN ♡",
  "MORE MEMORIES WITH LASSI WHENNN 😭🫶🏻",
  "WE NEED TO CELEBRATE IRL SOMEDAY!!",
  "HAVE THE BESTEST BIRTHDAY EVER ✨",
  "BIRTHDAY BOY SPOTTED 🚨🎂",
  "BIRTHDAY WISHES INCOMINGGG 💌",
  "SURPRISEEEEE!! WE LOVE UUU 💗"
];

const GHOSTIE_SPEECHES = [
  "HAPPY BIRTHDAYYYY 👻💗",
  "WE CAME TO CELEBRATE UUU!!",
  "BIRTHDAY BOY, LOOK AT USSS 😭",
  "MORE LOVE FOR BORIIII!!"
];

const GHOSTIE_PROPS = ["🎂", "🎈", "💗", "🎉", "✨"];
const BUBBLE_COLORS = ["bubble-pink", "bubble-lavender", "bubble-blue", "bubble-peach", "bubble-mint"];

function initGalleryWishFloodTrigger() {
  if (state.wishFloodTriggered) return;

  const triggerFloodWithDelay = () => {
    if (state.wishFloodTriggered) return;
    state.wishFloodTriggered = true;

    // Short, randomized delay (1.8s - 3.2s) so gallery looks completely normal first
    const delay = 1800 + Math.random() * 1400;
    const timer = setTimeout(() => {
      startWishFlood();
    }, delay);
    state.wishFloodTimers.push(timer);
  };

  const onScroll = () => {
    triggerFloodWithDelay();
    window.removeEventListener("scroll", onScroll);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  // Also fallback timer in case visitor lingers without scrolling immediately
  triggerFloodWithDelay();
}

function startWishFlood() {
  if (state.wishFloodActive) return;
  state.wishFloodActive = true;

  const overlay = document.getElementById("wish-flood-overlay");
  const stage = document.getElementById("wish-flood-stage");
  const card = document.getElementById("wish-flood-card");
  if (!overlay || !stage) return;

  overlay.classList.remove("hidden", "fade-out");
  stage.innerHTML = "";

  const shuffledWishes = [...BIRTHDAY_WISHES].sort(() => Math.random() - 0.5);
  const types = ["handwritten", "bubble", "sticker", "mini-card", "ghostie"];

  function spawnWish(type, text, customStartX) {
    if (!state.wishFloodActive) return;

    const el = document.createElement("div");
    el.className = "floating-wish";

    // Spread uniformly across full viewport width (3vw to 88vw)
    const startX = customStartX !== undefined ? customStartX : Math.floor(Math.random() * 86) + 3;
    const duration = (6.2 + Math.random() * 3.8).toFixed(1); // 6.2s to 10s
    const rotStart = `${(Math.random() * 16 - 8).toFixed(1)}deg`;
    const rotMid = `${(Math.random() * 14 - 7).toFixed(1)}deg`;
    const rotEnd = `${(Math.random() * 16 - 8).toFixed(1)}deg`;

    const d1 = `${Math.round(Math.random() * 60 - 30)}px`;
    const d2 = `${Math.round(Math.random() * 80 - 40)}px`;
    const d3 = `${Math.round(Math.random() * 60 - 30)}px`;
    const d4 = `${Math.round(Math.random() * 80 - 40)}px`;

    el.style.setProperty("--start-x", `${startX}vw`);
    el.style.setProperty("--float-duration", `${duration}s`);
    el.style.setProperty("--rot-start", rotStart);
    el.style.setProperty("--rot-mid", rotMid);
    el.style.setProperty("--rot-end", rotEnd);
    el.style.setProperty("--drift-x1", d1);
    el.style.setProperty("--drift-x2", d2);
    el.style.setProperty("--drift-x3", d3);
    el.style.setProperty("--drift-x4", d4);

    if (type === "ghostie") {
      const prop = GHOSTIE_PROPS[Math.floor(Math.random() * GHOSTIE_PROPS.length)];
      const speech = GHOSTIE_SPEECHES[Math.floor(Math.random() * GHOSTIE_SPEECHES.length)];
      el.classList.add("wish-ghostie");
      el.innerHTML = `
        <span class="ghostie-avatar">👻<span class="ghostie-prop">${prop}</span></span>
        <span class="ghostie-speech">${escapeHtml(speech)}</span>
      `;
    } else if (type === "handwritten") {
      el.classList.add("wish-handwritten");
      el.textContent = text;
    } else if (type === "bubble") {
      const color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      el.classList.add("wish-speech-bubble", color);
      el.textContent = text;
    } else if (type === "sticker") {
      el.classList.add("wish-sticker");
      el.textContent = `✨ ${text}`;
    } else {
      el.classList.add("wish-mini-card");
      el.textContent = `💌 ${text}`;
    }

    stage.appendChild(el);

    // Auto cleanup after finish
    setTimeout(() => {
      el.remove();
    }, parseFloat(duration) * 1000 + 200);
  }

  // Gradually increase density: 36 wishes spread across the entire screen from edge to edge
  const totalWishes = 36;
  for (let i = 0; i < totalWishes; i++) {
    let delay = 0;
    if (i < 5) {
      delay = i * 450 + Math.random() * 200;
    } else {
      delay = 2200 + (i - 5) * 160 + Math.random() * 120;
    }

    const t = types[i % types.length];
    const msg = shuffledWishes[i % shuffledWishes.length];

    // Distribute into 4 wide horizontal lanes across the whole viewport width
    const lane = i % 4; // 0, 1, 2, 3
    const laneWidth = 21; // ~21vw per lane
    const minX = 3 + lane * laneWidth;
    const startX = Math.floor(minX + Math.random() * (laneWidth - 3));

    const timer = setTimeout(() => {
      spawnWish(t, msg, startX);
    }, delay);
    state.wishFloodTimers.push(timer);
  }

  // After the flood runs for ~6.8 seconds, reveal the centered pink card
  const cardTimer = setTimeout(() => {
    if (!state.wishFloodActive) return;
    if (card) {
      card.classList.remove("hidden");
    }
  }, 6800);
  state.wishFloodTimers.push(cardTimer);
}

function dismissWishFlood() {
  const overlay = document.getElementById("wish-flood-overlay");
  const card = document.getElementById("wish-flood-card");
  const stage = document.getElementById("wish-flood-stage");

  // Clear any pending spawn timers
  state.wishFloodTimers.forEach(t => clearTimeout(t));
  state.wishFloodTimers = [];

  if (overlay) {
    overlay.classList.add("fade-out");
  }

  setTimeout(() => {
    if (overlay) {
      overlay.classList.add("hidden");
      overlay.classList.remove("fade-out");
    }
    if (card) card.classList.add("hidden");
    if (stage) stage.innerHTML = "";
    state.wishFloodActive = false;
  }, 500);
}

function setupGalleryEvents() {
  const toLetterBtn = document.getElementById("btn-to-letter");
  if (toLetterBtn) {
    toLetterBtn.addEventListener("click", () => {
      showScreen("screen-letter");
    });
  }

  // Dismiss button on final surprise card
  const dismissBtn = document.getElementById("btn-dismiss-wish-flood");
  if (dismissBtn) {
    dismissBtn.addEventListener("click", () => {
      dismissWishFlood();
    });
  }

  // Lightbox close events
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxClose = document.getElementById("lightbox-close");
  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
      lightboxModal?.classList.add("hidden");
    });
  }
  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.add("hidden");
      }
    });
  }
}

// ==========================================
// 5. OWNER CUSTOMIZATION DASHBOARD
// ==========================================
function setupOwnerEvents() {
  const sparkleBtn = document.getElementById("btn-owner-trigger");
  const ownerModal = document.getElementById("owner-modal");
  const closeBtn = document.getElementById("btn-owner-close");
  const authForm = document.getElementById("owner-auth-form");
  const passInput = document.getElementById("owner-passcode-input");
  const authError = document.getElementById("owner-auth-error");
  const authPanel = document.getElementById("owner-auth-panel");
  const settingsPanel = document.getElementById("owner-settings-panel");

  // 4 taps on sparkle button triggers owner dashboard
  if (sparkleBtn) {
    sparkleBtn.addEventListener("click", () => {
      state.ownerTapCount++;
      clearTimeout(state.ownerTapTimeout);
      state.ownerTapTimeout = setTimeout(() => {
        state.ownerTapCount = 0;
      }, 1500);

      if (state.ownerTapCount >= 4) {
        state.ownerTapCount = 0;
        openOwnerModal();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      ownerModal?.classList.add("hidden");
    });
  }

  if (ownerModal) {
    ownerModal.addEventListener("click", (e) => {
      if (e.target === ownerModal) {
        ownerModal.classList.add("hidden");
      }
    });
  }

  // Passcode verification
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const entered = passInput.value.trim();
      const expected = state.settings.ownerPasscode || "lassi123";

      if (entered === expected) {
        state.isOwnerAuthenticated = true;
        authPanel.classList.add("hidden");
        settingsPanel.classList.remove("hidden");
        populateOwnerDashboardInputs();
      } else {
        if (authError) authError.classList.remove("hidden");
        passInput.classList.add("shake-input");
        setTimeout(() => passInput.classList.remove("shake-input"), 400);
      }
    });
  }

  // Dashboard Tabs
  document.querySelectorAll(".owner-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".owner-tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".owner-tab-content").forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const targetId = btn.getAttribute("data-tab");
      document.getElementById(targetId)?.classList.add("active");
    });
  });

  // Save Password
  const savePassBtn = document.getElementById("btn-save-password");
  if (savePassBtn) {
    savePassBtn.addEventListener("click", () => {
      const newAnswer = document.getElementById("edit-nickname-answer").value.trim().toLowerCase();
      if (!newAnswer) return;
      state.settings.nicknamePassword = newAnswer;
      saveSettingsLocally();
      saveSettingsToServer({ nicknamePassword: newAnswer });
      document.getElementById("lbl-current-password").textContent = newAnswer;
      showOwnerToast("password updated successfully! 💗");
    });
  }

  // Gallery File Upload
  const fileInput = document.getElementById("gallery-file-input");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: `photo-${Date.now()}`,
          src: event.target.result,
          title: file.name.replace(/\.[^/.]+$/, ""),
          caption: "our cute moment ♡",
          badge: "new memory",
          sticker: "love ♡",
          rotation: (Math.random() * 4 - 2).toFixed(1)
        };
        state.settings.photos.push(newPhoto);
        saveSettingsLocally();
        saveSettingsToServer({ photos: state.settings.photos });
        renderGallery();
        populateOwnerPhotoList();
        showOwnerToast("new photo added! 💗");
      };
      reader.readAsDataURL(file);
    });
  }

  // Reset Gallery
  const resetGalBtn = document.getElementById("btn-reset-gallery");
  if (resetGalBtn) {
    resetGalBtn.addEventListener("click", () => {
      if (confirm("Reset gallery to original 3 photos?")) {
        state.settings.photos = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.photos));
        saveSettingsLocally();
        saveSettingsToServer({ photos: state.settings.photos });
        renderGallery();
        populateOwnerPhotoList();
        showOwnerToast("gallery reset to defaults ♡");
      }
    });
  }

  // Save Letter
  const saveLetterBtn = document.getElementById("btn-save-letter");
  if (saveLetterBtn) {
    saveLetterBtn.addEventListener("click", () => {
      state.settings.letterHeading = document.getElementById("edit-letter-heading").value;
      state.settings.letterSubtitle = document.getElementById("edit-letter-subtitle").value;
      state.settings.letterText = document.getElementById("edit-letter-content").value;
      state.settings.letterEndMessage = document.getElementById("edit-letter-end").value;

      saveSettingsLocally();
      saveSettingsToServer({
        letterHeading: state.settings.letterHeading,
        letterSubtitle: state.settings.letterSubtitle,
        letterText: state.settings.letterText,
        letterEndMessage: state.settings.letterEndMessage
      });
      applySettingsToUI();
      showOwnerToast("letter saved successfully! 💗");
    });
  }

  // Reset Letter
  const resetLetterBtn = document.getElementById("btn-reset-letter");
  if (resetLetterBtn) {
    resetLetterBtn.addEventListener("click", () => {
      if (confirm("Reset to original personal birthday letter?")) {
        state.settings.letterText = DEFAULT_SETTINGS.letterText;
        document.getElementById("edit-letter-content").value = DEFAULT_SETTINGS.letterText;
        saveSettingsLocally();
        saveSettingsToServer({ letterText: DEFAULT_SETTINGS.letterText });
        applySettingsToUI();
        showOwnerToast("letter restored to original! ♡");
      }
    });
  }

  // Save General Website Info
  const saveGeneralBtn = document.getElementById("btn-save-general");
  if (saveGeneralBtn) {
    saveGeneralBtn.addEventListener("click", () => {
      state.settings.websiteTitle = document.getElementById("edit-website-title").value;
      state.settings.recipientName = document.getElementById("edit-recipient-name").value;
      state.settings.footerText = document.getElementById("edit-footer-text").value;

      saveSettingsLocally();
      saveSettingsToServer({
        websiteTitle: state.settings.websiteTitle,
        recipientName: state.settings.recipientName,
        footerText: state.settings.footerText
      });
      applySettingsToUI();
      showOwnerToast("website info saved! 💗");
    });
  }
}

function openOwnerModal() {
  const modal = document.getElementById("owner-modal");
  if (modal) {
    modal.classList.remove("hidden");
    if (state.isOwnerAuthenticated) {
      document.getElementById("owner-auth-panel")?.classList.add("hidden");
      document.getElementById("owner-settings-panel")?.classList.remove("hidden");
      populateOwnerDashboardInputs();
    }
  }
}

function checkOwnerQueryParam() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("owner") === "true") {
    openOwnerModal();
  }
}

function populateOwnerDashboardInputs() {
  const s = state.settings;
  const passLbl = document.getElementById("lbl-current-password");
  if (passLbl) passLbl.textContent = s.nicknamePassword;
  
  const passInp = document.getElementById("edit-nickname-answer");
  if (passInp) passInp.value = s.nicknamePassword;

  const letterHead = document.getElementById("edit-letter-heading");
  if (letterHead) letterHead.value = s.letterHeading;

  const letterSub = document.getElementById("edit-letter-subtitle");
  if (letterSub) letterSub.value = s.letterSubtitle;

  const letterBody = document.getElementById("edit-letter-content");
  if (letterBody) letterBody.value = s.letterText;

  const letterEnd = document.getElementById("edit-letter-end");
  if (letterEnd) letterEnd.value = s.letterEndMessage;

  const webTitle = document.getElementById("edit-website-title");
  if (webTitle) webTitle.value = s.websiteTitle;

  const recipName = document.getElementById("edit-recipient-name");
  if (recipName) recipName.value = s.recipientName;

  const footText = document.getElementById("edit-footer-text");
  if (footText) footText.value = s.footerText;

  populateOwnerPhotoList();
}

function populateOwnerPhotoList() {
  const container = document.getElementById("owner-photo-list");
  if (!container) return;
  container.innerHTML = "";

  state.settings.photos.forEach((photo, idx) => {
    const item = document.createElement("div");
    item.className = "owner-photo-item";
    item.innerHTML = `
      <img src="${photo.src}" class="owner-thumb" alt="Thumbnail" />
      <div class="owner-item-details">
        <input type="text" class="owner-caption-input" value="${escapeHtml(photo.caption || '')}" placeholder="Caption..." data-index="${idx}" />
      </div>
      <div class="owner-item-actions">
        <button class="action-icon-btn btn-up" data-index="${idx}" title="Move Up">▲</button>
        <button class="action-icon-btn btn-down" data-index="${idx}" title="Move Down">▼</button>
        <button class="action-icon-btn delete-btn" data-index="${idx}" title="Delete">✕</button>
      </div>
    `;

    // Caption change listener
    const captionInput = item.querySelector(".owner-caption-input");
    captionInput.addEventListener("change", (e) => {
      state.settings.photos[idx].caption = e.target.value;
      saveSettingsLocally();
      saveSettingsToServer({ photos: state.settings.photos });
      renderGallery();
    });

    // Move Up
    item.querySelector(".btn-up").addEventListener("click", () => {
      if (idx > 0) {
        const temp = state.settings.photos[idx];
        state.settings.photos[idx] = state.settings.photos[idx - 1];
        state.settings.photos[idx - 1] = temp;
        saveSettingsLocally();
        saveSettingsToServer({ photos: state.settings.photos });
        renderGallery();
        populateOwnerPhotoList();
      }
    });

    // Move Down
    item.querySelector(".btn-down").addEventListener("click", () => {
      if (idx < state.settings.photos.length - 1) {
        const temp = state.settings.photos[idx];
        state.settings.photos[idx] = state.settings.photos[idx + 1];
        state.settings.photos[idx + 1] = temp;
        saveSettingsLocally();
        saveSettingsToServer({ photos: state.settings.photos });
        renderGallery();
        populateOwnerPhotoList();
      }
    });

    // Delete
    item.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Delete this photo from gallery?")) {
        state.settings.photos.splice(idx, 1);
        saveSettingsLocally();
        saveSettingsToServer({ photos: state.settings.photos });
        renderGallery();
        populateOwnerPhotoList();
      }
    });

    container.appendChild(item);
  });
}

function showOwnerToast(msg) {
  const toast = document.getElementById("owner-toast");
  if (toast) {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 2500);
  }
}

// ==========================================
// CONFETTI SYSTEM
// ==========================================
let confettiParticles = [];
let confettiCtx = null;
let confettiAnimationId = null;

function initConfettiCanvas() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  confettiCtx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
}

function triggerConfetti(count = 80) {
  const colors = ["#ff8fab", "#fb6f92", "#ffd1dc", "#d8b4e2", "#ffe4e8", "#fff0f3", "#ffd166"];
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: window.innerHeight / 2 - 100,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      opacity: 1,
      isHeart: Math.random() > 0.4
    });
  }

  if (!confettiAnimationId) {
    animateConfetti();
  }
}

function animateConfetti() {
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiParticles.forEach((p, idx) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.32; // gravity
    p.rotation += p.rotSpeed;
    p.opacity -= 0.007;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = Math.max(0, p.opacity);
    confettiCtx.fillStyle = p.color;

    if (p.isHeart) {
      drawHeart(confettiCtx, 0, 0, p.size);
    } else {
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    }
    confettiCtx.restore();

    if (p.opacity <= 0 || p.y > window.innerHeight) {
      confettiParticles.splice(idx, 1);
    }
  });

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(animateConfetti);
  } else {
    confettiAnimationId = null;
    confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
  ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
  ctx.fill();
}

// ==========================================
// GLOBAL EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  // Sound Toggle Button
  const soundBtn = document.getElementById("btn-sound-toggle");
  const soundIcon = document.getElementById("sound-icon");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      state.soundEnabled = !state.soundEnabled;
      if (soundIcon) {
        soundIcon.textContent = state.soundEnabled ? "🔊" : "🔇";
      }
      if (!state.soundEnabled) {
        stopBirthdaySong();
      }
    });
  }

  setupIntroEvents();
  setupLoginEvents();
  setupCakeEvents();
  setupGalleryEvents();
  setupOwnerEvents();
}
