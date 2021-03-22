addListeners();

function addListeners() {
    let heartBeatingStopper;
    let moveAndHideStopper;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeInWrapper(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOutWrapper(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            // animaster().move(block, 1000, {x: 100, y: 10});
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMoveAndScaleWrapper(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetMoveAndScaleWrapper(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideStopper = animaster().moveAndHide(block, 5000, {x: 100, y: 20});
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideStopper.stop();
            animaster().resetMoveAndHideResetWrapper(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingStopper = animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingStopper.stop();
        });
    
    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1)
                .play(block);
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


function animaster() {
    let resetFadeIn = (element) => {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    let resetFadeOut  = (element) => {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    let resetMoveAndScale  = (element) => {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }
    return {
        _steps: [],
        play(element) {
            let perform = () => {
                if (this._steps.length == 0) return;
                let step = this._steps.pop();
                let func = step.shift();
                func.call(this, element, ...step);
                setTimeout(() => perform(), step.shift());
            };
            perform();
            // for(let command of this._steps) {
            //     console.log(command);
            //     let func = command.shift();
            //     setTimeout(() => func.call(this, element, ...command), 10000);
            // }
        },
        resetFadeInWrapper(element) {
            resetFadeIn(element);
        },
        resetFadeOutWrapper(element) {
            resetFadeOut(element);
        },
        resetMoveAndScaleWrapper(element) {
            resetMoveAndScale(element);
        },
        resetMoveAndHideResetWrapper(element){
            resetMoveAndScale(element);
            resetFadeOut(element);
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        addFadeIn(duration) {
            this._steps.push([this.fadeIn, duration]);
            return this;
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        addFadeOut(duration) {
            this._steps.push([this.fadeOut, duration]);
            return this;
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
        addMove(duration, translation) {
            this._steps.push([this.move, duration, translation]);
            return this;
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
        addScale(duration, ratio) {
            this._steps.push([this.scale, duration, ratio]);
            return this;
        },
        moveAndHide(element, duration, translation){
            let moveDuration = (2 * duration) / 5;
            let fadeInDuration = duration - moveDuration;
            this.move(element,moveDuration,translation);
            let intervalTimer = setInterval(() =>
                this.fadeOut(element, fadeInDuration), moveDuration);
            let stopper = {
                intervalTimer,
                stop(){clearTimeout(this.intervalTimer)}
            }
            return stopper;
        },
        showAndHide(element, duration) {
            let durationPart = duration / 3;
            this.fadeIn(element, durationPart);
            setInterval(() => this.fadeOut(element, durationPart), 2 * durationPart);
        },
        heartBeating(element) {
            let durationPart = 500;
            let performHeartBeat = () => {
                this.scale(element, durationPart, 1.4);
                setTimeout(() => this.scale(element,durationPart,1/1.4), durationPart);
            };
            let intervalTimer = setInterval(performHeartBeat, 1000);
            let stopObj = {
                intervalTimer,
                stop(){clearTimeout(this.intervalTimer)}
            };
            return stopObj;
        }
    };
}