<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  loaded: Boolean,
});

const showOnboarding = ref(true);

// Ce script permet au bouton de fermer le menu d'accueil
function enterGame() {
  showOnboarding.value = false;
}
</script>

<template>
  <div id="onboarding" v-if="showOnboarding">
    <div class="content-box">
      <h1 class="title">🧟 Thriller Experience VR</h1>

      <div class="loading-status">
        <p v-if="!loaded" class="pulse-text">Chargement des esprits maléfiques...</p>
        <p v-if="loaded" class="ready-text">La nuit est prête...</p>
      </div>

      <div class="game-objective">
        <h3>L'Heure a sonné...</h3>
        <p>
          Minuit approche et les créatures de la nuit se réveillent. Votre objectif :
          <strong>récupérer 3 objets sacrés (la veste, la bague et le popcorn)</strong> dans le temps imparti.
          Trouvez-les pour forcer les portes du cinéma, mais prenez garde...
          Si les zombies vous contaminent, votre âme sera damnée à jamais !
        </p>
      </div>

      <button v-if="loaded" class="start-btn" @click="enterGame">Entrer dans le Cauchemar</button>

      <div class="instructions">
        <section>
          <h4>🎮 Comment survivre (Contrôles)</h4>
          <ul>
            <li>
              <strong>Desktop (PC) :</strong> Clavier pour se déplacer (<i>WASD / Flèches</i>) + Souris pour regarder
              (Cliquer-glisser).
            </li>
            <li>
              <strong>Mobile :</strong> Touchez avec <i>1 doigt</i> pour avancer + <i>2 doigts</i> pour reculer.
            </li>
            <li>
              <strong>VR / AR :</strong> Déplacement physique + Joysticks. Bouton latéral (<i>Grip</i>) pour attraper
              les objets et gâchette (<i>Laser</i>) pour interagir.
            </li>
          </ul>
        </section>
      </div>

      <div class="licences">
        <h4>Crédits & Licences</h4>
        <dl>
          <dt>Code de base (Boilerplate)</dt>
          <dd><a href="https://github.com/Chabloz/a-frame-vite-vue-boilerplate">A-Frame Vite Vue Boilerplate</a></dd>

          <dt>Zombies Animations</dt>
          <dd><a href="https://www.mixamo.com/" target="_blank">Mixamo</a> (Standard License)</dd>

          <dt>Cinéma Palace</dt>
          <dd><a href="https://sketchfab.com/3d-models/thrillers-cinema-palace-5ed7659b2eb34c0685f48814f9a73e43"
              target="_blank">Sketchfab Community</a> (CC BY 4.0)</dd>

          <dt>Environnement Forêt</dt>
          <dd><a href="https://sketchfab.com/3d-models/forest-9153c2b370934758bf14c395abe36b27"
              target="_blank">Sketchfab Community</a> (CC BY 4.0)</dd>

          <dt>Veste MJ & Bague</dt>
          <dd><a href="https://sketchfab.com/" target="_blank">Sketchfab Community</a> (CC BY 4.0)</dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Le fond de l'écran : Noir et angoissant */
#onboarding {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #050505;
  background-image: radial-gradient(circle, #1a0000 0%, #000000 80%);
  color: #e0e0e0;
  font-family: 'Courier New', Courier, monospace;
  /* Police style machine à écrire / horreur */
  z-index: 10000;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* La boîte centrale */
.content-box {
  max-width: 800px;
  width: 90%;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #ff0000;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.2);
  border-radius: 8px;
  text-align: center;
}

/* Titre Principal (Rouge sang) */
.title {
  font-size: 2.5rem;
  color: #cc0000;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

/* Chargement */
.pulse-text {
  color: #888;
  animation: pulse 1.5s infinite;
}

.ready-text {
  color: #cc0000;
  font-weight: bold;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.5;
  }
}

/* Objectif du jeu */
.game-objective {
  background: rgba(204, 0, 0, 0.1);
  border-left: 4px solid #cc0000;
  padding: 1rem;
  margin: 1.5rem 0;
  text-align: left;
  line-height: 1.5;
}

.game-objective h3 {
  color: #ff3333;
  margin-top: 0;
}

/* Instructions */
.instructions {
  text-align: left;
  margin: 2rem 0;
  border-bottom: 1px dashed #444;
  padding-bottom: 1rem;
}

.instructions h4 {
  color: #ffcccc;
  font-size: 1.2rem;
}

.instructions li {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.instructions strong {
  color: #ff3333;
}

/* Bouton de démarrage */
.start-btn {
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: bold;
  padding: 1rem 2rem;
  margin: 2rem 0;
  border-radius: 5px;
  background-color: #cc0000;
  color: white;
  border: 2px solid #ff3333;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(204, 0, 0, 0.5);
}

.start-btn:hover {
  background-color: #ff0000;
  box-shadow: 0 0 25px rgba(255, 0, 0, 0.8);
  transform: scale(1.05);
}

/* Licences en bas */
a {
  color: #ff6666;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.licences {
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid #333;
  font-size: 0.8rem;
  text-align: left;
  color: #888;
}

.licences dt {
  margin-top: 0.5rem;
  font-weight: bold;
  color: #aaa;
}

.licences dd {
  margin-left: 0;
  margin-bottom: 0.5rem;
}
</style>