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
            const animation = animaster().moveAndHide(block, 1000, { x: 100, y: 20 });

            document.getElementById('moveAndHideStop')
                .addEventListener('click', function () {
                    const block = document.getElementById('moveAndHideBlock');
                    animation.stop();
                });
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            const animation = animaster().heartBeating(block);

            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    const block = document.getElementById('heartBeatingBlock');
                    animation.stop();
                });
        });
}

function animaster() {
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

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        this.addFadeIn(duration).play(element);
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = `0ms`;
        element.classList.remove('show');
    }

    function addFadeIn(duration) {
        this._steps.push({
            name: 'fadeIn',
            duration,
        })
        return this;
    }

    /**
     * Блок плавно становистя прозрачным.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeOut(element, duration) {
        this.addFadeOut(duration).play(element);
    }

    function addFadeOut(duration) {
        this._steps.push({
            name: 'fadeOut',
            duration,
        })
        return this;
    }


    function resetFadeOut(element) {
        element.style.transitionDuration = `0ms`;
        element.classList.remove('hide');
        //element.style.hide = null;
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        //element.style.transitionDuration = `${duration}ms`;
        //element.style.transform = getTransform(translation, null);
        this.addMove(duration, translation).play(element);
    }

    function addMove(duration, translation) {
        this._steps.push({
            name: 'move',
            duration,
            translation,
        })
        return this;
    }

    function play(element) {
        console.log(this);
        for (const step of this._steps) {
            console.log(step);
            switch (step.name) {
                case 'move':
                    console.log(step);
                    element.style.transitionDuration = `${step.duration}ms`;
                    element.style.transform = getTransform(step.translation, null);
                    break;
                case 'fadeIn':
                    element.style.transitionDuration = `${step.duration}ms`;
                    element.classList.remove('hide');
                    element.classList.add('show');
                    break;
                case 'fadeOut':
                    element.style.transitionDuration = `${step.duration}ms`;
                    element.classList.remove('show');
                    element.classList.add('hide');
                    break;
                case 'scale':
                    element.style.transitionDuration = `${step.duration}ms`;
                    element.style.transform = getTransform(null, step.ratio);
                    break;
            }
        }
        return this;
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        this.addScale(duration,ratio).play(element);
    }

    function addScale(duration, ratio) {
        this._steps.push({
            name: 'scale',
            duration,
            ratio,
        })
        return this;
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = `0ms`;
        element.style.transform = getTransform(null, null);
    }

    function moveAndHide(element, duration, translation) {
        const moveTime = duration * 0.4;
        const hideTime = duration * 0.6
        this.move(element, moveTime, translation);
        const timeoutNum = setTimeout(() => this.fadeOut(element, hideTime), moveTime);
        function stop() {
            clearTimeout(timeoutNum);
            resetMoveAndScale(element);
            resetFadeOut(element);
        }

        return {
            stop,
        }
    }

    function showAndHide(element, duration) {
        const interval = duration / 3;
        this.fadeIn(element, interval)
        setTimeout(() => this.fadeOut(element, interval), interval);
    }

    function heartBeating(element) {

        const intervalNum = setInterval(() => {
            this.scale(element, 500, 1.4);
            setTimeout(() => this.scale(element, 500, 1), 500);
        }, 1000);

        function stop() {
            clearInterval(intervalNum);
        }

        return {
            stop,
        }
    }

    return {
        _steps: [],
        fadeIn,
        addFadeIn,
        fadeOut,
        addFadeOut,
        move,
        addMove,
        play,
        scale,
        addScale,
        moveAndHide,
        showAndHide,
        heartBeating
    }
}