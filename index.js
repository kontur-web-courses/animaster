addListeners();
let singleAnimaster = animaster();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            singleAnimaster.fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            singleAnimaster.resetFadeIn(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            singleAnimaster.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            singleAnimaster.resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            singleAnimaster.scale(block, 1000, 1.25);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            singleAnimaster.resetMoveAndScale(block);
        });

    let heartStopper;
    document.getElementById('heartPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBlock');
            heartStopper = singleAnimaster.heartBeating(block);
        });

    document.getElementById('heartStop')
        .addEventListener('click', function () {
            if (heartStopper !== null)
                heartStopper.stop();
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            singleAnimaster.moveAndHide(block, 1000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            singleAnimaster.resetMoveAndHide(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            singleAnimaster.showAndHide(block, 3000);
        });

    document.getElementById('AddMove')
        .addEventListener('click', function() {
            singleAnimaster.AddMove(50, {x: getRandomInt(100), y: -getRandomInt(50)});
        });

    document.getElementById('Play')
        .addEventListener('click', function() {
            const block = document.getElementById('AddMoveBlock');
            singleAnimaster.play(block);
        })

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
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

    this.resetFadeIn = function(element) {
        element.classList.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
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

    this.resetMoveAndScale = function(element) {
        element.style.transform = getTransform({x: 0, y: 0}, 1);
    }

    this.heartBeating = function(element) {
        let growing = () => this.scale(element, 500, 1.4);
        let decreasing = () => this.scale(element, 500, 1);
        let heartGrowingInterval = setInterval(growing, 1000);
        let heartDecreasingInterval = null;
        setTimeout(() => heartDecreasingInterval = setInterval(decreasing, 1000), 500);

        return {
            stop() {
                clearInterval(heartGrowingInterval);
                clearInterval(heartDecreasingInterval);
            }
        }
    }

    this.fadeOut = function(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    };

    this.resetFadeOut = function(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    this.moveAndHide = function(element, duration) {
        this.move(element, duration / 5 * 2, {x: 100, y: 20});
        setTimeout(() => this.fadeOut(element, duration / 5 * 3), duration / 5 * 2);
    };

    this.resetMoveAndHide = function(element) {
        this.resetMoveAndScale(element);
        this.resetFadeOut(element);
    }

    this.showAndHide = function(element, duration) {
        this.fadeIn(element, duration / 3);
        setTimeout(() => this.fadeOut(element, duration / 3), duration / 3 * 2);
    };

    this._steps = [];

    this.addMove = function(duration, translation) {
        this._steps.push({
            name: 'move',
            duration: duration,
            params: translation,
        });
        return this;
    };

    this.play = function(element) {
        let time = 0;
        for (let action of this._steps) {
            setTimeout(() => this[action.name](element, action.duration, action.params), time);
            time += action.duration;
        }
        this._steps = [];
    }

    this.addFadeIn = function(duration) {
        this._steps.push({
            name: 'fadeIn',
            duration: duration
        });
        return this;
    }

    this.addFadeOut = function(duration) {
        this._steps.push({
            name: 'fadeOut',
            duration: duration
        });
        return this;
    }

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
