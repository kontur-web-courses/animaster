addListeners();

function createStep(operationName, durationStep, extraParams) {
    return step = {
        operationName: operationName,
        stepDuration: durationStep,
        extraParams: extraParams
    }
}

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

    document.getElementById('moveAndFadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndFadeOutBlock');
            animaster().moveAndHide(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveAndFadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndFadeOutBlock');
            animaster().reset(block);
        });


    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).beat();
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).stop();
        });
}

let interval = 0;

function animaster() {
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    let obj = {
        _steps: []
    }
    obj.fadeIn = function (element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    obj.fadeOut = function (element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    obj.move = function (element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    obj.scale = function (element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    obj.moveAndHide = function (element, duration, translation) {
        obj.move(element, duration * (2 / 5), translation);
        setTimeout(() => {
            obj.fadeOut(element, duration * (3 / 5))
        }, duration * (2 / 5));
    }

    obj.showAndHide = function (element, duration) {
        obj.fadeIn(element, duration / 3);
        setTimeout(() => {
        }, duration / 3);
        setTimeout(() => {
            obj.fadeOut(element, duration / 3)
        }, duration / 3);
    }
    obj.heartBeating = function (element) {
        let heart = {}
        heart.beat = function () {
            interval = setInterval(() => {
                obj.scale(element, 500, 1.4)
                setTimeout(() => {
                    obj.scale(element, 500, 1)
                }, 500);
            }, 1000);
        }

        heart.stop = function () {
            console.log(interval);
            clearInterval(interval);
        }
        return heart
    }

    obj.addMove = function (duration, translation) {
        this._steps.push(createStep('move', duration, translation));
        return obj
    }

    obj.play = function (objToBeAnimated) {

        this._steps.forEach((value, index, array) => {
            if (value.operationName === 'move') {
                this.move(value.duration, value.extraParams);
            } else {

            }
        })
    };


    obj.reset = function (element) {
        resetFadeOut(element);
        resetMoveAndScale(element);
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
    }

    function resetMoveAndScale(element) {
        element.style.transform = null;
        element.style.transitionDuration = null;
    }

    return obj;
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
