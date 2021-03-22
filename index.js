addListeners();

function addListeners() {
    let obj = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            obj.addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            obj.addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            obj.addScale( 1000, 1.25).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            obj.addFadeOut(5000).play(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide = obj.moveAndHide(block, 5000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            moveAndHide.reset();
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            obj.showAndHide(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartbeating = obj.heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartbeating.stop();
        });

    document.getElementById('customAnimation')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);
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

function animaster () {
    let steps = []
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

    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function moveAndHide (element, duration) {
        move(element, duration * 0.4, {x: 100, y: 20});
        fadeOut(element, duration * 0.6);
        return {
            reset: function () {
                resetFadeOut(element);
                resetMoveAndScale(element);
            }
        }
    }

    function showAndHide (element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(fadeOut, duration / 3, element, duration / 3);
    }

    function heartBeating(element) {
        let f = function () {
            scale(element, 500, 1.4);
            setTimeout(scale, 500, element, 500, 1);
        }
        let timer = setInterval(f, 1500);
        return {
            stop: () => clearInterval(timer)
        }
    }

    function resetFadeIn(element) {
        fadeOut(element, 0);
    }

    function resetFadeOut(element) {
        fadeIn(element, 0);
    }

    function resetMoveAndScale (element) {
        move(element, 0, {x: 0, y: 0});
        scale(element, 0, 1);
    }

    function addMove(duration, translation) {
        steps.push({
            name: move,
            duration,
            translation
        });
        return this;
    }

    function play (element) {
        let delay = 0;
        for (let {name, ...args} of steps){
            setTimeout(name, delay, element, ...Object.values(args));
            delay += args.duration;
        }
        steps = [];
    }

    function addScale(duration, ratio){
        steps.push({
            name: scale,
            duration,
            ratio
        });
        return this;
    }

    function addFadeIn (duration) {
        steps.push({
            name: fadeIn,
            duration
        });
        return this;
    }
    function addFadeOut (duration) {
        steps.push({
            name: fadeOut,
            duration
        });
        return this;
    }

    return {
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        play,
        _steps: steps
    }
}