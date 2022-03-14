addListeners();

function addListeners() {
    let anim = animaster();
    let heartbeatObj;
    let moveAndHideObj;
    
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
            moveAndHideObj = anim.moveAndHide(block, 1000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideObj.reset(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim.showAndHide(block, 1000);
        });

    document.getElementById('customPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
            anim.addScale(1000, 1.5).play(block);
        });
}

function animaster() {
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */

    this._steps = []

    this.addMove = function(duration, translation) {
        this._steps.push(
            {
                name: 'move',
                duration: duration,
                translation: translation
            }
        )
        return this;
    }

    this.addScale = function(duration, ratio) {
        this._steps.push(
            {
                name: 'scale',
                duration: duration,
                ratio: ratio
            }
        )
        return this;
    }

    this.addFadeIn = function(duration) {
        this._steps.push(
            {
                name: 'fadeIn',
                duration: duration
            }
        )
        return this;
    }

    this.addFadeOut = function(duration) {
        this._steps.push(
            {
                name: 'fadeOut',
                duration: duration
            }
        )
        return this;
    }
    


    this.play = function(element){
        let duration = 0;
        for (step of this._steps){
            switch(step.name) {
                case 'move':
                    this.move(element, step.duration, step.translation);
                    break;
                case 'fadeIn':
                    this.fadeIn(element, step.duration);
                    break;
                case 'fadeOut':
                    this.fadeOut(element, step.duration);
                    break;
                case 'scale':
                    this.scale(element, step.duration, step.ratio);
                    break;
            }
        }
    }

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

    this.fadeOut = function(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.add('hide');
        element.classList.remove('show');
    };

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
        element.style.transform = getTransform(null, null);
    }

    this.moveAndHide = function(element, duration) {
        this.move(element, duration * 0.4, {x: 100, y: 20});
        let sched = setTimeout(this.fadeOut, duration * 0.4, element, duration * 0.6);
        this.reset = function() {
            clearTimeout(sched);
            resetMoveAndScale(element);
            resetFadeOut(element);
        };
        return this;
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
        };
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