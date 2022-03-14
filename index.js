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
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block, 500);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            window.khren3.stop();
        });
}

function animaster(){
    return {
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
        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide: function (element, duration) {
            let translation = {x: 100, y: 20};
            element.style.transitionDuration = `${duration * 0.4}ms`;
            element.style.transform = getTransform(translation, null);
            setTimeout((d)=>{
                element.style.transitionDuration = `${d}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }, duration * 0.4, duration * 0.6);
        },
        showAndHide: function (element, duration) {
            element.style.transitionDuration = `${duration / 3}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            setTimeout((d)=>{
                element.style.transitionDuration = `${d}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }, duration / 3, duration / 3);
        },
        heartBeating: function (element, duration) {
            let khren2 = "";
            let khren = setInterval(()=>{
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(null, 7/5);
            }, duration);
            setTimeout(()=>{
                 khren2 = setInterval(()=>{
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = getTransform(null, 5/7);
                }, duration)
            }, duration/2)
            window.khren3 = {stop : ()=>{
                clearInterval(khren);
                clearInterval(khren2);
            }}
        }
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