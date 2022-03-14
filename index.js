addListeners();

function addListeners() {
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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    let h = animaster();
    document.getElementById('AddMove')
        .addEventListener('click', function() {
            h.AddMove(500, {x: 100, y: -50});
        });

    document.getElementById('Play')
        .addEventListener('click', function() {
            const block = document.getElementById('AddMoveBlock');
            h.play(block);
        })
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

    this.fadeOut = function(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    };

    this.moveAndHide = function(element, duration) {
        this.move(element, duration / 5 * 2, {x: 100, y: 20});
        setTimeout(() => this.fadeOut(element, duration / 5 * 3), duration / 5 * 2);
    };

    this.showAndHide = function(element, duration) {
        this.fadeIn(element, duration / 3);
        setTimeout(() => this.fadeOut(element, duration / 3), duration / 3 * 2);
    };

    this._steps = [];

    this.AddMove = function(duration, translation) {
        this._steps.push({
            name: 'move',
            duration: duration,
            params: translation,
        });
        return this;
    };

    this.play = function(element) {
        console.log(this._steps)
        let actions = this._steps.slice();
        this._steps = [];
        let time = 0;
        for (let action of actions) {
            console.log('this shit happened');
            console.log(time);
            setTimeout(() => this[action.name](element, action.duration, action.params), time);
            time += action.duration;
        }
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
