addListeners();

function addListeners() {
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
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut( 1000, 1.25).play(block);
        });

    let moveAndHideResetter;

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideResetter = animaster().moveAndHide(block, 1000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            moveAndHideResetter.reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    let beatingStopper;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            beatingStopper = animaster().heartBeating(block, 1000);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            beatingStopper.stop();
        });

    let customAnimation = animaster()
        .addMove(200, {x: 40, y: 40})
        .addScale(800, 1.3)
        .addMove(200, {x: 80, y: 0})
        .addScale(800, 1)
        .addMove(200, {x: 40, y: -40})
        .addScale(800, 0.7)
        .addMove(200, {x: 0, y: 0})
        .addScale(800, 1);

    document.getElementById('customAnimationTest1Play')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationTest1Block');
            customAnimation.play(block);
        });

    document.getElementById('customAnimationTest2Play')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationTest2Block');
            customAnimation.play(block);
        });
}

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    };

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    };


    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    };

    return {
        _steps: [],

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
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide(element, duration) {
            this.move(element, duration * (2 / 5), {x: 100, y: 20});
            setTimeout(() => (this.fadeOut(element, duration * (3 / 5))), duration * (2 / 5));
            return {
                reset() {
                    resetFadeOut(element);
                    resetMoveAndScale(element);
                }
            }
        },

        showAndHide(element, duration) {
            this.fadeIn(element, (1 / 3) * duration);
            setTimeout(() => (this.fadeOut(element, (1 / 3) * duration)), (2 / 3) * duration);
        },

        heartBeating(element) {
            let beatingId = setInterval(() => {
                this.scale(element, 500, 1.4);
                setTimeout(() => this.scale(element, 500, 1 / 1.4), 500);
            }, 1000);

            return {
                stop() {
                    clearInterval(beatingId);
                }
            }
        },

        addMove(duration, coordinates) {
            this._steps.push({name: 'move', duration, coordinates});
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({name: 'fadeIn', duration});
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({name: 'fadeOut', duration});
            return this;
        },

        addScale(duration, ratio){
            this._steps.push({name: 'scale', duration, ratio});
            return this;
        },

        play(element) {
            function playStep(step){
                switch (step.name) {
                    case 'move':
                        this.move(element, step.duration, step.coordinates);
                        break;
                    case 'fadeIn':
                        this.fadeIn(element, step.duration);
                        break;
                    case 'fadeOut':
                        this.fadeOut(element, step.duration);
                        break;
                    case 'scale':
                        this.scale(element, step.duration, step.ratio);
                        break;
            }
            playStep(this._steps[0]);
            for (let i = 1; i < this._steps.length; i++) {
                    setTimeout(() => {playStep(this._steps[i])}, this._steps[i - 1].duration);
                }
            }
        }
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
