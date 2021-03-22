addListeners();

function addListeners() {
    let obj = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            obj.fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            obj.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            obj.scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            obj.fadeOut(block, 5000);
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
        setTimeout(this.fadeOut, duration / 3, element, duration / 3);
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
            duration: duration,
            arg: translation
        });
        return this;
    }

    function play (element) {
        for (let anim of steps){
            anim.name(element, anim.duration, anim.arg);
        }
    }

    return {
        scale: scale,
        fadeIn: fadeIn,
        move: move,
        fadeOut: fadeOut,
        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        heartBeating: heartBeating,
        addMove: addMove,
        play: play,
        _steps: steps
    }
}