// popup.js
function generateFaaahSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const duration = 3.5;
  const sampleRate = ctx.sampleRate;
  const numSamples = duration * sampleRate;
  const buffer = ctx.createBuffer(1, numSamples, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = t / duration;

    const pitchEnvelope = progress < 0.1
      ? progress / 0.1
      : progress < 0.7
        ? 1.0
        : 1.0 - ((progress - 0.7) / 0.3) * 0.5;

    const baseFreq = 120 + pitchEnvelope * 80;
    const openness = Math.min(1, progress * 5);

    let sample = 0;
    sample += Math.sin(2 * Math.PI * baseFreq * t) * 0.4;
    sample += Math.sin(2 * Math.PI * (800 * openness + 200) * t) * 0.2 * openness;
    sample += Math.sin(2 * Math.PI * 1200 * t) * 0.1 * openness;
    sample += Math.sin(2 * Math.PI * baseFreq * 3 * t) * 0.15;

    const attack = Math.min(1, t / 0.05);
    const release = progress > 0.85 ? 1 - ((progress - 0.85) / 0.15) : 1;
    const amp = attack * release;

    const breathiness = progress < 0.1 ? (Math.random() * 2 - 1) * 0.3 * (1 - progress / 0.1) : 0;
    data[i] = (sample * amp + breathiness) * 0.6;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
  source.onended = () => ctx.close();
}

// Load rejection count
chrome.storage.local.get(["rejectionCount"], (result) => {
  document.getElementById("count").textContent = result.rejectionCount || 0;
});

// Test button
document.getElementById("testBtn").addEventListener("click", () => {
  generateFaaahSound();
  const btn = document.getElementById("testBtn");
  btn.textContent = "😭 FAAAAAHHHHH...";
  setTimeout(() => { btn.textContent = "▶ PLAY FAAAAHHHHH"; }, 3500);
});

// Reset button
document.getElementById("resetBtn").addEventListener("click", () => {
  chrome.storage.local.set({ rejectionCount: 0 });
  document.getElementById("count").textContent = "0";
});
