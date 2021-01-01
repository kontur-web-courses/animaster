addListeners();


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

const customAnimation = animaster()
    .addMove(200, {x: 40, y: 40})
    .addScale(800, 1.3)
    .addMove(200, {x: 80, y: 0})
    .addScale(800, 1)
    .addMove(200, {x: 40, y: -40})
    .addScale(800, 0.7)
    .addMove(200, {x: 0, y: 0})
    .addScale(800, 1);

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeIn');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('move');
            //animaster().move(block, 1000, {x: 100, y: 10});
            animaster().addMove(1000, {x: 100, y:10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scale');
            //animaster().addScale(1000, 1.3).play(block);
            animaster().scale(block, 1000, 1.25);
            //customAnimation.play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOut');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHide');
            block.moveAndHide = animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function(){
            const block = document.getElementById('moveAndHide')
            block.moveAndHide.reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHide');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeating');
            block.heartBeating = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeating');
            block.heartBeating.stop();
        });

    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();

    document.getElementById('worryAnimation')
        .addEventListener('click', worryAnimationHandler);

    document.getElementById('outlineWidthPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('outlineWidth');
            animaster().changeHeigth(block, 5000);
        });
}

function animaster(){
    let animations = [];

    function fadeIn(element, duration){
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration){
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function changeHeigth(element, duration){
        element.style.transitionDuration = `${duration}ms`;
        element.style.height = `0`;
    }
    function moveAndHide(element, duration){
        let animation = animaster().addMove(duration*0.4,{x: 100, y: 20}).addFadeOut(duration*0.6).play(element);
        return{
            reset(){
                animation.reset();
            }
        }
    }

    function showAndHide(element, duration){
        animaster().addFadeIn(duration/3).addDelay(duration/3).addFadeOut(duration/3).play(element);
    }

    function heartBeating(element){
        animaster().addScale(500,1.4).addScale(500,1).play(element, true);
        return{
            stop(){
                animaster().play().stop();
            }
        }
    }

    function resetFadeIn(element){
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element){
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element){
        element.style.transitionDuration = null;
        element.style.transform = getTransform({ x: 0, y: 0 }, 1);
    }

    function addMove(duration, translation){
        this.animations.push({name: 'move', duration: duration, arg: translation});
        return this;
    }

    function addScale(duration, ratio){
        this.animations.push({name: 'scale', duration: duration, arg: ratio})
        return this;
    }

    function addFadeIn(duration){
        this.animations.push({name: 'fadeIn', duration: duration});
        return this;
    }

    function addFadeOut(duration){
        this.animations.push({name: 'fadeOut', duration: duration});
        return this;
    }

    function addDelay(duration){
        this.animations.push({name: 'delay', duration: duration});
        return this;
    }

    function play(elem, in_cycle){

        timeout = 0;
        if (in_cycle){
            interval = setInterval(() => {play(elem)}, 1000);
        }

        animations.forEach((operation)=>{
            switch (operation.name){
                case 'move':
                    setTimeout(()=>move(elem, operation.duration, operation.arg), timeout);
                    timeout += operation.duration;
                    break;
                case 'scale':
                    setTimeout(()=>scale(elem, operation.duration, operation.arg), timeout);
                    timeout += operation.duration;
                    break;
                case 'fadeIn':
                    setTimeout(()=>fadeIn(elem, operation.duration), timeout);
                    timeout += operation.duration;
                    break;
                case 'fadeOut':
                    setTimeout(()=>fadeOut(elem, operation.duration), timeout);
                    timeout += operation.duration;
                    break;
                case 'delay':
                    setTimeout(()=>{elem.style.transitionDuration = `${operation.duration}ms`;},timeout);
                    timeout += operation.duration;
                    break;
                case 'outlineWidth':
                    setTimeout(() => {outlineWidth(elem,operation.duration, operation.arg)}, timeout);
                    timeout += operation.duration;
                    break;
            }
        })
        return{
            stop(){
                clearInterval(interval);
            },
            reset(){
                resetMoveAndScale(elem);
                if (animations.findIndex(step=> step.name === 'fadeOut') >=animations.findIndex(step=> step.name === 'fadeIn')){
                    resetFadeOut(elem);
                }else{
                    resetFadeIn(elem);
                }
            }
        }
    }

    function buildHandler() {
        return (e) => this.play(e.target)
    }

    return {animations: animations, fadeIn, fadeOut, scale, move, moveAndHide, showAndHide, heartBeating,
        addMove, addScale, addFadeIn, addFadeOut, addDelay, play, buildHandler, changeHeigth};
}