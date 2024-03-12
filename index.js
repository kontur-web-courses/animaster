addListeners();

function addListeners() {
  addPlayListener("fadeIn", (anim, block) => {
    return anim.addFadeIn(1000).play(block);
  });

  addPlayListener("move", (anim, block) => {
    return anim.addMove(1000, { x: 100, y: 10 }).play(block);
  });

  addPlayListener("scale", (anim, block) => {
    return anim.addScale(1000, 1.25).play(block);
  });

  addPlayStopListeners("moveAndHide", (anim, block) => {
    return anim.moveAndHide(5000).play(block);
  });

  addPlayListener("showAndHide", (anim, block) => {
    return anim.showAndHide(1000).play(block);
  });

  addPlayStopListeners("heartBeating", (anim, block) => {
    return anim.heartBeating(block).play(block, (cycled = true));
  });
}

function addPlayStopListeners(name, callback) {
  const stops = [];
  addPlayListener(name, (anim, block) => {
    stops.push(callback(anim, block));
  });

  addClickListener(name + "Stop", name + "Block", (_, __) => {
    stops.forEach(e => e.stop());
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
    _timeouts: [],

    play(element, cycled = false) {
      this._play(element);
      if (cycled) {
        var interval = setInterval(
          this._play,
          this._steps.reduce((s, e) => s + e.duration, 0)
        );
      }

      return {
        stop: () => clearInterval(interval),
        reset: () => {
          this._steps.forEach((e) => e.cancel());
          this._timeouts.forEach((e) => clearTimeout(e));
        },
      };
    },

    _play(element) {
      let offset = 0;
      this._steps.forEach(({ func, duration, args }) => {
        this._timeouts.push(
          setTimeout(func, offset, element, duration, ...args)
        );
        offset += duration;
      });
    },

    addMove(duration, ...args) {
      return this.addStep(this.move, resetMoveAndScale, duration, args);
    },

    addScale(duration, ...args) {
      return this.addStep(this.scale, resetMoveAndScale, duration, args);
    },

    addFadeIn(duration, ...args) {
      return this.addStep(this.fadeIn, resetFadeIn, duration, args);
    },

    addFadeOut(duration, ...args) {
      return this.addStep(this.fadeOut, resetFadeOut, duration, args);
    },

    addDelay(duration, ...args) {
      return this.addStep(
        () => {},
        () => {},
        duration,
        args
      );
    },

    addStep(func, cancel, duration, args) {
      this._steps.push({ func, cancel, duration, args });
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
      this.addScale(500, 1.4).addScale(500, 1);
      return this;
    },
  };

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
