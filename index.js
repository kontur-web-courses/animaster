addListeners();

function addListeners() {
    let stopper;
    let resseter;

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

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resseter = animaster().moveAndHide(block, 5000, 1.25);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (resseter !== undefined)
                resseter.reset();
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopper = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (stopper !== undefined)
                stopper.stop();
        });
}

function animaster() {
    let resetFadeOut = (element) => {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    };

    let resetMoveAndScale = (element) => {
        element.style.transitionDuration = null;
        element.style.transform = null;
    };

    let resetFadeIn = (element) => {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    };

    return {
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

        addFadeIn(duration) {
            this._steps.push({func: this.fadeIn, duration: duration})
            return this;
        },

        /**
         * Блок плавно скрывается в прозрачный.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        addFadeOut(duration) {
            this._steps.push({func: this.fadeOut, duration: duration})
            return this;
        },

        /**
         * Блок сдвигается и скрывается.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        moveAndHide(element, duration) {
            this.move(element, duration * 0.4, {x: 100, y: 20});
            let timeout = setTimeout(this.fadeOut, duration * 0.4, element, duration * 0.6);
            return {
                reset() {
                    resetFadeOut(element);
                    resetMoveAndScale(element);
                    clearTimeout(timeout);
                }
            }
        },

        /**
         * Блок пульсирует.
         * @param element — HTMLElement, который надо анимировать
         */
        heartBeating(element) {
            let heartBeat = () => {
                this.scale(element, 500, 1.4);
                setTimeout(this.scale, 500, element, 500, 1);
            }
            heartBeat();
            let interval = setInterval(heartBeat, 1200);
            return {
                stop() {
                    clearInterval(interval);
                }
            };
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

        addMove(duration, args) {
            _steps.push({
                func : move,
                duration,
                args
            })
            return this;
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

        addScale(duration, argument) {
            this._steps.push({func: this.scale, duration: duration, argument: argument})
            return this;
        },

        /**
         * Функция, показывающая/скрывающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration
         */
        showAndHide(element, duration) {
            this.fadeIn(element, duration * 1 / 3);
            setTimeout(this.fadeOut, duration * 2 / 3, element, duration * 1 / 3);
        },

        play(element, cycled = false) {
            let prefixDurations = [];
            prefixDurations.push(0);
            for (let i = 1; i < this._steps.length; ++i) {
                prefixDurations.push(this._steps[i].duration + prefixDurations[i-1])
            }
            let animation = () => {
                for (let i = 0; i < this._steps.length; ++i) {
                    setTimeout(this._steps[i].func,
                        prefixDurations[i], element, this._steps[i].duration, this._steps[i].argument);
                }
            };

            animation();

            if (cycled) {
                _interval = setInterval(animation, prefixDurations[this._steps.length-1]);
            }


            function reset(someElement) {
                resetFadeIn(someElement);
                resetFadeOut(someElement);
                resetMoveAndScale(someElement);
            }

            return {stop:(interval) => {clearInterval(interval)}, reset:reset, _interval: _interval};

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
