AFRAME.registerComponent("game-timer", {
  schema: {
    label: { type: "string", default: "Temps" },
    durationSeconds: { type: "number", default: 120 },
  },

  init: function () {
    this.startedAt = performance.now();
    this.lastSecond = -1;
    this.ended = false;
    this.updateDisplay(this.data.durationSeconds);
  },

  formatTime: function (totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  },

  updateDisplay: function (secondsLeft) {
    const textData = this.el.getAttribute("text") || {};
    textData.value = this.formatTime(secondsLeft);
    this.el.setAttribute("text", textData);
  },

  tick: function () {
    if (this.ended) return;
    const elapsedSeconds = Math.floor((performance.now() - this.startedAt) / 1000);
    if (elapsedSeconds === this.lastSecond) return;
    this.lastSecond = elapsedSeconds;
    const secondsLeft = Math.max(this.data.durationSeconds - elapsedSeconds, 0);
    this.updateDisplay(secondsLeft);
    globalThis.dispatchEvent(
      new CustomEvent("game-timer-tick", { detail: { secondsLeft } }),
    );
    if (secondsLeft === 0) {
      this.ended = true;
      globalThis.dispatchEvent(new CustomEvent("game-timer-ended"));
    }
  },
});
