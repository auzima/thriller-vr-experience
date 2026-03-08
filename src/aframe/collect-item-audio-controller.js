AFRAME.registerComponent("collect-item-audio-controller", {
  schema: {
    audio: { type: "selector", default: "#collect-item-audio" },
    audioSelector: { type: "string", default: "#collect-item-audio" },
    durationMs: { type: "number", default: 5000 },
    volume: { type: "number", default: 0.5 },
  },

  init: function () {
    this.stopTimeout = null;
    this.activeClip = null;
    this.pendingPlay = false;

    this.resumeAudioContext = () => {
      const ctx = this.el.audioListener?.context;
      if (ctx?.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    };

    this.stopActiveClip = () => {
      if (!this.activeClip) return;
      this.activeClip.pause();
      this.activeClip.currentTime = 0;
      this.activeClip = null;
      if (this.stopTimeout) {
        clearTimeout(this.stopTimeout);
        this.stopTimeout = null;
      }
    };

    this.resolveAudioSource = () => {
      const audioEl =
        this.data.audio ||
        this.el.querySelector(this.data.audioSelector) ||
        document.querySelector(this.data.audioSelector);
      if (!audioEl) return null;
      return audioEl.currentSrc || audioEl.src || null;
    };

    this.playCollectAudio = () => {
      const source = this.resolveAudioSource();
      if (!source) return;

      this.resumeAudioContext();
      this.stopActiveClip();
      const clip = new Audio(source);
      clip.loop = false;
      clip.volume = this.data.volume;

      const playPromise = clip.play();
      if (playPromise?.then) {
        playPromise
          .then(() => {
            this.pendingPlay = false;
            this.activeClip = clip;
            this.stopTimeout = setTimeout(() => {
              this.stopActiveClip();
            }, this.data.durationMs);
          })
          .catch(() => {
            this.pendingPlay = true;
          });
      } else {
        this.pendingPlay = false;
        this.activeClip = clip;
        this.stopTimeout = setTimeout(() => {
          this.stopActiveClip();
        }, this.data.durationMs);
      }
    };

    this.onCollected = () => {
      this.playCollectAudio();
    };

    this.onUserGesture = () => {
      if (!this.pendingPlay) return;
      this.playCollectAudio();
    };

    globalThis.addEventListener("jacket-collected", this.onCollected);
    globalThis.addEventListener("popcorn-collected", this.onCollected);
    globalThis.addEventListener("ring-collected", this.onCollected);
    globalThis.addEventListener("pointerdown", this.onUserGesture);
    globalThis.addEventListener("touchstart", this.onUserGesture);
    globalThis.addEventListener("keydown", this.onUserGesture);
  },

  remove: function () {
    globalThis.removeEventListener("jacket-collected", this.onCollected);
    globalThis.removeEventListener("popcorn-collected", this.onCollected);
    globalThis.removeEventListener("ring-collected", this.onCollected);
    globalThis.removeEventListener("pointerdown", this.onUserGesture);
    globalThis.removeEventListener("touchstart", this.onUserGesture);
    globalThis.removeEventListener("keydown", this.onUserGesture);
    this.stopActiveClip();
  },
});
