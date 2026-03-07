<script setup>
import { ref } from 'vue';

import TheCameraRig from './TheCameraRig.vue';

import '../aframe/simple-grab.js';
import '../aframe/outline.js';
import '../aframe/zombie-chase.js';
import '../aframe/zombie-wave-spawner.js';
import '../aframe/player-boundary.js';
import '../aframe/jacket-pickup.js';
import '../aframe/game-over-controller.js';
import '../aframe/loup-audio-controller.js';
import '../aframe/zombie-appear-audio.js';
import '../aframe/thriller-background-controller.js';
import '../aframe/collect-item-audio-controller.js';
import '../aframe/hud-vr-fallback.js';
import '../aframe/hud-timer-display.js';
import '../aframe/collectibles-counter.js';

defineProps({
  scale: Number,
  overlaySelector: String,
});

const allAssetsLoaded = ref(false);
</script>

<template>
  <a-scene obb-collider="showColliders: false;" background="color: #050505;" :webxr="`
      requiredFeatures: local-floor;
      referenceSpaceType: local-floor;
      optionalFeatures: dom-overlay;
      overlayElement: ${overlaySelector};
    `" xr-mode-ui="XRMode: xr" physx="
      autoLoad: true;
      delay: 1000;
      useDefaultScene: false;
      wasmUrl: lib/physx.release.wasm;
    " loup-audio-controller="audio: #loup-audio; volume: 0.55; maxDurationMs: 10000; fadeOutMs: 1000"
    thriller-background-controller="audio: #thriller-audio; volume: 0.2"
    collect-item-audio-controller="audioSelector: #collect-item-audio; durationMs: 5000; volume: 0.75"
    hud-vr-fallback="fallback: #vr-hud-fallback" outline simple-grab game-over-controller
    zombie-wave-spawner="intervalMs: 25000; spawnDistance: 5; minSpeed: 0.0012; maxSpeed: 0.024; infectionDistance: 1.2; minZombieDistance: 2.4; avoidStrength: 0.9; groundY: -0.6; targetSelector: #head; roamMinX: -150; roamMaxX: 150; roamMinZ: -8; roamMaxZ: 92">

    <a-assets @loaded="allAssetsLoaded = true">
      <a-asset-item id="cinema-model" src="assets/cinema/scene.gltf"></a-asset-item>
      <a-asset-item id="route-model" src="assets/route.glb"></a-asset-item>
      <a-asset-item id="zombie-model" src="assets/zombie.glb"></a-asset-item>
      <a-asset-item id="zombie-hand-model" src="assets/zombie_hand.glb"></a-asset-item>
      <a-asset-item id="popcorn-model" src="assets/popcorn.glb"></a-asset-item>
      <a-asset-item id="ring-model" src="assets/ring.glb"></a-asset-item>
      <a-asset-item id="forest-model" src="assets/forest.glb"></a-asset-item>
      <a-asset-item id="stars-model" src="assets/stars.glb"></a-asset-item>
      <a-asset-item id="moon-model" src="assets/moon.glb"></a-asset-item>
      <a-asset-item id="caissier-model" src="assets/caissier.glb"></a-asset-item>
      <a-asset-item id="jacket-model" src="assets/jacket.glb"></a-asset-item>
      <audio id="loup-audio" src="assets/loup.mp3" preload="auto"></audio>
      <audio id="zombie-appear-audio" src="assets/zombie.mp3" preload="auto"></audio>
      <audio id="thriller-audio" src="assets/thriller.mp3" preload="auto"></audio>
      <audio id="collect-item-audio" src="assets/heehee.mp3" preload="auto"></audio>
    </a-assets>

    <template v-if="allAssetsLoaded">

      <a-plane color="#ff0000" width="220" height="100" position="0 0 42" rotation="-90 0 0" visible="false"
        data-role="nav-mesh"></a-plane>

      <a-light type="ambient" color="#777777"></a-light>
      <a-light type="directional" color="#aaccff" intensity="0.8" position="-2 4 2"></a-light>
      <a-light type="point" color="#ffaa55" intensity="1.5" position="0 2 -3" distance="10"></a-light>

      <a-entity id="cinema" gltf-model="#cinema-model" position="0 -1.2 -0.2" scale="1.6 1.6 1.6"
        rotation="0 0 0"></a-entity>
      <!-- HUD fixé sur le mur gauche du cinéma -->
      <a-entity id="cinema-wall-hud-left" position="-19 7 -9" rotation="0 0 0">
        <a-plane color="#0d0f14" opacity="0.82" width="6" height="2" material="side: double"></a-plane>
        <a-entity position="0 0.5 0.01" hud-timer-display="initialSeconds: 300"
          text="value: 05:00; align: center; color: #ffffff; width: 15"></a-entity>
        <a-entity position="0 -0.3 0.01" collectibles-counter="total: 3"
          text="value: 0/3; align: center; color: #ffffff; width: 15"></a-entity>
      </a-entity>
      <!-- Lune bien visible au-dessus du cinéma, légèrement décalée sur la droite -->
      <a-entity gltf-model="#moon-model" position="-110 150 -140" scale="35 35 35" rotation="0 0 0">
      </a-entity>


      <!-- Ciel étoilé : deux couches pour plus de densité -->
      <!-- Couche intérieure -->
      <a-entity gltf-model="#stars-model" position="0 0 500" scale="100 100 100" rotation="0 0 0">
      </a-entity>
      <!-- Couche extérieure, légèrement plus grande et tournée -->
      <a-entity gltf-model="#stars-model" position="0 0 50" scale="140 140 140" rotation="0 37 0">
      </a-entity>

      <!-- Forêt autour du cinéma pour ajouter du contexte -->
      <!-- *Côté gauche  -->
      <a-entity gltf-model="#forest-model" position="-74.31 -0.88 28.06" scale="6 6 6" rotation="0 180 0">
      </a-entity>

      <!-- *Côté gauche  -->
      <a-entity gltf-model="#forest-model" position="-74.31 -0.88 -60" scale="6 6 6" rotation="0 180 0">
      </a-entity>

      <!-- *Devant le cinéma -->
      <a-entity gltf-model="#forest-model" position="-61.5 -0.88 67.52" scale="6 6 6" rotation="0 -90 0">
      </a-entity>

      <!-- *Devant le cinéma -->
      <a-entity gltf-model="#forest-model" position="33.57 -0.88 67.52" scale="6 6 6" rotation="0 -90 0">
      </a-entity>

      <!-- *Côté droit-->
      <a-entity gltf-model="#forest-model" position="72.40 -0.88 -38" scale="6 6 6" rotation="0 0 0">
      </a-entity>

      <!-- *Côté droit-->
      <a-entity gltf-model="#forest-model" position="72.40 -0.88 38" scale="6 6 6" rotation="0 0 0">
      </a-entity>

      <!-- Points de spawn zombies -->
      <a-entity class="zombie-spawn" position="-34 -0.6 6"></a-entity>
      <a-entity class="zombie-spawn" position="26 -0.6 14"></a-entity>
      <a-entity class="zombie-spawn" position="-12 -0.6 36"></a-entity>

      <a-entity gltf-model="#zombie-model" position="-70 -0.6 -60" scale="0.018 0.018 0.018"
        animation-mixer="clip: *; loop: repeat;"
        simple-navmesh-constraint="navmesh: [data-role='nav-mesh']; height: 0.05; fall: 2;"
        zombie-appear-audio="audio: #zombie-appear-audio; volume: 0.65; delayAfterLoupMs: 8000"
        zombie-chase="speed: 0.01; infectionDistance: 1.2; waitBeforeChaseMs: 3000; groundY: -0.6; spawnPoints: .zombie-spawn; spawnIndex: 0; minZombieDistance: 2.4; avoidStrength: 0.9; blockMinX: 0; blockMaxX: 0; blockMinZ: 0; blockMaxZ: 0; roamMinX: -150; roamMaxX: 150; roamMinZ: -8; roamMaxZ: 92"
        class="collidable">
      </a-entity>

      <!-- Veste cachee dans la foret : le joueur doit la recuperer pour entrer -->
      <a-entity id="jacket" gltf-model="#jacket-model" position="-18 -0.8 40" scale="2.5 2.5 2.5" rotation="-90 55 180"
        jacket-pickup="radius: 0.12">
      </a-entity>

      <!-- Popcorn cache dans la foret, dans la zone de jeu -->
      <a-entity id="popcorn" gltf-model="#popcorn-model" position="60 -0.55 80" scale="1 1 1" rotation="0 15 0"
        jacket-pickup="radius: 0.12; collectEvent: popcorn-collected"></a-entity>

      <!-- Bague cachée dans la forêt côté gauche -->
      <a-entity id="ring" gltf-model="#ring-model" position="-80 1 0" scale="1 1 1" rotation="0 165 0"
        jacket-pickup="radius: 0.12; collectEvent: ring-collected"></a-entity>

    </template>

    <TheCameraRig player-boundary="worldMinX: -150; worldMaxX: 150; worldMinZ: -8; worldMaxZ: 92"
      :allAssetsLoaded="allAssetsLoaded" position="0 0 22" />

  </a-scene>
</template>