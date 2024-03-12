addListeners();

function addListeners() {
    let heartBeatingObj;
    let moveAndHideObj;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            // animaster().move(block, 1000, {x: 100, y: 10});
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

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideObj = animaster().moveAndHide(block, 1000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingObj = animaster().heartBeating(block, 500);
        });

    document.getElementById('stopHeartBeatingPlay')
        .addEventListener('click', function () {
            heartBeatingObj.stop();
        });

    document.getElementById('resetMoveAndHide')
        .addEventListener('click', function () {
            moveAndHideObj.reset();
        });
    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();
    document
        .getElementById('worryAnimationPlay')
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
    return result.join(' ');
}

function animaster()
{
    function resetMoveAndScale(element){
        element.style.transitionDuration = null;
        element.style.transform = null;
    }
    function resetFadeOut(element){
        element.style.transitionDuration = null
        element.classList.add('show');
        element.classList.remove('hide');
    }
    function resetFadeIn (element){
        element.style.transitionDuration = null
        element.classList.add('hide');
        element.classList.remove('show');

    }
    return {
        _steps: [],

        addMove: function (duration, translation)
        {
            this._steps.push({
                duration: duration,
                operation: element => this.move(element, duration, translation)
            })
            return this;
        },

        addScale: function (duration, ratio)
        {
            this._steps.push({
                duration: duration,
                operation: element => this.scale(element, duration, ratio)
            })
            return this;
        },

        addFadeIn: function (duration)
        {
            this._steps.push({
                duration: duration,
                operation: element => this.fadeIn(element, duration)
            })
            return this;
        },

        addFadeOut: function (duration)
        {
            this._steps.push({
                duration: duration,
                operation: element => this.fadeOut(element, duration)
            })
            return this;
        },

        addDelay: function (delay)
        {
            this._steps.push({
                duration: delay,
                operation: () => {}
            })
            return this;
        },

        play: function (element, cycled=false)
        {
            if (this._steps.length < 1)
                return this;

            if (cycled)
                return this._play_cycle(element);

            this._play_steps(element);

            this._steps = [];
            return this;
        },

        _play_cycle: function (element)
        {
            let cycle_time = 0;
            for (const step of this._steps)
                cycle_time += step.duration;

            let cycle = setInterval( () => this._play_steps(element), cycle_time*2);
            return {
                stop: function (){
                    clearTimeout(cycle);
                }
            }
        },

        _play_steps: function (element)
        {
            let time = 0;
            this._steps[0].operation(element);
            for (let i = 1; i < this._steps.length; i++) {
                let prev_cur = this._steps[i];
                setTimeout(() => prev_cur.operation(element), time);

                time += prev_cur.duration
            }
        },

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn: function(element, duration)
        {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale: function(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        fadeOut: function(element, duration)
        {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide: function(element, duration) {
            this.addMove(duration*2/5, {x: 100, y: 20})
                .addFadeOut(duration*3/5)
                .play(element);

            return {
                reset: function () {
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            };
        },

        showAndHide: function (element, duration){
            this.addFadeIn(duration/3)
                .addDelay(duration/3)
                .addFadeOut(duration/3)
                .play(element);
        },

        heartBeating: function (element, duration){
            return this.addScale(2, 1.4)
                .addScale(duration, 1/1.4)
                .play(element, true)
        },

        buildHandler() {
            const obj = this;

            return function () {
                obj.play(this);
            }
        }
    }
}
