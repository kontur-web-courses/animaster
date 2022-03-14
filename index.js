addListeners();

function addListeners() {
    const customAnimation = animaster()
        .addMove(200, {x: 40, y: 40})
        .addScale(800, 1.3)
        .addMove(200, {x: 80, y: 0})
        .addScale(800, 1)
        .addMove(200, {x: 40, y: -40})
        .addScale(800, 0.7)
        .addMove(200, {x: 0, y: 0})
        .addScale(800, 1);

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 1000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            const stop = animaster().heartBeating(block);
            document.getElementById('showAndHideStop')
                .addEventListener('click', stop.stop)
        })


    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const moveAndHideAnimation = animaster().moveAndHide(block, 1000);

            document.getElementById('moveAndHideStop')
                .addEventListener('click', moveAndHideAnimation.stop)
        })

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        })


    document.getElementById('customPlay1')
        .addEventListener('click', function () {
            const block = document.getElementById('custom1');
            console.log('hi');
            customAnimation.play(block);
        })

    document.getElementById('customPlay2')
        .addEventListener('click', function () {
            const block = document.getElementById('custom2');
            console.log('hi22')
            customAnimation.play(block);
        })
}

function animaster() {
    const resetFadeIn = (element) => {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    const resetFadeOut = (element) => {
        element.style.transitionDuration = null;
        element.classList.add('show');
        element.classList.remove('hide');
        console.log('hi');
    }


    const resetMoveAndScale = (element) => {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }


    return {
        _steps: [],

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            this.addFadeIn(duration).play(element);
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            this.addMove(duration, translation).play(element);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            this.addScale(duration, ratio).play(element);
        },

        fadeOut(element, duration) {
            this.addFadeOut(duration).play(element);
        },

        moveAndHide(element, duration) {
            this.addMove(duration * 0.4, {x: 100, y: 20})
                .addFadeOut(duration * 0.6)
                .play(element);
            return {
                stop() {
                    // clearTimeout(timeoutInterval);
                    // resetMoveAndScale(element);
                    // resetFadeOut(element);
                }
            }
        },

        showAndHide(element, duration) {
            this.addFadeIn(duration * 1 / 3)
                .addDelay(duration * 1 / 3)
                .addFadeOut(duration * 1 / 3)
                .play(element);
        },

        heartBeating(element) {
            const heartBeatStep = () => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1);
                }, 500);
            }

            heartBeatStep();
            const intervalId = setInterval(() => {
                heartBeatStep();
            }, 1500);
            return {
                stop() {
                    clearInterval(intervalId);
                }
            }
        },


        addMove(duration, translation) {
            const step = {
                duration,
                play(element) {
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = getTransform(translation, null);
                },
                reset: (element) => resetMoveAndScale(element),
            }

            this._steps.push(step);
            return this;
        },

        addScale(duration, ratio) {
            const step = {
                duration,
                play(element) {
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = getTransform(null, ratio);
                },
                reset: (element) => resetMoveAndScale(element),
            }

            this._steps.push(step);
            return this;
        },

        addFadeIn(duration) {
            const step = {
                duration,
                play(element) {
                    element.style.transitionDuration = `${duration}ms`;
                    element.classList.remove('hide');
                    element.classList.add('show');
                },
                reset: (element) => resetFadeIn(element),
            }

            this._steps.push(step);
            return this;
        },

        addFadeOut(duration) {
            const step = {
                duration,
                play(element) {
                    element.style.transitionDuration = `${duration}ms`;
                    element.classList.add('hide');
                    element.classList.remove('show');
                },
                reset: (element) => resetFadeOut(element),
            }

            this._steps.push(step);
            return this;
        },

        play(element) {
            const player = (i) => {
                if (i >= this._steps.length) return

                this._steps[i].play(element);
                setTimeout(() => {
                    player(i + 1);
                }, this._steps[i].duration);
            }

            player(0);
        },


        addDelay(duration) {
            const step = {
                duration,
                play(element) {

                },
                reset: (element) => null
            }

            this._steps.push(step);
            return this;
        },
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
