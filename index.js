addListeners();

function addListeners() {
    let heartBeating;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster()
                .addMove(1000, {x: 100, y: 10})
                .play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('heartBreatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBreatingBlock');
            heartBeating = animaster().heartBeating(block);
        });
    document.getElementById('heartBreatingStop')
        .addEventListener('click', function () {
            heartBeating?.stop();
            heartBeating = null;
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block, 1000);
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

function animaster(){
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
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    function moveAndHide(element, duration){
        move(element, duration, {x:100,  y:20});
        fadeOut(element, duration);
    }
    function showAndHide(element, duration){
        fadeIn(element, duration);
        setTimeout(() => fadeOut(element, duration), duration)
    }
    function heartBeating(element){
        let intervalId = setInterval(function () {
                scale(element, 500, 1.4);
                setTimeout(function () {
                    scale(element, 500, 1);
                }, 500);
            }, 1000);
            
        return {
            intervalId,
            stop: function () {
                clearInterval(this.intervalId);
            }
        }
    }
    function resetFadeIn(element){
        element.style.show = null;
        element.classList.remove('show');
    }

    function resetFadeOut(element){
        element.style.hide = null;
        element.classList.remove('hide');
    }

    function resetMoveAndScale(element){
        element.style.transform = null;
    }

    function resetMoveAndHide(element){
        resetMoveAndScale(element);
        resetFadeOut(element);
    }

    function addMove (duration, translation) {
        this._steps.push({
            name: 'move',
            duration,
            translation
        });
        return this;
    }

    function addScale (duration, scale) {
        this._steps.push({
            name: 'scale',
            duration,
            scale: scale
        });
        return this;
    }

    function addFadeIn (duration) {
        this._steps.push({
            name: 'fadeIn',
            duration
        });
        return this;
    }

    function addFadeOut (duration) {
        this._steps.push({
            name: 'fadeOut',
            duration
        });
        return this;
    }

    function play (element) {
        for (const step of this._steps){
            switch (step.name){
                case 'move':
                    this.move(element, step.duration);
                    break;
                case 'fadeIn':
                    this.fadeIn(element, step.duration);
                    break;
                case 'fadeOut':
                    this.fadeOut(element, step.duration);
                    break;
                case 'scale':
                    this.scale(element, step.duration, step.scale);
                    break;
                case 'wait':
                    setTimeout(() => 0, duration)
                    break;
            }
        }
    }

    function addDelay(duration) {
        this._steps.push({
            name: 'wait',
            duration
        });
        return this;
    }
    
    return {
        _steps: [],
        move, scale, fadeIn, fadeOut, moveAndHide, showAndHide, heartBeating, resetMoveAndHide, addMove, play,
        addFadeIn,
    addFadeOut, addScale};
}