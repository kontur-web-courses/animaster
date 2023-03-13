addListeners();

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

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            fadeOut(block, 1000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide(block, 1000, {x: 100, y: 20});
        });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
function fadeIn(element, duration) {
    animaster().fadeIn(element, duration);
}

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */
function move(element, duration, translation) {
    animaster().move(element, duration, translation);
}

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
function scale(element, duration, ratio) {
    animaster().scale(element, duration, ratio);
}

function getTransform(translation, ratio) {
    animaster().getTransform(translation, ratio);
}

function fadeOut(element, duration) {
    animaster().fadeOut(element, duration);
}

function moveAndHide(element, duration, translation) {
    animaster().moveAndHide(element, duration, translation);
}

function animaster(){
    return {
        fadeIn: function(element, duration){
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        move: function(element, duration, translation){
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale: function(element, duration, ratio){
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        getTransform: function(translation, ratio){
            const result = [];
            if (translation) {
                result.push(`translate(${translation.x}px,${translation.y}px)`);
            }
            if (ratio) {
                result.push(`scale(${ratio})`);
            }
            return result.join(' ');
        },
        fadeOut: function(element, duration){
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide: function(element, duration, translation){
            this.move(element, duration * 2/5, translation)
            this.fadeOut(element, duration * 3/5, translation)
        },
        showAndHide: function (element, duration){
            this.fadeIn(element, duration * 1/3)
            setTimeout(function() {
            }, duration * 1/3);
            this.fadeOut(element, duration * 1/3)
        }
    }
}
