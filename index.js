addListeners();

function addListeners() {
    let anim = animaster();

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim.fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim.resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            anim.fadeOut(block, 5000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            anim.resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            anim.move(block, 1000, {x: 100, y: 10});
        });
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            anim.resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anim.scale(block, 1000, 1.25);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anim.resetMoveAndScale(block);
        });

    let moveAndHideTimeout;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');

            anim
                .addMove(2000, {x: 100, y: 20})
                .addFadeOut(3000)
                .play(block);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            clearInterval(moveAndHideTimeout);
            anim.resetMoveAndScale(block);
            anim.resetFadeOut(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim
                .addFadeIn(1000)
                .addDelay(1000)
                .addFadeOut(1000)
                .play(block);
        });

    let heartBeatingTimer;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');

            heartBeatingTimer = anim
                .addScale(500, 1.4)
                .addScale(500, 1)
                .play(block, true);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeatingTimer.stop();
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


/* Task */


function makeStep(step, el, animaster){
    if (step.type === 'move'){
        animaster.move(el, step.params[0], step.params[1]);
    }

    if (step.type === 'scale'){
        animaster.scale(el, step.params[0], step.params[1]);
    }   
    if (step.type === 'fadeOut'){
        animaster.fadeOut(el, step.params[0]);
    }

    if (step.type === 'fadeIn'){
        animaster.fadeIn(el, step.params[0]);
    }
}

function animaster(){
    return {
        _steps: [],
        addMove(duration, translation){
            this._steps.push({
                type: 'move',
                params: [duration, translation]
            });

            return this;
        },
        addScale(duration, ratio){
            this._steps.push({
                type: 'scale',
                params: [duration, ratio]
            });

            return this;
        },
        addFadeIn(duration){
            this._steps.push({
                type: 'fadeIn',
                params: [duration]
            });

            return this;
        },
        addFadeOut(duration){
            this._steps.push({
                type: 'fadeOut',
                params: [duration]
            });

            return this;
        },
        addDelay(duration){
            this._steps.push({
                type: 'delay',
                params: [duration]
            });

            return this;
        },
        play(element, cycled=false){
            let counter = 0;
            let duration = 0;

            for (const step of this._steps){
                setTimeout(() => {makeStep(step, element, this)}, duration);
                duration += step.params[0];
            }

            if (cycled){
                let timer = setInterval(() => {
                    let counter = 0;
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
            {
                this._steps = [];
            }
        },
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        resetFadeIn(element){
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetMoveAndScale(element){
            element.style.transitionDuration = null;
            element.style.transform = getTransform({x: 0, y: 0}, null);
            element.style.transform = getTransform(null, 1);
        },
        resetFadeOut(element){
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        }
    }
}
