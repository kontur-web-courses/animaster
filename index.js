addListeners();

class Step {
    constructor(funcName, time, param){
        this.funcName = funcName;
        this.time = time;
        this.param = param || 0;
    }
}

function animaster(){
    let obj = {};
    let _steps = [];

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration =  null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    obj.addMove = function(duration, translation) {
        _steps.push(new Step('move', duration, translation));
        return this;
    }

    obj.addFadeIn = function(duration) {
        _steps.push(new Step('fadeIn', duration));
        return this;
    }
    
    obj.addScale = function(duration, ratio) {
        _steps.push(new Step('scale', duration, ratio));
        return this;
    }
    
    obj.addFadeOut = function(duration) {
        _steps.push(new Step('fadeOut',duration ))
        return this;
    }

    obj.addDelay = function (duration) {
        _steps.push(new Step('delay', duration))
        return this;
    }


    function _play(element, cycled) {
        if(_steps.length !=0){
            let step = _steps.shift();
            playStep(element, step);
            if(cycled) _steps.push(step);
            setTimeout(() => {
            _play(element, cycled);
            }, step.time);
        }
    }

    obj.play = function(element, cycled) {
        let obj = {};
        let lastStep = _steps[_steps.length - 1];
        let player = _play.bind(this);
        player(element, cycled)

        obj.stop = function() {
            _steps = new Array(lastStep);
            player(element);
        }

        obj.reset = function() {
            resetMoveAndScale(element);
            switch(lastStep.funcName){
                case 'fadeIn':
                    resetFadeIn(element);
                    break;
                case 'fadeOut':
                    resetFadeOut(element);
                    break;
            }

        }

        return obj;
    }

    function playStep(element, step) {
        switch(step.funcName){
            case 'move':
                move(element, step.time, step.param);
                break;
            case 'fadeIn':
                fadeIn(element, step.time);
                break;
            case 'scale':
                scale(element, step.time, step.param);
                break;
            case 'fadeOut':
                fadeOut(element, step.time);
                break;
        }
    }

    obj.buildHandler = function(name){
        return function(){
            const block = document.getElementById(name);
            this.play(block);
        }
    }

    return obj;
}

function addListeners() {
    //const fadeinAnimation = animaster().addFadeIn(5000).buildHandler('fadeInBlock');

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
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
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            let moveAndHider = moveAndHide();
            moveAndHider.run();
            document.getElementById('moveAndHideStop')
            .addEventListener('click', moveAndHider.stop);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            let thirdPart = 5000 / 3;
            animaster()
            .addFadeIn(thirdPart)
            .addDelay(thirdPart)
            .addFadeOut(thirdPart)
            .play(block);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', () => { 
            let hearbeater = heartbeating();
            hearbeater.run();
            document.getElementById('heartBeatingStop')
            .addEventListener('click', hearbeater.stop);
        });
    document.getElementById('customAnimationPlay')
        .addEventListener('click', () => {
            const block = document.getElementById('customAnimationBlock');
            customAnimationSet(block);
        });
        
    function customAnimationSet(block){
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
    }
}

function moveAndHide() {
    let obj = {};
    const block = document.getElementById('moveAndHideBlock');
    let fistPart = 5000 * 0.4;
    let secondPart = 5000 * 0.6;
    let player
    obj.run = function() {
        player = animaster().addMove(fistPart, {x: 100 ,y: 20}).addFadeOut(secondPart).play(block);
    }
    obj.stop = function() {
        player.stop();
        player.reset();
    }
    return obj;
}

function heartbeating() { 
    let obj = {};
    const block = document.getElementById('heartBeatingBlock');
    let interval = 500;
    let player;
    obj.run = function() {
        player = animaster().addScale(interval, 1.4).addScale(interval, 1).play(block, true);
    }
    obj.stop = function() {
        player.stop();
    }
    return obj;
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
