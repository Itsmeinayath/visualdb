// Simple Web Audio API Sound Effects for Gamification

let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = (freq, type, duration, vol = 0.1) => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const sounds = {
  init: initAudio,
  
  playBoot: () => {
    initAudio();
    playTone(150, 'square', 0.1, 0.05);
    setTimeout(() => playTone(300, 'square', 0.2, 0.05), 100);
  },
  
  playNodeConnect: () => {
    initAudio();
    playTone(600, 'sine', 0.1, 0.1);
  },
  
  playSuccess: () => {
    initAudio();
    playTone(400, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(600, 'sine', 0.1, 0.1), 100);
    setTimeout(() => playTone(800, 'sine', 0.3, 0.1), 200);
  },
  
  playError: () => {
    initAudio();
    playTone(100, 'sawtooth', 0.3, 0.2);
  }
};
