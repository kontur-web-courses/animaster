addListeners();

function addListeners() {
    let isFadeIn = true;
    const dur = 1000;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const animasterObj = animaster();
            const block = document.getElementById('fadeInBlock');
            if (isFadeIn){
                animasterObj.fadeIn(block, dur);
                isFadeIn = false;
            } else {
                animasterObj.fadeOut(block, dur);
                isFadeIn = true;
            }
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

    document.getElementById('moveAndHideBtn')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000, {x: 100, y: 10});
        });
    document.getElementById('showAndHideBtn')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    let heart;
    document.getElementById('heartBeatingBtnPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heart = animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingBtnStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heart.stop();
        });
    document.getElementById('moveAndHideResetBtn')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });
    document.getElementById('beautifulAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('beautifulAnimationBlock');
            animaster().beautifulAnimation(block, 1000);
        });
}

function animaster() {
    function resetFadeIn (element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut (element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale (element) {
        element.style.transitionDuration = null;
        element.style.transform = getTransform(null, null);
    }

    let _step = [];

    return {
        fadeIn: (element, duration) => {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut: (element, duration) => {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        move: function (element, duration, translation) {
            this.addMove(duration, translation).play(element);
        },
        scale: (element, duration, ratio) => {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        moveAndHide: function (element, duration, translation) {
            this.move(element, duration * 0.4, translation);
            setTimeout(() => this.fadeOut(element, duration * 0.6), duration * 0.4);
        },
        showAndHide: function (element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration * 2 / 3);
        },
        heartBeating: function (element) {
            let id = setInterval(() => {
                this.scale(element, 500, 1.4);

                setTimeout(() => {
                    this.scale(element, 500, 1);
                }, 500);
            }, 1500);

            return {stop: () => clearInterval(id)}
        },
        beautifulAnimation: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.borderRadius = "0% 100%";
            setInterval(() => {
                element.style.borderRadius = "100% 0%";

                setTimeout(() => {
                    element.style.borderRadius = "0% 100%";
                }, duration);
            }, 2 * duration);
        },
        resetMoveAndHide: function (element) {
            resetMoveAndScale(element);
            resetFadeOut(element);
        },
        addMove: function (duration, translation) {
            _step.push([
                "move",
                duration,
                translation
            ]);

            return this;
        },
        play: function (element) {
            for (const step of _step) {
                if (step[0] === 'move') {
                    let duration = step[1];
                    let translation = step[2];

                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = getTransform(translation, null);
                } else {
                    throw new Error();
                }
            }
        }
    }
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */


/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
function scale(element, duration, ratio) {
    element.style.transitionDuration =  `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
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
