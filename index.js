addListeners();

function addListeners() {
    let Animaster = new animaster()
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            Animaster.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            Animaster.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            Animaster.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            Animaster.scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            Animaster.moveAndHide(block, 1000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            Animaster.heartBeating(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            console.log(block);
            Animaster.showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            Animaster.stopHeartBeating(block);
        });

    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            Animaster.resetMoveAndHide(block);
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
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList = ["block"];
    }
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList = ["block"];
    }
    function resetMove(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }


    obj = {
        Timer: setInterval(() => {}, 0),
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
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide(element, duration) {
            this.move(element, 2 * duration / 5, {x: 100, y: 20});
            setTimeout(this.fadeOut, 2 * duration / 5, element, 3 * duration / 5,);
        },
        heartBeating(element) {
            this.Timer = setInterval((el) => {
                this.scale(el, 500, 1.4);
                setTimeout(this.scale, 500, el, 500,  1);
            }, 1000,element);
        },
        stopHeartBeating(element) {
            clearInterval(this.Timer);
        },
        showAndHide(element, duration) {

            this.fadeIn(element, Math.floor(duration / 3));
            setTimeout(this, Math.floor(duration / 3));
            setTimeout(this.fadeOut, Math.floor(duration / 3), element, Math.floor(duration / 3));
        },
        resetMoveAndHide(element) {
            resetMove(element);
            resetFadeOut(element);
        }
    }
    return obj;
}