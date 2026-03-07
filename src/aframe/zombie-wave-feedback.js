AFRAME.registerComponent("zombie-wave-feedback", {
  schema: {
    duration: { type: "number", default: 2000 },
  },

  init: function () {
    this.hideTimeout = null;
    this.onWaveSpawned = () => {
      this.el.setAttribute("visible", "true");
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
      }
      this.hideTimeout = setTimeout(() => {
        this.el.setAttribute("visible", "false");
        this.hideTimeout = null;
      }, this.data.duration);
    };

    globalThis.addEventListener("zombie-wave-spawned", this.onWaveSpawned);
  },

  remove: function () {
    globalThis.removeEventListener("zombie-wave-spawned", this.onWaveSpawned);
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  },
});
