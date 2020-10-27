addListeners();

function addListeners() {
    const {
        fadeIn,
        resetFadeIn,
        fadeOut,
        resetFadeOut,
        move,
        scale,
        resetMoveAndScale,
        moveAndHide,
        showAndHide,
        heartBeating,
    } = animaster();
    document.getElementById('fadeInPlay').addEventListener('click', function () {
        const block = document.getElementById('fadeInBlock');
        //fadeIn(block, 5000);
        animaster().addFadeIn(5000).play(block);
    });
    
    document.getElementById('fadeInReset').addEventListener('click', function(){
        const block = document.getElementById('fadeInBlock');
        resetFadeIn(block);
    });

    document.getElementById('fadeOutPlay').addEventListener('click', function () {
        const block = document.getElementById('fadeOutBlock');
        //fadeOut(block, 5000);
        animaster().addFadeOut(5000).play(block);
    });
    
    document.getElementById('fadeOutReset').addEventListener('click', function(){
        const block = document.getElementById('fadeOutBlock');
        resetFadeOut(block);
    });

    document.getElementById('movePlay').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        animaster().addMove(1000, {x: 100, y:10}).play(block);
        //move(block, 1000, { x: 100, y: 10 });
    });

    document.getElementById('moveReset').addEventListener('click', function() {
        const block = document.getElementById('moveBlock');
        resetMoveAndScale(block);
    });

    document.getElementById('scalePlay').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        //scale(block, 1000, 1.25);
        animaster().addScale(1000, 1.25).play(block);
    });

    document.getElementById('scaleReset').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        resetMoveAndScale(block);
    });

    document.getElementById('moveAndHide').addEventListener('click', function () {
        const block = document.getElementById('moveAndHideBlock');
        //moveAndHide(block, 1000);
        animaster().addMove(1000*0.4,{x: 100, y:20}).addFadeOut(1000*0.6).play(block);
    });

    document.getElementById('moveAndHideReset').addEventListener('click', function () {
        const block = document.getElementById('moveAndHideBlock');
        resetMoveAndScale(block);
        resetFadeOut(block);
    });

    document.getElementById('showAndHide').addEventListener('click', function () {
        const block = document.getElementById('showAndHideBlock');
        //showAndHide(block, 1000);
        animaster().addFadeIn(1000/3).addDelay(1000/3).addFadeOut(1000/3).play(block);
    });

    document.getElementById('heartBeating').addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        //block.heartBeating = heartBeating(block);
        animaster().addScale(500, 1.4).addScale(500, 1).play(block, true);
    });

    document.getElementById('heartBeatingStop').addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        block.heartBeating.stop();
    });
    
    //Задание 11
    document.getElementById('customAnimation').addEventListener('click', function () {
        const block = document.getElementById('customAnimationBlock');
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

class Step{
    constructor(nameAnimation, duration, additionalParams){
        this.nameAnimation = nameAnimation;
        this.duration = duration;
        this.additionalParams = additionalParams || 0;
    }
}

function animaster() {
    _steps = [];

    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
        
    }
    function resetFadeIn(element){
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element){
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }
    
    function resetMoveAndScale(element){
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function moveAndHide(element, duration) {
        const interval = duration * 0.4;
        move(element, interval, { x: 100, y: 20 });
        setTimeout(() => {
            fadeOut(element, duration * 0.6);
        }, interval);
    }

    function showAndHide(element, duration) {
        const interval = duration / 3;
        fadeIn(element, interval);
        setTimeout(() => {
            fadeOut(element, interval);
        }, interval * 2);
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

    function addMove(duration, translation){
        this._steps.push(new Step('move', duration, translation));
        return this;
    }

    function addScale(duration, ratio){
        this._steps.push(new Step('scale', duration, ratio));
        return this;
    }

    function addFadeIn(duration){
        this._steps.push(new Step('fadeIn', duration));
        return this;
    }

    function addFadeOut(duration){
        this._steps.push(new Step('fadeOut', duration));
        return this;
    }

    function addDelay(duration){
        this._steps.push(new Step('delay', duration));
        return this;
    }
    function play(element, cycled = false){
        let timeout = 0;
        for(const step of this._steps){
            switch(step.nameAnimation){
                case 'move':
                    setTimeout(()=>move(element, step.duration, step.additionalParams), timeout)
                    //move(element, step.duration, step.additionalParams); 
                    break;
                case 'scale':
                    setTimeout(()=> scale(element, step.duration, step.additionalParams), timeout)
                    //scale(element, step.duration, step.additionalParams);
                    break;
                case 'fadeIn':
                    setTimeout(()=> fadeIn(element, step.duration), timeout)
                    //fadeIn(element, step.duration);
                    break;
                case 'fadeOut':
                    setTimeout(()=> fadeOut(element, step.duration), timeout)
                    //fadeOut(element, step.duration);
                    break;
                case 'delay':
                    setTimeout(()=> addDelay(element, step.duration), timeout);
                    break;
            }
            timeout+=step.duration;
        }
        if(cycled){
            setInterval(() => {
                play.call(this, element)
            }, timeout);
        }
    }

    return {
        _steps,
        fadeIn,
        resetFadeIn,
        fadeOut,
        resetFadeOut,
        move,
        scale,
        resetMoveAndScale,
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        addDelay,
        play,
    };
}
