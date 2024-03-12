addListeners();

function addListeners() {
    let heartBeatingInterval;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingInterval = animaster().heartBeating(block);
        });

    document.getElementById('stopHeartBeating')
        .addEventListener('click', function () {
            if (heartBeatingInterval !== undefined) {
                heartBeatingInterval.stop();
            }
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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });

    document.getElementById('resetMoveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });

    document.getElementById('testPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('testBlock');
            animaster().addFadeIn(500)
                .addMove(500, {x: 20, y:20})
                .addScale(1000, 1.3)
                .addFadeOut(1000)
                .play(block);
        });
}

function animaster() {

    const resetFadeIn = function(element) {
        element.style.transitionDuration =  `0ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    const resetFadeOut = function(element) {
        element.style.transitionDuration =  `0ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    const resetMove = function(element) {
        element.style.transitionDuration =  `0ms`;
        element.style.transform = null;
    }

    return {
        _steps: [],
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
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show')
        },

        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide')
        },

        addDelay(duration) {
            let operation = {
                Name: 'Duration',
                Duration: duration,
                Command: function() { }
            }
            this._steps.push(operation);
            return this;
        },

        showAndHide(element, duration) {
            this.addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        heartBeating(element) {
            const upScaleK = 1.4;
            const defaultScaleK = 1;
            const interval = 500;

            this.scale(element, interval, upScaleK);
            setTimeout(() => this.scale(element, interval, defaultScaleK), interval);
            const intervalObj = setInterval(() => {
                this.scale(element, interval, upScaleK);
                setTimeout(() => this.scale(element, interval, defaultScaleK), interval);
            }, 2 * interval)

            return {stop() {clearInterval(intervalObj)}};
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        addScale(duration, ratio) {
            let step = {
                Name: 'Scale',
                Command: this.scale,
                Duration: duration,
                Additional: ratio
            }
            this._steps.push(step);
            return this;
        },

        moveAndHide(element, duration) {
            this.addMove(duration * 2 / 5,{x: 100, y: 20} )
                .addFadeOut(duration * 3 / 5)
                .play(element);
        },

        resetMoveAndHide(element) {
            resetFadeOut(element);
            resetMove(element);
        },

        addMove(duration, position) {
            const step = {
                Name: 'Move',
                Command: this.move,
                Duration: duration,
                Additional: position
            }
            this._steps.push(step);
            return this;
        },

        addFadeIn(duration) {
            const step = {
                Name: 'FadeIn',
                Command: this.fadeIn,
                Duration: duration
            }
            this._steps.push(step);
            return this;
        },

        addFadeOut(duration) {
            const step = {
                Name: 'FadeOut',
                Command: this.fadeOut,
                Duration: duration
            }
            this._steps.push(step);
            return this;
        },

        play(element) {
            let interval = 0;
            this._steps.reverse();
            while (this._steps.length > 0) {
                const step = this._steps.pop();
                if (step.hasOwnProperty('Additional')) {
                    setTimeout(() => step.Command(element, step.Duration, step.Additional), interval);
                }
                else {
                    setTimeout( () => step.Command(element, step.Duration), interval);
                }
                interval += step.Duration;
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
