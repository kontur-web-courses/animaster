let heartBeatingInterval;
let moveAndHidePlayTimeOut;
addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('fadeInStop')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            resetFadeIn(block)
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });

    document.getElementById('fadeOutStop')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            resetFadeOut(block)
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHidePlayTimeOut = animaster().addMove(1000 * 2/5,{x:100, y: 20}).addFadeOut(1000 * 3/5,null,false).play(block);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndHide(block, moveAndHidePlayTimeOut)
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().addFadeIn(1000).addFadeOut(1000).play(block);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingInterval = animaster()
                .addScale(1000,1.4)
                .addScale(1000,1/1.4)
                .play(block,true);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeatingInterval = animaster().heartBeating().stop(heartBeatingInterval);
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
    element.style.transitionDuration =  null;
    element.classList.add('hide');
    element.classList.remove('show');
    element.style.opacity = null;
}

function resetFadeOut(element){
    element.style.transitionDuration =  null;
    element.classList.remove('hide');
    element.classList.add('show');
    element.style.opacity = null;
}

function resetMoveAndScale(element){
    element.style.transform = getTransform({x:0,y:0}, 1);
}


function resetMoveAndHide(element, timeout){
    clearTimeout(timeout)
    resetMoveAndScale(element)
    resetFadeOut(element)
}

class Operation{
    constructor(name, duration, arg, timeout) {
        this.name = name
        this.duration = duration
        this.arg = arg
        this.timeout = timeout;
    }
}

function animaster(){
    _steps = []
    timeoutSum = 0
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

    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function moveAndHide(element, duration){
        const moveDuration = 2*duration/5;
        setTimeout(move(element, moveDuration, {x:100, y: 20}))
        return setTimeout(()=>fadeOut(element, 3*duration/5),moveDuration)
    }

    function showAndHide(element, duration){
        const duration_ = duration/3;
        fadeIn(element,duration_);
        setTimeout(()=>fadeOut(element, duration_),duration_);
    }

    function heartBeating(){
        _steps = []
        function start(element){
            function extracted() {
                setTimeout(() => scale(element, duration, 1.4))
                setTimeout(() => scale(element, duration, 1 / 1.4), duration)
            }
            const duration = 0.5 * 1000;
            extracted();
            return setInterval(()=>{
                extracted();
            },duration*2
            )
        }

        function stop(interval){
            if (!interval) return
            clearInterval(interval);
        }

        return {
            start: start,
            stop: stop
        }
    }
    function addMove(duration, arg, needWait=true){
        const op = new Operation("move", duration, arg)
        _addOperation(op, needWait)
        return obj;
    }

    function addScale(duration, arg, needWait=true){
        const op = new Operation("scale", duration, arg)
        _addOperation(op, needWait)
        return obj;
    }

    function addFadeIn(duration, arg, needWait=true){
        const op = new Operation("fadeIn", duration)
        _addOperation(op, needWait)
        return obj;
    }

    function addFadeOut(duration, arg, needWait=true){
        const op = new Operation("fadeOut", duration)
        _addOperation(op, needWait)
        return obj;
    }


    function _addOperation(operation, needWait){
        if (!needWait){
            console.log(_steps[_steps.length-1])
            timeoutSum -= _steps[_steps.length-1].duration
            operation.timeout = timeoutSum
            _steps.push(operation)
        } else {
            operation.timeout = timeoutSum
            _steps.push(operation)
            timeoutSum += operation.duration
        }
        return obj;
    }

    function play(element, cycled){
        function _play() {
            _steps.forEach((operation, i) => {
                switch (operation.name) {
                    case "move":
                        setTimeout(() => move(element, operation.duration, operation.arg), operation.timeout)
                        break;
                    case "scale":
                        setTimeout(() => scale(element, operation.duration, operation.arg), operation.timeout)
                        break;
                    case "fadeIn":
                        setTimeout(() => fadeIn(element, operation.duration), operation.timeout)
                        break;
                    case "fadeOut":
                        setTimeout(() => fadeOut(element, operation.duration), operation.timeout)
                        break;
                }
            })
        }

        _play()
        if (cycled) setInterval(()=>_play(),timeoutSum)

    }

    let obj = {
        addMove: addMove,
        addScale: addScale,
        addFadeIn: addFadeIn,
        addFadeOut: addFadeOut,
        play: play,
    };
    return obj
}