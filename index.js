addListeners();

function addListeners() {
    let a,b;
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
            b = animaster().moveAndHide(block, 5000, {x: 100, y: 20});
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            b.reset(block);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            a = animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            a.stop();
        });        
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */

function animaster(){
    let resetFadeIn = function(element){
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide'); 
    }
    let resetFadeOut= function (element){
        element.style.transitionDuration =  null;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    let resetMoveAndScale = function (element){
        element.style.transitionDuration = null;
        element.style.transform = null;
    }
    return {
        scale (element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeIn (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        move(element, duration, translation) {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(translation, null);                 
            },  
        fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide'); 
        },
        moveAndHide(element, duration, translation){
            this.move(element,duration*2/5,translation);
            setTimeout(() => this.fadeOut(element,duration*3/5), 2/5*duration);
            return{
                reset(element) {
                    resetFadeOut(element);
                    resetMoveAndScale(element);
                },
            }  
        },
        showAndHide (element, duration){
            this.fadeIn(element, 1/3 * duration);
            setTimeout(()=> this.fadeOut(element, 1/3 * duration), 1/3 * duration);
        },
        heartBeating(element){
            let counter = 0;
            let timerId  = setInterval(() => this.scale(element,500, (++counter%2) ? 1.4 : 1), 500); 
            return{
                stop(){
                    clearInterval(timerId);
                }
            }         
        },
    };
}

/**
 * Функция, передвигающая элемент
 * 
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */


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
