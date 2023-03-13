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

    document.getElementById('customBlock')
        .addEventListener('click', customHandler);

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const ctrl = animaster().moveAndHide(block, 5000);
            const rstBtn = document.getElementById('moveAndHideReset');
            rstBtn.addEventListener('click', () => {
                ctrl.reset();
            });
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            const ctrl = animaster().heartBeating(block);
            const stopBtn = document.getElementById('heartBeatingStop');
            stopBtn.addEventListener('click', () => {
                ctrl.stop();
            });
        });


    document.getElementById('customCycledPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customCycledBlock');
            animaster()
                .addMove(1000, {x: 100, y: 20})
                .addMove(1000, {x: 0, y: 0})
                .play(block, true);
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
            return animaster()
                .addFadeIn(duration)
                .play(element);
        },

        fadeOut(element, duration) {
            return animaster()
                .addFadeOut(duration)
                .play(element);
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            return animaster()
                .addMove(duration, translation)
                .play(element);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            return animaster()
                .addScale(duration, ratio)
                .play(element);
        },

        moveAndHide(element, duration) {
            return animaster()
                .addMove(duration * 2 / 5, {x: 100, y: 20})
                .addFadeOut(duration * 3 / 5)
                .play(element);
        },

        heartBeating(element) {
            return animaster()
                .addScale(500, 1.4)
                .addScale(500, 1)
                .play(element, true);
        },

        showAndHide(element, duration) {
            return animaster()
                .addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        _steps: [],

        _addStep(step, duration, resetFunc = null) {
            this._steps.push({
                duration,
                resetFunc,
                play(element) {
                    step(element, duration);
                    return new Promise((resolve) => {
                        setTimeout(() => resolve(), duration);
                    });
                }
            });
            return this;
        },

        addMove(duration, translation) {
            return this._addStep((element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(translation, null);
            }, duration, resetMoveAndScale);
        },

        addFadeIn(duration) {
            return this._addStep((element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('hide');
                element.classList.add('show');
            }, duration, resetFadeIn);
        },

        addFadeOut(duration) {
            return this._addStep((element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }, duration, resetFadeOut);
        },

        addScale(duration, ratio) {
            return this._addStep((element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(null, ratio);
            }, duration, resetMoveAndScale);
        },

        addDelay(duration) {
            return this._addStep((element) => {
                return new Promise((resolve) => {
                    setTimeout(() => resolve(), duration);
                });
            }, duration);
        },

        _playSteps(element, steps, cycled = false) {
            let totalDuration = 0;
            steps.forEach((step) => {
                totalDuration += step.duration;
            });

            let isStopped = false;

            function doCycle() {
                if (isStopped) {
                    return;
                }
                steps.reduce((promise, step) => {
                    return promise.then(() => step.play(element));
                }, Promise.resolve());
            }

            doCycle()
            if (cycled) {
                setInterval(doCycle, totalDuration);
            }

            const obj = this;

            return {
                stop() {
                    isStopped = true;
                    clearInterval(doCycle);
                },

                reset() {
                    stop();
                    for (let step of obj._steps) {
                        if (step.resetFunc) {
                            step.resetFunc(element);
                        }
                    }
                }
            }
        },

        play(element, cycled = false) {
            return this._playSteps(element, this._steps, cycled);
        },

        buildHandler() {
            const copy = this._steps.slice();
            const obj = this;
            return function () {
                const dom = this;
                obj._playSteps(dom, copy);
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

