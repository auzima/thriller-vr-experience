AFRAME.registerComponent("cinema-riddle-feedback", {
  schema: {
    duration: { type: "number", default: 7000 },
  },

  init: function () {
    this.timer = null;
    this.onLocked = this.onLocked.bind(this);
    globalThis.addEventListener("cinema-entry-locked", this.onLocked);
  },

  remove: function () {
    globalThis.removeEventListener("cinema-entry-locked", this.onLocked);
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  },

  onLocked: function () {
    this.el.setAttribute("visible", "true");
    this.el.object3D.visible = true;

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.el.setAttribute("visible", "false");
      this.el.object3D.visible = false;
      this.timer = null;
    }, this.data.duration);
  },
});
