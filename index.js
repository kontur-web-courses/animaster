addListeners();

function addListeners() {
    let am = animaster()
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            am.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            am.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            am.move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            am.scale(block, 1000, 1.25);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            am.showAndHide(block, 1000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            am.moveAndHide(block, 1000);
        });

    let heartBeatingHandle = undefined

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingHandle = am.heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingHandle !== undefined) {
                heartBeatingHandle.stop()
            }
    })

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndScale(block, 1000);
            resetFadeOut(block, 1000);
        });

    document.getElementById('')

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

/*
    reset functions
*/

function resetFadeIn(element) {
    element.style.transitionDuration = null;
    element.classList.remove('show');
    element.classList.remove('hide');
}

function resetFadeOut(element) {
    element.style.transitionDuration = null;
    element.classList.remove('hide');
    element.classList.remove('show');
}

function resetMoveAndScale(element) {
    element.style.transitionDuration = null;
    element.style.transform = null;
}

// step constructor

function step(stepName, duration, translation, ratio) {
    return {
        stepName: stepName,
        duration: duration,
        translation: translation,
        ratio: ratio,
    }
}

function animaster() {
    return {
        _steps: [],
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
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        // custom
        /**
         * Скрываем элемент
         */
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        
        moveAndHide(element, duration) {
            
            this.move(element, duration * 2 / 5, { x: 100, y: 20 });

            setTimeout(() => {
                this.fadeOut(element, duration * 3 / 5);
            }, duration / 5);
        },

        showAndHide(element, duration) {
    
            this.fadeIn(element, duration / 3)
            setTimeout(() => {
                this.fadeOut(element, duration * 2 / 3)
            }, duration / 3)
        },

        heartBeating(element) {
            let timerId = setInterval(() => {
                this.scale(element, 500, 1.4)
                setTimeout(() => {
                    this.scale(element, 500, 1)
               }, 500);
            }, 1000)
            return {
                stop() {
                    clearInterval(timerId)
                }
            }
        },

        // play
        addFadeIn(duration, translation){
            this._steps.push(step(this.fadeIn.name, duration, translation, undefined))
            return this
        },

        addMove(duration, translation){
            this._steps.push(step(this.move.name, duration, translation, undefined))
            return this
        },

        addScale(element){

        },

        play(element){
            for (const s of _steps) {
                switch (s.stepName) {
                    case this.move.name:
                        this.move(element, s.duration, s.translation)
                        break;
                    default:
                        break;
                }
            }
        }
    }
}