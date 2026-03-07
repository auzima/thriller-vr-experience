AFRAME.registerComponent("thriller-background-controller", {
  schema: {
    audio: { type: "selector", default: "#thriller-audio" },
    volume: { type: "number", default: 0.2 },
  },

  init: function () {
    this.started = false;
    this.pendingByGesture = false;

    this.resumeAudioContext = () => {
      const ctx = this.el.audioListener?.context;
      if (ctx?.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    };

    this.playThriller = () => {
      if (this.started) return;
      const audioEl = this.data.audio;
      if (!audioEl) return;

      this.resumeAudioContext();
      audioEl.loop = true;
      audioEl.volume = this.data.volume;
      const playPromise = audioEl.play();
      if (playPromise?.then) {
        playPromise
          .then(() => {
            this.started = true;
            this.pendingByGesture = false;
          })
          .catch(() => {
            this.pendingByGesture = true;
          });
      } else {
        this.started = true;
        this.pendingByGesture = false;
      }
    };

    this.onFirstZombieScream = () => {
      this.playThriller();
    };

    this.onUserGesture = () => {
      if (!this.pendingByGesture || this.started) return;
      this.playThriller();
    };

    globalThis.addEventListener("first-zombie-scream", this.onFirstZombieScream);
    globalThis.addEventListener("pointerdown", this.onUserGesture);
    globalThis.addEventListener("touchstart", this.onUserGesture);
    globalThis.addEventListener("keydown", this.onUserGesture);
  },

  remove: function () {
    globalThis.removeEventListener("first-zombie-scream", this.onFirstZombieScream);
    globalThis.removeEventListener("pointerdown", this.onUserGesture);
    globalThis.removeEventListener("touchstart", this.onUserGesture);
    globalThis.removeEventListener("keydown", this.onUserGesture);
  },
});
