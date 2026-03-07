AFRAME.registerComponent("loup-audio-controller", {
  schema: {
    audio: { type: "selector", default: "#loup-audio" },
    volume: { type: "number", default: 0.55 },
    maxDurationMs: { type: "number", default: 5000 },
    fadeOutMs: { type: "number", default: 1000 },
  },

  init: function () {
    this.started = false;
    this.hasEnded = false;
    this.isStarting = false;
    this.stopTimeout = null;
    this.fadeTimeout = null;
    this.fadeInterval = null;
    globalThis.__loupAudioFinished = false;
    globalThis.__loupAudioStartedAt = 0;

    this.resumeAudioContext = () => {
      const ctx = this.el.audioListener?.context;
      if (ctx?.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    };

    this.stopAudio = () => {
      const audioEl = this.data.audio;
      if (!audioEl) return;
      if (this.started && !this.hasEnded) {
        this.hasEnded = true;
        globalThis.__loupAudioFinished = true;
        globalThis.dispatchEvent(new CustomEvent("loup-audio-ended"));
      }
      audioEl.pause();
      audioEl.currentTime = 0;
      audioEl.volume = this.data.volume;
      if (this.stopTimeout) {
        clearTimeout(this.stopTimeout);
        this.stopTimeout = null;
      }
      if (this.fadeTimeout) {
        clearTimeout(this.fadeTimeout);
        this.fadeTimeout = null;
      }
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
    };

    this.startFadeOut = () => {
      const audioEl = this.data.audio;
      if (!audioEl) return;
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
      }

      const fadeDuration = Math.max(0, this.data.fadeOutMs);
      if (fadeDuration === 0) return;

      const steps = Math.max(1, Math.floor(fadeDuration / 50));
      const startVolume = this.data.volume;
      let step = 0;

      this.fadeInterval = setInterval(() => {
        step += 1;
        const progress = Math.min(1, step / steps);
        audioEl.volume = startVolume * (1 - progress);
        if (progress >= 1) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
      }, 50);
    };

    this.tryPlay = () => {
      if (this.started || this.isStarting) return;
      const audioEl = this.data.audio;
      if (!audioEl) return;

      this.isStarting = true;
      this.resumeAudioContext();
      audioEl.loop = false;
      audioEl.currentTime = 0;
      audioEl.volume = this.data.volume;

      const playPromise = audioEl.play();
      if (playPromise?.then) {
        playPromise
          .then(() => {
            this.isStarting = false;
            this.started = true;
            this.hasEnded = false;
            globalThis.__loupAudioStartedAt = Date.now();
            globalThis.dispatchEvent(
              new CustomEvent("loup-audio-started", {
                detail: { startedAt: globalThis.__loupAudioStartedAt },
              }),
            );
            const fadeDelay = Math.max(
              0,
              this.data.maxDurationMs - this.data.fadeOutMs,
            );
            this.fadeTimeout = setTimeout(() => {
              this.startFadeOut();
            }, fadeDelay);
            this.stopTimeout = setTimeout(() => {
              this.stopAudio();
            }, this.data.maxDurationMs);
          })
          .catch(() => {
            this.isStarting = false;
          });
      } else {
        this.isStarting = false;
        this.started = true;
        this.hasEnded = false;
        globalThis.__loupAudioStartedAt = Date.now();
        globalThis.dispatchEvent(
          new CustomEvent("loup-audio-started", {
            detail: { startedAt: globalThis.__loupAudioStartedAt },
          }),
        );
        const fadeDelay = Math.max(0, this.data.maxDurationMs - this.data.fadeOutMs);
        this.fadeTimeout = setTimeout(() => {
          this.startFadeOut();
        }, fadeDelay);
        this.stopTimeout = setTimeout(() => {
          this.stopAudio();
        }, this.data.maxDurationMs);
      }
    };

    this.onEnterVr = () => {
      this.tryPlay();
    };

    this.onSceneLoaded = () => {
      this.tryPlay();
    };

    // Fallback: certaines plateformes débloquent l'audio
    // au premier geste utilisateur, même hors VR.
    this.onUserGesture = () => {
      this.tryPlay();
    };

    if (this.el.hasLoaded) {
      this.tryPlay();
    } else {
      this.el.addEventListener("loaded", this.onSceneLoaded);
    }
    this.el.addEventListener("enter-vr", this.onEnterVr);
    globalThis.addEventListener("pointerdown", this.onUserGesture);
    globalThis.addEventListener("touchstart", this.onUserGesture);
    globalThis.addEventListener("keydown", this.onUserGesture);
  },

  remove: function () {
    this.stopAudio();
    this.el.removeEventListener("loaded", this.onSceneLoaded);
    this.el.removeEventListener("enter-vr", this.onEnterVr);
    globalThis.removeEventListener("pointerdown", this.onUserGesture);
    globalThis.removeEventListener("touchstart", this.onUserGesture);
    globalThis.removeEventListener("keydown", this.onUserGesture);
  },
});
