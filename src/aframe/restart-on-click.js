AFRAME.registerComponent("restart-on-click", {
  schema: {
    controllers: {
      type: "selectorAll",
      default: "#hand-left, #hand-right",
    },
  },

  init: function () {
    this.hasRestarted = false;
    this.restart = () => {
      if (this.hasRestarted) return;
      this.hasRestarted = true;
      globalThis.location.reload();
    };

    this.isTargetedByRaycaster = () => {
      const controllers = this.data.controllers || [];
      for (const controller of controllers) {
        const raycaster = controller?.components?.raycaster;
        if (!raycaster?.intersectedEls) continue;
        if (raycaster.intersectedEls.includes(this.el)) return true;
      }
      return false;
    };

    this.onClick = () => this.restart();
    this.isEffectivelyVisible = () => {
      let current = this.el;
      while (current) {
        const visibleAttr = current.getAttribute?.("visible");
        if (visibleAttr === false || visibleAttr === "false") return false;
        current = current.parentEl;
      }
      return true;
    };

    this.onControllerPress = () => {
      // Primary path: controller ray is over the button.
      if (this.isTargetedByRaycaster()) {
        this.restart();
        return;
      }
      // Fallback path: in some headsets thumbstick press events fire
      // but raycaster intersections are unreliable.
      if (this.isEffectivelyVisible()) {
        this.restart();
      }
    };
    this.onControllerClick = () => this.onControllerPress();

    this.controllerEvents = [
      "buttondown",
      "triggerdown",
      "gripdown",
      "thumbstickdown",
      "trackpaddown",
      "abuttondown",
      "bbuttondown",
      "xbuttondown",
      "ybuttondown",
    ];

    this.el.addEventListener("click", this.onClick);
    this.el.addEventListener("mousedown", this.onClick);
    for (const controller of this.data.controllers || []) {
      for (const eventName of this.controllerEvents) {
        controller.addEventListener(eventName, this.onControllerPress);
      }
      controller.addEventListener("click", this.onControllerClick);
    }
  },

  remove: function () {
    this.el.removeEventListener("click", this.onClick);
    this.el.removeEventListener("mousedown", this.onClick);
    for (const controller of this.data.controllers || []) {
      for (const eventName of this.controllerEvents || []) {
        controller.removeEventListener(eventName, this.onControllerPress);
      }
      controller.removeEventListener("click", this.onControllerClick);
    }
  },
});
