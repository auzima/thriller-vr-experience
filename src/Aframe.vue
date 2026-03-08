<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import TheOnboarding from './components/TheOnboarding.vue';
import TheOverlay from './components/TheOverlay.vue';
import TheScene from './components/TheScene.vue';

const loaded = ref(false);
const gameOver = ref(false);
const gameWon = ref(false);
const overlayHudEnabled = ref(true);
const timerText = ref('05:00');
const collectedCount = ref(0);
let delayedGameOverTimer = null;
const collected = {
  jacket: false,
  popcorn: false,
  ring: false,
};

const triggerGameOver = () => {
  if (gameOver.value || gameWon.value) return;
  gameOver.value = true;
  globalThis.dispatchEvent(new CustomEvent('game-over'));
};

const checkWin = () => {
  if (gameOver.value || gameWon.value) return;
  if (collected.jacket && collected.popcorn && collected.ring) {
    gameWon.value = true;
    globalThis.dispatchEvent(new CustomEvent('game-win'));
  }
};

const onTimerEnded = () => {
  triggerGameOver();
};

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const onTimerTick = (event) => {
  const secondsLeft = event?.detail?.secondsLeft;
  if (typeof secondsLeft !== 'number') return;
  timerText.value = formatTime(secondsLeft);
};

const onHudDomOverlayState = (event) => {
  const active = event?.detail?.active;
  overlayHudEnabled.value = active !== false;
};

const updateCollectedCount = () => {
  collectedCount.value = Number(collected.jacket) + Number(collected.popcorn) + Number(collected.ring);
};

const onHandsTransformed = () => {
  if (delayedGameOverTimer) {
    clearTimeout(delayedGameOverTimer);
  }
  delayedGameOverTimer = setTimeout(() => {
    triggerGameOver();
    delayedGameOverTimer = null;
  }, 5000);
};

const restartGame = () => {
  globalThis.location.reload();
};

const onJacketCollected = () => {
  collected.jacket = true;
  updateCollectedCount();
  checkWin();
};

const onPopcornCollected = () => {
  collected.popcorn = true;
  updateCollectedCount();
  checkWin();
};

const onRingCollected = () => {
  collected.ring = true;
  updateCollectedCount();
  checkWin();
};

onMounted(() => {
  updateCollectedCount();
  globalThis.addEventListener('game-timer-ended', onTimerEnded);
  globalThis.addEventListener('game-timer-tick', onTimerTick);
  globalThis.addEventListener('hud-dom-overlay-state', onHudDomOverlayState);
  globalThis.addEventListener('zombie-hands-transformed', onHandsTransformed);
  globalThis.addEventListener('jacket-collected', onJacketCollected);
  globalThis.addEventListener('popcorn-collected', onPopcornCollected);
  globalThis.addEventListener('ring-collected', onRingCollected);
});

onBeforeUnmount(() => {
  globalThis.removeEventListener('game-timer-ended', onTimerEnded);
  globalThis.removeEventListener('game-timer-tick', onTimerTick);
  globalThis.removeEventListener('hud-dom-overlay-state', onHudDomOverlayState);
  globalThis.removeEventListener('zombie-hands-transformed', onHandsTransformed);
  globalThis.removeEventListener('jacket-collected', onJacketCollected);
  globalThis.removeEventListener('popcorn-collected', onPopcornCollected);
  globalThis.removeEventListener('ring-collected', onRingCollected);
  if (delayedGameOverTimer) {
    clearTimeout(delayedGameOverTimer);
    delayedGameOverTimer = null;
  }
});

const hudVisible = computed(() => (
  loaded.value && !gameOver.value && !gameWon.value && overlayHudEnabled.value
));
</script>

<template>
  <TheOnboarding :loaded="loaded" />

  <!-- The DOM element of the overlay must be mounted before the A-Frame Scene is mounted -->
  <!-- Otherwise the "webxr system" of the A-Frame scene wont find the DOM Element -->
  <TheOverlay id="overlay" :game-over="gameOver" :game-won="gameWon" :hud-visible="hudVisible" :timer-text="timerText"
    :collected-count="collectedCount" @restart="restartGame" />

  <TheScene overlay-selector="#overlay" @loaded="loaded = true" />
</template>