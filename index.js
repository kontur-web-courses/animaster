addListeners();

anim = animaster();

function addListeners() {
    let stopBeatingHeartObj;

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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopBeatingHeartObj = anim.heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopBeatingHeartObj.stop();
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMoveAndScale(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetMoveAndScale(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
}


function animaster() {
    let increaseHeartSizeTime;
    let decreaseHeartSizeTime;
    let moveAndHideTimeout;
    let _steps = [];

    return {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            this.addFadeIn(duration).play(element);
        },

        addFadeIn(duration) {
            _steps.push({
                func(element)
                {
                    element.style.transitionDuration = `${duration}ms`;
                    element.classList.remove('hide');
                    element.classList.add('show');
                },
                duration,
            });

            return this;
        },

        resetFadeIn(element) {
            element.style.transitionDuration = `0ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        fadeOut(element, duration) {
            this.addFadeOut(duration).play(element);
        },

        addFadeOut(duration) {
            _steps.push({
                func(element)
                {
                    element.style.transitionDuration = `${duration}ms`;
                    element.classList.remove('show');
                    element.classList.add('hide');
                },
                duration,
            });

            return this;
        },

        resetFadeOut(element, duration) {
            element.style.transitionDuration = `0ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        moveAndHide(element, duration) {
            let moveTime = duration * 2 / 5;
            this.move(element, moveTime, {x: 100, y: 20});
            moveAndHideTimeout = setTimeout(() => {
                let hideTime = duration * 3 / 5;
                this.fadeOut(element, hideTime);
            }, moveTime);
        },

        resetMoveAndHide(element) {
            clearTimeout(moveAndHideTimeout);
            this.resetMoveAndScale(element);
            this.resetFadeOut(element);
        },

        resetMoveAndScale(element) {
            element.style.transitionDuration = `0ms`;
            element.style.transform = getTransform({x: 0, y: 0}, null);

            element.style.transitionDuration = `0ms`;
            element.style.transform = getTransform(null, 1);
        },

        heartBeating(element) {
            clearInterval(increaseHeartSizeTime);
            clearInterval(decreaseHeartSizeTime);

            this.scale(element, 500, 1.4);
            decreaseHeartSizeTime = setTimeout(() => {
                this.scale(element, 500, 1);
            }, 500)

            increaseHeartSizeTime = setTimeout(() => {
                this.heartBeating(element);
            }, 1000);

            return {
                stop() {
                    clearInterval(increaseHeartSizeTime);
                    clearInterval(decreaseHeartSizeTime);
                }
            }
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

        addMove(duration, translation) {
            _steps.push({
                func(element) {
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = getTransform(translation, null);
                },
                duration,
            });

            return this;
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

        addScale(duration, ratio) {
            _steps.push({
                func(element)
                {
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = getTransform(null, ratio);
                },
                duration,
            });

            return this;
        },

        showAndHide(element, duration){
            let time = duration/3.0
            this.fadeIn(element, time);
            setTimeout(() => {this.fadeOut(element, time)}, 2 * time);
        },

        play(element) {
            let currentTimeout = 0;
            for (let obj of _steps) {
                setTimeout(() => obj.func(element), currentTimeout);
                currentTimeout += obj.duration;
            }

            _steps = [];
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
