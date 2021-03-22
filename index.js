addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
            //animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
            //animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
            //animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
            //animaster().fadeOut(block, 5000);
        });

    let moveAndHideTimeout
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideTimeout = animaster().moveAndHide(block, 5000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            clearTimeout(moveAndHideTimeout)
            animaster().moveAndHideReset(block)
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingStopper = animaster().heartBeating(block, 1000);
        });
    let heartBeatingStopper
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeatingStopper.stop();
        });
}


function animaster(element, duration, ratio){
    function resetFadeIn(element){
        element.classList.remove('show');
        element.classList.add('hide');
        element.style.transitionDuration = null;
    }

    function resetFadeOut(element){
        element.classList.add('show');
        element.classList.remove('hide');
        element.style.transitionDuration = null;
    }

    function resetMoveAndScale(element){
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn: function (element, duration)
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
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        /**
         * Блок становится прозрачным.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut: function (element, duration)
        {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide: function (element, duration) {
            //this.move(element, duration/5*2, {x: 100, y: 20});

            this.addMove(duration/5*2, {x: 100, y: 20}).addFadeOut(duration/5*3).play(element);

            //return setTimeout(this.fadeOut, duration/5*2, element, duration/5*3);
        },
        moveAndHideReset: function (element) {
            resetMoveAndScale(element);
            resetFadeOut(element);
        },

        showAndHide: function (element, duration) {
            this.fadeIn(element, duration/3)
            setTimeout(this.fadeOut, duration/3*2, element, duration/3)
        },

        heartBeating: function (element, duration) {
            let id1
            let id2
            id1 = setInterval(()=>this.scale(element, duration/2, 1.4), duration)
            setTimeout(
                () => id2 = setInterval(()=>this.scale(element, duration/2, 1), duration),
                duration/2)
            return {stop: function(){clearInterval(id1); clearInterval(id2)}}
        },

        addMove: function (duration, translation){
            this._steps.push({
                name: 'move',
                duration,
                translation,
            });
            return this;
        },
        addScale: function (duration, ratio){
            this._steps.push({
                name: 'scale',
                duration,
                ratio,
            });
            return this;
        },
        addFadeIn: function (duration){
            this._steps.push({
                name: 'fadeIn',
                duration,
            });
            return this;
        },
        addFadeOut: function (duration){
            this._steps.push({
                name: 'fadeOut',
                duration,
            });
            return this;
        },

        play: function (element) {
            this._pl(0, element);
        },

        _pl: function(i, element){
            let step = this._steps[i]
            switch (step.name) {
                case 'move':
                    this.move(element, step.duration, step.translation);
                    if (i < this._steps.length - 1){
                        setTimeout(()=>this._pl(i+1, element), step.duration);
                    }
                    break;
                case 'scale':
                    this.scale(element, step.duration, step.ratio);
                    if (i < this._steps.length - 1){
                        setTimeout(()=>this._pl(i+1, element), step.duration);
                    }
                    break;
                case 'fadeIn':
                    this.fadeIn(element, step.duration);
                    if (i < this._steps.length - 1){
                        setTimeout(()=>this._pl(i+1, element), step.duration);
                    }
                    break;
                case 'fadeOut':
                    this.fadeOut(element, step.duration);
                    if (i < this._steps.length - 1){
                        setTimeout(()=>this._pl(i+1, element), step.duration);
                    }
                    break;
            }
        },
        _steps: [],
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
