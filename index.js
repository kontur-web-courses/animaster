addListeners();

function addListeners() {
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

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            // animaster().move(block, 1000, {x: 100, y: 10});
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    let heartStop;
    document.getElementById('heartPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBlock');
            heartStop = animaster().heartBeating(block);
        });
    document.getElementById('heartStop')
        .addEventListener('click', function () {
            heartStop.stop();
        });

    let reset;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            reset = animaster().moveAndHide(block, 1000);
        });
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            reset.stop();
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

function AnimationStruct(animationName, durationMS, params) {
    this.animationName = animationName;
    this.durationMS = durationMS;
    this.params = params;
}

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
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

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },

        showAndHide(element, duration) {
            this.addFadeIn(duration/3);
            this.addDelay(duration/3);
            this.addFadeOut(duration/3);
            this.play(element);
        },

        heartBeating(element) {
            this.addScale(500, 1.4);
            this.addScale(500, 1);
            let f = () => {
                this.play(element);
            }
            f = f.bind(this)
            let id = setInterval(f, 1000);
            return {
                stop() {
                    clearInterval(id);
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

        delay(element, duration){

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
            this.addMove(2 * duration / 5, {x: 100, y: 20});
            this.addFadeOut(3 * duration / 5);
            this.play(element);

            return {
                stop() {
                    resetMoveAndScale(element);
                    resetFadeOut(element)
                }
            }
        },

        play(element) {
            let i = 0;
            let tick = () => {
                const {animationName, durationMS, params} = this._steps[i];
                this[animationName](element, durationMS, ...params);
                i += 1;
                if (i !== this._steps.length) {
                    setTimeout(tick, durationMS);
                }
            }
            tick = tick.bind(this);
            setTimeout(tick, 0)
        },

        addMove(duration, transition) {
            this._steps.push(new AnimationStruct("move", duration, [transition]));
            return this;
        },
        addScale(duration, ratio) {
            this._steps.push(new AnimationStruct("scale", duration, [ratio]));
            return this;
        },
        addFadeIn(duration) {
            this._steps.push(new AnimationStruct("fadeIn", duration, []));
            return this;
        },
        addFadeOut(duration) {
            this._steps.push(new AnimationStruct("fadeOut", duration, []));
            return this;
        },
        addDelay(duration) {
            this._steps.push(new AnimationStruct("delay", duration, []));
            return this;
        }
    }
}
