addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(500, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let a = animaster()
                .addMove(1000 * 2 / 5, {x: 100, y: 10})
                .addFadeOut(1000 * 3 / 5)
                .play(block);
            setTimeout(a.stop, 100);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster()
                .addFadeIn(1000 / 3)
                .addDelay(1000 / 3)
                .addFadeOut(1000 / 3)
                .play(block);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block, 1000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block, 1000);
        });

    document.getElementById('moveReset')
        .addEventListener('click', () => {
            const block = document.getElementById('moveBlock');
            animaster().resetMove(block, 1000);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', () => {
            const block = document.getElementById('scaleBlock');
            animaster().resetScale(block, 1000);
        });

    let stopper;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            const timePart = 500;
            stopper = {stop: false};
            setTimeout(function run() {
                animaster()
                    .addScale(timePart, 1.4)
                    .addScale(5 / 7)
                    .play(block);
                if (!stopper.stop) {
                    setTimeout(run, 2 * timePart);
                }
            }, 0);
            // animaster()
            //     .addScale(timePart, 1.4)
            //     .addScale(timePart, 5 / 7)
            //     .play(block, true);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', () => {
            if (stopper) {
                stopper.stop = true;
            }
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', () => {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block, 1000, {x: 0, y: 0});
        });

    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();

    document
        .getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);

    document.getElementById('dancePlay')
        .addEventListener('click', () => {
            const block = document.getElementById('danceBlock');
            const timePart = 400;
            setTimeout(function run() {
                animaster().dance(block, timePart);
                setTimeout(run, 2 * timePart);
            }, 0);
        });
}


function getTransform(translation, ratio, rotate = null, skew = null) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    if (rotate) {
        result.push(`rotate3d(${rotate.x},${rotate.y},${rotate.y},${rotate.angle}deg)`);
    }
    if (skew) {
        result.push(`skew(${skew.x}deg,${skew.y}deg)`);
    }
    return result.join(' ');
}

function animaster() {
    let _steps = [];

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

    /**
     * Блок плавно исчезает.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function dance(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(
            null,
            null,
            {x: 12, y: 55, z: 45, angle: 15},
            {x: 10, y: 20}
        );
        setTimeout(() => {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(
                null,
                null,
                {x: 12, y: 55, z: 45, angle: 35},
                {x: -10, y: -20}
            );
        }, 400);
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
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    /**
     * Функция, одновременно сдвигающая элемент на 100 пикселей вправо
     * и на 20 вниз, потом элемент исчезает
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function moveAndHide(element, duration) {
        const firstDuration = duration * 2 / 5;
        move(element, firstDuration, {x: 100, y: 10});
        setTimeout(fadeOut, firstDuration, element, duration * 3 / 5);

    }

    /**
     * блок должен появиться, подождать и исчезнуть. Каждый шаг анимации
     * длится 1/3 от времени, переданного аргументом в функцию.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function showAndHide(element, duration) {
        const timeInterval = duration * 1 / 3;
        fadeIn(element, timeInterval);
        setTimeout(fadeOut, timeInterval * 2, element, timeInterval);
    }

    /**
     * Имитация сердцебиения
     * @param element — HTMLElement, который надо анимировать
     */
    function heartBeating(element) {
        const timePart = 500;
        let stopper = {stop: false};
        setTimeout(function run() {
            scale(element, timePart, 1.4);
            setTimeout(scale, timePart, element, timePart, 5 / 7);
            if (!stopper.stop) {
                setTimeout(run, 2 * timePart);
            }
        }, 100);
        return stopper;
    }

    function resetFadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;

        element.classList.add('hide');
        element.classList.remove('show');
    }

    function resetFadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;

        element.classList.add('show');
        element.classList.remove('hide');
    }

    function resetMove(element, duration, translation = {x: 0, y: 0}) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function addMove(duration, translation) {
        this._steps.push(["move", duration, translation]);
        return this;
    }

    function addScale(duration, ratio = 0) {
        this._steps.push(["scale", duration, ratio]);
        return this;
    }

    function resetScale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function addFadeIn(duration) {
        this._steps.push(["fadeIn", duration]);
        return this;
    }

    function addFadeOut(duration) {
        this._steps.push(["fadeOut", duration]);
        return this;
    }

    function addDelay(duration) {
        this._steps.push(["delay", duration]);
        return this;
    }

    const actByName = new Map([
        ["move", move],
        ["scale", scale],
        ["fadeIn", fadeIn],
        ["fadeOut", fadeOut],
        ["delay", () => {
        }],
    ]);
    const reverseActByName = new Map([
        ["move", resetMove],
        ["scale", resetScale],
        ["fadeIn", resetFadeIn],
        ["fadeOut", resetFadeOut],
        ["delay", () => {
        }],
    ]);

    function play(element, cycled = false) {
        let stop = false;
        let reset = false;
        const callObject = this;

        const manager = {
            stop() {
                stop = true;
            },
            reset() {
                reset = true;
                setTimeout(() => {
                        let offset = 0;
                        for (const act of callObject._steps.slice().reverse()) {
                            setTimeout(reverseActByName.get(act.at(1)), offset, element, ...act.slice(1));
                            offset += act.at(1);
                        }
                    }
                );
            }
        };
        setTimeout(() => {
            let offset = 0;
            do {
                for (const act of callObject._steps) {
                    if (stop || reset) {
                        break;
                    }
                    setTimeout(actByName.get(act.at(0)), offset, element, ...act.slice(1));
                    offset += act.at(1);
                }
            } while (cycled && !stop && !reset);
        }, 0, element, manager, cycled);
        return manager;
    }

    function buildHandler() {
        const animasterContext = this;
        return function () {
            animasterContext.play.call(animasterContext, this);
        };
    }


    function resetMoveAndHide(element) {
        resetMove(element, 1);
        resetFadeOut(element, 1);
    }

    return {
        _steps,
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide,
        heartBeating,
        resetFadeIn,
        resetFadeOut,
        resetMove,
        resetScale,
        resetMoveAndHide,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        addDelay,
        play,
        buildHandler,
        dance,
    };

}
