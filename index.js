addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            // Задание 2
            animaster().addFadeIn(3000).play(block);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            // Задание 2
            animaster().resetFadeIn(block);
        });

    // Задание 9
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            // Задание 2
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            // Задание 2
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetMoveAndScale(block);
        });

    // Задание 4
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 2000, {x: 100, y: 20}).play();
        });

    // Задание 7
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 2000, {x: 100, y: 20}).reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 2000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).play();
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).stop();
        });

    // Задание 11
    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1)
                .play(block);
        });

    document.getElementById('heightAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heightAnimationBlock');
            animaster().changeHeight(block);
        });
}

// Задание 1
function animaster() {
    // Задание 8
    let _steps = [];

    function play(element) {
        let curDur = 0;
        _steps.forEach(step => {
            switch (step.name) {
                case 'fadeIn':
                    setTimeout(() => fadeIn(element, step.duration), curDur);
                    curDur += step.duration;
                    break;

                // Задание 10
                case 'fadeOut':
                    globalThis.timerIdFadeOut = setTimeout(() => fadeOut(element, step.duration), curDur);
                    curDur += step.duration;
                    break;

                case 'move':
                    setTimeout(() => move(element, step.duration, step.translation), curDur);
                    curDur += step.duration;
                    break;

                case 'scale':
                    setTimeout(() => scale(element, step.duration, step.ratio), curDur);
                    curDur += step.duration;
                    break;

                case 'delay':
                    setTimeout(() => move(element, step.duration, {x: 0, y: 0}), curDur);
                    curDur += step.duration;
                    break;
            }
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

    function addFadeIn(duration) {
        _steps.push({
            name: 'fadeIn',
            duration
        });
        return this;
    }

    // Задание 6
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    // Задание 3
    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function addFadeOut(duration) {
        _steps.push({
            name: 'fadeOut',
            duration
        });
        return this;
    }

    // Задание 6
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
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

    // Задание 8
    function addMove(duration, translation) {
        _steps.push({
            name: 'move',
            duration,
            translation
        });
        return this;
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

    function addScale(duration, ratio) {
        _steps.push({
            name: 'scale',
            duration,
            ratio
        });
        return this;
    }

    // Задание 6
    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    // Задание 4
    // Задание 12
    function moveAndHide(element, duration, translation) {
        function play() {
            animaster()
                .addMove(2 * duration / 5, translation)
                .addFadeOut(3 * duration / 5)
                .play(element);
        }

        function reset() {
            clearTimeout(globalThis.timerIdFadeOut);
            resetMoveAndScale(element);
            resetFadeOut(element);
        }

        return {
            play,
            reset
        }
    }

    function showAndHide(element, duration) {
        animaster()
            .addFadeIn(duration / 3)
            .addDelay(duration / 3)
            .addFadeOut(duration / 3)
            .play(element);
    }

    function addDelay(duration) {
        _steps.push({
            name: 'delay',
            duration
        });
        return this;
    }

    function heartBeating(element) {
        function play(cycled=true) {
            if (cycled) {
                globalThis.timerIdHeartBeating = setInterval(() => {
                    animaster()
                        .addScale(500, 1.4)
                        .addScale(500, 1)
                        .play(element);
                }, 1000);
            } else {
                animaster()
                    .addScale(500, 1.4)
                    .addScale(500, 1)
                    .play(element);
            }

        }

        // Задание 5
        function stop(){
            clearInterval(globalThis.timerIdHeartBeating);
        }

        return {
            play,
            stop
        };
    }

    function changeHeight(element) {
        let flag = true;
        let curHeight = 100;
        setInterval(() => {
            if (flag) {
                curHeight -= 1;
                if (curHeight === 10) {
                    flag = false;
                }
            } else {
                curHeight += 1
                if (curHeight === 100) {
                    flag = true;
                }
            }
            element.style.height = `${curHeight}px`;
        }, 10)
    }

    return {
        fadeIn,
        resetFadeIn,
        fadeOut,
        resetFadeOut,
        move,
        scale,
        resetMoveAndScale,
        moveAndHide,
        showAndHide,
        heartBeating,
        addFadeIn,
        addFadeOut,
        addMove,
        addScale,
        addDelay,
        changeHeight,
        play
    };
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