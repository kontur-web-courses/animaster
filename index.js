addListeners();
let animations = animaster();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animations.fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animations.addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animations.scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let controller = animations.moveAndHide(block, 1000);
            document.getElementById('moveAndHideReset')
                .addEventListener('click', function () {
                    controller.reset();
                });
        });

    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animations.showAndHide(block, 3000);
        });

    document.getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let controller = animations.heartBeating(block);
            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    controller.stop();
                });
        });

    document.getElementById('custom')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
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
}

function animaster() {
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

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
    }

    function resetMoveAndScale(element) {
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
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
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

        moveAndScale: function (element, duration, translation, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, ratio);
        },

        moveAndHide: function (element, duration) {
            return animaster().addMove(duration * 2 / 5, {x: 100, y: 20})
                .addFadeOut(duration * 3 / 5)
                .play(element);
            // return {
            //     reset: () => {
            //         resetFadeOut(element);
            //         resetMoveAndScale(element);
            //     }
            // };
        },
        showAndHide: function (element, duration) {
            return animaster().addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        heartBeating: function (element) {
            return animaster().addScale(500, 1.4)
                .addScale(500, 1)
                .play(element, true);
        },

        addMove: function (duration, translation) {
            let step = {
                name: "Move",
                duration: duration,
                translation: translation,
            };
            this._steps.push(step);
            return this;
        },

        addScale: function (duration, ratio) {
            let step = {
                name: "Scale",
                duration: duration,
                ratio: ratio,
            };
            this._steps.push(step);
            return this;
        },

        addFadeIn: function (duration) {
            let step = {
                name: "FadeIn",
                duration: duration
            };
            this._steps.push(step);
            return this;
        },

        addFadeOut: function (duration) {
            let step = {
                name: "FadeOut",
                duration: duration
            };
            this._steps.push(step);
            return this;
        },

        addDelay: function (duration) {
            let step = {
                name: "Delay",
                duration: duration
            };
            this._steps.push(step);
            return this;
        },


        play: function (element, cycled=false) {
            let innerPlay = () => {
                let s = 0;
                let allSteps = {};
                for (const step of this._steps) {
                    setTimeout(() => {
                        if (step.name === "Move") {
                            allSteps.translation = step.translation;
                        } else if (step.name === "Scale") {
                            allSteps.ratio = step.ratio;
                        } else if (step.name === "FadeIn") {
                            this.fadeIn(element, step.duration);
                            return;
                        } else if (step.name === "FadeOut") {
                            this.fadeOut(element, step.duration);
                            return;
                        }
                        this.moveAndScale(element, step.duration, allSteps.translation, allSteps.ratio);
                    }, s);
                    s += step.duration;
                }
            }

            if (cycled === true){
                let delay = this._steps.map(x => x.duration).reduce((partialSum, a) => partialSum + a, 0);
                var idInterval = setInterval(innerPlay, delay);
            } else{
                innerPlay();
            }

            return {
                stop: () => clearInterval(idInterval),
                reset: () => {

                }
            };
        }
    };
}