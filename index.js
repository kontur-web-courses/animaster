addListeners();

function addListeners() {

    document
        .getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document
        .getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('movePlay').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        animaster().move(block,1000, { x: 100, y: 10 })
    });

    document.getElementById('scalePlay').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        animaster().scale(block, 1000, 1.25);
    });

    document
        .getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide= animaster().moveAndHide(block, 1000);
        });

    document
        .getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    document
        .getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating = animaster().heartBeating(block);
        });

    document
        .getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating.stop();
        });

    document
        .getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide.reset();
        });

    document
        .getElementById('test')
        .addEventListener('click', function () {
            const block = document.getElementById('testBlock');
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

function animaster() {


    function fadeIn(element, duration) {
        this._steps.length=0
        this.addFadeIn(duration).play(element)
    }

    function fadeOut(element, duration) {
        this._steps.length=0
        this.addFadeOut(duration).play(element)
    }

    function move(element, duration, translation) {
        this._steps.length=0
        this.addMove(duration,translation).play(element)
    }

    function scale(element, duration, ratio) {
        this._steps.length=0
        this.addScale(duration,ratio).play(element)
    }

    function moveAndHide(element, duration) {
        this._steps.length=0
        const interval = duration * 0.4;

        return this.addMove(interval, { x: 100, y: 20 }).addFadeOut(duration * 0.6).play(element)
    }

    function showAndHide(element, duration) {
        this._steps.length=0
        const interval = duration / 3;

        this.addFadeIn(interval).addDelay(interval).addFadeOut(interval).play(element)
    }

    function heartBeating(element) {
        this._steps.length=0
        return this.addScale(500,1.4).addScale(500,1).play(element,true)
    }

    let _steps = []
    let currStep=0
    let needStop=false

    function addMove(duration,translation){
        let step={
            name:"Move",
            duration : duration,
            params :{
                translation: translation,
                ratio : null
            }
        }
        _steps.push(step)
        return this
    }

    function addScale(duration,ratio){
        let step={
            name:"Scale",
            duration : duration,
            params :{
                translation: null,
                ratio : ratio
            }
        }
        _steps.push(step)
        return this
    }

    function addFadeIn(duration){
        let step={
            name:"FadeIn",
            duration : duration,
            params :{
                translation: null,
                ratio : null
            }
        }
        _steps.push(step)
        return this
    }

    function addFadeOut(duration){
        let step={
            name:"FadeOut",
            duration : duration,
            params :{
                translation: null,
                ratio : null
            }
        }
        _steps.push(step)
        return this
    }

    function addDelay(duration){
        let step={
            name:"AddDelay",
            duration : duration,
            params :{
                translation: null,
                ratio : null
            }
        }
        _steps.push(step)
        return this
    }

    function play(element,cycled=false){
        if(_steps.length>currStep && !needStop)
        {
            element.style.transitionDuration = `${_steps[currStep].duration}ms`;
            switch(_steps[currStep].name){
                case "Move":{
                    element.style.transform = getTransform(_steps[currStep].params.translation, null);
                    break;
                }
                case "Scale":{
                    element.style.transform=getTransform(null,_steps[currStep].params.ratio);
                    break;
                }
                case "FadeIn":{
                    element.classList.remove('hide');
                    element.classList.add('show');
                    break;
                }
                case "FadeOut":{
                    element.classList.remove('show');
                    element.classList.add('hide');
                    break;
                }

                case "AddDelay":{
                    break;
                }
            }

            setTimeout(()=>play(element,cycled),_steps[currStep].duration)
            currStep++
        }
        else{
            currStep=0
            if(cycled && !needStop)
                setTimeout(()=>play(element,cycled),1000)
        }
        return {
            stop(){
                needStop=true
            },
            reset(){
                for(let i=_steps.length-1;i>=0;i--) {
                    switch (_steps[i].name) {
                        case "Move":
                        case "Scale":{
                            resetMoveAndScale(element);
                            break;
                        }
                        case "FadeIn": {
                            resetFadeIn(element)
                            break;
                        }
                        case "FadeOut": {
                            resetFadeOut(element)
                            break;
                        }
                        case "AddDelay": {
                            break;
                        }
                    }
                }
            }
        }

    }


    function resetFadeIn(element){
        element.style.transitionDuration=null
        element.classList.add('hide')
        element.classList.remove('show')
    }

    function resetFadeOut(element){
        element.style.transitionDuration=null
        element.classList.add('show')
        element.classList.remove('hide')
    }

    function resetMoveAndScale(element){
        element.style.transitionDuration = null
        element.style.transform = null
    }

    function resetMoveAndHide(element){
        element.style.transform = null
        resetFadeOut(element)
    }

    return {
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide,
        heartBeating,
        resetFadeIn,
        resetFadeOut,
        resetMoveAndScale,
        addMove,
        play,
        addScale,
        addFadeIn,
        addFadeOut,
        addDelay,
        _steps
       };
}
