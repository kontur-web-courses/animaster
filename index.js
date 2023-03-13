

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            block.unchangedClassList = block.classList;
            block.fadeIn = animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInPlayReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            block.style.transitionDuration = null;
            block.classList.remove('show');
            block.classList.add('hide');
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            block.style.transitionDuration = null;
            block.classList.remove('hide');
            block.classList.add('show');
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.unchangedClassList = block.classList;
            block.moveAndHide = animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide.stop()
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 6000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating.stop();
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.4);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});

        });

    const worryAnimationHandler = animaster()
        .addStep('move',200, {x: 80, y: 0})
        .addStep('move',200, {x: 0, y: 0})
        .addStep('move',200, {x: 80, y: 0})
        .addStep('move',200, {x: 0, y: 0})
        .buildHandler();

    document
        .getElementById('worryBlock')
        .addEventListener('click', worryAnimationHandler);


}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(" ");
}


function animaster() {
    return new Animaster();
}

class Step {
    constructor(name,duration,params) {
        this.name = name;
        this.duration = duration;
        this.params = params;
    }
}

class Animaster {

    _steps = [];

    addStep(name,duration,params){
        this._steps.push(new Step(name,duration,params));
        return this;
    }

    _createFuncArray(){
        let _funcs = []
        _funcs['move'] = this.move;
        _funcs['scale'] = this.scale;
        _funcs['fadeIn'] = this.fadeIn;
        _funcs['fadeOut'] = this.fadeOut;
        _funcs['reset'] = this.reset;
        _funcs['moveAndHide'] = this.moveAndHide;
        _funcs['showAndHide'] = this.showAndHide;
        _funcs['heartBeating'] = this.heartBeating;
        _funcs['addDelay'] = this.addDelay;

        return _funcs;
    }

    play(element,cycled=false){

        const unchangedClassList = element.classList;
        let stopRequested = false;
        let stepInd = 0;

        const funcs = this._createFuncArray();

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const playNextStep = () => {
            if (this._steps.length === 0)
                return;
            if(stopRequested)
                return;

            let step = this._steps[stepInd++];
            if(cycled && stepInd >= this._steps.length)
                stepInd = 0;
            if (step === undefined)
                return;

            funcs[step.name](element,step.duration,step.params);

            sleep(step.duration).then(()=>{
                playNextStep();
            });
        }

        playNextStep();

        const stop = () => {
            this.reset(element, unchangedClassList);
            stopRequested = true;
        }

        return {
            stop
        }
    }

    scale(element,duration,ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
        return this.play(element);
    }

    fadeOut(element, duration){
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    reset(element, classList = null) {
        element.style.transitionDuration = null;
        element.style.transform = null;
        element.classList = classList === null ? null : classList.value;
        if(classList.value.includes('hide'))
            classList.add('show');
        if(classList.value.includes('show'))
            classList.add('hide');
    }

    addDelay(duration){
        return new Promise(resolve => setTimeout(resolve, duration)).then();
    }

    moveAndHide(element, duration){
        this.addStep('move',duration * 0.4, {x: 100, y: 20});
        this.addStep('fadeOut',duration * 0.6);
        return this.play(element);
    }

    showAndHide(element, duration){
        duration = duration*0.33;
        this.addStep('fadeIn', duration);
        this.addStep('addDelay', duration);
        this.addStep('fadeOut', duration);
        this.play(element);
    }

    heartBeating(element){
        this.addStep('scale',500, 1.4)
        this.addStep('scale',500, 1)
        return this.play(element,true);
    }

    buildHandler(){
        let animaster = this;
        return  function() {
            animaster.play(this);
        }
    }
}

addListeners();