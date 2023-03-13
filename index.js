addListeners();

function animaster(){
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
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
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function moveAndHide(element, duration){
        element.style.transitionDuration = `${duration * 0.4}ms`;
        let trans = {x: 100, y:20}
        element.style.transform = getTransform(trans, null);

        setTimeout(() => {
            element.style.transitionDuration =  `${duration * 0.6}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        }, duration * 0.4)
    }

    function showAndHide(element, duration){
        element.style.transitionDuration = `${duration * 0.33}ms`;
        element.classList.remove('hide');
        element.classList.add('show');

        setTimeout(null, duration * 0.33);

        setTimeout(() => {
            element.style.transitionDuration =  `${duration * 0.33}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        }, duration * 0.66)
    }

    function heartBeating(element){
        let interval = setInterval(() => {
            element.style.transitionDuration = `${500}ms`;
            element.style.transform = getTransform(null, 1.4);
            setTimeout(() => {
                element.style.transitionDuration = `${500}ms`;
                element.style.transform = getTransform(null, 1);
            }, 500)
        }, 1000);
        return {stop: () => clearInterval(interval)};
    }

    return {scale, move, fadeIn, fadeOut, showAndHide, heartBeating, moveAndHide}
}

function addListeners() {
    let anim = animaster()
    let stopHb;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim.fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            anim.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anim.scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim.showAndHide(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopHb = anim.heartBeating(block, 5000);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopHb.stop();
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
