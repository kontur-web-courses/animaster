addListeners();

function addListeners() {

    let anim;

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim = animaster().fadeIn(block, 5000);

            document.getElementById('resetFadeIn')        
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });
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
            anim = animaster().fadeOut(block, 5000);

            document.getElementById('resetFadeOut')        
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        });

        });
    
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block,5000);

            document.getElementById('resetMoveAndHide')        
                .addEventListener('click', function () {
                    const block = document.getElementById('moveAndHideBlock');
                    animaster().resetMoveAndScale(block);
                    animaster().resetFadeOut(block);
                });
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block,5000);
        });
        
    document.getElementById('heartBeatingPlay')        
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            
            anim = animaster().heartBeating(block);
        
            document.getElementById('heartBeatingStop')        
                .addEventListener('click', function () {
                    const block = document.getElementById('heartBeatingBlock');
                    anim.stop();
                });
    });
}


function animaster() {
    
    return {
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
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale: function(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        fadeOut: function fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        
        /*
        moveAndHide — блок должен одновременно сдвигаться на 100 пикселей вправо и на 20 вниз, а потом исчезать.
        Метод на вход должен принимать продолжительность анимации. При этом 2/5 времени блок двигается, 3/5 — исчезает.
        */
        moveAndHide: function moveAndHide(block, duration) {
            this.move(block, duration * 0.4, {x: 50, y: 20});
            setTimeout(this.fadeOut, duration * 0.4, block, duration * 0.6);
        },

        /*
        showAndHide — блок должен появиться, подождать и исчезнуть. Каждый шаг анимации длится 1/3
         от времени, переданного аргументом в функцию.
        */

        showAndHide: function showAndHide(block, duration) {
            this.fadeIn(block, duration / 3);
            setTimeout(this.move, duration / 3, block, duration /3, {x: 0, y: 0});
            setTimeout(this.fadeOut, duration * 2 / 3, block, duration / 3);
        },

        /*
        heartBeating — имитация сердцебиения. Сначала элемент должен увеличиться в 1,4 раза, 
        потом обратно к 1. Каждый шаг анимации занимает 0,5 секунды. Анимация должна повторяться бесконечно.
        */
        heartBeating: function heartBeating(block) {
            let timer2;
            let timer = setInterval(() => {
                this.scale(block, 500, 1.4);
                timer2 = setTimeout(this.scale, 500, block, 500, 1);
            },1000);
            
            return  {
                stop: function() {
                    clearInterval(timer);
                    clearTimeout(timer2);
                }
            }
        
        },

        resetFadeIn: function resetFadeIn(block) {
            block.style.transitionDuration =  null;
            block.classList.remove('show');
            block.classList.add('hide');
        },
        resetFadeOut: function resetFadeOut(block) {
            block.style.transitionDuration =  null;
            block.classList.remove('hide');
            block.classList.add('show');
        },
        resetMoveAndScale: function resetMoveAndScale(block){
            block.style.transitionDuration = null;
            block.style.transform = getTransform(null, 1);
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
