addListeners();

function addListeners() {
  const globalAnimaster = animaster();

  addPlayListener("fadeIn", (anim, block) => {
    anim.fadeIn(block, 5000);
  });

  addPlayListener("move", (anim, block) => {
    anim.move(block, 1000, { x: 100, y: 10 });
  });

  addPlayListener("scale", (anim, block) => {
    anim.scale(block, 1000, 1.25);
  });
  
  addPlayListener("moveAndHide", (anim, block) => {
    anim.moveAndHide(block, 1000);
  });

  addPlayListener("showAndHide", (anim, block) => {
    anim.showAndHide(block, 1000);
  });

  let heartBeatStop = null;
  addPlayListener("heartBeating", (anim, block) => {
    heartBeatStop = anim.heartBeating(block);
  });

  addClickListener("heartBeatingStop", "heartBeatingBlock", (_, __) => {
    heartBeatStop?.stop();
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
  })
}

function animaster() {
  return {
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    fadeIn(element, duration) {
      element.style.transitionDuration = `${duration}ms`;
      element.classList.remove("hide");
      element.classList.add("show");
    },

    fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove("show");
        element.classList.add("hide");
    },

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    move(element, duration, translation) {
      element.style.transitionDuration = `${duration}ms`;
      element.style.transform = getTransform(translation, null);
    },

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    scale(element, duration, ratio) {
      element.style.transitionDuration = `${duration}ms`;
      element.style.transform = getTransform(null, ratio);
    },

    moveAndHide(element, duration) {
      const moveDuration = duration * 2 / 5;
      setTimeout(this.move, 0, element, moveDuration, {x: 100, y: 20});
      setTimeout(this.fadeOut, moveDuration, element, duration - moveDuration);
    },

    showAndHide(element, duration) {
      const fadeDuration = duration / 3;
      setTimeout(this.fadeIn, 0, element, fadeDuration);
      setTimeout(this.fadeOut, 2 * fadeDuration, element, fadeDuration);
    },

    heartBeating(element) {
      const interval = setInterval(() => {
        setTimeout(this.scale, 0, element, 500, 1.4);
        setTimeout(this.scale, 500, element, 500, 1 / 1.4);
      }, 1000);
      return {
        stop() {
          clearInterval(interval)
        }
      };
    }
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
