<script setup>
defineProps({
  gameOver: {
    type: Boolean,
    default: false,
  },
  gameWon: {
    type: Boolean,
    default: false,
  },
  hudVisible: {
    type: Boolean,
    default: false,
  },
  timerText: {
    type: String,
    default: '05:00',
  },
  collectedCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["restart"]);
</script>

<template>
  <div id="overlay">
    <div v-if="hudVisible" id="hud">
      <p id="hud-timer">{{ timerText }}</p>
      <p id="hud-counter">OBJETS {{ collectedCount }}/3</p>
    </div>
    <div v-if="gameWon" id="game-win-panel">
      <h2>Victoire</h2>
      <p>Tu as récupéré la bague, la veste et le popcorn.</p>
      <button type="button" @click="emit('restart')">Rejouer</button>
    </div>
    <div v-if="gameOver" id="game-over-panel">
      <h2>Game Over</h2>
      <button type="button" @click="emit('restart')">Recommencer</button>
    </div>
  </div>
</template>

<style scoped>
  #overlay {
    z-index: 1000;
    position: fixed;
    inset: 0;
    pointer-events: none;
  }

  #game-over-panel {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(8, 10, 16, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 16px 20px;
    color: #f7f8ff;
    font-family: Arial, sans-serif;
    text-align: center;
    pointer-events: auto;
  }

  #hud {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 24px;
    pointer-events: none;
    font-family: Arial, sans-serif;
    font-weight: 700;
    color: #000;
  }

  #hud-timer,
  #hud-counter {
    margin: 0;
    position: absolute;
    bottom: 0;
    font-size: 18px;
    letter-spacing: 1px;
    text-shadow: 0 0 1px rgba(255, 255, 255, 0.4);
  }

  #hud-timer {
    left: 24px;
  }

  #hud-counter {
    right: 24px;
  }

  #game-win-panel {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(8, 16, 10, 0.92);
    border: 1px solid rgba(165, 255, 180, 0.45);
    border-radius: 12px;
    padding: 16px 20px;
    color: #f7fff8;
    font-family: Arial, sans-serif;
    text-align: center;
    pointer-events: auto;
  }

  h2 {
    margin: 0 0 10px;
    font-size: 22px;
  }

  p {
    margin: 0 0 12px;
    font-size: 14px;
  }

  button {
    border: none;
    border-radius: 8px;
    background: #b72222;
    color: #fff;
    padding: 8px 14px;
    font-size: 14px;
    cursor: pointer;
  }
</style>