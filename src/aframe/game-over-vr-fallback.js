AFRAME.registerComponent("game-over-vr-fallback", {
  schema: {
    panel: { type: "selector", default: "#vr-game-over-panel" },
  },

  init: function () {
    this.gameOverActive = false;
    this.overlayActive = true;

    this.applyVisibility = () => {
      const panel = this.data.panel;
      if (!panel) return;
      const inVr = this.el.sceneEl?.is?.("vr-mode");
      const visible = Boolean(this.gameOverActive && inVr && !this.overlayActive);
      panel.setAttribute("visible", visible ? "true" : "false");
      panel.object3D.visible = visible;
    };

    this.onGameOver = () => {
      this.gameOverActive = true;
      this.applyVisibility();
    };

    this.onGameWin = () => {
      this.gameOverActive = false;
      this.applyVisibility();
    };

    this.onHudDomOverlayState = (event) => {
      const active = event?.detail?.active;
      this.overlayActive = active !== false;
      this.applyVisibility();
    };

    this.onEnterVr = () => this.applyVisibility();
    this.onExitVr = () => this.applyVisibility();

    globalThis.addEventListener("game-over", this.onGameOver);
    globalThis.addEventListener("game-win", this.onGameWin);
    globalThis.addEventListener("hud-dom-overlay-state", this.onHudDomOverlayState);
    this.el.sceneEl?.addEventListener("enter-vr", this.onEnterVr);
    this.el.sceneEl?.addEventListener("exit-vr", this.onExitVr);
    this.applyVisibility();
  },

  remove: function () {
    globalThis.removeEventListener("game-over", this.onGameOver);
    globalThis.removeEventListener("game-win", this.onGameWin);
    globalThis.removeEventListener("hud-dom-overlay-state", this.onHudDomOverlayState);
    this.el.sceneEl?.removeEventListener("enter-vr", this.onEnterVr);
    this.el.sceneEl?.removeEventListener("exit-vr", this.onExitVr);
  },
});
