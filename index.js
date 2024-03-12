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
    animaster().moveAndHide(block, 5000);
    });

    document.getElementById('showAndHidePlay')
    .addEventListener('click', function () {
    const block = document.getElementById('showAndHideBlock');
    animaster().showAndHide(block, 5000);
    });

    document.getElementById('heartBeatingPlay')
    .addEventListener('click', function () {
    const block = document.getElementById('heartBeatingBlock');
    animaster().heartBeating(block);
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
    return{
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

        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
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

        moveAndHide(element, duration) {
            this.move(element, duration * 2 / 5, {x:100, y:20});
            this.fadeOut(element, duration * 3 / 5);
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3)
            setTimeout(this.fadeOut, duration / 3, element, duration / 3)
        },

        heartBeating(element) {
            function beat(element){
                animaster().scale(element, 500, 1.4);
                setTimeout(animaster().scale, 500, element, 500, 1)
            }
            setInterval(beat, 1000, element);
        }
}
}
