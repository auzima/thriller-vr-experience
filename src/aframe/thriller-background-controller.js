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
      if (this.started) return;
      if (!this.pendingByGesture) return;
      this.playThriller();
    };

    this.onSceneLoaded = () => {
      this.playThriller();
    };

    this.onEnterVr = () => {
      this.playThriller();
    };

    globalThis.addEventListener(
      "first-zombie-scream",
      this.onFirstZombieScream,
    );
    globalThis.addEventListener("pointerdown", this.onUserGesture);
    globalThis.addEventListener("touchstart", this.onUserGesture);
    globalThis.addEventListener("keydown", this.onUserGesture);
    this.el.addEventListener("loaded", this.onSceneLoaded);
    this.el.addEventListener("enter-vr", this.onEnterVr);

    // Try once immediately when the component starts.
    setTimeout(() => this.playThriller(), 0);
  },

  remove: function () {
    globalThis.removeEventListener(
      "first-zombie-scream",
      this.onFirstZombieScream,
    );
    globalThis.removeEventListener("pointerdown", this.onUserGesture);
    globalThis.removeEventListener("touchstart", this.onUserGesture);
    globalThis.removeEventListener("keydown", this.onUserGesture);
    this.el.removeEventListener("loaded", this.onSceneLoaded);
    this.el.removeEventListener("enter-vr", this.onEnterVr);
  },
});
