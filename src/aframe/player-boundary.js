AFRAME.registerComponent("player-boundary", {
  schema: {
    worldMinX: { type: "number", default: -150 },
    worldMaxX: { type: "number", default: 150 },
    worldMinZ: { type: "number", default: -8 },
    worldMaxZ: { type: "number", default: 92 },
  },

  init: function () {
    this.hasJacket = false;
    this.isEntryLockedActive = false;
    this.onJacketCollected = () => {
      this.hasJacket = true;
      if (this.isEntryLockedActive) {
        this.isEntryLockedActive = false;
        globalThis.dispatchEvent(
          new CustomEvent("cinema-entry-lock-state", {
            detail: { locked: false },
          }),
        );
      }
    };
    globalThis.addEventListener("jacket-collected", this.onJacketCollected);
  },

  remove: function () {
    globalThis.removeEventListener("jacket-collected", this.onJacketCollected);
  },

  tick: function () {
    const playerPos = this.el.object3D.position;
    playerPos.x = Math.max(this.data.worldMinX, Math.min(this.data.worldMaxX, playerPos.x));
    playerPos.z = Math.max(this.data.worldMinZ, Math.min(this.data.worldMaxZ, playerPos.z));

    // Tant que la veste n'est pas récupérée, l'entrée du cinéma reste verrouillée.
    if (this.hasJacket) return;

    const limitX = 30;
    const frontZ = -8.9;
    const backZ = -30;
    const nearSideMargin = 4;
    const nearFrontMargin = 2.5;

    const isInsideCinema =
      playerPos.x > -limitX &&
      playerPos.x < limitX &&
      playerPos.z < frontZ &&
      playerPos.z > backZ;

    // Zone d'affichage du texte : dans la zone de caisse + très proche devant.
    const isNearCashZone =
      playerPos.x > -(limitX + nearSideMargin) &&
      playerPos.x < limitX + nearSideMargin &&
      playerPos.z < frontZ + nearFrontMargin &&
      playerPos.z > backZ;

    if (isNearCashZone) {
      if (!this.isEntryLockedActive) {
        this.isEntryLockedActive = true;
        globalThis.dispatchEvent(new CustomEvent("cinema-entry-locked"));
        globalThis.dispatchEvent(
          new CustomEvent("cinema-entry-lock-state", {
            detail: { locked: true },
          }),
        );
      }
    }

    if (isInsideCinema) {
      // On bloque très près de l'entrée (quasi contact avec la devanture de caisse).
      playerPos.z = frontZ + 0.02;
      return;
    }

    if (this.isEntryLockedActive) {
      this.isEntryLockedActive = false;
      globalThis.dispatchEvent(
        new CustomEvent("cinema-entry-lock-state", {
          detail: { locked: false },
        }),
      );
    }
  },
});
