addListeners();

function addListeners() {
    let heartBeatingStopper;
    let moveAndHideController = {stop: 'kek'}

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeInReset(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(500, {x: 20, y: 20}).play(block);
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().moveReset(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scaleReset(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingStopper = animaster().heartBeating(block, 500, 1.4);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeatingStopper.stop();
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOutReset(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBLock');
            moveAndHideController = animaster().moveAndHide(block, 5000, {x: 100, y: 20})
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            moveAndHideController.stop();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBLock');
            animaster().showAndHide(block, 5000)
        });
}

function animaster() {
    return {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn: (element, duration) => {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut: (element, duration) => {
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
        move: (element, duration, translation) => {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale: (element, duration, ratio) => {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        heartBeating: function (element, interval, ratio) {
            return {
                currentSize: ratio,
                intervalId: setInterval(() => {
                    this.scale(element, interval, this.currentSize);
                    this.currentSize = (this.currentSize === 1) ? ratio : 1;
                }, interval),
                stop: function () {
                    clearInterval(this.intervalId)
                }
            }
        },

        _steps: [],

        addMove: function (duration, translation) {
            this._steps.push({name: "Move", duration: duration, translation: translation})
            return this;
        },
        addScale: function (duration, ratio) {
            this._steps.push({name: "Scale", duration: duration, ratio: ratio})
            return this;
        },
        addFadeIn: function (duration) {
            this._steps.push({name: "FadeIn", duration: duration})
            return this;
        },
        addFadeOut: function (duration) {
            this._steps.push({name: "FadeOut", duration: duration})
            return this;
        },

        play: function (element) {
            for (let step of this._steps) {
                switch (step.name) {
                    case "Move":
                        this.move(element, step.duration, step.translation);
                        break;
                    case "Scale":
                        this.scale(element, step.duration, step.ratio)
                        break;
                    case "FadeIn":
                        this.fadeIn(element, step.duration)
                        break;
                    case "FadeOut":
                        this.fadeOut(element, step.duration)
                        break;
                }
            }
        }
        scaleReset: (element) => {
            element.style.transitionDuration = null;
            element.style.transform = null
        },
        showAndHide: function (element, duration) {
            this.fadeIn(element, 1 / 3 * duration);
            setTimeout(() => this.fadeOut(element, 1 / 3 * duration), 2 / 3 * duration);
        },
        fadeInReset: (element) => {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        fadeOutReset: (element) => {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        moveReset: (element) => {
            element.style.transitionDuration = null;
            element.style.transform = `translate(${-element.x}px,${-element.y}px)`
            element.style.transform = null;
        },
        moveAndHide: function (element, duration, translation) {
            this.move(element, 2 / 5 * duration, translation);
            let timeoutId = setTimeout(() => this.fadeOut(element, 3 / 5 * duration), 2 / 5 * duration);
            return {
                stop: () => {
                    this.moveReset(element);
                    this.fadeOutReset(element);
                    clearInterval(timeoutId);
                }
            }
        },
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
