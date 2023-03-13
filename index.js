addListeners();

function addListeners() {
    let hb;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster()
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
    document.getElementById('heartBreathPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBreathBlock');

            let hb = animaster().heartBreath(block);

            document.getElementById('heartBreathStop')
                .addEventListener('click', function () {
                    hb.Reset();
                });
        });
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().reset(block);
        });


}

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
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
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        /**
         * Блок плавно пропадает.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
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

        moveAndHide(element, duration) {
            animaster().addMove(duration * 2 / 5, {x: 100, y: 20})
                .addFadeOut(duration * 3 / 5)
                .play(element);
        },

        showAndHide(element, duration) {
            animaster().addFadeIn(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        heartBreath(element) {
            let refreshIntervalId = setInterval(() => {
                animaster().addScale(500, 1.4)
                    .addScale(500, 1).play(element);
            }, 1000);

            return {
                Reset() {
                    clearInterval(refreshIntervalId);
                }
            }
        },
        reset(element) {
            resetFadeOut(element);
            resetMoveAndScale(element);
        },
        addMove(duration, param) {
            this._steps.push({act: this.move, duration: duration, param: param})
            return this;
        },
        addScale(duration, ratio) {
            this._steps.push({act: this.scale, duration: duration, param: ratio})
            return this;
        },
        addFadeIn(duration) {
            this._steps.push({act: this.fadeIn, duration: duration})
            return this;
        },
        addFadeOut(duration) {
            this._steps.push({act: this.fadeOut, duration: duration})
            return this;
        },
        play(element) {
            let totalDuration = 0;
            for (let step of this._steps) {
                totalDuration += step.duration;
                setTimeout(() => {
                    step.act(element, step.duration, step.param)
                }, totalDuration);
            }
        },

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

    // function resetFadeIn(element) {
    //     element.classList.add('hide');
    //     element.classList.remove('show');
    // }
    //
    // function resetFadeOut(element) {
    //     element.classList.remove('hide');
    //     element.classList.add('show');
    // }
    //
    // function resetMoveAndScale(element){
    //     animaster().move(element, 0, {x: -100, y: -20});
    //     resetFadeOut(element);
    // }
}
