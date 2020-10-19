addListeners();
let timerId;

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block, true);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block, false).stop();
        });
}

function animaster() {
    function resetFadeIn(element) {
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transform = getTransform({x: 0, y: 0}, null);
        element.style.transform = getTransform(null, 1);
    }

    return {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            resetFadeOut(element);
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            resetFadeIn(element);
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

        moveAndHide(element, duration) {
            this.move(element, duration * 2 / 5, { x: 100, y: 20 });
            setTimeout(this.fadeOut, duration * 2 / 5, element, duration * 3 / 5);
        },

        resetMoveAndHide(element) {
            element.style.transitionDuration = `0ms`;
            resetMoveAndScale(element);
            resetFadeOut(element);
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(this.fadeOut, duration * 2 / 3, element, duration / 3);
        },

        heartBeating(element, move) {
            function oneBeat(element, obj) {
                obj.scale(element, 500, 1.4);
                setTimeout(obj.scale, 500, element, 500, 1);
            }
            if (move) {
                timerId = setInterval(oneBeat, 1000, element, this);
            }

            return {
                timerId : timerId,
                stop() {
                    console.log("here", this.timerId);
                    clearInterval(this.timerId);
                }
            }
        },
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