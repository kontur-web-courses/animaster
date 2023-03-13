addListeners();
function makeStep(step, element, animaster){
    if (step.type === 'move') {
        element.style.transitionDuration = `${step.params[0]}ms`;
        element.style.transform = getTransform(step.params[1], null);
    }
    if (step.type === 'scale'){
        element.style.transitionDuration =  `${step.params[0]}ms`;
        element.style.transform = getTransform(null, step.params[1]);
    }
    if (step.type === 'fadeOut') {
        element.style.transitionDuration =  `${step.params[0]}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    if (step.type === 'fadeIn'){
        element.style.transitionDuration =  `${step.params[0]}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    if (step.type === 'delay'){
        setTimeout(null, step.params[0]);
    }
}

function animaster(){
    this._steps = []
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        return addFadeIn(duration);
    }

    function fadeOut(element, duration) {
        return addFadeOut(duration);
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        return addMove(duration, translation);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        return addScale(duration, ratio);
    }

    function moveAndHide(element, duration){
        let trans = {x: 100, y:20};
        addMove(duration * 0.4, trans);
        addFadeOut(duration * 0.6);
    }

    function showAndHide(element, duration){
        addFadeIn(duration * 0.33);
        addDelay(duration * 0.33);
        addFadeOut(duration * 0.33);
    }

    function heartBeating(element){
        addScale(500, 1.4);
        addScale(500, 1);
    }

    function addDelay(duration){
        this._steps.push({
            type: 'delay',
            params: [duration]
        });
        return this;
    }

    function addMove(duration, translation){
        this._steps.push({
            type: 'move',
            params: [duration, translation]
        });
        return this;
    }

    function addFadeIn(duration){
        this._steps.push({
            type: 'fadeIn',
            params: [duration]
        })
        return this
    }

    function addFadeOut(duration){
        this._steps.push({
            type: 'fadeOut',
            params: [duration]
        })
        return this
    }

    function addScale(duration, ratio){
        this._steps.push({
            type: 'scale',
            params: [duration, ratio]
        })
        return this
    }

    function play(element, cycled=false){
        let duration = 0;
        for (const step of this._steps){
            setTimeout(() => {makeStep(step, element, this)}, duration);
            duration += step.params[0];
        }
        if (cycled){
            let timer = setInterval(() => {
                let duration = 0;
                for (const step of this._steps){
                    setTimeout(() => {makeStep(step, element, this)}, duration);
                    duration += step.params[0];
                }
            }, duration);
            return {
                stop(){
                    clearInterval(timer);
                }
            }
        }
        else
            this._steps = [];
    }

    return {
        _steps,
        addMove, addScale, addFadeIn, addFadeOut,
        play,
        scale, move, fadeIn, fadeOut, showAndHide, heartBeating, moveAndHide}
}

function addListeners() {
    let anim = animaster()
    let stopHb;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim.addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            anim.play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            anim.move(block, 1000, {x: 100, y: 10});
            anim.play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anim.scale(block, 1000, 1.25);
            anim.play(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.moveAndHide(block, 5000);
            anim.play(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim.showAndHide(block, 5000);
            anim.play(block);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            anim.heartBeating(block, 5000);
            anim.play(block, true);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            stopHb.stop();
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndScale(block);
            resetFadeOut(block);
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

function resetFadeIn(element){
    element.style.transitionDuration = "0ms";
    element.classList.remove('show');
    element.classList.add('hide');
}

function resetFadeOut(element){
    element.style.transitionDuration = "0ms";
    element.classList.remove('hide');
    element.classList.add('show');
}

function resetMoveAndScale(element){
    element.style.transitionDuration = "0ms";
    element.style.transform = null;
}