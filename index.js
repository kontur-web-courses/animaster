class Step{
    constructor(func, duration, ...args) {
        this.func = func;
        this.duration = duration;
        this.args = args;
    }
}


addListeners('fadeInPlay', 'fadeInBlock', animaster().addFadeIn(5000));
addListeners('movePlay', 'moveBlock', animaster().addMove(5000, {x: 100, y: 20}));
addListeners('scalePlay', 'scaleBlock', animaster().addScale(1000, 1.25));
addListeners('fadeOutPlay', 'fadeOutBlock', animaster().addFadeOut(5000));
addListeners('moveAndHidePlay', 'moveAndHideBlock', animaster().moveAndHide(5000), 'moveAndHideResetPlay');
addListeners('showAndHidePlay', 'showAndHideBlock', animaster().showAndHide(5000), 'showAndHideResetPlay');
addListeners('heartBeatingPlay', 'heartBeatingBlock', animaster().heartBeating(), null, 'heartBeatingStopPlay');

function addListeners(buttonId, blockId, animator, resetButton = null, stopButton = null){
    document.getElementById(buttonId)
        .addEventListener('click', function(){
            const block = document.getElementById(blockId);
            if (!stopButton) {
                animator['break'] = animator.play(block);
            } else{
                animator['break'] = animator.play(block, true);
            }
        })
    if (resetButton){
        document.getElementById(resetButton)
            .addEventListener('click', function (){
                animator['break'].reset.call(animator);
            })
    }
    if (stopButton){
        document.getElementById(stopButton)
            .addEventListener('click', function (){
                animator['break'].stop.call(animator);
            })
    }
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

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMove(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {
        _steps: [],
        addMove(duration, ...args){
            this._steps.push(new Step(this.move, duration, ...args));
            return this;
        },
        addScale(duration, ...args){
          this._steps.push(new Step(this.scale, duration, ...args));
          return this;
        },
        addFadeIn(duration){
            this._steps.push(new Step(this.fadeIn, duration));
            return this;
        },
        addFadeOut(duration){
          this._steps.push(new Step(this.fadeOut, duration));
          return this;
        },
        addDelay(duration){
            this._steps.push(new Step(() => {}, duration));
            return this;
        },
        playID: null,
        timeOuts: [],
        play(element, cycled = false){
            let actSteps = [...this._steps];
            if(!cycled){
                let prevDuration = 0;
                for(let i = 0; i < this._steps.length; i++){
                    let step = this._steps[i];
                    const time = setTimeout(() => {
                        step.func(element, step.duration, ...step.args);
                    }, prevDuration);
                    this.timeOuts.push(time);
                    prevDuration += step.duration;
                }
            } else{
                this.playID = setInterval(()=>{
                    let prevDuration = 0;
                    for(let i = 0; i < this._steps.length; i++) {
                        let step = this._steps[i];
                        const time = setTimeout(() => {
                            step.func(element, step.duration, ...step.args);
                        }, prevDuration);
                        this.timeOuts.push(time);
                        prevDuration += step.duration;
                    }
                }, 1000)
            }
            return {
                stop(){
                    clearInterval(this.playID);
                },
                reset(){
                    actSteps.reverse().forEach(step => {
                        if (step.func === this.fadeIn) {
                            resetFadeIn(element);
                        } else if (step.func === this.fadeOut) {
                            resetFadeOut(element);
                        } else if (step.func === this.move) {
                            resetMove(element);
                        }
                    });
                    this.timeOuts.forEach(time => {
                        clearTimeout(time);
                    })
                    clearTimeout(this.playID);
                }
            }
        },
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide(duration) {
            this.addMove(duration / 5 * 2, {x: 100, y: 20})
                .addDelay(duration / 5)
                .addFadeOut(duration / 5 * 2);
            return this;
        },
        showAndHide(duration) {
            this.addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3);
            return this;
        },
        heartBeating() {
            this.addScale(500, 1.4)
                .addScale(500, 1);
            return this;
        }
    }
}
