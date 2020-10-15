addListeners();

function addListeners() {
    const {
        addMove,
        playAnimation,
        fadeIn,
        resetFadeIn,
        fadeOut,
        resetFadeOut,
        showAndHide,
        move,
        moveAndHide,
        resetMoveAndHide,
        scale,
        resetMoveAndScale,
        heartBeating
    } = animaster();

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            fadeOut(block, 5000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            resetFadeOut(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            showAndHide(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            addMove(500, {x: 20, y: 20}).playAnimation(block);
            // move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndHide(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            scale(block, 1000, 1.25);
        });

    document.getElementById('resetMoveAndScale')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            resetMoveAndScale(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating = heartBeating(block, 1000, 1.4);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating.stop();
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
    let _steps = [];

    /**
    * Добавляет шаг из переданных параметров в конец массива последовательных шагов для анимации
    * @param duration - Продолжительность анимации в миллисекундах
    * @param param - Дополнительный параметр (смещение для 'move', соотношение для 'scale')
    */
    function addMove(duration, param) {
        let step = {
            operation: 'move',
            duration,
            param
        };
        this._steps.push(step);
        return this; // TODO придумать, как вместо this возвращать функцию animaster не сбрасывая _steps
    }
    /**
     * @param element - HTML, который будем анимировать
     */
    function playAnimation(element) {
        for (let step of this._steps) {
            switch (step.operation) {
                case 'move':
                    move(element, step.duration, step.param);
                    break;
                case 'fadeIn':
                    fadeIn(element, step.duration, step.param);
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetFadeIn(element) {
        element.classList.add('hide');
        element.classList.remove('show');
        element.style = null;
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.classList.add('show');
        element.classList.remove('hide');
        element.style = null;
    }

    function showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(fadeOut, duration / 3, element, duration * 2 / 3);
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function moveAndHide(element, duration, translation) {
        move(element, duration * 0.4, translation);
        setTimeout(fadeOut, duration * 0.4, element, duration * 0.6);
    }

    function resetMoveAndHide(element) {
        resetFadeOut(element);
        resetMoveAndScale(element);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = '0ms';
        element.style.transform = getTransform({x: 0, y: 0}, 1);
    }

    function heartBeating(element, duration, ratio) {
        const interval = setInterval(() => {
            scale(element, duration * 0.5, ratio);
            setTimeout(() => scale(element, duration * 0.5, 1), duration * 0.5);
        }, duration);

        return {
            stop() {
            clearInterval(interval);
            }
        }
    }


    return {
        _steps,
        addMove,
        playAnimation,
        fadeIn,
        resetFadeIn,
        fadeOut,
        resetFadeOut,
        showAndHide,
        move,
        moveAndHide,
        resetMoveAndHide,
        scale,
        resetMoveAndScale,
        heartBeating
    }
}