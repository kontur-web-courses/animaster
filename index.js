addListeners();
let animations = animaster();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animations.fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animations.addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animations.scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let controller = animations.moveAndHide(block, 1000);
            document.getElementById('moveAndHideReset')
                .addEventListener('click', function () {
                    controller.reset();
                });
        });

    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animations.showAndHide(block, 3000);
        });

    document.getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let controller = animations.heartBeating(block);
            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    controller.stop();
                });
        });
}

function animaster() {
    function getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        return result.join(' ');
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {

        _steps: [],
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        moveAndHide: function (element, duration) {
            this.addMove(duration * 2 / 5, {x: 100, y: 20}).play(element);
            setTimeout(() => {
                this.fadeOut(element, duration * 3 / 5);
            }, duration * 2 / 5);

            return {
                reset: () => {
                    resetFadeOut(element);
                    resetMoveAndScale(element);
                }
            };
        },
        showAndHide: function (element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => {
                this.fadeOut(element, duration / 3);
            }, duration * 2 / 3);
        },

        heartBeating: function (element) {
            let idInterval = setInterval(() => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1);
                }, 500);
            }, 1000);
            return {
                stop: () => {
                    clearInterval(idInterval);
                }
            };
        },

        addMove: function (duration, translation) {
            let step = {
                name: "move",
                duration: duration,
                translation: translation,
            };
            this._steps.push(step);
            return this;
        },

        play: function (element) {
            for (const step of this._steps) {
                if (step.name === "move") {
                    this.move(element, step.duration, step.translation);
                }
            }
        }
    };
}