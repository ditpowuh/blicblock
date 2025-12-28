let dropSounds: HTMLAudioElement[] | null = null;
let clearSounds: HTMLAudioElement[] | null = null;
let introSound: HTMLAudioElement | null = null;
let loseSound: HTMLAudioElement | null = null;

function initAudio() {
  if (typeof window === "undefined") {
    return;
  }
  if (dropSounds || clearSounds || introSound || loseSound) {
    return;
  }

  dropSounds = [
    new Audio("/Sounds/Drop 1.wav"),
    new Audio("/Sounds/Drop 2.wav"),
    new Audio("/Sounds/Drop 3.wav"),
    new Audio("/Sounds/Drop 4.wav"),
    new Audio("/Sounds/Drop 5.wav")
  ];

  clearSounds = [
    new Audio("/Sounds/Clear 1.wav"),
    new Audio("/Sounds/Clear 2.wav")
  ];

  introSound = new Audio("/Sounds/Intro.wav");
  loseSound = new Audio("/Sounds/Lose.wav");

  [...dropSounds, ...clearSounds, introSound, loseSound].forEach(a => {
    a.preload = "auto";
  });
}

export function playDropSound() {
  initAudio();
  if (!dropSounds) {
    return;
  }
  const sound = dropSounds[Math.floor(Math.random() * dropSounds.length)];
  sound.currentTime = 0;
  sound.play();
}

export function playClearSound() {
  initAudio();
  if (!clearSounds) {
    return;
  }
  const sound = clearSounds[Math.floor(Math.random() * clearSounds.length)];
  sound.currentTime = 0;
  sound.play();
}

export function playIntroSound() {
  initAudio();
  if (!introSound) {
    return;
  }
  introSound.currentTime = 0;
  introSound.play();
}

export function playLoseSound() {
  initAudio();
  if (!loseSound) {
    return;
  }
  loseSound.currentTime = 0;
  loseSound.play();
}

export default {
  playDropSound,
  playClearSound,
  playIntroSound,
  playLoseSound
};
