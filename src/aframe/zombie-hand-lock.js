AFRAME.registerComponent("zombie-hand-lock", {
  schema: {
    left: { type: "selector", default: "#hand-left" },
    right: { type: "selector", default: "#hand-right" },
    zombieLeft: { type: "selector", default: "#zombie-hand-left" },
    infectedColor: { type: "color", default: "#18c93b" },
  },

  init: function () {
    this.isInfectedLookApplied = false;
    this.onZombieInfected = () => {
      this.applyInfectedHandsLook();
    };
    globalThis.addEventListener("zombie-infected", this.onZombieInfected);
    this.el.sceneEl?.addEventListener("zombie-infected", this.onZombieInfected);
  },

  remove: function () {
    globalThis.removeEventListener("zombie-infected", this.onZombieInfected);
    this.el.sceneEl?.removeEventListener(
      "zombie-infected",
      this.onZombieInfected,
    );
  },

  resolveTarget: function (preferredEl, selector) {
    if (preferredEl) return preferredEl;
    return this.el.sceneEl?.querySelector(selector) || null;
  },

  tintObject3D: function (obj3D, colorHex) {
    if (!obj3D) return;
    obj3D.traverse((node) => {
      if (!node?.isMesh || !node.material) return;
      const materials = Array.isArray(node.material)
        ? node.material
        : [node.material];
      for (const material of materials) {
        if (material?.color) {
          material.color.set(colorHex);
          material.needsUpdate = true;
        }
      }
    });
  },

  ensureHandTint: function (handEl, colorHex) {
    if (!handEl) return;
    const mesh = handEl.getObject3D("mesh");
    if (mesh) {
      this.tintObject3D(mesh, colorHex);
      return;
    }
    const onObject3DSet = (evt) => {
      if (evt.detail?.type === "mesh") {
        const m = handEl.getObject3D("mesh");
        if (m) this.tintObject3D(m, colorHex);
        handEl.removeEventListener("object3dset", onObject3DSet);
      }
    };
    handEl.addEventListener("object3dset", onObject3DSet);
  },

  applyInfectedHandsLook: function () {
    if (this.isInfectedLookApplied) return;
    const left = this.resolveTarget(this.data.left, "#hand-left");
    const right = this.resolveTarget(this.data.right, "#hand-right");
    const zombieLeft = this.resolveTarget(
      this.data.zombieLeft,
      "#zombie-hand-left",
    );

    left?.setAttribute("hand-controls", "color", this.data.infectedColor);
    right?.setAttribute("hand-controls", "color", this.data.infectedColor);
    this.ensureHandTint(left, this.data.infectedColor);
    this.ensureHandTint(right, this.data.infectedColor);

    // On force la main zombie GLB à rester cachée pour garder l'effet couleur.
    if (zombieLeft) {
      zombieLeft.setAttribute("visible", "false");
      if (zombieLeft.object3D) zombieLeft.object3D.visible = false;
    }

    this.isInfectedLookApplied = true;
  },
});
