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
});

const emit = defineEmits(["restart"]);
</script>

<template>
  <div id="overlay">
    <div v-if="gameWon" id="game-win-panel">
      <h2>Victoire</h2>
      <p>Tu as récupéré la bague, la veste et le popcorn.</p>
      <p>Minuit sonne... Les ombres se referment. La salle t'attend: entre, si tu oses regarder Thriller jusqu'au dernier souffle.</p>
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
  width: min(92vw, 440px);
  background: rgba(8, 10, 16, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  color: #f7f8ff;
  font-family: Arial, sans-serif;
  text-align: center;
  pointer-events: auto;
}

#game-win-panel {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(92vw, 520px);
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
  line-height: 1.4;
  overflow-wrap: anywhere;
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