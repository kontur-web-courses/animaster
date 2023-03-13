addListeners();

function addListeners() {
    let heartBeatingStopper;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(500, {x: 20, y: 20}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
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
