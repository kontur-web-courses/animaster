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

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
        const block = document.getElementById('fadeOutBlock');
        animaster().fadeOut(block, 5000).start();
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
    animaster().showAndHide(block, 5000);
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
        play(element){
            let lastStepDuration = 0;
            for(let step of this._steps){
                console.log(step.duration);
                setTimeout(step.func, lastStepDuration, element, step.duration, step.args);
                lastStepDuration = step.duration;
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
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide(element, duration) {
            return {
                start: function (){
                    animaster().move(element, duration * 2 / 5, {x:100, y:20});
                    animaster().fadeOut(element, duration * 3 / 5).start();
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
            this.fadeIn(element, duration / 3)
            setTimeout(this.fadeOut, duration / 3, element, duration / 3)
        },

        heartBeating() {
            return{
                startBeat(element){
                    globalInterval = setInterval(this.beat, 1000, element)
                },
                beat(element){
                    animaster().scale(element, 500, 1.4);
                    setTimeout(animaster().scale, 500, element, 500, 1)
                },
                stop(){
                    console.log("pressed stop button");
                    clearInterval(globalInterval);
                }
            }
        }
    }
}
