AFRAME.registerComponent("hud-vr-fallback", {
  schema: {
    fallback: { type: "selector", default: "#vr-hud-fallback" },
  },

  init: function () {
    this.setFallbackVisible = (visible) => {
      const fallbackEl = this.data.fallback;
      if (!fallbackEl) return;
      fallbackEl.setAttribute("visible", visible ? "true" : "false");
      fallbackEl.object3D.visible = visible;
    };

    this.updateMode = () => {
      const inVr = this.el.is("vr-mode");
      const session = this.el.renderer?.xr?.getSession?.();
      const hasDomOverlay = Boolean(session?.domOverlayState);
      const useOverlayHud = !inVr || hasDomOverlay;
      this.setFallbackVisible(!useOverlayHud);
      globalThis.dispatchEvent(
        new CustomEvent("hud-dom-overlay-state", {
          detail: { active: useOverlayHud },
        }),
      );
    };

    this.onEnterVr = () => {
      this.updateMode();
      // Petit délai pour laisser la session XR se stabiliser.
      setTimeout(() => this.updateMode(), 250);
    };

    this.onExitVr = () => {
      this.updateMode();
    };

    this.el.addEventListener("enter-vr", this.onEnterVr);
    this.el.addEventListener("exit-vr", this.onExitVr);
    this.updateMode();
  },

  remove: function () {
    this.el.removeEventListener("enter-vr", this.onEnterVr);
    this.el.removeEventListener("exit-vr", this.onExitVr);
  },
});
