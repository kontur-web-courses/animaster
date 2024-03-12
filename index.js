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
            animaster().fadeOut(block, 1000, 1.25);
        });

    document.getElementById('showAndHidePlay')
    .addEventListener('click', function () {
        const block = document.getElementById('showAndHideBlock');
        animaster().showAndHide(block, 1000, 1.25);
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

    document.getElementById('heartBeatingPlay')
    .addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        animaster().heartBeating(block, 1000, 1.25);
    });

    document.getElementById('moveAndHidePlay')
    .addEventListener('click', function () {
        const block = document.getElementById('moveAndHideBlock');
        animaster().moveAndHide(block, 1000, {x: 100, y: 20});
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

function animaster() {
    return {
/**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        /**
         * Блок плавно становится прозрачным.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide: function (element, duration, translation){
            let hideFunction = function(){
                element.style.transitionDuration = `${3*duration/5}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }
            element.style.transitionDuration = `${2*duration/5}ms`;
            element.style.transform = getTransform(translation, null);
            setTimeout(hideFunction, 2*duration/5);
        },

        showAndHide: function (element, duration){
            element.style.transitionDuration = `${duration/3}ms`;
            element.classList.remove('hide');
            element.classList.add('show');

            let showFunction = function(){
                element.style.transitionDuration = `${duration/3}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }
            setTimeout(showFunction, duration/3)
        },

        heartBeating: function (element, duration, ratio){
            let intervalFunction = function(){
                element.style.transitionDuration = `${duration/2}ms`;
                element.style.transform = getTransform(null, ratio);
                let scaleFunction = function(){
                    element.style.transitionDuration = `${duration/2}ms`;
                    element.style.transform = getTransform(null, 1/ratio);
                }
                setTimeout(scaleFunction, duration/2)
                setTimeout(intervalFunction, 1000)
            }
            
            intervalFunction();
        }
    }
}