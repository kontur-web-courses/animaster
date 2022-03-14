addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            movedAndHidden = animaster().moveAndHide(block, 5000);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            objectiveShit = animaster().heartBeating(block);
        });
    document.getElementById('stopPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            objectiveShit.stop(block);
        });
    document.getElementById('resetPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            movedAndHidden.reset(block);
        });
}

function animaster() {
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

    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function moveAndHide(element, duration) {
        this.move(element, duration*0.4, {x: 100, y: 20});
        setTimeout(() => this.fadeOut(element, duration*0.6), duration*0.4);
        return {
            reset: (block) => {
                resetMoveAndScale(block);
                resetFadeOut(block);
            }
        }
    }

    function showAndHide(element, duration) {
        fadeIn(element, duration/3);
        setTimeout(() => fadeOut(element, duration/3), duration/3);
    }

    function heartBeating(element){
        let count = true;
        let timerId = setInterval(function run() {
            if (count) {
                scale(element, 500, 1.4);
                count = false;
            }
            else {
                count = true;
                scale(element, 500, 1)
            }
        }, 500);
        return {
            stop: (block) => clearInterval(timerId)
        }
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

    function resetFadeIn(element) {

        element.style.transitionDuration =  null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {

        element.style.transitionDuration =  null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration =  null;
        element.style.transform = null;
        element.style.transform = null;
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
    return {
        _steps: [],
        scale: scale,
        move: move,
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        heartBeating: heartBeating,
        addScale: function(duration, ratio) {
            this._steps.push([scale, duration, ratio]);
            return this;
        },
        addFadeIn: function(duration) {
            this._steps.push([fadeIn, duration]);
            return this;
        },
        addFadeOut: function(duration) {
            this._steps.push([fadeOut, duration]);
            return this;
        },
        addMove: function(duration, translation) {
            this._steps.push([move, duration, translation]);
            return this;
        },
        play: function(element) {
            this._steps.forEach(step => step[0](element, ...step.slice(1)));
        }
    };
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
