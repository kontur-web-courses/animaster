addListeners();

function addListeners() {
    let animaster1 = new animaster();
    let animaster2 = new animaster();

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
            animaster().addMove(1000, {x:100, y:20}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster1.heartBeating(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            console.log(block);
            animaster2.showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster1.stopHeartBeating(block);
        });

    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster2.resetMoveAndHide(block);
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

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList = ["block"];
    }
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList = ["block"];
    }
    function resetMove(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }


    obj = {
        _steps: [],
        _translation: null,
        _ratio: null,
        Timer: setInterval(() => {
        }, 0),
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            this.ratio = ratio;
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            this.translation= translation;
        },

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
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide(element, duration) {
            this.move(element, 2 * duration / 5, {x: 100, y: 20});
            setTimeout(this.fadeOut, 2 * duration / 5, element, 3 * duration / 5,);
        },
        heartBeating(element) {
            this.Timer = setInterval((el) => {
                this.addScale(500, 1.4);
                this.addScale(500, 1);
                this.play(el);
            }, 1000,element);
        },
        stopHeartBeating(element) {
            clearInterval(this.Timer);
        },
        showAndHide(element, duration) {

            this.fadeIn(element, Math.floor(duration / 3));
            setTimeout(this, Math.floor(duration / 3));
            setTimeout(this.fadeOut, Math.floor(duration / 3), element, Math.floor(duration / 3));
        },
        resetMoveAndHide(element) {
            resetMove(element);
            resetFadeOut(element);
        },
        addMove(duration, translation) {
            obj = {
                name: 'move',
                duration: duration,
                translation: translation,
            };
            this._steps.push(obj);
            return this;
        },
        addScale(duration, ratio) {
            obj = {
                name: 'scale',
                duration: duration,
                ratio: ratio,
            };
            this._steps.push(obj);
            return this;
        },
        addFadeIn(duration) {
            obj = {
                name: 'fadeIn',
                duration: duration
            };
            this._steps.push(obj);
            return this;
        },
        addFadeOut(duration) {
            obj = {
                name: 'fadeOut',
                duration: duration
            };
            this._steps.push(obj);
            return this;
        },
        play(element) {
            let prevDuration = 0;
            for (let i of this._steps) {
                setTimeout((name) => {
                    console.log(i.name);
                    switch (name) {
                        case('move'):
                            this.move(element, i.duration, i.translation);
                            break;
                        case('scale'):
                            this.scale(element, i.duration, i.ratio);
                            break;
                        case('fadeOut'):
                            this.fadeOut(element, i.duration);
                            break;
                        case('fadeIn'):
                            this.fadeIn(element, i.duration);
                    }
                    element.style.transform = getTransform(this.translation, this.ratio);
                }, prevDuration, i.name);
                prevDuration = i.duration;
            }
        }
    }
    return obj;
}