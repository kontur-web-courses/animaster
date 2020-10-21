addListeners();

const animationNames = {
    fadeIn: 'fadeIn',
    fadeOut: 'fadeOut',
    move: 'move',
    scale: 'scale',
};

function animaster() {

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
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
        fadeIn(element, duration) {
            this.addFadeIn(duration);
            this.play(element);
        },

        /**
         * Блок плавно становится прозрачным.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            this.addFadeOut(duration);
            this.play(element);
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            this.addMove(duration, translation);
            this.play(element);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            this.addScale(duration, ratio);
            this.play(element);
        },

        /**
         * Блок одновременно сдвигается на 100 пикселей вправо и на 20 вниз, а потом исчезает
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        moveAndHide(element, duration) {
            this.move(element, 2 / 5 * duration, {x: 100, y: 20});
            const timerId = setTimeout(() => this.fadeOut(element, 3 / 5 * duration), 2 / 5 * duration);
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
            this.fadeIn(element, 1 / 3 * duration);
            setTimeout(() => this.fadeOut(element, 1 / 3 * duration), 2 / 3 * duration)
        },

        /**
         * Имитация сердцебиения
         * @param element — HTMLElement, который надо анимировать
         */
        heartBeating(element) {
            const duration = 1000;
            const animation = () => {
                this.scale(element, duration / 2, 1.4);
                setTimeout(() => this.scale(element, duration / 2, 1), duration / 2);
            };
            const timerId = setInterval(() => animation(), duration);
            animation();
            return {
                stop() {
                    clearInterval(timerId);
                }
            }
        },

        addMove(duration, translation) {
            const step = {
                animationName: animationNames.move,
                duration: duration,
                translation: translation,
                ratio: null,
            };
            console.log(step);
            this._steps.push(step);
            return this;
        },

        addScale(duration, ratio) {
            const step = {
                animationName: animationNames.scale,
                duration: duration,
                translation: null,
                ratio: ratio,
            };
            console.log(step);
            this._steps.push(step);
            return this;
        },

        addFadeIn(duration) {
            const step = {
                animationName: animationNames.fadeIn,
                duration: duration,
                remove: 'hide',
                add: 'show',
            };
            this._steps.push(step);
            return this;
        },

        addFadeOut(duration) {
            const step = {
                animationName: animationNames.fadeOut,
                duration: duration,
                remove: 'show',
                add: 'hide',
            };
            this._steps.push(step);
            return this;
        },

        play(element) {
            const playStep = (index = 0) => {
                const step = this._steps[index];
                if (step === undefined) return;
                element.style.transitionDuration = `${step.duration}ms`;
                if (step.animationName === animationNames.move)
                    element.style.transform = getTransform(step.translation, this._steps[index - 1].ratio);
                if (step.animationName === animationNames.scale)
                    element.style.transform = getTransform(this._steps[index - 1].translation, step.ratio);
                if (step.animationName === animationNames.fadeIn || step.animationName === animationNames.fadeOut) {
                    element.classList.remove(step.remove);
                    element.classList.add(step.add);
                }
                setTimeout(() => playStep(index + 1), step.duration);
            };
            playStep();
        }
    }
}

const customAnimation = animaster()
    .addMove(200, {x: 40, y: 40})
    .addScale(800, 1.3);
// .addMove(200, {x: 80, y: 0})
// .addScale(800, 1)
// .addMove(200, {x: 40, y: -40})
// .addScale(800, 0.7)
// .addMove(200, {x: 0, y: 0})
// .addScale(800, 1);

function addListeners() {

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            customAnimation.play(block);
        });

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
            //animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
            //animaster().addFadeOut(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
            //animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
            //animaster().addScale(1000, 1.25).play(block);
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
