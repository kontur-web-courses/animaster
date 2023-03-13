addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let animation = animaster().moveAndHide(block, 1000);

            document.getElementById('moveAndHideReset')
                .addEventListener('click', function () {
                    animation.reset();
                })
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let animation = animaster().heartBeating(block);

            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    animation.stop();
                });
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

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.add('hide');
        element.classList.remove('show');
    }

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

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function moveAndHide(element, duration) {
        this.addMove(duration * 2 / 5, {x: 100, y: 20})
            .addFadeOut(duration * 3 / 5)
            .play(element);
    }

    function showAndHide(element, duration) {
        this.addFadeIn(duration / 3)
            .addDelay(duration / 3)
            .addFadeOut(duration / 3)
            .play(element);
    }

    function heartBeating(element) {
        function beat() {
            scale(element, 500, 1.4);
            setTimeout(scale, 500, element, 500, 1);
        }

        let interval = setInterval(beat, 1500);

        function stop() {
            clearInterval(interval);
        }

        return {stop};
    }

    function addMove(duration, argument) {
        this._steps.push({func: move, duration: duration, argument: argument})
        return this;
    }

    function addScale(duration, argument) {
        this._steps.push({func: scale, duration: duration, argument: argument})
        return this;
    }

    function addFadeIn(duration) {
        this._steps.push({func: fadeIn, duration: duration})
        return this;
    }

    function addFadeOut(duration) {
        this._steps.push({func: fadeOut, duration: duration})
        return this;
    }

    function addDelay(duration) {
        return this.addMove(duration, {x: 0, y:0});
    }

    function play(element) {
        let sumDuration = 0;
        for (let i = 0; i < this._steps.length; ++i) {
            sumDuration += this._steps[i].duration;
            if (i === 0)
                this._steps[i].func(element, this._steps[i].duration, this._steps[i].argument);
            else setTimeout(this._steps[i].func,
                sumDuration, element, this._steps[i].duration, this._steps[i].argument);
        }
    }

    return {
        _steps: [],
        addMove: addMove,
        addScale: addScale,
        addFadeIn: addFadeIn,
        addFadeOut: addFadeOut,
        addDelay: addDelay,
        play: play,
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        move: move,
        scale: scale,
        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        heartBeating: heartBeating
    }
}