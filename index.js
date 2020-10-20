addListeners();

function animaster() {
    const animations = {};

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    animations.fadeIn = (element, duration) => {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    };
    /**
     * Блок плавно исчезает.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    animations.fadeOut = (element, duration) => {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    };

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    animations.move = (element, duration, translation) => {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    };

    animations.showAndHide = (block, duration) => {
        const animationDurationThird = duration / 3;
        animations.fadeIn(block, animationDurationThird);
        setTimeout(() => animations.fadeOut(block, animationDurationThird), animationDurationThird);
    };

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    animations.scale = (element, duration, ratio) => {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    };

    animations.moveAndHide = (element, duration , ratio) => {
        const firstAnimationDuration = duration * 2 / 5;
        const secondAnimationDuration = duration * 3 / 5;
        animations.move(element, firstAnimationDuration, ratio);
        setTimeout(() => {
            animations.fadeOut(element, secondAnimationDuration);
        }, firstAnimationDuration);
    };

    animations.heartBeating = (element, duration, ratio) => {
        const durationHalf = duration / 2;
        const heartBeatInterval = setInterval(() => {
            animations.scale(element, durationHalf, ratio);
            setTimeout(() => {
                animations.scale(element, durationHalf, 1);
            }, durationHalf);
        }, duration);

        return {
            stop() {
                clearInterval(heartBeatInterval);
            }
        };
    }

    return animations;
}

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 3000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 3000, {x: 200, y: 20});
        });

    let heartBeating;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeating = animaster().heartBeating(block, 1000, 1.4);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeating.stop()
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
