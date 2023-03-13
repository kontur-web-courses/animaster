addListeners();

function addListeners() {

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    const customHandler = animaster()
        .addFadeOut(1000)
        .addDelay(10)
        .addFadeIn(10)
        .addScale(1000, 1.5)
        .addScale(1000, 0.5)
        .buildHandler();

    document.getElementById('customPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
            customHandler(block);
        });
}

function animaster() {
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
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

        showAndHide(element, duration) {
            animaster()
                .addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        _steps: [],

        _addStep(step, duration, ...args) {
            this._steps.push((element) => {
                step(element, duration, ...args);
                return new Promise((resolve) => {
                    setTimeout(() => resolve(), duration);
                });
            });
            return this;
        },

        addMove(duration, translation) {
            return this._addStep(this.move, duration, translation);
        },

        addFadeIn(duration) {
            return this._addStep(this.fadeIn, duration);
        },

        addFadeOut(duration) {
            return this._addStep(this.fadeOut, duration);
        },

        addScale(duration, ratio) {
            return this._addStep(this.scale, duration, ratio);
        },

        addDelay(duration) {
            return this._addStep((element, duration) => {
                return new Promise((resolve) => {
                    setTimeout(() => resolve(), duration);
                });
            }, duration);
        },

        _playSteps(element, steps) {
            steps.reduce((promise, step) => {
                return promise.then(() => step(element));
            }, Promise.resolve());
        },

        play(element) {
            this._playSteps(element, this._steps);
        },

        buildHandler() {
            const copy = this._steps.slice();
            return (element) => {
                this._playSteps(element, copy);
            }
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
    return result.join(' ');
}

