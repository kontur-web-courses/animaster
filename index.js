addListeners();

const anim = animaster();

function addListeners() {
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

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            anim.fadeOut(block, 5000);
        });
}

function animaster() {

    function MoveAndHide() {
        this.move(element, 400, 100);
        this.scale(element, 600, 0);
    }

    function ShowAndHide() {
        this.fadeIn(element, 500);
        setTimeout(500);
        this.fadeOut(element, 500);

    }

    function HeartBeating() {
        while (true){
            this.scale(element, 500, 1.4);
            this.scale(element, 500, (1/1.4));
        }

    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function FadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function FadeOut(element, duration){
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
    function Move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
    function Scale(element, duration, ratio) {
    element.style.transitionDuration =  `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
}

    return {
        move: function(element, duration, translation) {return Move(element, duration, translation)},
        scale: function(element, duration, ratio) {return Scale(element, duration, ratio)},
        fadeIn: function (element, duration) {return FadeIn(element, duration)},
        fadeOut: function (element, duration) {return FadeOut(element, duration)},
        moveAndHide: function (){return MoveAndHide()},
        showAndHide: function (){return ShowAndHide()},
        heartBeating: function (){return HeartBeating()}
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
