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
            animaster().moveAndHide(block, 5000, {x: 100, y: 20});
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });
    let heart = animaster().heartBeating(document.getElementById('heartBeatingBlock'), 1.4);
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            heart.play();
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heart.stop();
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

function animaster(){
    return {
        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move: function(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn: function(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale: function(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeOut: function(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide: function(element, duration, translation){
            element.style.transitionDuration = `${duration*2/5}ms`;
            element.style.transform = getTransform(translation, null);
            setTimeout(() => {
                element.style.transitionDuration =  `${duration*3/5}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            },duration*2/5)
        },
        showAndHide: function(element, duration){
            element.style.transitionDuration =  `${duration/3}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            setTimeout(() => {
                element.style.transitionDuration =  `${duration/3}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            },duration/3)
        },
        heartBeating: function(element, ratio){
            let idInterval = 0;
            return {
                play: function() {
                    idInterval = setInterval(() => {
                        element.style.transitionDuration = `${500}ms`;
                        element.style.transform = getTransform(null, ratio);
                        setTimeout(() => {
                            element.style.transitionDuration = `${500}ms`;
                            element.style.transform = getTransform(null, 1);
                            }, 500)
                    }, 1000)
                },
                stop: function() {
                    clearInterval(idInterval);
                }
            }
        }
    }
}
