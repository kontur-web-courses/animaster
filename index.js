addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block, 500, 1.4);
        });

    document.getElementById('someMovementsPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('someMovementsBlock');
            animaster()
                .addMove(200, {x: 100, y: 0})
                .addMove(200, {x: 0, y: 0})
                .addMove(200, {x: 0, y: 0})
                .addMove(200, {x: 0, y: 0})
                .play(block);
        });
}


function animaster(){
    return {
        'steps_': [],
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        resetFadeIn(element) {
            element.style.transitionDuration = null;
            // element.classList.remove('show');
        },
        /**
         * Блок плавно угасает.
         * Блок плавно исчезает.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetFadeOut(element) {
            element.style.transitionDuration = null;
            // element.classList.remove('show');
        },
        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        /**
         * Сердцебиение.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        heartBeating(element, duration, ratio) {
            setInterval(() => {
                this.scale(element, duration, ratio);
                setTimeout(() => this.scale(element, duration, 1.0), duration);
            }, 2 * duration);
        },
        /**
         * Движение (2/5 времени) и исчезновение (3/5 времени)
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        moveAndHide(element, duration, translation) {
            this.move(element, 2 * duration / 5, translation);
            setTimeout(() => this.fadeOut(element, 3 * duration / 5), 2 * duration / 5);
        },

        /**
         * появление (1/3), ожидание (1/3), исчезновение (1/3)
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), 2 * duration / 3);
        },
        /**
         * Функция ///
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        addMove(duration, translation) {
            console.log(this.steps_)
            this.steps_.add(function (element) {
                this.move(element, duration, translation);
            });
            return this;
        },
        /**
         * Функция, воспроизводящая накопленные анимации
         * @param element — HTMLElement, который надо анимировать
         */
        play(element) {
            this.steps_.forEach(action => action(element));
        }
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
