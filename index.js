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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animasterObj.moveAndHide(block, 1000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animasterObj.moveAndHideReset(block);
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
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах, 2/5 времени элемент движется, а 3/5 - исчезает
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        moveAndHide(element, duration, translation = { x: 100, y: 20}) {
            this.move(element, duration * 2 / 5, translation);
            setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5);
        },

        moveAndHideReset(element) {
            resetFadeOut(element);
            resetMoveAndScale(element);
        },

        beatingElements: new Map(),

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         */
        heartbeating(element) {
            if (this.beatingElements.has(element)) {
                return this.beatingElements.get(element);
            }

            const heartbeatAnimation = () => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1); 
                }, 500);
            };

            heartbeatAnimation();
            const timer = setInterval(heartbeatAnimation, 1000);

            const stopFunc = () => {
                clearInterval(timer);
                this.beatingElements.delete(element);
            };
            const stopper = {
                stop: stopFunc.bind(this)
            };
            this.beatingElements.set(element, stopper);

            return stopper;
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
