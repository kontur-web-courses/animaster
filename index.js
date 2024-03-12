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

    let testManager;
    document.getElementById('testPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('testBlock');
            testManager = animaster().addFadeIn(500)
                .addMove(500, {x: 20, y:20})
                .addScale(1000, 1.3)
                .addFadeOut(300)
                .addFadeIn(200)
                .play(block);
        });

    document.getElementById('resetTestPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('testBlock');
            testManager.reset(block);
        });

    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();
    document
        .getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
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

    const createResetCommandsList = function(commands) {
        let result = [];
        for (const command of commands) {
            switch (command.Name) {
                case 'FadeIn': {
                    result.push(resetFadeIn);
                    break;
                }
                case 'FadeOut': {
                    result.push(resetFadeOut);
                    break;
                }
                case 'Move': {
                    result.push(resetMove);
                    break;
                }
                case 'Scale': {
                    result.push(resetMove);
                    break;
                }
            }
        }
        return result;
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
            const increasedScale = 1.4;
            const defaultScale = 1;
            const interval = 500;

            return this.addScale(interval, increasedScale)
                .addScale(interval, defaultScale)
                .play(element, true)
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

        buildHandler() {
            const animationHandler = this;
            return function() {
                const element = this;
                animationHandler.play(element);
            };
        },

        play(element, cycled = false) {
            const usedCommands = this._steps.map(x => x);
            const resetFunc = (element) => {
                for (const command of createResetCommandsList(usedCommands)) {
                    command(element);
                }
            }
            if (cycled) {
                let totalTime = 0;
                for (const step of this._steps) {
                    totalTime += step.Duration;
                }
                let interval = 0;
                for (const step of this._steps) {
                    interval = executeStep(step, element, interval);
                }
                const intervalObj = setInterval(() => {
                    interval = 0;
                    for (const step of this._steps) {
                        interval = executeStep(step, element, interval);
                    }
                }, totalTime);

                return {
                    stop() {clearInterval(intervalObj)},
                    reset(element) {
                        resetFunc(element);
                    }
                };
            }
            else {
                let interval = 0;
                for (const step of this._steps) {
                    interval = executeStep(step, element, interval);
                }

                return {
                    stop() { },
                    reset(element) {
                        resetFunc(element) ;
                    }
                }
            }

        }
    }
}


function executeStep(step, element, currentInterval) {
    if (step.hasOwnProperty('Additional')) {
        setTimeout(() => step.Command(element, step.Duration, step.Additional), currentInterval);
    }
    else {
        setTimeout( () => step.Command(element, step.Duration), currentInterval);
    }
    return currentInterval + step.Duration;
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
