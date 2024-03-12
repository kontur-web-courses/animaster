addListeners();

function addListeners() {
    const animasterObj = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animasterObj.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animasterObj.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animasterObj.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animasterObj.scale(block, 1000, 1.25);
        });

    let resetter;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetter = animasterObj.showAndHide(block, 1000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            resetter.reset();
        });
    
    let stopper;
    document.getElementById('heartbeatingPlay')
        .addEventListener('click', function () {
            if (stopper !== undefined) {
                stopper.stop();
                stopper = undefined;
            } else {
                const block = document.getElementById('heartbeatingBlock');
                stopper = animasterObj.heartbeating(block);
            }
        });
    
    const customAnimation = animaster()
        .addMove(200, {x: 40, y: 40})
        .addScale(800, 1.3)
        .addMove(200, {x: 80, y: 0});
        // .addScale(800, 1)
        // .addMove(200, {x: 40, y: -40})
        // .addScale(800, 0.7)
        // .addMove(200, {x: 0, y: 0})
        // .addScale(800, 1);
    document.getElementById('customPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
            customAnimation.play(block);
        });
}

function animaster() {

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
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

        play(element) {
            let timer;
            let resetter;

            function innerPlay(steps, index) {
                if (index === steps.length - 1)
                    return (element) => steps[index].action(element);
                return (element) => {
                    steps[index].action(element);
                    resetter = setTimeout(() => innerPlay(steps, index + 1)(element), steps[index].timeout);
                }
            }

            innerPlay(this._steps, 0)(element);

            return {
                stop() {

                },

                reset() {
                    clearTimeout(resetter);
                }
            }
        },

        addMove(duration, translation) {
            const actionFunc = (element) => this.move(element, duration, translation);
            this._steps.push({
                timeout: duration,
                action: actionFunc.bind(this)
            });
            return this;
        },

        addScale(duration, ratio) {
            const actionFunc = (element) => this.scale(element, duration, ratio);
            this._steps.push({
                timeout: duration,
                action: actionFunc.bind(this)
            });
            return this;
        },

        addFadeIn(duration) {
            const actionFunc = (element) => this.fadeIn(element, duration);
            this._steps.push({
                timeout: duration,
                action: actionFunc.bind(this)
            });
            return this;
        },

        addFadeOut(duration) {
            const actionFunc = (element) => this.fadeOut(element, duration);
            this._steps.push({
                timeout: duration,
                action: actionFunc.bind(this)
            });
            return this;
        },

        addDelay(duration) {
            const actionFunc = (element) => {};
            this._steps.push({
                timeout: duration,
                action: actionFunc.bind(this)
            });
            return this;
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

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform += getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform += getTransform(null, ratio);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах, 2/5 времени элемент движется, а 3/5 - исчезает
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        moveAndHide(element, duration, translation = { x: 100, y: 20}) {
            let ultimateAbort = this.addMove(duration * 2 / 5, translation).addFadeOut(duration * 3 / 5).play(element);
            this._steps = [];
            return {
                reset() {
                    ultimateAbort.reset();
                    resetFadeOut(element);
                    resetMoveAndScale(element);
                }
            };
        },

        showAndHide(element, duration) {
            let ultimateAbort = this.addFadeIn(duration / 3).addDelay(duration / 3).addFadeOut(duration / 3).play(element);
            this._steps = [];
            return {
                reset() {
                    ultimateAbort.reset();
                    resetFadeOut(element);
                }
            };
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         */
        heartbeating(element) {
            const heartbeatAnimation = () => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1); 
                }, 500);
            };

            heartbeatAnimation();
            const timer = setInterval(heartbeatAnimation, 1000);

            return {
                stop() {
                    clearInterval(timer);
                }
            };
        }
    };
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
