addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);

            setTimeout(() => animaster().resetFadeIn(), 3000); //проверка
        });  
        
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let anim = animaster().moveAndHide(block, 1000, {x: 100, y: 20});;
            document.getElementById('moveAndHideStop')
                .addEventListener('click', function () {
                    anim.reset();
                });
        });
    
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let anim = animaster().heartBeating(block, 500, 1.4);
            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    anim.stop();
                });
        });
}

function animaster(){
    function resetFadeIn(element){
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element){
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element){
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

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
        
        /**
        * Функция, передвигающая элемент с постепенным его исчезновением
        * @param element — HTMLElement, который надо анимировать
        * @param duration — Продолжительность анимации в миллисекундах
        * @param translation — объект с полями x и y, обозначающими смещение блока
        */
        moveAndHide(element, duration, translation){
            this.move(element, duration * 2 / 5, translation);
            setTimeout(()=>this.fadeOut(element, duration * 3 / 5),duration * 2 / 5);
            return {
                reset(){
                    resetFadeOut(element);
                    resetMoveAndScale(element);
                },
            }
        },
        
        /**
        * Функция, показывающая и скрывающая элемент
        * @param element — HTMLElement, который надо анимировать
        * @param duration — Продолжительность анимации в миллисекундах
        */
        showAndHide(element, duration){
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration * 2 / 3);
        },

        /**
        * Функция, имитирующая сердцебиение
        * @param element — HTMLElement, который надо анимировать
        * @param duration — Продолжительность анимации в миллисекундах
        * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
        */
        heartBeating(element, duration, ratio){
            let timer = setInterval(() => {
                this.scale(element, duration, ratio);
                setTimeout(() => this.scale(element, duration, 1), duration);
            }, duration * 2);
            return {
                stop(){
                    clearInterval(timer);
                },
            }
        },
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
