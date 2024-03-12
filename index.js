addListeners();

function addListeners() {
  addPlayListener("fadeIn", (anim, block) => anim.addFadeIn(1000).play(block));

  addPlayListener("move", (anim, block) =>
    anim.addMove(1000, { x: 100, y: 10 }).play(block)
  );

  addPlayListener("scale", (anim, block) =>
    anim.addScale(1000, 1.25).play(block)
  );

  addPlayStopListeners("moveAndHide", (anim, block) =>
    anim.moveAndHide(5000).play(block)
  );

  addPlayListener("showAndHide", (anim, block) =>
    anim.showAndHide(1000).play(block)
  );

  addPlayStopListeners("heartBeating", (anim, block) =>
    anim.heartBeating().play(block, (cycled = true))
  );

  addPlayStopListeners("backgroundSize", (anim, block) =>
    anim.addBackgroundSize(1000, 100).addBackgroundSize(1000, 5).play(block, (cycled = true))
  );
}

function addPlayStopListeners(name, callback) {
  addPlayListener(name, (anim, block) => {
    const play = callback(anim, block);

    addClickListener(name + "Reset", name + "Block", (_, __) => {
      play.reset();
    });

    addClickListener(name + "Stop", name + "Block", (_, __) => {
      play.stop();
    });
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
          this._play.bind(this),
          this._steps.reduce((s, e) => s + e.duration, 0),
          element
        );
      }

      return {
        stop: () => clearInterval(interval),
        reset: () => {
          this._steps.forEach((e) => e.cancel(element));
          this._timeouts.forEach((e) => clearTimeout(e));
        },
      };
    },

    _play(element) {
      let offset = 0;
      this._timeouts = [];
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

    addBackgroundSize(duration, ...args) {
      return this.addStep(
        this.backgroundSize,
        resetbackgroundSize,
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

    backgroundSize(element, duration, size) {
      element.style.transitionDuration = `${duration}ms`;
      element.style.backgroundSize = `${size}% ${size}%`;
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

    heartBeating() {
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

  function resetbackgroundSize(element) {
    element.style.transitionDuration = null;
    element.style.backgroundSize = null;
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
