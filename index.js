const animationType = { move: 0, scale: 1, fadeIn: 2, fadeOut: 3, nothing: 4, rotate: 5 };
addListeners();

function addListeners() {
    let moveAndHideAnimation;
    let heartBeatingAnimation;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster()
                .addFadeIn(1000)
                .play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster()
                .addFadeOut(1000)
                .play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster()
                .addMove(1000, { x: 100, y: 10 })
                .play(block);

        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster()
                .addScale(1000, 1.25)
                .play(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let duration = 5000;
            const animation = animaster()
                .addMove(duration * 2 / 5, { x: 100, y: 20 })
                .addFadeOut(duration * 3 / 5);
            moveAndHideAnimation = animation.play(block);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHideAnimation !== undefined) {
                moveAndHideAnimation.reset();
            }
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            let duration = 5000;
            const animation = animaster()
                .addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3);
            animation.play(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            let duration = 1000;
            const block = document.getElementById('heartBeatingBlock');
            const animation = animaster()
                .addScale(duration / 2, 1.4)
                .addScale(duration / 2, 1);
            heartBeatingAnimation = animation.play(block, true);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingAnimation !== undefined) {
                heartBeatingAnimation.stop();
            }
        });

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            const block1 = document.getElementById('customAnimationBlock1');
            const customAnimation = animaster()
                .addMove(200, { x: 40, y: 40 })
                .addScale(800, 1.3)
                .addMove(200, { x: 80, y: 0 })
                .addScale(800, 1)
                .addMove(200, { x: 40, y: -40 })
                .addScale(800, 0.7)
                .addMove(200, { x: 0, y: 0 })
                .addScale(800, 1);
            customAnimation.play(block);
            customAnimation.play(block1);
        });

    document.getElementById('ourAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('ourAnimationBlock');
            animaster().addRotate(1000).play(block);
        });

    const worryAnimationHandler = animaster()
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .addMove(200, { x: 80, y: 0 })
        .addMove(200, { x: 0, y: 0 })
        .buildHandler();

    document
        .getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
}

function animaster(params) {
    let _steps = [];

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transform = getTransform(null, 0);
        element.style.transform = getTransform({ x: 0, y: 0 }, null);
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

    function rotate(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = `rotate(360deg)`;
    }

    function moveAndHide(element, duration) {
        this.move(element, duration * 2 / 5, { x: 100, y: 20 });
        this.fadeOut(element, duration * 3 / 5);

        return {
            reset() {
                resetMoveAndScale(element);
                resetFadeOut(element);
            }
        }
    }

    function showAndHide(element, duration) {
        this.fadeIn(element, duration / 3);
        setTimeout(() => {
            this.fadeOut(element, duration / 3);
        }, duration / 3);
    }

    function heartBeating(element, duration) {
        let timer = setInterval(() => {
            this.scale(element, duration / 2, 1.4);
            setTimeout(() => {
                this.scale(element, duration / 2, 1);
            }, duration / 2);
        }, duration);
        return {
            stop() {
                clearTimeout(timer);
            }
        }
    }

    function addMove(duration, translation) {
        let step = new Step(animationType.move, duration, translation);
        this._steps.push(step);
        return this;
    }

    function addScale(duration, ratio) {
        let step = new Step(animationType.scale, duration, 0, ratio);
        this._steps.push(step);
        return this;
    }

    function addFadeIn(duration) {
        let step = new Step(animationType.fadeIn, duration);
        this._steps.push(step);
        return this;
    }

    function addFadeOut(duration) {
        let step = new Step(animationType.fadeOut, duration);
        this._steps.push(step);
        return this;
    }

    function addDelay(duration) {
        let step = new Step(animationType.nothing, duration);
        this._steps.push(step);
        return this;
    }

    function addRotate(duration) {
        let step = new Step(animationType.rotate, duration);
        this._steps.push(step);
        return this;
    }

    function play(element, cycled) {
        let i = 0;
        let timer = setTimeout((function run() {
            let duration = this._steps[i].duration;
            setStyles(element, this._steps[i]);
            i++;
            if (i >= this._steps.length && cycled) {
                i = 0;
            } else if (i >= this._steps.length) {
                return;
            }
            timer = setTimeout(run.bind(this), duration);
        }).bind(this), 0)
        let passedSteps = _steps.slice();
        _steps = [];
        return {
            stop() {
                clearTimeout(timer);
            },
            reset() {
                passedSteps.reverse().forEach(step => { resetStyles(element, step.animation) });
            }
        }
    }

    function setStyles(element, step) {
        switch (step.animation) {
            case animationType.move:
                move(element, step.duration, step.translation);
                break;
            case animationType.scale:
                scale(element, step.duration, step.ratio);
                break;
            case animationType.fadeIn:
                fadeIn(element, step.duration);
                break;
            case animationType.fadeOut:
                fadeOut(element, step.duration);
                break;
            case animationType.rotate:
                rotate(element, step.duration);
                break;
            case animationType.nothing:
                break;
        }
    }

    function resetStyles(element, animation) {
        switch (animation) {
            case animationType.move:
            case animationType.scale:
                resetMoveAndScale(element);
                break;
            case animationType.fadeIn:
                resetFadeIn(element);
                break;
            case animationType.fadeOut:
                resetFadeOut(element);
                break;
            case animationType.nothing:
                break;
        }
    }

    function buildHandler() {
        let play = this.play.bind(this);
        return function () {
            play(this);
        }
    }

    return {
        _steps,
        fadeIn,
        move,
        scale,
        fadeOut,
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove,
        addScale,
        addFadeIn,
        addDelay,
        addFadeOut,
        addRotate,
        play,
        buildHandler
    };
}

function Step(animation, duration, translation, ratio) {
    this.animation = animation;
    this.duration = duration;
    this.translation = translation;
    this.ratio = ratio;
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
