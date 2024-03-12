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

    let MAHblock = undefined;

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            MAHblock = animaster().moveAndHide(block, 1000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    let id = undefined;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            id = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
        if (id)
            id.stop();
    });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            MAHblock.reset();
        });
}



/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
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

function resetFadeIn(element) {
    element.style.transitionDuration = null;
    element.classList.add('hide');
    element.classList.remove('show');
}

function resetFadeOut(element) {
    element.style.transitionDuration = null;
    element.classList.remove('hide');
    element.classList.add('show');
}

function resetMoveAndHide(element) {
    element.style.transitionDuration = null;
    move(element, )
}

function animaster() {

    let _steps = [];

    function addFadeIn(element, duration) {
        _steps.push(() => fadeIn(element, duration));
        return this;
    }

    function addFadeOut(element, duration) {
        _steps.push(() => fadeOut(element, duration));
        return this;
    }

    function addScale(element, duration, ratio) {
        _steps.push(() => scale(element, duration, ratio));
        return this;
    }

    function addMove(element, duration, translation) {
        _steps.push(() => move(element, duration, translation));
        return this;
    }

    function play() {
        _steps.forEach((func) => func());
        _steps.clear();
    }



    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }
    function moveAndHide(element, duration) {
        this.move(element, 0.4 * duration, { x: 100, y: 20 });
        setTimeout(() => this.fadeOut(element, 0.6 * duration), 0.4 * duration);
        return {
            reset() {
                move(element, 0, { x: 0, y: 0 })
                element.classList.remove('hide');
                element.classList.add('show');
            }
        }
    }
    function showAndHide(element, duration) {
        this.fadeIn(element, duration / 3);
        setTimeout(() => this.fadeOut(element, duration / 3), 2 * duration / 3);
    }
    function heartBeating(element) {

        let id = setInterval(() => {
            this.scale(element, 500, 1.4);
            setTimeout(() => this.scale(element, 500, 5 / 7), 500);
        }, 1000);
        return {
            stop() {
                clearInterval(id);
            }
        };

    }
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndHide(element) {
        element.style.transitionDuration = null;
        move(element, )
    }

    return {
        fadeIn,
        fadeOut,
        scale,
        move,
        moveAndHide,
        showAndHide,
        heartBeating,
        play,
        addMove,
        addFadeIn,
        addFadeOut,
        addScale
    }
}
