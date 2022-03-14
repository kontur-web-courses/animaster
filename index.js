addListeners();


function animaster() {

    let resetFadeIn = (element) => {
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
    };

    let resetFadeOut = (element) => {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    };
    let resetMove = (element, translation) => {
        element.style.transitionDuration = null;
        element.style.transform = getTransform({x: 0, y: 0}, null)
    };
    return {
        operations: [],
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
         * Блок плавно исчезает.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide(element, duration, translation)
        {
            this.move(element, duration * 2 / 5, translation);
            setTimeout(this.fadeOut, duration * 2 /5, element, duration * 3 / 5);
            return {
                reset() {
                    resetMove(element, translation);
                    resetFadeOut(element);
                }
            };
        },

        showAndHide(element, duration)
        {
            this.fadeIn(element, duration / 3);
            setTimeout(this.fadeOut, duration * 2 / 3, element, duration / 3);
        },

        heartBeating(element, duration, ratio)
        {
            let beat = setInterval(() => {
                this.scale(element, duration / 2, ratio);
                setTimeout(this.scale, duration / 2, element, duration / 2, 1 / ratio)
            }, duration);
            return {
                stop() { clearInterval(beat) }
            };
        },
    }
}

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            scale(block, 1000, 1.25);
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
