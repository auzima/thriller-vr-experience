AFRAME.registerComponent("jacket-pickup", {
  schema: {
    hands: { type: "selectorAll", default: "#hand-left, #hand-right, #hand-left-collider, #hand-right-collider" },
    radius: { type: "number", default: 0.12 }, // ~12 cm
    collectEvent: { type: "string", default: "jacket-collected" },
  },

  init: function () {
    this.collected = false;
    this.jacketPos = new THREE.Vector3();
    this.handPos = new THREE.Vector3();
    this.jacketBox = new THREE.Box3();
  },

  tick: function () {
    if (this.collected) return;

    const jacketObj = this.el.getObject3D("mesh") || this.el.object3D;
    if (!jacketObj) return;

    this.el.object3D.getWorldPosition(this.jacketPos);
    this.jacketBox.setFromObject(jacketObj);
    const hasValidBox = !this.jacketBox.isEmpty();

    const hands = this.data.hands;
    if (!hands || hands.length === 0) return;

    for (const handEl of hands) {
      if (!handEl?.object3D) continue;

      handEl.object3D.getWorldPosition(this.handPos);
      const distance = hasValidBox
        ? this.jacketBox.distanceToPoint(this.handPos)
        : this.jacketPos.distanceTo(this.handPos);

      if (distance <= this.data.radius) {
        this.collected = true;
        this.el.setAttribute("visible", "false");
        globalThis.dispatchEvent(new CustomEvent(this.data.collectEvent));
        return;
      }
    }
  },
});

