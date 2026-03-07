AFRAME.registerComponent("collectibles-counter", {
  schema: {
    label: { type: "string", default: "Objets" },
    total: { type: "number", default: 3 },
  },

  init: function () {
    this.collected = new Set();
    this.eventsMap = {
      "jacket-collected": "jacket",
      "popcorn-collected": "popcorn",
      "ring-collected": "ring",
    };

    this.onCollected = (eventName) => {
      const key = this.eventsMap[eventName];
      if (!key) return;
      this.collected.add(key);
      this.updateText();
    };

    this.listeners = Object.keys(this.eventsMap).map((eventName) => {
      const handler = () => this.onCollected(eventName);
      globalThis.addEventListener(eventName, handler);
      return { eventName, handler };
    });

    this.updateText();
  },

  updateText: function () {
    const count = Math.min(this.collected.size, this.data.total);
    this.el.setAttribute("text", "value", `${this.data.label} ${count}/${this.data.total}`);
  },

  remove: function () {
    if (!this.listeners) return;
    for (const { eventName, handler } of this.listeners) {
      globalThis.removeEventListener(eventName, handler);
    }
  },
});
