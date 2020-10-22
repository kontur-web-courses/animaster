addListeners();

function animaster() {
    const animationNames = {
        fadeIn: 'fadeIn',
        fadeOut: 'fadeOut',
        move: 'move',
        scale: 'scale',
        delay: 'delay'
    };

    /**
     * Сброс анимации FadeIn
     * @param element — HTMLElement, на котором надо сбросить состояние
     */
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    /**
     * Сброс анимации FadeOut
     * @param element — HTMLElement, на котором надо сбросить состояние
     */
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    /**
     * Сброс анимации MoveAndScale
     * @param element — HTMLElement, на котором надо сбросить состояние
     */
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
        fadeIn(element, duration) {
            this.addFadeIn(duration).play(element);
        },

        /**
         * Блок плавно становится прозрачным.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            this.addFadeOut(duration).play(element);
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            this.addMove(duration, translation).play(element);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            this.addScale(duration, ratio).play(element);
        },

        /**
         * Блок одновременно сдвигается на 100 пикселей вправо и на 20 вниз, а потом исчезает
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        moveAndHide(element, duration) {
            this.addMove(2 / 5 * duration, { x: 100, y: 20 }).addFadeOut(3 / 5 * duration).play(element);
            const timerId = this.timerId;
            return {
                reset() {
                    clearTimeout(timerId);
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            }
        },


        /**
         * Блок появляется, ждет и исчезает
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        showAndHide(element, duration) {
            const partDuration = 1 / 3 * duration;
            this.addFadeIn(partDuration).addDelay(partDuration).addFadeOut(partDuration).play(element);
        },

        /**
         * Имитация сердцебиения
         * @param element — HTMLElement, который надо анимировать
         */
        heartBeating(element) {
            const duration = 1000;
            this.addScale(duration / 2, 1.4).addScale(duration / 2, 1).play(element, true);
            const self = this; // TODO: Почему не работает если присвоить this.timerId?
            return {
                stop() {
                    clearTimeout(self.timerId);
                }
            }
        },

        /**
         * Добавить анимацию движения в список шагов анимации
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        addMove(duration, translation) {
            this._steps.push({
                animationName: animationNames.move,
                duration: duration,
                translation: translation
            });
            return this;
        },

        /**
         * Добавить анимацию увеличения/уменьшения элемента в список шагов анимации
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        addScale(duration, ratio) {
            this._steps.push({
                animationName: animationNames.scale,
                duration: duration,
                ratio: ratio
            });
            return this;
        },

        /**
         * Добавить анимацию плавного появления из прозрачного в список шагов анимации
         * @param duration — Продолжительность анимации в миллисекундах
         */
        addFadeIn(duration) {
            this._steps.push({
                animationName: animationNames.fadeIn,
                duration: duration,
                add: 'show',
                remove: 'hide'
            });
            return this;
        },

        /**
         * Добавить анимацию плавного исчезновения в список шагов анимации
         * @param duration — Продолжительность анимации в миллисекундах
         */
        addFadeOut(duration) {
            this._steps.push({
                animationName: animationNames.fadeOut,
                duration: duration,
                add: 'hide',
                remove: 'show'
            });
            return this;
        },

        /**
         * Добавить паузу в анимацию
         * @param duration — Продолжительность паузы
         */
        addDelay(duration) {
            this._steps.push({
                animationName: animationNames.delay,
                duration,
            });
            return this;
        },

        /**
         * Воспроизведение анимации
         * @param element — HTMLElement, к которому надо применить шаги анимации
         */
        play(element, cycled = false) {
            const runStep = (index = 0) => {
                const step = this._steps[index];
                const getTransformValue = (paramName) => {
                    let result = null;
                    if (step[paramName]) {
                        result = step[paramName];
                    } else if (this._steps[index - 1]) {
                        result = this._steps[index - 1][paramName];
                    }
                    return result;
                };
                if (step === undefined) {
                    if(cycled) runStep();
                    return;
                }
                element.style.transitionDuration = `${step.duration}ms`;
                switch (step.animationName) {
                    case animationNames.move:
                    case animationNames.scale:
                        step.translation = getTransformValue('translation');
                        step.ratio = getTransformValue('ratio');
                        element.style.transform = getTransform(step.translation, step.ratio);
                        break;
                    case animationNames.fadeOut:
                    case animationNames.fadeIn:
                        element.classList.remove(step.remove);
                        element.classList.add(step.add);
                        break;
                    default:
                        break;
                }
                this.timerId = setTimeout(() => runStep(index + 1), step.duration);
            };
            runStep();
        }
    }
}

function addListeners() {
    const customAnimation = animaster()
        .addMove(200, { x: 40, y: 40 })
        .addScale(800, 1.3)
        .addMove(200, { x: 80, y: 0 })
        .addScale(800, 1)
        .addMove(200, { x: 40, y: -40 })
        .addScale(800, 0.7)
        .addMove(200, { x: 0, y: 0 })
        .addScale(800, 1);

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            customAnimation.play(block);
        });

    document.getElementById('customAnimation2Play')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimation2Block');
            customAnimation.play(block);
        });

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

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', () => {
            const block = document.getElementById('moveAndHideBlock');
            if (this.moveAndHide) {
                return;
            }
            this.moveAndHide = animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', () => {
            if (this.moveAndHide) {
                this.moveAndHide.reset();
                this.moveAndHide = null;
            }
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', () => {
            const block = document.getElementById('heartBeatingBlock');
            if (this.heartBeating) {
                return;
            }
            this.heartBeating = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', () => {
            if (this.heartBeating) {
                this.heartBeating.stop();
                this.heartBeating = null;
            }
        });
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
