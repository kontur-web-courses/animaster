addListeners();

function animaster() {
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

    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function moveAndHide(element, duration) {
        move(element, duration * 2 / 5, {x: 100, y: 20});
        setTimeout(() => fadeOut(element, duration * 3 / 5), duration * 2 / 5);
    }

    function showAndHide(element, duration) {
        fadeIn(element, duration * 1 / 3);
        setTimeout(() => {
            setTimeout(() => fadeOut(element, duration * 1 / 3), duration * 1 / 3);
        }, duration * 1 / 3);
    }

    function heartBeating(element, duration) {
        let intervalId;
        let isBeating = false;

        function beat() {
            scale(element, duration / 2, 1.4);
            setTimeout(() => scale(element, duration / 2, 1), duration / 2);
        }

        function stop() {
            clearInterval(intervalId);
            isBeating = false;
        }

        function playStop() {
            if (isBeating) {
                stop();
            } else {
                intervalId = setInterval(beat, duration);
                isBeating = true;
            }
        }

        return {
            playStop: playStop,
            stop: stop
        };
    }

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
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        move: move,
        scale: scale,
        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        heartBeating: heartBeating,
        resetFadeIn: resetFadeIn,
        resetFadeOut: resetFadeOut,
        resetMoveAndScale: resetMoveAndScale
    };
}

function addListeners() {
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

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 3000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetFadeIn(block);
            animaster().resetMoveAndScale(block);
            animaster().resetFadeOut(block)
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });


    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block, 500);
        });

    let heartBeatAnimation = null;
    document.getElementById('heartBeatingPlay').addEventListener('click', function () {
        if (!heartBeatAnimation) {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatAnimation = animaster().heartBeating(block, 500);
        }
        heartBeatAnimation.playStop();
    });

    document.getElementById('heartBeatingStop').addEventListener('click', function () {
        if (heartBeatAnimation) {
            heartBeatAnimation.stop();
            heartBeatAnimation = null;
        }
    });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */

/**
 function fadeIn(element, duration) {
 element.style.transitionDuration =  `${duration}ms`;
 element.classList.remove('hide');
 element.classList.add('show');
 }

 /**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */

/**
 function move(element, duration, translation) {
 element.style.transitionDuration = `${duration}ms`;
 element.style.transform = getTransform(translation, null);
 }

 /**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
/**
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
 */
