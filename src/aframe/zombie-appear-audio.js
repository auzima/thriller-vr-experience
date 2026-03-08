AFRAME.registerComponent("zombie-appear-audio", {
  schema: {
    audio: { type: "selector", default: "#zombie-appear-audio" },
    volume: { type: "number", default: 0.65 },
    delayAfterLoupMs: { type: "number", default: 8000 },
  },

  init: function () {
    this.played = false;
    this.pendingTimeout = null;
    this.loupStartedAt = Number(globalThis.__loupAudioStartedAt) || 0;
    this.hasDispatchedFirstScream = Boolean(globalThis.__firstZombieScreamPlayed);

    this.scheduleWhenReady = () => {
      if (this.played) return;
      if (!this.loupStartedAt) return;
      const elapsed = Date.now() - this.loupStartedAt;
      const remaining = Math.max(this.data.delayAfterLoupMs - elapsed, 0);
      if (this.pendingTimeout) {
        clearTimeout(this.pendingTimeout);
        this.pendingTimeout = null;
      }
      this.pendingTimeout = setTimeout(() => {
        this.tryPlay();
      }, remaining);
    };

    this.tryPlay = () => {
      if (this.played || !this.loupStartedAt) return;
      const elapsed = Date.now() - this.loupStartedAt;
      if (elapsed < this.data.delayAfterLoupMs) {
        this.scheduleWhenReady();
        return;
      }
      const audioEl = this.data.audio;
      if (!audioEl) return;

      const source = audioEl.currentSrc || audioEl.src;
      if (!source) return;

      const clip = new Audio(source);
      clip.volume = this.data.volume;
      clip.play().catch(() => {});
      this.played = true;
      if (!this.hasDispatchedFirstScream) {
        this.hasDispatchedFirstScream = true;
        globalThis.__firstZombieScreamPlayed = true;
        globalThis.dispatchEvent(new CustomEvent("first-zombie-scream"));
      }
      if (this.pendingTimeout) {
        clearTimeout(this.pendingTimeout);
        this.pendingTimeout = null;
      }
    };

    this.onModelLoaded = () => {
      this.tryPlay();
    };

    this.onLoupAudioStarted = (event) => {
      const startedAt = Number(event?.detail?.startedAt) || Date.now();
      this.loupStartedAt = startedAt;
      this.scheduleWhenReady();
    };

    this.el.addEventListener("model-loaded", this.onModelLoaded);
    globalThis.addEventListener("loup-audio-started", this.onLoupAudioStarted);
    setTimeout(() => {
      this.tryPlay();
    }, 0);
  },

  remove: function () {
    this.el.removeEventListener("model-loaded", this.onModelLoaded);
    globalThis.removeEventListener("loup-audio-started", this.onLoupAudioStarted);
    if (this.pendingTimeout) {
      clearTimeout(this.pendingTimeout);
      this.pendingTimeout = null;
    }
  },
});
