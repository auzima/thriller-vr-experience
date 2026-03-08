AFRAME.registerComponent("game-win-vr-fallback", {
  schema: {
    panel: { type: "selector", default: "#vr-game-win-panel" },
  },

  init: function () {
    this.gameWinActive = false;

    this.applyVisibility = () => {
      const panel = this.data.panel;
      if (!panel) return;
      const inVr = this.el.sceneEl?.is?.("vr-mode");
      // Always show the VR win panel in headset.
      const visible = Boolean(this.gameWinActive && inVr);
      panel.setAttribute("visible", visible ? "true" : "false");
      panel.object3D.visible = visible;
    };

    this.onGameWin = () => {
      this.gameWinActive = true;
      this.applyVisibility();
    };

    this.onGameOver = () => {
      this.gameWinActive = false;
      this.applyVisibility();
    };

    this.onEnterVr = () => this.applyVisibility();
    this.onExitVr = () => this.applyVisibility();

    globalThis.addEventListener("game-win", this.onGameWin);
    globalThis.addEventListener("game-over", this.onGameOver);
    this.el.sceneEl?.addEventListener("enter-vr", this.onEnterVr);
    this.el.sceneEl?.addEventListener("exit-vr", this.onExitVr);
    this.applyVisibility();
  },

  remove: function () {
    globalThis.removeEventListener("game-win", this.onGameWin);
    globalThis.removeEventListener("game-over", this.onGameOver);
    this.el.sceneEl?.removeEventListener("enter-vr", this.onEnterVr);
    this.el.sceneEl?.removeEventListener("exit-vr", this.onExitVr);
  },
});
