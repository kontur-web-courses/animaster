addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            if (block.classList.contains('hide'))
                animaster().fadeIn(block, 5000);
            else
                animaster().fadeOut(block, 5000);
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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let stopButton = document.getElementById('moveAndHideRest');
            let restObj = animaster().moveAndHide(block, 3000);
            stopButton.disabled = false;
            stopButton.addEventListener('click', function (){
                restObj.rest();
                stopButton.disabled = true;
                stopButton.removeEventListener('click', arguments.callee)
            });
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let stopper = animaster().heartBeating(block);
            let stopButton = document.getElementById('heartBeatingStop');
            stopButton.disabled = false;
            stopButton.addEventListener('click', function (){
                stopper.stop();
                stopButton.disabled = true;
                stopButton.removeEventListener('click', arguments.callee);
            });
        });
}

function animaster() {
    let resetFadeIn = (element) => {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    let resetFadeOut = (element) => {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    let resetMoveAndScale = (element) => {
        element.style.transform = null;
        element.style.transitionDuration = null;
    }
    return {
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
         * Блок плавно уходит в прозрачный.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
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

        /**
         * Функция, передвигающая и прячущая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        moveAndHide(element, duration) {
            this.move(element, duration * 0.4, {x: 100, y: 20})
            let timeout = setTimeout(this.fadeOut, duration * 0.4, element, duration * 0.6);
            return {
                rest() {
                    clearTimeout(timeout);
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            }
        },

        /**
         * Функция, показывающая затем прячущая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3)
            setTimeout(this.fadeOut, 2 * duration / 3, element, duration / 3)
        },

        /**
         * Функция, включающая анимацию сердцебиения
         * @param element — HTMLElement, который надо анимировать
         */
        heartBeating(element) {
            let heartBeat = () => {
                this.scale(element, 500, 1.4);
                setTimeout(this.scale, 500, element, 500, 1)
            }
            heartBeat();
            let interval = setInterval(heartBeat, 1200);
            return {
                stop(){
                    clearInterval(interval);
                }
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
