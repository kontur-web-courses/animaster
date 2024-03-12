addListeners();


const master = animaster();


function addListeners() {
    let heartBeatingInterval;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            master.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            master.fadeOut(block, 5000);
        });

    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            master.showAndHide(block, 5000);
        });

    document.getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingInterval = master.heartBeating(block);
        });

    document.getElementById('stopHeartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if (heartBeatingInterval !== undefined) {
                heartBeatingInterval.stop();
            }
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            master.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            master.scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            master.moveAndHide(block, 1000);
        });

    document.getElementById('resetMoveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            master.resetMoveAndHide(block);
        });
}

function animaster() {
    let isHeartBeating = true;
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

    const resetMove = function (element) {
        element.style.transitionDuration =  `0ms`;
        element.style.transform = null;
    }

    return {
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

        showAndHide(element, duration) {
            const shortDuration = duration / 3;
            this.fadeIn(element, shortDuration);
            setTimeout(() => this.fadeOut(element, shortDuration), shortDuration)
        },

        heartBeating(element) {
            const upScaleK = 1.4;
            const defaultScaleK = 1;
            const interval = 500;

            this.scale(element, interval, upScaleK);
            setTimeout(() => this.scale(element, interval, defaultScaleK), interval);
            const intervalObj = setInterval(() => {
                this.scale(element, interval, upScaleK);
                setTimeout(() => this.scale(element, interval, defaultScaleK), interval);
            }, 2 * interval)

            return {stop() {clearInterval(intervalObj)}};
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            console.log(132134134);
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },


        moveAndHide(element, duration) {
            this.move(element, duration * 2 / 5, {x: 100, y: 20});
            setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5);
        },

        resetMoveAndHide(element) {
            resetFadeOut(element);
            resetMove(element);
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
