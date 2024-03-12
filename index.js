addListeners();

function addListeners() {
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

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000, 1.25);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster()
                .addMove(1000, {x: 100, y: 10})
                .addMove(1000, {x: 200, y: 0})
                .addMove(1000, {x: 300, y: -10})
                .addMove(1000, {x: 400, y: 0})
                .play(block);
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetMoveAndScale(block);
        });

    let obj;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            obj = animaster().heartBeating(block, 1000, 1.25);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            obj.stop();
            // const block = document.getElementById('heartBeatingBlock');
            // animaster().heartBeating(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, {x: 100, y: 20});
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

function animaster() {
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
         * Функция, отменяющая анимацию передвижения или изменения размера
         * @param element — HTMLElement, который надо анимировать
         */
        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        },

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
         * Отменить анимацию появления.
         * @param element — HTMLElement, который надо перестать анимировать
         */
        resetFadeIn(element) {
            element.style.transitionDuration = null;

            element.classList.remove('show');
            element.classList.add('hide');
        },

        /**
         * Блок плавно становится прозрачным.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide(element, duration, translation) {
            let hideFunction = function () {
                element.style.transitionDuration = `${3 * duration / 5}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }
            element.style.transitionDuration = `${2 * duration / 5}ms`;
            element.style.transform = getTransform(translation, null);
            setTimeout(hideFunction, 2 * duration / 5);
        },

        showAndHide(element, duration) {
            element.style.transitionDuration = `${duration / 3}ms`;
            element.classList.remove('hide');
            element.classList.add('show');

            let showFunction = function () {
                element.style.transitionDuration = `${duration / 3}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }
            setTimeout(showFunction, duration / 3)
        },

        heartBeating(element, duration, ratio) {
            // console.log('create');
            let stop = false;
            let intervalFunction = function () {
                element.style.transitionDuration = `${duration / 2}ms`;
                element.style.transform = getTransform(null, ratio);
                let scaleFunction = function () {
                    element.style.transitionDuration = `${duration / 2}ms`;
                    element.style.transform = getTransform(null, 1 / ratio);
                }
                console.log(stop);
                if (stop) {
                    return obj
                }
                setTimeout(scaleFunction, duration / 2)
                setTimeout(intervalFunction, 1000)
            }
            intervalFunction();
            let obj = {
                stop: () => {
                    stop = true
                }
            }
            return obj
        },
        /**
         * Отменить анимацию исчезания.
         * @param element — HTMLElement, который надо перестать анимировать
         */
        resetFadeOut(element) {
            element.style.transitionDuration = null;

            element.classList.remove('hide');
            element.classList.add('show');
        },

        /**
         * Добавляет анимацию движения в очередь.
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        addMove(duration, translation) {
            this._steps.push({
                name: 'move',
                duration: duration,
                translation: translation,

                func: this.move,
                args: [duration, translation],

                accumulatedDuration: duration + (this._steps[this._steps.length - 1]?.accumulatedDuration ?? 0),
            })

            return this;
        },

        /**
         * Проигрывает анимации из очереди.
         * @param element — HTMLElement, который надо анимировать
         */
        play(element) {
            for (let step of this._steps) {
                let args = step.args.toSpliced(0, 0, element)

                setTimeout(() => {
                    step.func.apply(this, args)
                }, step.accumulatedDuration - step.duration)
            }
        },
    }
}