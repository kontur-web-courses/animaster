addListeners();

function addListeners() {
    let anim = animaster();
    let heartbeatObj;
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
            anim.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anim.scale(block, 1000, 1.25);
        });
    
    document.getElementById('heartbeatPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartbeatBlock');
            heartbeatObj = anim.heartbeat(block, 1000);
        });
    
    document.getElementById('heartbeatStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartbeatBlock');
            heartbeatObj.stop();
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.moveAndHide(block, 1000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim.showAndHide(block, 1000);
        });
}

function animaster() {
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    this.fadeIn = function(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    };

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    this.fadeOut =  function(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }


    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    this.move = function(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    };

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    this.scale = function(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    };

    function resetMoveAndScale(element) {        
        element.style.transitionDuration = null;
        element.style.transform = getTransform(null, 1);
    }

    this.moveAndHide = function(element, duration) {
        this.move(element, duration * 0.4, {x: 100, y: 20});
        setTimeout(this.fadeOut, duration * 0.4, element, duration * 0.6);
    };

    this.heartbeat = function(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        let isBig = false;
        function changeScale() {
            if (isBig) {
                this.scale(element, 500, 1);
                isBig = false;
            } else {
                this.scale(element, 500, 1.4);
                isBig = true;
            }
        }
        let timer = setInterval(() => changeScale(), 500);
        this.stop = function() {
            clearInterval(timer);
        }
        return this;
    };
    this.showAndHide = function(element, duration) {
        this.fadeIn(element, duration / 3);
        setTimeout(this.fadeIn, duration / 3, element, duration / 3);
    };

    return this;
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