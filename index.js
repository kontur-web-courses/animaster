addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const cancel = animaster().addMove(400, {
                'x': 100,
                'y': 20
            }).addFadeOut(600).play(block).stop;

            document.getElementById('moveAndHideReset').addEventListener('click', cancel);
        });

    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().addFadeIn(1000 / 3).addDelay(1000 / 3).addFadeOut(1000 / 3).play(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let cancel = animaster().heartBeating(block).stop;
            document.getElementById('heartBeatingStop').addEventListener('click', cancel);
        });

    document.getElementById('fullAnimation').addEventListener('click', function () {
        const customAnimation = animaster()
            .addMove(200, {x: 40, y: 40})
            .addScale(800, 1.3)
            .addMove(200, {x: 80, y: 0})
            .addScale(800, 1)
            .addMove(200, {x: 40, y: -40})
            .addScale(800, 0.7)
            .addMove(200, {x: 0, y: 0})
            .addScale(800, 1);

        const block = document.getElementById('fullAnimation');
        const cancel = customAnimation.play(block).stop;
        document.getElementById('fullAnimationStop').addEventListener('click', cancel);
    });
}

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = getTransform(null, null);

    }

    return {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
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

        moveAndHide: function (element, duration) {
            this.move(element, (duration / 5) * 2, {'x': 100, 'y': 20});
            let timeout = setTimeout(() => this.fadeOut(element, (duration / 5) * 3), (duration / 5) * 2);

            return {
                'stop': function () {
                    clearInterval(timeout);
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            };
        },

        showAndHide: function (element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
        },

        heartBeating: function (element) {
            let anim = this;
            let id1 = setInterval(() => anim.scale(element, 500, 1.4), 500);
            let id2 = setInterval(() => anim.scale(element, 500, 1), 1000);

            return {
                stop: function () {
                    clearInterval(id1);
                    clearInterval(id2);
                }
            };
        },

        delay: function () {

        },

        _steps: [],
        addMove: function (duration, pos) {
            this._steps.push({
                oper: 'move',
                duration: duration,
                params: pos,
                cancel: resetMoveAndScale,
            });

            return this;
        },

        addScale: function (duration, scale) {
            this._steps.push({
                oper: 'scale',
                duration: duration,
                params: scale,
                cancel: resetMoveAndScale,
            });

            return this;
        },

        addFadeIn: function (duration) {
            this._steps.push({
                oper: 'fadeIn',
                duration: duration,
                params: undefined,
                cancel: resetFadeIn,
            });

            return this;
        },

        addFadeOut: function (duration) {
            this._steps.push({
                oper: 'fadeOut',
                duration: duration,
                params: undefined,
                cancel: resetFadeOut,
            });

            return this;
        },

        addDelay: function (duration) {
            this._steps.push({
                oper: 'delay',
                duration: duration,
                params: undefined,
            });

            return this;
        },


        play: function (element) {
            let dur = 0;
            let cancelCalls = [];
            let timeouts = [];
            for (const step of this._steps) {
                console.log(`step: ${JSON.stringify(step)}`);
                let meth;
                switch (step.oper) {
                    case 'move':
                        meth = this.move;
                        break;
                    case 'scale':
                        meth = this.scale;
                        break;
                    case 'fadeOut':
                        meth = this.fadeOut;
                        break;
                    case 'fadeIn':
                        meth = this.fadeIn;
                        break;
                    case 'delay':
                        meth = this.delay;
                        break;
                    default:
                        throw new TypeError(`Unknown step type: ${step}`);
                }

                dur += step.duration;
                timeouts.push(setTimeout(() => meth(element, step.duration, step.params), dur));
                if (step.cancel !== undefined) {
                    cancelCalls.push(step.cancel);
                }
            }

            return {
                stop: function () {
                    for (const timeout of timeouts) {
                        clearTimeout(timeout);
                    }

                    for (const call of cancelCalls) {
                        call(element);
                    }
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
