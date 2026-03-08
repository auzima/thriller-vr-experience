<script setup>
import '../aframe/disable-in-vr.js';
import '../aframe/hide-in-vr.js';
import '../aframe/simple-navmesh-constraint.js';
import '../aframe/blink-controls.js';
import '../aframe/physx-grab.js';
import '../aframe/zombie-infection-feedback.js';
import '../aframe/game-timer.js';
import '../aframe/zombie-hand-lock.js';
import '../aframe/restart-on-click.js';
import '../aframe/game-over-vr-fallback.js';
import '../aframe/game-win-vr-fallback.js';

defineProps({
  allAssetsLoaded: Boolean,
});
</script>

<template>
  <a-entity id="camera-rig" movement-controls="camera: #head;"
    game-over-vr-fallback="panel: #vr-game-over-panel"
    game-win-vr-fallback="panel: #vr-game-win-panel">

    <a-entity id="head" look-controls="pointerLockEnabled: true"
      simple-navmesh-constraint="navmesh: [data-role='nav-mesh']; height: 1.65;"
      disable-in-vr="component: simple-navmesh-constraint;" camera position="0 1.65 -6" zombie-hand-lock>
      <a-entity id="zombie-infection-feedback" visible="false" zombie-infection-feedback="duration: 3500"
        position="0 0.18 -0.95">
        <a-plane color="#3b0505" opacity="0.9" width="1.25" height="0.22"></a-plane>
        <a-entity text="value: Le joueur est contamine.; align: center; color: #ffd6d6; width: 1.8"
          position="0 0 0.01"></a-entity>
      </a-entity>
      <a-entity v-if="allAssetsLoaded" id="game-timer-driver" visible="false"
        game-timer="label: TEMPS; durationSeconds: 300"></a-entity>
      <a-entity id="vr-game-over-panel" visible="false" position="0 0 -0.95">
        <a-plane color="#1a1d2a" opacity="0.94" width="1.24" height="0.62"></a-plane>
        <a-plane color="#dfe4ff" opacity="0.28" width="1.2" height="0.58" position="0 0 0.003"></a-plane>
        <a-plane color="#090b12" opacity="0.95" width="1.16" height="0.54" position="0 0 0.006"></a-plane>
        <a-entity text="value: Game Over; align: center; color: #ffffff; width: 1.8"
          position="0 0.12 0.012"></a-entity>
        <a-entity position="0 -0.13 0.02">
          <a-plane class="clickable" restart-on-click color="#b72222" opacity="1" width="0.52" height="0.14"></a-plane>
          <a-entity text="value: Recommencer; align: center; color: #ffffff; width: 1.25"
            position="0 0 0.01"></a-entity>
        </a-entity>
      </a-entity>
      <a-entity id="vr-game-win-panel" visible="false" position="0 0 -0.95">
        <a-plane color="#102116" opacity="0.94" width="1.28" height="0.86"></a-plane>
        <a-plane color="#d8ffdf" opacity="0.22" width="1.24" height="0.82" position="0 0 0.003"></a-plane>
        <a-plane color="#0a120d" opacity="0.95" width="1.2" height="0.78" position="0 0 0.006"></a-plane>
        <a-entity text="value: Victoire; align: center; color: #f3fff6; width: 1.25"
          position="0 0.28 0.012"></a-entity>
        <a-entity text="value: Tu as récupéré la bague, la veste et le popcorn.; align: center; color: #d7ffe2; width: 1.08"
          position="0 0.12 0.012"></a-entity>
        <a-entity
          text="value: Minuit sonne... Les ombres se referment. La salle t'attend: entre, si tu oses regarder Thriller jusqu'au dernier souffle.; align: center; color: #d7ffe2; width: 1.08"
          position="0 -0.08 0.012"></a-entity>
        <a-entity position="0 -0.28 0.02">
          <a-plane class="clickable" restart-on-click color="#2a8a3a" opacity="1" width="0.52" height="0.14"></a-plane>
          <a-entity text="value: Recommencer; align: center; color: #ffffff; width: 1.25"
            position="0 0 0.01"></a-entity>
        </a-entity>
      </a-entity>
      <a-entity geometry="primitive: circle; radius: 0.0003;" material="shader: flat; color: white;" cursor
        raycaster="far: 4; objects: .clickable, .collectible; showLine: false;" position="0 0 -0.1"
        disable-in-vr="component: raycaster; disableInAR: false;" hide-in-vr="hideInAR: false"></a-entity>
      <a-box id="dummy-hand-right" obb-collider position="0.3 -0.4 -0.5"></a-box>
      <a-entity id="dummy-hand-left" obb-collider position="-0.3 -0.4 -0.5"></a-entity>
    </a-entity>

    <a-entity id="hand-left" hand-controls="hand: left; handModelStyle: lowPoly; color: #ffcccc" blink-controls="
          cameraRig: #camera-rig;
          teleportOrigin: #head;
          collisionEntities: [data-role='nav-mesh'];
          snapTurn: false;
        " obb-collider position="0 1.5 0" physx-grab>
      <a-entity id="zombie-hand-left" gltf-model="#zombie-hand-model" visible="false" position="0 0 0" rotation="0 0 0"
        scale="1 1 1"></a-entity>

      <a-sphere id="hand-left-collider" radius="0.02" visible="false"
        physx-body="type: kinematic; emitCollisionEvents: true">
      </a-sphere>
    </a-entity>

    <a-entity id="hand-right" hand-controls="hand: right; handModelStyle: lowPoly; color: #ffcccc"
      laser-controls="hand: right" raycaster="far: 4; objects: .clickable, .collectible; showLine: true;" position="0 1.5 0"
      obb-collider physx-grab>
      <a-sphere id="hand-right-collider" radius="0.02" visible="true"
        physx-body="type: kinematic; emitCollisionEvents: true">
      </a-sphere>
    </a-entity>

  </a-entity>
</template>