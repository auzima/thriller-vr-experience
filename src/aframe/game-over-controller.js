AFRAME.registerComponent("game-over-controller", {
  init: function () {
    this.hasStopped = false;
    this.onStopRequested = () => {
      if (this.hasStopped) return;
      this.hasStopped = true;
      // On évite de pauser toute la scène pour ne pas casser les contrôles VR.
      const zombies = this.el.querySelectorAll("[zombie-chase]");
      for (const zombie of zombies) {
        zombie.removeAttribute("zombie-chase");
        zombie.removeAttribute("simple-navmesh-constraint");
      }
    };
    globalThis.addEventListener("game-over", this.onStopRequested);
    globalThis.addEventListener("game-win", this.onStopRequested);
  },

  remove: function () {
    globalThis.removeEventListener("game-over", this.onStopRequested);
    globalThis.removeEventListener("game-win", this.onStopRequested);
  },
});
