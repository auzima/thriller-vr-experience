AFRAME.registerComponent("jacket-pickup", {
  schema: {
    hands: { type: "selectorAll", default: "#hand-left, #hand-right, #hand-left-collider, #hand-right-collider" },
    radius: { type: "number", default: 0.12 }, // ~12 cm
    desktopTarget: { type: "selector", default: "#head" },
    desktopRadius: { type: "number", default: 1.1 },
    collectEvent: { type: "string", default: "jacket-collected" },
  },

  init: function () {
    this.collected = false;
    this.jacketPos = new THREE.Vector3();
    this.handPos = new THREE.Vector3();
    this.jacketBox = new THREE.Box3();
    this.desktopPos = new THREE.Vector3();
    this.el.classList.add("collectible");

    this.collect = () => {
      if (this.collected) return;
      this.collected = true;
      this.el.setAttribute("visible", "false");
      globalThis.dispatchEvent(new CustomEvent(this.data.collectEvent));
    };

    this.getHorizontalDistance = (a, b) => {
      const dx = a.x - b.x;
      const dz = a.z - b.z;
      return Math.hypot(dx, dz);
    };

    this.tryHandsCollect = (hasValidBox) => {
      const hands = this.data.hands;
      if (!hands || hands.length === 0) return false;

      for (const handEl of hands) {
        if (!handEl?.object3D) continue;

        handEl.object3D.getWorldPosition(this.handPos);
        const distance = hasValidBox
          ? this.jacketBox.distanceToPoint(this.handPos)
          : this.jacketPos.distanceTo(this.handPos);

        if (distance <= this.data.radius) {
          this.collect();
          return true;
        }
      }

      return false;
    };

    this.tryDesktopAutoCollect = () => {
      const sceneEl = this.el.sceneEl;
      if (sceneEl?.is?.("vr-mode")) return false;
      const headEl = this.data.desktopTarget;
      if (!headEl?.object3D) return false;

      headEl.object3D.getWorldPosition(this.desktopPos);
      if (this.getHorizontalDistance(this.jacketPos, this.desktopPos) <= this.data.desktopRadius) {
        this.collect();
        return true;
      }
      return false;
    };

    this.tryDesktopCollect = () => {
      if (this.collected) return;
      const sceneEl = this.el.sceneEl;
      if (sceneEl?.is?.("vr-mode")) return;
      const headEl = this.data.desktopTarget;
      if (!headEl?.object3D) return;

      this.el.object3D.getWorldPosition(this.jacketPos);
      headEl.object3D.getWorldPosition(this.desktopPos);
      const distance = this.getHorizontalDistance(this.jacketPos, this.desktopPos);
      if (distance <= this.data.desktopRadius) {
        this.collect();
      }
    };

    this.onDesktopClick = () => {
      this.tryDesktopCollect();
    };

    this.onDesktopKeyDown = (event) => {
      const key = event?.key?.toLowerCase?.() || "";
      if (key === "e" || key === "enter" || key === " ") {
        this.tryDesktopCollect();
      }
    };

    this.el.addEventListener("click", this.onDesktopClick);
    globalThis.addEventListener("pointerdown", this.onDesktopClick);
    globalThis.addEventListener("keydown", this.onDesktopKeyDown);
  },

  tick: function () {
    if (this.collected) return;

    const jacketObj = this.el.getObject3D("mesh") || this.el.object3D;
    if (!jacketObj) return;

    this.el.object3D.getWorldPosition(this.jacketPos);
    this.jacketBox.setFromObject(jacketObj);
    const hasValidBox = !this.jacketBox.isEmpty();
    if (this.tryHandsCollect(hasValidBox)) return;
    this.tryDesktopAutoCollect();
  },

  remove: function () {
    this.el.removeEventListener("click", this.onDesktopClick);
    globalThis.removeEventListener("pointerdown", this.onDesktopClick);
    globalThis.removeEventListener("keydown", this.onDesktopKeyDown);
  },
});

