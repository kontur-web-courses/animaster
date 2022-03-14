addListeners();

function addListeners() {
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
            this.addMove(duration, translation).play(element);
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
            element.classList.add('hide');
            element.classList.remove('show');
        },

        moveAndHide(element, duration) {
            this.move(element, duration * 0.4, {x: 100, y: 20})
            const timeoutInterval = setTimeout(() => this.fadeOut(element, duration * 0.6), duration * 0.4)
            return {
                stop() {
                    clearTimeout(timeoutInterval);
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            }
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration * 1 / 3)
            setTimeout(() => this.fadeOut(element, duration * 1 / 3), 1000)
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
            this._steps.push((element) => {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(translation, null);
            });
            return this;
        },

        play(element) {
            for (let func of this._steps){
                func(element);
            }
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
