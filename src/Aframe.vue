<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import TheOnboarding from './components/TheOnboarding.vue';
import TheOverlay from './components/TheOverlay.vue';
import TheScene from './components/TheScene.vue';

const loaded = ref(false);
const gameOver = ref(false);
const gameWon = ref(false);
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
  checkWin();
};

const onPopcornCollected = () => {
  collected.popcorn = true;
  checkWin();
};

const onRingCollected = () => {
  collected.ring = true;
  checkWin();
};

onMounted(() => {
  globalThis.addEventListener('game-timer-ended', onTimerEnded);
  globalThis.addEventListener('zombie-hands-transformed', onHandsTransformed);
  globalThis.addEventListener('jacket-collected', onJacketCollected);
  globalThis.addEventListener('popcorn-collected', onPopcornCollected);
  globalThis.addEventListener('ring-collected', onRingCollected);
});

onBeforeUnmount(() => {
  globalThis.removeEventListener('game-timer-ended', onTimerEnded);
  globalThis.removeEventListener('zombie-hands-transformed', onHandsTransformed);
  globalThis.removeEventListener('jacket-collected', onJacketCollected);
  globalThis.removeEventListener('popcorn-collected', onPopcornCollected);
  globalThis.removeEventListener('ring-collected', onRingCollected);
  if (delayedGameOverTimer) {
    clearTimeout(delayedGameOverTimer);
    delayedGameOverTimer = null;
  }
});

</script>

<template>
  <TheOnboarding :loaded="loaded" />

  <!-- The DOM element of the overlay must be mounted before the A-Frame Scene is mounted -->
  <!-- Otherwise the "webxr system" of the A-Frame scene wont find the DOM Element -->
  <TheOverlay id="overlay" :game-over="gameOver" :game-won="gameWon" @restart="restartGame" />

  <TheScene overlay-selector="#overlay" @loaded="loaded = true" />
</template>