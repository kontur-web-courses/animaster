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
            // const customAnimation = animaster()
            //     .addMove(200, {x: 40, y: 40})
            //     .addScale(800, 1.3)
            //     .addMove(200, {x: 80, y: 0})
            //     .addScale(800, 1)
            //     .addMove(200, {x: 40, y: -40})
            //     .addScale(800, 0.7)
            //     .addMove(200, {x: 0, y: 0})
            //     .addScale(800, 1);
            // customAnimation.play(block);
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(500, {x: 100, y: 10}).play(block);
            // animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            // animaster().moveAndHide(block, 1000);
            animaster()
                .addMove(1000 * 2 / 5, {x: 100, y: 10})
                .addFadeOut(1000 * 3 / 5)
                .play(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            // animaster().showAndHide(block, 1000);
            animaster()
                .addFadeIn(1000 / 3)
                .addFadeIn(1000 / 3)
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
            animaster().resetMove(block, 1000, {x: 0, y: 0});
        });

    document.getElementById('scaleReset')
        .addEventListener('click', () => {
            const block = document.getElementById('scaleBlock');
            animaster().resetScale(block, 1000, {x: 0, y: 0});
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
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', () => {
            if (stopper) {
                stopper.stop = true;
            }
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

    function resetScale() {

    }

    function resetMove(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function addMove(duration, translation) {
        this._steps.push(["move", duration, translation]);
        return this;
    }

    function addScale(duration, ratio) {
        this._steps.push(["scale", duration, ratio]);
        return this;
    }

    function addFadeIn(duration) {
        this._steps.push(["fadeIn", duration]);
        return this;
    }

    function addFadeOut(duration) {
        this._steps.push(["fadeOut", duration]);
        return this;
    }

    function play(element) {
        let offset = 0;
        for (const act of this._steps) {
            if (act.at(0) === 'move') {
                setTimeout(move, offset, element, act.at(1), act.at(2));
            } else if (act.at(0) === 'scale') {
                setTimeout(scale, offset, element, act.at(1), act.at(2));
                // scale(element, act.at(1), act.at(2));
            } else if (act.at(0) === 'fadeIn') {
                setTimeout(fadeIn, offset, element, act.at(1));
                // fadeIn(element, act.at(1));
            } else if (act.at(0) === 'fadeOut') {
                setTimeout(fadeOut, offset, element, act.at(1));
                // fadeOut(element, act.at(1));
            }
            offset += act.at(1);
        }
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
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        play
    };
}
