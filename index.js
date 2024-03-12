addListeners();

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
            let x = animaster().moveAndHide(block, 1000);

            document.getElementById('moveAndHideReset')
                .addEventListener('click', function () {
                    const block = document.getElementById('moveAndHideBlock');
                    x.reset();
                });
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let x = animaster().heartBeating(block);

            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    const block = document.getElementById('heartBeatingBlock');
                    x.stop();
                });
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

let currentBeat = false;

function animaster() {
    function resetFadeIn(element) {
        element.classList.remove('show');
    }

    function resetFadeOut(element) {
        element.classList.remove('hide');
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
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        moveAndHide: function (element, duration) {
            this.move(element, duration * 2 / 5, {x: 100, y: 20});
            setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5);

            return {
                reset: () => {
                    resetFadeOut(element);
                    resetMoveAndScale(element);
                }
            }
        },

        showAndHide: function (element, duration) {
            setTimeout(() => this.fadeIn(element, duration * 1 / 3), duration * 1 / 3);
            setTimeout(() => this.fadeOut(element, duration * 1 / 3), duration * 2 / 3);
        },

        heartBeating: function (element) {
            let a = setInterval(() => {
                if (!currentBeat) {
                    this.scale(element, 500, 1.4);
                    currentBeat = true;
                } else {
                    this.scale(element, 500, 1);
                    currentBeat = false;
                }
            }, 500);

            return {
                stop: () => {
                    clearInterval(a);
                }
            }
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale:

            function (element, duration, ratio) {
                console.log('in')
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(null, ratio);
            }
    }
}