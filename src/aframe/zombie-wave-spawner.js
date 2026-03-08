AFRAME.registerComponent("zombie-wave-spawner", {
  schema: {
    intervalMs: { type: "number", default: 45000 },
    spawnDistance: { type: "number", default: 10 },
    groundY: { type: "number", default: -0.6 },
    speed: { type: "number", default: 0.001 },
    minSpeed: { type: "number", default: 0.001 },
    maxSpeed: { type: "number", default: 0.005 },
    infectionDistance: { type: "number", default: 1.2 },
    minZombieDistance: { type: "number", default: 2.4 },
    avoidStrength: { type: "number", default: 0.9 },
    modelId: { type: "string", default: "#zombie-model" },
    targetSelector: { type: "string", default: "#head" },
    maxAlive: { type: "number", default: 8 },
    roamMinX: { type: "number", default: -150 },
    roamMaxX: { type: "number", default: 150 },
    roamMinZ: { type: "number", default: -8 },
    roamMaxZ: { type: "number", default: 92 },
  },

  init: function () {
    this.playerPos = new THREE.Vector3();
    this.spawnStopped = false;
    this.spawnTimer = null;
    this.initialSpawnDone = false;

    this.onStopSpawning = () => {
      this.spawnStopped = true;
      if (this.spawnTimer) {
        clearInterval(this.spawnTimer);
        this.spawnTimer = null;
      }
    };

    globalThis.addEventListener("game-over", this.onStopSpawning);
    globalThis.addEventListener("game-win", this.onStopSpawning);

    this.spawnTimer = setInterval(() => {
      this.spawnZombie();
    }, this.data.intervalMs);
  },

  tick: function () {
    if (this.initialSpawnDone || this.spawnStopped) return;
    const spawned = this.spawnZombie();
    if (spawned) this.initialSpawnDone = true;
  },

  getAliveZombiesCount: function () {
    const zombies = this.el.querySelectorAll("[zombie-chase]");
    return zombies ? zombies.length : 0;
  },

  spawnZombie: function () {
    if (this.spawnStopped) return;
    if (this.getAliveZombiesCount() >= this.data.maxAlive) return;

    const targetEl =
      this.el.querySelector(this.data.targetSelector) ||
      document.querySelector(this.data.targetSelector) ||
      this.el.querySelector("[camera]") ||
      document.querySelector("[camera]");
    if (!targetEl?.object3D) return;

    targetEl.object3D.getWorldPosition(this.playerPos);
    const angle = Math.random() * Math.PI * 2;
    const rawX = this.playerPos.x + Math.cos(angle) * this.data.spawnDistance;
    const rawZ = this.playerPos.z + Math.sin(angle) * this.data.spawnDistance;
    const x = Math.max(this.data.roamMinX, Math.min(this.data.roamMaxX, rawX));
    const z = Math.max(this.data.roamMinZ, Math.min(this.data.roamMaxZ, rawZ));

    const min = Math.min(this.data.minSpeed, this.data.maxSpeed);
    const max = Math.max(this.data.minSpeed, this.data.maxSpeed);
    const randomSpeed =
      min + Math.random() * (max - min || 0) || this.data.speed;

    const zombie = document.createElement("a-entity");
    zombie.setAttribute("gltf-model", this.data.modelId);
    zombie.setAttribute("position", `${x} ${this.data.groundY} ${z}`);
    zombie.setAttribute("scale", "0.018 0.018 0.018");
    zombie.setAttribute("animation-mixer", "clip: *; loop: repeat;");
    zombie.setAttribute(
      "zombie-appear-audio",
      "audio: #zombie-appear-audio; volume: 0.65; delayAfterLoupMs: 8000",
    );
    zombie.setAttribute(
      "simple-navmesh-constraint",
      "navmesh: [data-role='nav-mesh']; height: 0.05; fall: 2;",
    );
    zombie.setAttribute(
      "zombie-chase",
      `target: #head; speed: ${randomSpeed}; infectionDistance: ${this.data.infectionDistance}; waitBeforeChaseMs: 0; groundY: ${this.data.groundY}; useSpawnPoints: false; minZombieDistance: ${this.data.minZombieDistance}; avoidStrength: ${this.data.avoidStrength}; blockMinX: 0; blockMaxX: 0; blockMinZ: 0; blockMaxZ: 0; roamMinX: ${this.data.roamMinX}; roamMaxX: ${this.data.roamMaxX}; roamMinZ: ${this.data.roamMinZ}; roamMaxZ: ${this.data.roamMaxZ}`,
    );
    zombie.classList.add("collidable");

    this.el.appendChild(zombie);
    return true;
  },

  remove: function () {
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }
    globalThis.removeEventListener("game-over", this.onStopSpawning);
    globalThis.removeEventListener("game-win", this.onStopSpawning);
  },
});
