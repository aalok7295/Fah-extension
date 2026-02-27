// Job Rejection Detector - content.js
// Watches email content and screams FAAAAHHHHH on rejection

const REJECTION_PHRASES = [
  "we regret to inform",
  "we have decided to move forward with other candidates",
  "we will not be moving forward",
  "not moving forward with your application",
  "we won't be moving forward",
  "we have decided not to",
  "after careful consideration",
  "after careful review",
  "we are unable to offer",
  "unfortunately",
  "we have chosen to",
  "we have selected another candidate",
  "we won't be proceeding",
  "not selected for",
  "decided to pursue other candidates",
  "we appreciate your interest but",
  "you were not selected",
  "position has been filled",
  "we will be moving in a different direction",
  "not the right fit",
  "does not meet our requirements",
  "your application was not successful",
  "unsuccessful in your application",
  "we've decided to go in a different direction",
  "no longer being considered",
];

const JOB_CONTEXT_PHRASES = [
  "application",
  "position",
  "role",
  "job",
  "opportunity",
  "interview",
  "candidacy",
  "candidate",
  "resume",
  "cv",
  "hiring",
];

let lastPlayedUrl = "";
let lastPlayedText = "";
let rejectionCount = 0;

function generateFaaahSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const duration = 3.5;
  const sampleRate = ctx.sampleRate;
  const numSamples = duration * sampleRate;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);

  // Generate a dramatic "FAAAAHHHHH" - starts as an 'F' breath, opens to 'AH'
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = t / duration;

    // Base pitch: starts low, rises dramatically, then falls
    const pitchEnvelope = progress < 0.1
      ? progress / 0.1  // ramp up
      : progress < 0.7
        ? 1.0  // sustain
        : 1.0 - ((progress - 0.7) / 0.3) * 0.5; // fall off

    const baseFreq = 120 + pitchEnvelope * 80; // 120Hz to 200Hz

    // Harmonics for vowel formants (open 'AH' sound)
    const openness = Math.min(1, progress * 5); // opens up fast
    
    let sample = 0;
    // Fundamental
    sample += Math.sin(2 * Math.PI * baseFreq * t) * 0.4;
    // First formant (AH vowel ~800Hz)
    sample += Math.sin(2 * Math.PI * (800 * openness + 200) * t) * 0.2 * openness;
    // Second formant (~1200Hz)
    sample += Math.sin(2 * Math.PI * 1200 * t) * 0.1 * openness;
    // Third harmonic adds richness
    sample += Math.sin(2 * Math.PI * baseFreq * 3 * t) * 0.15;
    // Vibrato for the sustained 'AH'
    if (progress > 0.15) {
      const vibratoDepth = Math.min(1, (progress - 0.15) * 3) * 8;
      sample *= 1 + 0.05 * Math.sin(2 * Math.PI * 5 * t);
    }

    // Amplitude envelope
    const attack = Math.min(1, t / 0.05);
    const release = progress > 0.85 ? 1 - ((progress - 0.85) / 0.15) : 1;
    const amp = attack * release;

    // Add slight breathiness at start (F consonant)
    const breathiness = progress < 0.1 ? (Math.random() * 2 - 1) * 0.3 * (1 - progress / 0.1) : 0;

    data[i] = (sample * amp + breathiness) * 0.6;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // Add reverb-like effect with a delay node
  const gainNode = ctx.createGain();
  gainNode.gain.value = 1.0;

  source.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start(0);

  // Cleanup
  source.onended = () => ctx.close();
}

function isRejectionEmail(text) {
  if (!text) return false;
  const lower = text.toLowerCase();

  const hasRejection = REJECTION_PHRASES.some(phrase => lower.includes(phrase));
  if (!hasRejection) return false;

  const hasJobContext = JOB_CONTEXT_PHRASES.some(phrase => lower.includes(phrase));
  return hasJobContext;
}

function getEmailText() {
  const selectors = [
    // Gmail
    ".a3s.aiL",
    ".ii.gt .a3s",
    // Outlook
    '[aria-label="Message body"]',
    ".ReadMsgBody",
    "#Contentpane",
    ".allowTextSelection",
    // Yahoo Mail
    ".msg-body",
    '[data-test-id="message-body"]',
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el && el.innerText.trim().length > 50) {
      return el.innerText;
    }
  }

  return null;
}

function getEmailSubject() {
  const selectors = [
    // Gmail
    ".hP",
    'h2[data-legacy-thread-id]',
    // Outlook
    '.allowTextSelection[role="heading"]',
    ".SubjectText",
    // Yahoo
    '[data-test-id="message-subject"]',
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el.innerText;
  }
  return "";
}

function showRejectionToast() {
  // Remove existing toast
  const existing = document.getElementById("faaah-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "faaah-toast";
  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999999;
      background: linear-gradient(135deg, #1a0a0a, #3d0f0f);
      border: 2px solid #ff3333;
      border-radius: 12px;
      padding: 16px 20px;
      color: white;
      font-family: 'Georgia', serif;
      font-size: 14px;
      max-width: 320px;
      box-shadow: 0 0 30px rgba(255,50,50,0.4), 0 8px 32px rgba(0,0,0,0.5);
      animation: faaah-slide-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    ">
      <div style="font-size: 28px; margin-bottom: 8px;">😭</div>
      <div style="font-weight: bold; color: #ff6666; font-size: 16px; margin-bottom: 4px;">REJECTION DETECTED</div>
      <div style="color: #ffaaaa; font-size: 12px; opacity: 0.8;">Total rejections today: ${rejectionCount}</div>
      <div style="margin-top: 10px; color: #ff9999; font-style: italic; font-size: 11px;">You'll get 'em next time, champ. 💪</div>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes faaah-slide-in {
      from { transform: translateX(120%) scale(0.8); opacity: 0; }
      to { transform: translateX(0) scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);

  setTimeout(() => {
    const t = toast.querySelector("div");
    if (t) t.style.transition = "opacity 0.5s";
    if (t) t.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
  }, 5000);
}

function checkCurrentEmail() {
  const currentUrl = window.location.href;
  const emailText = getEmailText();
  const emailSubject = getEmailSubject();

  if (!emailText) return;

  const combinedText = `${emailSubject} ${emailText}`;

  // Avoid re-triggering for same content
  if (combinedText === lastPlayedText) return;

  if (isRejectionEmail(combinedText)) {
    lastPlayedText = combinedText;
    lastPlayedUrl = currentUrl;
    rejectionCount++;

    console.log("💀 Job Rejection Alarm: REJECTION DETECTED! Playing FAAAAHHHHH...");
    generateFaaahSound();
    showRejectionToast();

    // Store count
    chrome.storage.local.set({ rejectionCount });
  }
}

// Watch for email content changes
const observer = new MutationObserver(() => {
  clearTimeout(window._faaahTimeout);
  window._faaahTimeout = setTimeout(checkCurrentEmail, 800);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: false,
  attributes: false,
});

// Also check on URL changes (Gmail SPA navigation)
let lastHref = location.href;
setInterval(() => {
  if (location.href !== lastHref) {
    lastHref = location.href;
    lastPlayedText = ""; // Reset for new email
    setTimeout(checkCurrentEmail, 1200);
  }
}, 500);

// Initial check
setTimeout(checkCurrentEmail, 2000);
