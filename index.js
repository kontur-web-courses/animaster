addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000).start();
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000).reset();
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).addMove(2000, {x: 200, y: 10}).play(block);
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, {x: 100, y: 10}, 1).reset();
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25).start();
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25).reset();
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
        const block = document.getElementById('fadeOutBlock');
        animaster().addFadeOut(5000).play(block);
    });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000).reset();
        });
    
    document.getElementById('moveAndHidePlay')
    .addEventListener('click', function () {
    const block = document.getElementById('moveAndHideBlock');
    animaster().moveAndHide(block, 5000).start();
    });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000).reset();
        });

    document.getElementById('showAndHidePlay')
    .addEventListener('click', function () {
    const block = document.getElementById('showAndHideBlock');
    animaster().showAndHide(block, 5000).start();
    });

    document.getElementById('showAndHideReset')
    .addEventListener('click', function () {
    const block = document.getElementById('showAndHideBlock');
    animaster().showAndHide(block, 5000).reset();
    });

    document.getElementById('heartBeatingPlay')
    .addEventListener('click', function () {
    const block = document.getElementById('heartBeatingBlock');
    animaster().heartBeating().startBeat(block);
    });

    document.getElementById('heartBeatingStop')
    .addEventListener('click', function () {
    const block = document.getElementById('heartBeatingBlock');
    animaster().heartBeating().stop();
    });

    document.getElementById('customAnimationPlay')
    .addEventListener('click', function () {
    const block = document.getElementById('customAnimationBlock');
    playCustomAnimation(block);
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

let globalInterval;


function playCustomAnimation(element){
    const customAnimation = animaster()
    .addMove(200, {x: 40, y: 40})
    .addScale(800, 1.3)
    .addMove(200, {x: 80, y: 0})
    .addScale(800, 1)
    .addMove(200, {x: 40, y: -40})
    .addScale(800, 0.7)
    .addMove(200, {x: 0, y: 0})
    .addScale(800, 1);
    customAnimation.play(element);
}

function animaster(){
    return{
        _steps: [],

        addMove(duration, translation){
            this._steps.push({
                func: animaster().move,
                duration: duration,
                args: translation
            })
            return this;
        },
        addDelay(duration)
        {
            this._steps.push({
                func: animaster().delay,
                duration: duration,
                args: undefined
            })
            return this;
        },
        addScale(duration, ratio){
            this._steps.push({
                func: animaster().scale,
                duration: duration,
                args: ratio
            })
            return this;
        },

        addFadeIn(duration){
            this._steps.push({
                func: animaster().fadeIn,
                duration: duration,
                args: []
            })
            return this;
        },

        addFadeOut(duration){
            this._steps.push({
                func: animaster().fadeOut,
                duration: duration,
                args: undefined
            })
            return this;
        },

        play(element){
            let lastStepDuration = 0;
            for(let step of this._steps){
                setTimeout(step.func(element, step.duration, step.args).start, lastStepDuration);
                lastStepDuration += step.duration;
            }
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            return{
                start: function (){
                    element.style.transitionDuration =  `${duration}ms`;
                    element.classList.remove('hide');
                    element.classList.add('show');
                },
                reset: function (){
                    element.style.transitionDuration =  null;
                    element.classList.remove('show');
                    element.classList.add('hide');
                }
            }
        },
        
        delay()
        {
            return{
                start: function(){},
                reset: function(){}
            }
        },

        fadeOut(element, duration) {
            return {
                start: function (){
                    element.style.transitionDuration =  `${duration}ms`;
                    element.classList.remove('show');
                    element.classList.add('hide');
                },
                reset: function (){
                    element.style.transitionDuration =  null;
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            }
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            return{
                start: function (){
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = getTransform(translation, null);
                },
                reset: function (){
                    element.style.transitionDuration =  null;
                    element.style.transform = getTransform({x: 0, y: 0}, null);
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
            return{
                start: function (){
                    element.style.transitionDuration =  `${duration}ms`;
                    element.style.transform = getTransform(null, ratio);
                },
                reset: function (){
                    element.style.transitionDuration =  null;
                    element.style.transform = getTransform(null, 1 / ratio);
                }
            }
        },

        moveAndHide(element, duration) {
            return {
                start: function (){
                    animaster().addMove(duration * 2 / 5, {x:100, y:20}).addFadeOut(duration * 3 / 5).play(element);
                },
                reset: function (){
                    element.style.transitionDuration =  null;
                    element.style.transform = getTransform({x: 0, y: 0}, null);
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            }
        },

        showAndHide(element, duration) {
            return {
                start: function (){
                    animaster().addFadeIn(duration / 3).addDelay(duration / 3).addFadeOut(duration / 3).play(element);
                },
                reset: function (){
                    element.style.transitionDuration =  null;
                    element.style.transform = getTransform({x: 0, y: 0}, null);
                    element.classList.remove('show');
                    element.classList.add('hide');
                }
            }
        },

        heartBeating() {
            return{
                startBeat(element){
                    globalInterval = setInterval(this.beat, 1000, element)
                },
                beat(element){
                    animaster().addScale(500, 1.4).addScale(500, 1).play(element);
                },
                stop(){
                    console.log("pressed stop button");
                    clearInterval(globalInterval);
                }
            }
        }
    }
}
