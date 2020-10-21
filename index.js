addListeners();

function animaster() {
    const animationNames = {
        fadeIn: 'fadeIn',
        fadeOut: 'fadeOut',
        move: 'move',
        scale: 'scale',
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
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
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

        /**
         * Блок одновременно сдвигается на 100 пикселей вправо и на 20 вниз, а потом исчезает
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        moveAndHide(element, duration) {
            this.move(element, 2/5 * duration, {x: 100 , y: 20});
            const timerId = setTimeout(() => this.fadeOut(element, 3/5 * duration), 2/5 * duration);
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
            this.fadeIn(element, 1/3 * duration);
            setTimeout(() => this.fadeOut(element, 1/3 * duration), 2/3 * duration)
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
         * Воспроизведение анимации
         * @param element — HTMLElement, к которому надо применить шаги анимации
         */
        play(element) {
            const playStep = (index = 0) => {
                const step = this._steps[index];
                if(step === undefined) return;
                element.style.transitionDuration = `${step.duration}ms`;
                switch (step.animationName) {
                    case animationNames.move:
                    case animationNames.scale:
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
                setTimeout(() => playStep(index + 1), step.duration);
            };
            playStep();
        }
    }
}

function addListeners() {
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
            animaster().addMove(1000, {x: 100, y:10}).play(block);
            // animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', () => {
            const block = document.getElementById('moveAndHideBlock');
            if(this.moveAndHide) {
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
            if(this.heartBeating) {
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
