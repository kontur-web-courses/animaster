addListeners();
const master = animaster();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            master.fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            master.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            master.scale(block, 1000, 1.25);
        });
    
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            master.fadeOut(block, 5000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            master.moveAndHide(block, 5000);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            master.showAndHide(block, 3000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            if(master.heart === undefined) {
                master.heart = master.heartBeating(block, 1000);
            }
            master.heart.start();
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function() {
            if(master.heart !== undefined) {
                master.heart.stop();
            }
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            master.resetMoveAndHide(block);
        });
        
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */


/**
 * Функция, передвигающая элемент
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
    
    function resetMoveAndScale(moveBlock, scaleBlock){
        moveBlock.style.transitionDuration = null;
        moveBlock.style.transform = getTransform({x:0, y:0}, 1);
        scaleBlock.style.transitionDuration = null;
        scaleBlock.style.transform = getTransform({x:0, y:0}, 1);
    }
    return {
        move: function(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
    
        scale: function(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
    
        fadeIn: function(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
    
        fadeOut: function(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide: function(element, duration) {
            this.move(element, (duration / 5 * 2), {x: 100, y: 10});
            setTimeout(this.fadeOut, duration / 5 * 2, element, duration / 5 * 3);
        },

        showAndHide: function(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(this.fadeOut, duration / 3, element, duration / 3);
        },

        heartBeating: function(element, duration) {
            return {
                timer: 0,
                start: () => {
                    this.timer = setInterval(() => {
                        this.scale(element, duration / 2, 1.4);
                        setTimeout(this.scale, duration / 2, element, duration / 2, 1);
                    }, duration);
                },
                stop: () => {
                    clearTimeout(this.timer);
                }
            }
        },

        resetMoveAndHide: function(element){
            resetMoveAndScale(element, element);
            resetFadeOut(element);
        }
    }
}