class Transformation {
    constructor(func, duration, param) {
        this.func = func;
        this.duration = duration;
        this.param = param;
    }
}

addListeners();

function addListeners() {

    const customAnimation = animaster()
        .addMove(200, {x: 40, y: 0})
        .addMove(200, {x: 40, y: 40})
        .addMove(200, {x: 0, y: 40})
        .addMove(200, {x: 0, y: 0});

    const heartAnimation = animaster()
        .addHeartbeating();

    document
        .getElementById('testWickAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('wickAnimationBlock');
            customAnimation.play(block);
        });

    document
        .getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document
        .getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });

    document.getElementById('movePlay').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        animaster().addMove(1000, { x: 100, y: 10 }).play(block);
    });

    document.getElementById('scalePlay').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        animaster().addScale(1000, 1.25).play(block);
    });

    document
        .getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().addMoveAndHide(1000).play(block);
        });

    document
        .getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().addShowAndHide(1000).play(block) ;
        });

    document
        .getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartAnimation.play(block);
        });

    document
        .getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().play(block).stop();
        });

    document
        .getElementById('resetFadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });

    document
        .getElementById('resetFadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        });

    document
        .getElementById('resetMovePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMove(block);
        });

    document
        .getElementById('resetScalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetScale(block);

        });

    document
        .getElementById('resetMoveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });
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

let heartBeatStop;

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

        return {
            reset() {
                resetScale(element)
            }
        };
    }

    function moveAndHide(element, duration) {
        const interval = duration * 0.4;

        move(element, interval, { x: 100, y: 20 });
        setTimeout(() => {
            fadeOut(element, duration * 0.6);
        }, interval);
    }

    function showAndHide(element, duration) {
        const interval = duration / 3;

        fadeIn(element, interval);
        setTimeout(() => {
            fadeOut(element, interval);
        }, interval * 2);
    }

    function heartBeating(element) {
        let interval = setInterval(() => {
            scale(element, 500, 1.4);
            setTimeout(() => scale(element, 500, 1), 500);
        }, 1000);

        return {
            stop() {
                clearInterval(interval);
            }
        };
    }

    function resetFadeIn(element) {
        fadeOut(element, 0);
    }

    function resetFadeOut(element) {
        fadeIn(element, 0);
    }

    function resetMove(element) {
        move(element, 0, { x: 0, y: 0 });
    }

    function resetScale(element) {
        scale(element, 0, 1)
    }

    function resetMoveAndHide(element) {
        resetMove(element);
        resetFadeOut(element);
    }

    function addMove(duration, direction) {
        this._steps.push(new Transformation(move, duration, direction));
        return this;
    }

    function addScale(duration, ratio) {
        this._steps.push(new Transformation(scale, duration, ratio));
        return this;
    }

    function addFadeIn(duration) {
        this._steps.push(new Transformation(fadeIn, duration));
        return this;
    }

    function addFadeOut(duration) {
        this._steps.push(new Transformation(fadeOut, duration));
        return this;
    }

    function addMoveAndHide(duration) {
        this._steps.push(new Transformation(moveAndHide, duration))
        return this;
    }

    function addShowAndHide(duration) {
        this._steps.push(new Transformation(showAndHide, duration))
        return this;
    }

    function addHeartbeating() {
        this._steps.push(new Transformation(heartBeating))
        return this;
    }

    function play(element, cycled) {
        let animationTime = 0;
        this._steps.forEach((Transformation) => {
            setTimeout(() => {
                heartBeatStop = Transformation.func(element, Transformation.duration, Transformation.param) }, animationTime);
            animationTime += Transformation.duration;
        })

        return {
            stop : () =>  {
                heartBeatStop.stop()
            },
            reset() {
                this._steps.reverse().forEach((Transformation) => Transformation.func.reset(element))
            }
        }
    }

    return {
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        addMoveAndHide,
        addShowAndHide,
        addHeartbeating,
        moveAndHide,
        showAndHide,
        heartBeating,
        resetFadeIn,
        resetFadeOut,
        resetMove,
        resetScale,
        resetMoveAndHide,
        play,
        _steps
    };
}
