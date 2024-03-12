addListeners();

function addListeners() {

  addPlayListener("fadeIn", (anim, block) => {
    anim.addFadeIn(1000)
        .play(block);
  });

  addPlayListener("move", (anim, block) => {
    anim.addMove(1000, { x: 100, y: 10 })
        .play(block);
  });

  addPlayListener("scale", (anim, block) => {
    anim.addScale(1000, 1.25)
        .play(block);
  });

  addPlayStopListeners("moveAndHide", (anim, block) => {
    anim.moveAndHide(5000)
        .play(block);
  });

  addPlayListener("showAndHide", (anim, block) => {
    anim.showAndHide(1000)
        .play(block);
  });

  addPlayStopListeners("heartBeating", (anim, block) => {
      anim.heartBeating(block)
          .play(block, cycled=true)
    }
  );
}

function addPlayStopListeners(name, callback) {
  const stops = [];
  addPlayListener(name, (anim, block) => {
    stops.push(callback(anim, block));
  });

  addClickListener(name + "Stop", name + "Block", (_, __) => {
    for (const stop of stops) {
      stop.stop();
    }
  });
}

function addPlayListener(name, callback) {
  addClickListener(name + "Play", name + "Block", callback);
}

function addClickListener(playName, blockName, callback) {
  document.getElementById(playName).addEventListener("click", function () {
    const block = document.getElementById(blockName);
    const anim = animaster();
    callback(anim, block);
  });
}

function animaster() {
  return {
    _steps: [],

    play(element, cycled = false) {
      const interval = setInterval(
        () => {
          let offset = 0;
          for (const { func, duration, args } of this._steps) {
            setTimeout(func, offset, element, duration, ...args);
            offset += duration;
          }
          if (!cycled) {
            clearInterval(interval);
          }
        },
        this._steps.reduce((s, e) => s + e.duration, 0));
    },

    addMove(duration, ...args) {
      return this.addStep(this.move, duration, args);
    },

    addScale(duration, ...args) {
      return this.addStep(this.scale, duration, args);
    },

    addFadeIn(duration, ...args) {
      return this.addStep(this.fadeIn, duration, args);
    },

    addFadeOut(duration, ...args) {
      return this.addStep(this.fadeOut, duration, args);
    },

    addDelay(duration) {
      return this.addStep(() => {}, duration);
    },

    addStep(func, duration, args) {
      this._steps.push({ func, duration, args });
      return this;
    },

    fadeIn(element, duration) {
      element.style.transitionDuration = `${duration}ms`;
      show(element);
    },

    fadeOut(element, duration) {
      element.style.transitionDuration = `${duration}ms`;
      hide(element);
    },

    move(element, duration, translation) {
      element.style.transitionDuration = `${duration}ms`;
      element.style.transform = getTransform(translation, null);
    },

    scale(element, duration, ratio) {
      element.style.transitionDuration = `${duration}ms`;
      element.style.transform = getTransform(null, ratio);
    },

    moveAndHide(duration) {
      const moveDuration = (duration * 2) / 5;

      this.addMove(moveDuration, { x: 100, y: 20 }).addFadeOut(
        duration - moveDuration,
        { x: 100, y: 20 }
      );

      return this;
    },

    showAndHide(duration) {
      const fadeDuration = duration / 3;
      this.addFadeIn(fadeDuration)
          .addDelay(fadeDuration)
          .addFadeOut(fadeDuration);
      return this;
    },

    heartBeating(element) {
      const timeouts = [null, null];

      const interval = setInterval(() => {
        timeouts[0] = setTimeout(this.scale, 0, element, 500, 1.4);
        timeouts[1] = setTimeout(this.scale, 500, element, 500, 1);
      }, 1000);
      return {
        reset: resetMoveAndScale,
        interval,
        timeouts,
        element,
        stop,
      };
    },
  };

  function stop() {
    for (const timeout of this.timeouts) {
      clearTimeout(timeout);
    }
    clearInterval(this.interval);
    this.reset(this.element);
  }

  function resetMoveAndScale(element) {
    element.style.transitionDuration = null;
    element.style.transform = null;
  }

  function resetFadeIn(element) {
    element.style.transitionDuration = null;
    hide(element);
  }

  function resetFadeOut(element) {
    element.style.transitionDuration = null;
    show(element);
  }

  function hide(element) {
    element.classList.add("hide");
    element.classList.remove("show");
  }

  function show(element) {
    element.classList.add("show");
    element.classList.remove("hide");
  }
}

function getTransform(translation, ratio) {
  const result = [];
  if (translation) {
    result.push(`translate(${translation.x}px,${translation.y}px)`);
  }
  if (ratio) {
    result.push(`scale(${ratio})`);
  }
  return result.join(" ");
}
