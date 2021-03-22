addListeners();

function animaster() {
    const resetFadeIn = function (element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    const resetFadeOut = function (element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    const resetMoveAndScale = function (element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
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

    function fadeOut(element, duration) {
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
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function moveAndHide(element, duration) {
        move(element, duration * 2 / 5, {x: 100, y: 20});
        fadeOut(element, duration * 3 / 5);
        return {
            stop: () => {
                resetMoveAndScale(element);
                resetFadeOut(element);
            }
        }
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

    function showAndHide(element, duration) {
        fadeIn(element, duration * 1 / 3);
        setTimeout(() => fadeOut(element, duration * 1 / 3), duration * 1 / 3)
    }

    function heartBeating(element) {
        const interval = setInterval(() => {
            scale(element, 500, 1.4);
            setTimeout(() => scale(element, 500, 1), 500)
        }, 1000)
        return {
            stop: () => clearInterval(interval)
        }
    }

    return {
        _steps: [],
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        move: move,
        scale: scale,
        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        heartBeating: heartBeating,
        addMove: function (duration, translation) {
            this._steps.push({
                name: 'move',
                duration: duration,
                translation: translation,
            });
            return this;
        },
        addScale: function (duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration: duration,
                ratio: ratio,
            });
            return this;
        },
        addFadeIn: function (duration) {
            this._steps.push({
                name: 'fadeIn',
                duration: duration,
            });
            return this;
        },
        addFadeOut: function (duration) {
            this._steps.push({
                name: 'fadeOut',
                duration: duration,
            });
            return this;
        },
        play: function (element) {
            let prev = 0;
            for (let i = 0; i < this._steps.length; i++) {
                const e = this._steps[i];
                prev += this._steps[i].duration;
                switch (e.name) {
                    case 'move':
                        setTimeout(() => move(element, e.duration, e.translation), prev);
                        break;
                    case 'scale':
                        setTimeout(() => scale(element, e.duration, e.ratio), prev);
                        break;
                    case 'fadeIn':
                        setTimeout(() => fadeIn(element, e.duration), prev);
                        break;
                    case 'fadeOut':
                        setTimeout(() => fadeOut(element, e.duration), prev);
                        break;
                    default:
                        break;
                }
            }
        }
    };
}

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(1000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(1000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const obj = animaster().moveAndHide(block, 5000);

            document.getElementById('moveAndHideStop')
                .addEventListener('click', function () {
                    obj.stop();
                });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            const obj = animaster().heartBeating(block);

            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    obj.stop();
                });
        });

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            animaster()
                .addMove(1000, {x: 40, y: 40})
                .addScale(1000, 1.3)
                .addMove(1000, {x: 80, y: 0})
                .addScale(1000, 1)
                .addMove(1000, {x: 40, y: -40})
                .addScale(1000, 0.7)
                .addMove(1000, {x: 0, y: 0})
                .addScale(1000, 1)
                .play(block);
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
