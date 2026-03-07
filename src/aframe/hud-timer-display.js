AFRAME.registerComponent("hud-timer-display", {
  schema: {
    label: { type: "string", default: "TEMPS" },
    initialSeconds: { type: "number", default: 300 },
  },

  init: function () {
    this.onTick = (event) => {
      const secondsLeft = event?.detail?.secondsLeft;
      if (typeof secondsLeft !== "number") return;
      this.updateText(secondsLeft);
    };

    this.updateText(this.data.initialSeconds);
    globalThis.addEventListener("game-timer-tick", this.onTick);
  },

  formatTime: function (totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  },

  updateText: function (secondsLeft) {
    const textData = this.el.getAttribute("text") || {};
    textData.value = this.formatTime(secondsLeft);
    this.el.setAttribute("text", textData);
  },

  remove: function () {
    globalThis.removeEventListener("game-timer-tick", this.onTick);
  },
});
