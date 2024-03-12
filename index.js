addListeners();

const ANIMASTER = animaster()

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            ANIMASTER.fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            ANIMASTER.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            ANIMASTER.scale(block, 1000, 1.25);
        });
    document.getElementById('hearhBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('hearhBeatingBlock');
            ANIMASTER.heartBeating(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            ANIMASTER.moveAndHide(block, 1000)
        })
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            ANIMASTER.showAndHide(block, 5000)
        })
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

function animaster() {
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function moveAndHide(element, duration) {
        move(element, duration * 2 / 5, {x: 100, y: 20});
        fadeOut(element, duration * 3 / 5);
    }

    function showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(() => fadeOut(element, duration / 3), duration / 3);
    }

    function heartBeating(element) {
        const duration = 500
        const pulseOut = 1.4
        const pulseIn = 1.0

        setInterval(this.scale, 500, element, duration, pulseOut)
        setInterval(this.scale, 1000, element, duration, pulseIn)

    }


    const result = {};
    result.scale = scale;
    result.fadeIn = fadeIn;
    result.move = move;
    result.fadeOut = fadeOut;
    result.moveAndHide = moveAndHide;
    result.showAndHide = showAndHide;
    result.heartBeating = heartBeating;
    return result;
}


