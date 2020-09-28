addListeners();

function animaster(){
    return {

        #resetFadeIn(element){
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        #resetFadeOut(element){
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        #resetMove(element){
            element.style.transitionDuration =  null;
            element.style.transform = null;
        },
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

        moveAndHide(element, duration){
            this.move(element, duration * 2 / 5, {x: 100, y: 20});
            setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5);
            return {
                reset(){
                    this.#resetMove(element);
                    this.#resetFadeOut(element);
                }
            }
        },

        showAndHide(element, duration){
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
            setTimeout(() => this.fadeIn(element, duration / 3), duration * 2 / 3);
        },

        heartBeating(element, duration){
            let timer = setInterval(() => {
                this.scale(element, duration, 1.4);
                setTimeout(() => this.scale(element, duration, 1), duration);
            }, duration * 2);
            return {
                stop(){
                    clearInterval(timer);
                }
            }
        },

        #_steps : [],
        #_translation : {},

        addMove(duration, translation){
            this.#_translation = translation;
            this.#_steps.push({
                duration: duration,
                nowTranslation : {x: 0, y:0}
            })
            return this;
        },

        play(element){
            
        }
    }
}

function addListeners() {
    let anim = animaster();
    let isHiden = true;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            if(isHiden)
                anim.fadeIn(block, 5000);
            else
                anim.fadeOut(block, 5000);
            isHiden = !isHiden;
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

    let resetMoveAndHide;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndHide = anim.moveAndHide(block, 5000);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim.showAndHide(block, 3000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndHide.reset();
        });
    let stopHeart;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopHeart = anim.heartBeating(block, 500);
        });
        document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopHeart.stop();
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
