let playerAlreadyInfected = false;

AFRAME.registerComponent("zombie-chase", {
  schema: {
    target: { type: "selector", default: "[camera]" }, // Le joueur
    speed: { type: "number", default: 0.02 }, // Vitesse du zombie
    infectionDistance: { type: "number", default: 5 }, // Distance à laquelle il "touche" le joueur
    waitBeforeChaseMs: { type: "number", default: 0 }, // Temps d'attente avant de quitter la forêt
    groundY: { type: "number", default: -0.6 }, // Hauteur visuelle des pieds sur le sol
    spawnPoints: { type: "selectorAll", default: ".zombie-spawn" }, // Points de départ forêt
    spawnIndex: { type: "number", default: -1 }, // -1 => départ aléatoire
    fleeSpeed: { type: "number", default: 0.2 }, // vitesse de fuite
    minZombieDistance: { type: "number", default: 2 }, // distance mini entre zombies
    avoidStrength: { type: "number", default: 0.65 }, // intensité du contournement
    // Zone intérieure du cinéma à éviter (le zombie peut toucher les façades mais pas entrer)
    blockMinX: { type: "number", default: -15 },
    blockMaxX: { type: "number", default: 15 },
    blockMinZ: { type: "number", default: -17 },
    blockMaxZ: { type: "number", default: -8 },
    roamMinX: { type: "number", default: -150 },
    roamMaxX: { type: "number", default: 150 },
    roamMinZ: { type: "number", default: -8 },
    roamMaxZ: { type: "number", default: 92 },
  },

  init: function () {
    this.hasInfected = false;
    this.spawned = false;
    this.isFleeing = false;
    this.currentSpawnIndex = -1;
    this.chaseStartsAt = Date.now() + this.data.waitBeforeChaseMs;
    this.randomDirection = new THREE.Vector3();
    this.targetPos = new THREE.Vector3();
    this.fleeTarget = new THREE.Vector3();
    this.tmpLeft = new THREE.Vector3();
    this.tmpRight = new THREE.Vector3();
    this.deltaScale = 1;

    this.onPlayerInfected = () => {
      this.isFleeing = true;
      this.hasInfected = true;
      this.setFleeTargetFromForest();
    };
    globalThis.addEventListener("player-infected", this.onPlayerInfected);
  },

  remove: function () {
    globalThis.removeEventListener("player-infected", this.onPlayerInfected);
  },

  spawnFromForest: function () {
    const points = this.data.spawnPoints;
    if (!points || points.length === 0) return;

    let idx = this.data.spawnIndex;
    if (idx < 0) {
      idx = Math.floor(Math.random() * points.length);
    } else {
      idx = ((idx % points.length) + points.length) % points.length;
    }
    this.currentSpawnIndex = idx;
    const spawnEl = points[idx];
    if (!spawnEl?.object3D) return;

    spawnEl.object3D.getWorldPosition(this.targetPos);
    this.el.object3D.position.x = Math.max(
      this.data.roamMinX,
      Math.min(this.data.roamMaxX, this.targetPos.x),
    );
    this.el.object3D.position.z = Math.max(
      this.data.roamMinZ,
      Math.min(this.data.roamMaxZ, this.targetPos.z),
    );
    this.el.object3D.position.y = this.data.groundY;
    this.spawned = true;
  },

  setFleeTargetFromForest: function () {
    const points = this.data.spawnPoints;
    if (!points || points.length === 0) return;
    // Cible différente du point de départ pour donner un vrai mouvement de fuite
    const base = Math.max(this.currentSpawnIndex, 0);
    const offset =
      1 + Math.floor(Math.random() * Math.max(points.length - 1, 1));
    const idx = (base + offset) % points.length;
    const fleeEl = points[idx];
    if (!fleeEl?.object3D) return;
    fleeEl.object3D.getWorldPosition(this.fleeTarget);
  },

  isInsideCinema: function (x, z) {
    return (
      x > this.data.blockMinX &&
      x < this.data.blockMaxX &&
      z > this.data.blockMinZ &&
      z < this.data.blockMaxZ
    );
  },

  isOutsideRoamingArea: function (x, z) {
    return (
      x < this.data.roamMinX ||
      x > this.data.roamMaxX ||
      z < this.data.roamMinZ ||
      z > this.data.roamMaxZ
    );
  },

  isTooCloseToAnotherZombie: function (nextX, nextZ) {
    const zombies = this.el.sceneEl?.querySelectorAll("[zombie-chase]");
    if (!zombies || zombies.length <= 1) return false;

    for (const zombieEl of zombies) {
      if (zombieEl === this.el) continue;
      const otherPos = zombieEl.object3D?.position;
      if (!otherPos) continue;

      const dx = nextX - otherPos.x;
      const dz = nextZ - otherPos.z;
      const distXZ = Math.hypot(dx, dz);
      if (distXZ < this.data.minZombieDistance) return true;
    }
    return false;
  },

  getAvoidanceDirection: function (zombie3D) {
    const zombies = this.el.sceneEl?.querySelectorAll("[zombie-chase]");
    if (!zombies || zombies.length <= 1) return null;

    const avoid = new THREE.Vector3();
    for (const zombieEl of zombies) {
      if (zombieEl === this.el) continue;
      const otherPos = zombieEl.object3D?.position;
      if (!otherPos) continue;

      const away = new THREE.Vector3(
        zombie3D.position.x - otherPos.x,
        0,
        zombie3D.position.z - otherPos.z,
      );
      const distance = away.length();
      if (distance === 0 || distance >= this.data.minZombieDistance) continue;

      away.normalize();
      const weight =
        (this.data.minZombieDistance - distance) / this.data.minZombieDistance;
      avoid.add(away.multiplyScalar(weight));
    }

    if (avoid.lengthSq() === 0) return null;
    avoid.normalize();
    return avoid;
  },

  separateOverlappingZombies: function (zombie3D) {
    const zombies = this.el.sceneEl?.querySelectorAll("[zombie-chase]");
    if (!zombies || zombies.length <= 1) return;

    for (const zombieEl of zombies) {
      if (zombieEl === this.el) continue;
      const otherPos = zombieEl.object3D?.position;
      if (!otherPos) continue;

      const dx = zombie3D.position.x - otherPos.x;
      const dz = zombie3D.position.z - otherPos.z;
      const dist = Math.hypot(dx, dz);

      if (dist === 0) {
        const angle = (this.data.spawnIndex + 1) * 0.9;
        zombie3D.position.x += Math.cos(angle) * 0.02;
        zombie3D.position.z += Math.sin(angle) * 0.02;
        continue;
      }

      if (dist >= this.data.minZombieDistance) continue;
      const overlap = this.data.minZombieDistance - dist;
      const nx = dx / dist;
      const nz = dz / dist;
      const push = overlap * 0.5;
      const candidateX = zombie3D.position.x + nx * push;
      const candidateZ = zombie3D.position.z + nz * push;
      if (this.isInsideCinema(candidateX, candidateZ)) continue;
      zombie3D.position.x = candidateX;
      zombie3D.position.z = candidateZ;
    }
  },

  moveWithBlockCheck: function (zombie3D, dir, speed) {
    const steering = dir.clone();
    const avoid = this.getAvoidanceDirection(zombie3D);
    if (avoid) {
      steering.add(avoid.multiplyScalar(this.data.avoidStrength)).normalize();
    }

    const step = speed * this.deltaScale;
    const canMoveTo = (x, z) => (
      !this.isOutsideRoamingArea(x, z) &&
      !this.isInsideCinema(x, z) &&
      !this.isTooCloseToAnotherZombie(x, z)
    );

    let futurX = zombie3D.position.x + steering.x * step;
    let futurZ = zombie3D.position.z + steering.z * step;
    if (canMoveTo(futurX, futurZ)) {
      zombie3D.position.x = futurX;
      zombie3D.position.z = futurZ;
      return true;
    }

    // Si bloque, on essaye de "glisser" sur le cote au lieu d'arreter net.
    this.tmpLeft.set(-steering.z, 0, steering.x).normalize();
    futurX = zombie3D.position.x + this.tmpLeft.x * step * 0.65;
    futurZ = zombie3D.position.z + this.tmpLeft.z * step * 0.65;
    if (canMoveTo(futurX, futurZ)) {
      zombie3D.position.x = futurX;
      zombie3D.position.z = futurZ;
      return true;
    }

    this.tmpRight.set(steering.z, 0, -steering.x).normalize();
    futurX = zombie3D.position.x + this.tmpRight.x * step * 0.65;
    futurZ = zombie3D.position.z + this.tmpRight.z * step * 0.65;
    if (canMoveTo(futurX, futurZ)) {
      zombie3D.position.x = futurX;
      zombie3D.position.z = futurZ;
      return true;
    }

    // Dernier essai: petit pas pour limiter les micro-blocages.
    futurX = zombie3D.position.x + steering.x * step * 0.35;
    futurZ = zombie3D.position.z + steering.z * step * 0.35;
    if (canMoveTo(futurX, futurZ)) {
      zombie3D.position.x = futurX;
      zombie3D.position.z = futurZ;
      return true;
    }

    return false;
  },

  handleFlee: function (zombie3D) {
    const fleeDir = new THREE.Vector3();
    fleeDir.subVectors(this.fleeTarget, zombie3D.position);
    fleeDir.y = 0;
    if (fleeDir.length() <= 0.4) return;
    fleeDir.normalize();
    this.moveWithBlockCheck(zombie3D, fleeDir, this.data.fleeSpeed);
    zombie3D.lookAt(
      zombie3D.position.x + fleeDir.x,
      zombie3D.position.y,
      zombie3D.position.z + fleeDir.z,
    );
  },

  handlePostInfectionWander: function (zombie3D) {
    const moved = this.moveWithBlockCheck(
      zombie3D,
      this.randomDirection,
      this.data.speed,
    );
    if (moved) return;
    const randomAngle = Math.random() * Math.PI * 2;
    this.randomDirection.x = Math.cos(randomAngle);
    this.randomDirection.z = Math.sin(randomAngle);
  },

  handleInfection: function () {
    this.hasInfected = true;
    this.isFleeing = true;
    this.setFleeTargetFromForest();

    // Une seule contamination globale déclenche la fuite du groupe
    if (!playerAlreadyInfected) {
      playerAlreadyInfected = true;
      globalThis.dispatchEvent(new CustomEvent("zombie-infected"));
      globalThis.dispatchEvent(new CustomEvent("player-infected"));
      globalThis.dispatchEvent(new CustomEvent("zombie-hands-transformed"));
    }

    const randomAngle = Math.random() * Math.PI * 2;
    this.randomDirection.x = Math.cos(randomAngle);
    this.randomDirection.z = Math.sin(randomAngle);
  },

  tick: function (_time, timeDelta) {
    if (!this.data.target) return;
    const normalizedDelta = (timeDelta || 16.67) / 16.67;
    this.deltaScale = Math.max(0.65, Math.min(1.5, normalizedDelta));

    let zombie3D = this.el.object3D;
    if (!this.spawned) this.spawnFromForest();
    // Forcer la hauteur du zombie pour compenser le pivot du modèle.
    zombie3D.position.y = this.data.groundY;

    // Le zombie attend avant de sortir de la forêt.
    if (Date.now() < this.chaseStartsAt && !this.isFleeing && !this.hasInfected)
      return;

    if (this.isFleeing) {
      this.handleFlee(zombie3D);
      this.separateOverlappingZombies(zombie3D);
      return;
    }

    // --- PHASE DE MARCHE ALÉATOIRE (Après l'infection) ---
    if (this.hasInfected) {
      this.handlePostInfectionWander(zombie3D);
      this.separateOverlappingZombies(zombie3D);
      return;
    }

    // --- PHASE 2 : LA TRAQUE ---
    let target3D = this.data.target.object3D;
    target3D.getWorldPosition(this.targetPos);

    this.targetPos.y = zombie3D.position.y;
    let distance = zombie3D.position.distanceTo(this.targetPos);

    if (distance > this.data.infectionDistance) {
      zombie3D.lookAt(this.targetPos);
      let direction = new THREE.Vector3();
      direction.subVectors(this.targetPos, zombie3D.position).normalize();

      this.moveWithBlockCheck(zombie3D, direction, this.data.speed);
      this.separateOverlappingZombies(zombie3D);
    }
    // --- PHASE 3 : L'INFECTION ---
    else {
      this.handleInfection();
    }
  },
});
