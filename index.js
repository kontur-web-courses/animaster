addListeners();

function addListeners() {
    let timer = null;
    let moveAndHideTimer = null;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMove(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideTimer = animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('resetMoveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideTimer.stop(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            timer = animaster().heartBeating(block, 1000, 1.4, 1);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            timer.stop();
        });

    document.getElementById('addMovePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('addMoveBlock');
            timer = animaster().addMove(200, {x: 200, y: 0})
                .addMove(200, {x: 0, y: 0})
                .addMove(200, {x: 200, y: 0})
                .addMove(200, {x: 0, y: 0}).play(block);
        });
}

function animaster() {
    return {
        _steps: [],

        addMove(duration, argument) {
            this._steps.push({func: this.move, duration: duration, argument: argument})
            return this;
        },

        play(element) {
            let wait = 0;
            for (let step of this._steps) {
                setTimeout(() => step.func(element, step.duration, step.argument), wait);
                wait += step.duration;
            }
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn: function (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
        },

        resetFadeIn(element) {
            element.style.transitionDuration = `${0}ms`
            element.classList.add('hide');
        },
        /**
         * Блок плавно становится прозрачным.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut: function (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut(element) {
            element.style.transitionDuration = `${0}ms`
            element.classList.add('show');
            element.classList.remove('hide');
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

        resetMove(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        },
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale: function (element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide: function (element, duration, translation) {
            this.move(element, duration * 2 / 5, translation);
            let timer = setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5);

            return {
                stop: (element) => {
                    this.resetMove(element);
                    this.resetFadeOut(element);
                    if (timer) {
                        clearInterval(timer);
                    }
                }
            }
        },

        showAndHide: function (element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration * 2 / 3);
        },

        heartBeating: function (element, duration, ratioUp, rationDown) {
            this.scale(element, duration / 2, ratioUp);
            setTimeout(() => this.scale(element, duration / 2, rationDown), duration / 2)
            let timer = setInterval(() =>
            {
                this.scale(element, duration / 2, ratioUp);
                setTimeout(() => this.scale(element, duration / 2, rationDown), duration / 2);
            }, duration);

            return {
                stop: () => {
                    if (timer) {
                        clearInterval(timer);
                    }
                }
            }
        }
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
    return result.join(' ');
}
