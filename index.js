const anim = animaster();
addListeners();

function animaster() {
    return { fadeIn, move, scale, fadeOut, moveAndHide, showAndHide, heartBeating };

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
    }

    function resetMoveAndScale(element) {
        element.style.scale = null;
        element.style.transform = null;
    }
    
    /**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.add('show');
        element.classList.remove('hide');
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }



    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    /**
     * Блок плавно становится прозрачным.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeOut(element, duration) {
        console.log(element)
        element.style.transitionDuration = `${duration}ms`;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function moveAndHide(element, duration) {
        move(element, duration * 2 / 5, { x: 100, y: 20 });
        setTimeout(() => fadeOut(element, duration * 3 / 5), duration * 2 / 5);
    }

    function showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(() => { console.log('sad'); fadeOut(element, duration / 3); }, duration / 3);
    }

    function heartBeating(element) {
        scale(element, 500, 1.4);
        setTimeout(() => { scale(element, 500, 1); }, 500);

        let intervalId = setInterval(() => {
            scale(element, 500, 1.4);
            setTimeout(() => { scale(element, 500, 1); }, 500);
        }, 1000);

        return {
            stop() {
                clearInterval(intervalId)
            }
        };
    }

}

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            anim.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            anim.move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anim.scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.moveAndHide(block, 2000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim.showAndHide(block, 3000)
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            anim.heartBeating.stop = anim.heartBeating(block);
        });
    
    

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            anim.heartBeating.stop.stop();
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
