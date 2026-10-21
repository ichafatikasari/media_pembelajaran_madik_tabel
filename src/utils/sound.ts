/**
 * Web Audio API Sound Effects for "Giliran Siswa" Game Show Quiz & App
 * Generates all sounds synthetically without any external audio files.
 * Supports sound enabled/disabled setting.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

function getAudioContext(): AudioContext | null {
  if (!soundEnabled) return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playClickSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Ignore audio errors gracefully
  }
}

export function playTickSound(urgent = false) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Heartbeat double thump or sharp tick
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(urgent ? 180 : 220, now);
    osc1.frequency.exponentialRampToValueAtTime(60, now + 0.07);
    gain1.gain.setValueAtTime(urgent ? 0.25 : 0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.07);

    if (urgent) {
      // Secondary heartbeat thump
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(140, now + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.18);
      gain2.gain.setValueAtTime(0.2, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.18);
    }
  } catch {
    // Ignore
  }
}

/**
 * Slot machine / raffle drum roll effect that starts fast and slows down over durationMs
 */
export function playRaffleSound(durationMs = 3500) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const steps = 30;
    
    for (let i = 0; i < steps; i++) {
      // Normalized progress with exponential ease-out
      const progress = i / (steps - 1);
      const timeOffset = Math.pow(progress, 1.8) * (durationMs / 1000);
      const hitTime = now + timeOffset;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      // Pitch rises slightly near the end
      osc.frequency.setValueAtTime(400 + progress * 250, hitTime);
      gain.gain.setValueAtTime(0.08 + progress * 0.05, hitTime);
      gain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(hitTime);
      osc.stop(hitTime + 0.04);
    }

    // Final triumphant bell ding upon stopping
    const finalTime = now + durationMs / 1000;
    const finalOsc = ctx.createOscillator();
    const finalGain = ctx.createGain();
    finalOsc.type = 'sine';
    finalOsc.frequency.setValueAtTime(880, finalTime);
    finalGain.gain.setValueAtTime(0.25, finalTime);
    finalGain.gain.exponentialRampToValueAtTime(0.001, finalTime + 0.6);
    finalOsc.connect(finalGain);
    finalGain.connect(ctx.destination);
    finalOsc.start(finalTime);
    finalOsc.stop(finalTime + 0.6);
  } catch {
    // Ignore
  }
}

/**
 * Dramatic suspense drone for the "Yakin?" 3-second delay
 */
export function playSuspenseDrone(durationSeconds = 3) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Deep pulsating drone
    const freqs = [110, 164.81, 220]; // A2 chord
    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now);
      // Pitch rises subtly over the 3 seconds to heighten tension
      osc.frequency.linearRampToValueAtTime(f * 1.05, now + durationSeconds);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.08, now + durationSeconds * 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + durationSeconds);
    });
  } catch {
    // Ignore
  }
}

export function playSuccessSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Arpeggio notes: C5, E5, G5, C6
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.28);
    });
  } catch {
    // Ignore audio errors gracefully
  }
}

export function playErrorSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Classic dramatic wrong buzzer: dissonance (130Hz & 138Hz)
    [130, 138.5].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    });
  } catch {
    // Ignore audio errors gracefully
  }
}

export function playResetSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.18);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  } catch {
    // Ignore audio errors gracefully
  }
}

export function playCelebrationSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Fanfare: C5, G4, C5, E5, G5, C6
    const notes = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 392.00, d: 0.12, t: 0.13 },
      { f: 523.25, d: 0.12, t: 0.26 },
      { f: 659.25, d: 0.16, t: 0.39 },
      { f: 783.99, d: 0.16, t: 0.55 },
      { f: 1046.5, d: 0.45, t: 0.72 }
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.18, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d);
    });
  } catch {
    // Ignore
  }
}
