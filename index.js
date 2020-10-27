addListeners();

function addListeners() {
    const {
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
    } = animaster();
    document
        .getElementById('fadeInPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeInBlock');
            fadeIn(block, 5000);
        });

    document
        .getElementById('fadeOutPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeOutBlock');
            fadeOut(block, 5000);
        });

    document.getElementById('movePlay').addEventListener('click', function() {
        const block = document.getElementById('moveBlock');
        move(block, 1000, { x: 100, y: 10 });
    });

    document.getElementById('scalePlay').addEventListener('click', function() {
        const block = document.getElementById('scaleBlock');
        scale(block, 1000, 1.25);
    });

    document
        .getElementById('moveAndHide')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide(block, 1000);
        });

    document
        .getElementById('showAndHide')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            showAndHide(block, 1000);
        });

    document
        .getElementById('heartBeating')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating = heartBeating(block);
        });

    document
        .getElementById('heartBeatingStop')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating.stop();
        });
    document
        .getElementById('resetFadeInButton')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeInBlock');
            resetFadeIn(block, 0);
        });
    document
        .getElementById('resetFadeOutButton')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeOutBlock');
            resetFadeOut(block, 0);
        });
    document
        .getElementById('resetMoveButton')
        .addEventListener('click', function() {
            const block = document.getElementById('moveBlock');
            resetMove(block, 0);
        });
    document
        .getElementById('resetScaleButton')
        .addEventListener('click', function() {
            const block = document.getElementById('scaleBlock');
            resetScale(block, 0);
        });
    document
        .getElementById('resetMoveAndHideButton')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide(block).stop();
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
    function fadeIn(element, duration) {
        animaster().addFadeIn(duration).play(element);
    }

    function fadeOut(element, duration) {
        animaster().addFadeOut(duration).play(element);
    }

    function move(element, duration, translation) {
        animaster().addMove(duration, translation).play(element);
    }

    function scale(element, duration, ratio) {
        animaster().addScale(duration, ratio).play(element);
    }

    function moveAndHide(element, duration) {
        const interval = duration * 0.4;

        move(element, interval, { x: 100, y: 20 });
        setTimeout(() => {
            fadeOut(element, duration * 0.6);
        }, interval);
        return {
            stop() {
                element.style.transitionDuration = 0;
                element.style.opacity = 1;
                element.style.transform = null;
            }
        };
    }

    function showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        animaster().addDelay(duration).play(element);
    }

    function heartBeating(element) {
        const interval = setInterval(() => {
            scale(element, 500, 1.4);
            setTimeout(() => scale(element, 500, 1), 500);
        }, 1000);

        return {
            stop() {
                clearInterval(interval);
            },
        };
    }


    function resetFadeIn(element, duration) {
        animaster().addFadeIn(duration).play(element).reset();
    }

    function resetFadeOut(element, duration) {
        animaster().addFadeOut(duration).play(element).reset();
    }

    function resetMove(element, duration, translation) {
        animaster().addMove(duration, translation).play(element).reset();
    }

    function resetScale(element, duration, ratio) {
        animaster().addScale(duration, ratio).play(element).reset();
    }

    var _steps = [];

    function addMove(duration, shift) {
        let step = {
            operation: "move",
            stepDuration: duration,
            parameters: shift
        }
        _steps.push(step);

        return this;
    }

    function addScale(duration, ratio) {
        let step = {
            operation: "scale",
            stepDuration: duration,
            parameters: ratio
        }
        _steps.push(step);
        return this;
    }

    function addFadeIn(duration) {
        let step = {
            operation: "fadeIn",
            stepDuration: duration,
            parameters: null
        }
        _steps.push(step);
        return this;
    }

    function addFadeOut(duration) {
        let step = {
            operation: "fadeOut",
            stepDuration: duration,
            parameters: null
        }
        _steps.push(step);
        return this;
    }

    function addDelay(duration) {
        let step = {
            operation: "nothing",
            stepDuration: duration / 3,
            parameters: null
        }
        _steps.push(step);
        return this;
    }

    function addHeartBeating() {
        let step = {
            operation: "heartBeating",
            stepDuration: null,
            parameters: null
        }
        _steps.push(step);
        return this;
    }

    function play(element) {
        _steps = _steps.reverse();
        var interval;
        while (_steps.length > 0) {
            let duration = _steps[_steps.length - 1].stepDuration;
            let change = _steps[_steps.length - 1].parameters;
            let cycled = true;
            let lastStep;

            if (_steps.length > 0 && _steps[_steps.length - 1].operation == "move") {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(change, null);
                console.log('move');
                lastStep = _steps.pop();
            }
            if (_steps.length > 0 && _steps[_steps.length - 1].operation == "scale") {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(null, change);
                console.log('scale');
                lastStep = _steps.pop();
            }
            if (_steps.length > 0 && _steps[_steps.length - 1].operation == "fadeIn") {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('hide');
                element.classList.add('show');
                lastStep = _steps.pop();
            }
            if (_steps.length > 0 && _steps[_steps.length - 1].operation == "fadeOut") {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
                lastStep = _steps.pop();
            }
            if (_steps.length > 0 && _steps[_steps.length - 1].operation == "nothing") {
                setTimeout(() => {
                    fadeOut(element, duration);
                }, duration * 2);
                lastStep = _steps.pop();
            }
            if (_steps.length > 0 && _steps[_steps.length - 1].operation == "heartBeating") {
                interval = setInterval(() => {
                    scale(element, 500, 1.4);
                    setTimeout(() => scale(element, 500, 1), 500);
                }, 1000);
                lastStep = _steps[_steps.length - 1]
                lastStep = _steps.pop();

            }
            console.log(lastStep)
            return {

                reset() {
                    if (lastStep.operation == "fadeOut") {
                        element.style.transitionDuration = `${duration}ms`;
                        element.classList.remove('hide');
                        element.classList.add('show');
                    };
                    if (lastStep.operation == "fadeIn") {
                        element.style.transitionDuration = `${duration}ms`;
                        element.classList.remove('show');
                        element.classList.add('hide');
                    };
                }
            };

        }
        return {
            stop() {
                clearInterval(interval);
            }
        }
    }
    return {
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
        addDelay,
        addHeartBeating,
        play,
        _steps,
    };


}