addListeners();

const ANIMATION_SCALE = "scale";
const ANIMATION_MOVE = "move";
const ANIMATION_FADE_IN = "fadeIn";
const ANIMATION_FADE_OUT = "fadeOut";
const ANIMATION_DELAY = "delay";

function resetFadeIn(element) {
  element.style.transitionDuration = null;
  element.classList.add("hide");
  element.classList.remove("show");
  element.style.opacity = null;
}

function resetFadeOut(element) {
  element.style.transitionDuration = null;
  element.classList.remove("hide");
  element.classList.add("show");
  element.style.opacity = null;
}

function resetMoveAndScale(element) {
  element.style.transform = getTransform({ x: 0, y: 0 }, 1);
}

function animaster() {
  return {
    _steps: [],
    _currentStep: 0,
    _currentTranslation: { x: 0, y: 0 },
    _currentRatio: 1,
    _stopPended: false,
    _startVisibility: null,
    _timeout: null,

    addFadeIn: function (duration) {
      this._steps.push({
        name: ANIMATION_FADE_IN,
        duration,
      });
      return this;
    },

    addFadeOut: function (duration) {
      this._steps.push({
        name: ANIMATION_FADE_OUT,
        duration,
      });
      return this;
    },

    addMove: function (duration, translation) {
      this._steps.push({
        name: ANIMATION_MOVE,
        duration,
        translation,
      });
      return this;
    },

    addDelay: function (duration) {
      this._steps.push({
        name: ANIMATION_DELAY,
        duration,
      });
      return this;
    },

    _nextStep: function (element, cycled = false) {
      if (this._stopPended)
      {
        return;
      }

      if (this._currentStep === this._steps.length) {
        if (cycled) {
          this._currentStep = 0;
        } else {
          return;
        }
      }

      let step = this._steps[this._currentStep];
      switch (step.name) {
        case ANIMATION_SCALE:
          this._currentRatio = step.ratio;
          break;

        case ANIMATION_MOVE:
          this._currentTranslation.x += step.translation.x;
          this._currentTranslation.y += step.translation.y;
          break;

        case ANIMATION_FADE_IN:
          element.classList.remove("hide");
          element.classList.add("show");
          break;

        case ANIMATION_FADE_OUT:
          element.classList.remove("show");
          element.classList.add("hide");
          break;
      }

      element.style.transform = getTransform(this._currentTranslation, this._currentRatio);
      element.style.transitionDuration = `${step.duration}ms`;

      this._currentStep += 1;
      this._timeout = setTimeout(() => {this._nextStep(element, cycled)},  step.duration);
    },

    play: function (element, cycled = false) {
      this._startVisibility = element.classList.contains("hide") ? "hide" : "show";
      this._nextStep(element, cycled);
      
      let obj = this;
      return {
        stop: function() {
          obj._stopPended = true;
          clearTimeout(obj._timeout);
        },
        reset: function()
        {
          stop();
          obj._steps = [];
          element.style.transform = getTransform({x:0, y:0}, 1);
          element.style.transitionDuration = `${0}ms`;
          element.classList.remove("show");
          element.classList.remove("hide");
          element.classList.add(obj._startVisibility);
        }
      }
    },

    addScale: function (duration, ratio) {
      this._steps.push({
        name: ANIMATION_SCALE,
        duration,
        ratio,
      });
      return this;
    },

    heartBeating: function (element) {
      function makeHeartBeat() {
        this.scale(element, 500, 1.4);
        setTimeout(this.scale, 500, element, 500, 1);
      }

      const scaleUpInterval = setInterval(makeHeartBeat.bind(this), 1000);
      console.log(scaleUpInterval);

      return {
        stop: function () {
          console.log(scaleUpInterval);
          clearInterval(scaleUpInterval);
        },
      };
    },
  };
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

function addListeners() {
  document.getElementById("fadeInPlay").addEventListener("click", function () {
    const block = document.getElementById("fadeInBlock");
    animaster().addFadeIn(5000).play(block);
  });

  document.getElementById("movePlay").addEventListener("click", function () {
    const block = document.getElementById("moveBlock");
    animaster().addMove(1000, { x: 100, y: 10 }).play(block);
  });

  document.getElementById("scalePlay").addEventListener("click", function () {
    const block = document.getElementById("scaleBlock");
    animaster().addScale(1000, 1.25).play(block);
  });


  let moveAndHideAnimation;
  document
    .getElementById("moveAndHidePlay")
    .addEventListener("click", function () {
      const block = document.getElementById("moveAndHideBlock");
      moveAndHideAnimation = animaster()
        .addMove(1000, { x: 100, y: 20 })
        .addDelay(500)
        .addFadeOut(500)
        .play(block);
    });

  document
    .getElementById("MoveAndHideReset")
    .addEventListener("click", function () {
      moveAndHideAnimation && moveAndHideAnimation.reset();
    });

  document
    .getElementById("showAndHidePlay")
    .addEventListener("click", function () {
      const block = document.getElementById("showAndHideBlock");
      animaster()
        .addFadeIn(1000)
        .addDelay(1000)
        .addFadeOut(block, 1000)
        .play(block);
    });

  let heartBeatingAnimation;
  document
    .getElementById("heartBeatingPlay")
    .addEventListener("click", function () {
      const block = document.getElementById("heartBeatingBlock");

      heartBeatingAnimation = animaster()
        .addScale(1000, 1.25)
        .addScale(1000, 1)
        .play(block, true);
    });

  document
    .getElementById("heartBeatingStop")
    .addEventListener("click", function () {
      heartBeatingAnimation && heartBeatingAnimation.stop();
    });
}
