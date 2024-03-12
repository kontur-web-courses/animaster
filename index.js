addListeners();
let stop = null;
let fadeOutReset = null;
let fadeInReset = null;
let moveScaleReset = null;

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            fadeInReset = animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            moveScaleReset = animaster().move(block, 1000, {x: 100, y: 10});
        }); 

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            moveScaleReset = animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            fadeOutReset = animaster().fadeOut(block, 5000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000, {x: 100, y: 20});
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stop = animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (stop !== null) {
                stop.stop();
            }
        });
    
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            if (fadeOutReset !== null) {
                fadeOutReset.reset();
            }
        });
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            if (fadeInReset !== null) {
                fadeInReset.reset();
            }
        });
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            if (moveScaleReset !== null) {
                moveScaleReset.reset();
            }
        });
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            if (moveScaleReset !== null) {
                moveScaleReset.reset();
            }
        });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
function fadeIn(element, duration) {
    element.style.transitionDuration =  `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
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
    element.style.transitionDuration =  `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
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
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
        return {
            reset: function() {
                element.style.transitionDuration =  `0ms`;
                element.style.transform = getTransform({x: 0, y: 0}, null);
            }
        }
    }

    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
        return {
            reset: function() {
                element.style.transitionDuration =  `0ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }
        }
    }
    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
        return {
            reset: function() {
                element.style.transitionDuration =  `0ms`;
                element.classList.remove('hide');
                element.classList.add('show');
            }
        }
    }
    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);

        return {
            reset: function() {
                element.style.transitionDuration =  `0ms`;
                element.style.transform = getTransform(null, 1);
            }
        }
    }
    function moveAndHide(element, duration, translation) {
        this.move(element, duration*0.4, translation);
        setTimeout(() => this.fadeOut(element, duration*0.6), duration*0.4);
    }
    function showAndHide(element, duration) {
        this.fadeIn(element, duration*0.33);
        setTimeout(() => this.fadeOut(element, duration*0.33), duration*0.33);
    }
    function heartBeating(element) {
        const anc = setInterval(() => {
            this.scale(element, 500, 1.4);
            setTimeout(() => this.scale(element, 500, 1), 500)
        }, 1000);

        return {
            stop: function() {
                setTimeout(() => {clearInterval(anc)}, 0.5);
            }
        }
    }


    return {
        fadeIn,
        fadeOut, 
        move, 
        scale,
        showAndHide,
        heartBeating,
        moveAndHide,
    }
}