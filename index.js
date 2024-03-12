addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn( 5000).play(block);

            document.getElementById('fadeInStop')
                .addEventListener('click', function () {
                    animaster().resetFadeIn(block)
                });
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
            let obj = animaster().moveAndHide(block, 1000, {x: 100, y: 20});

            document.getElementById('moveAndHideStop')
                .addEventListener('click', obj.stop);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000)
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let obj = animaster().heartBeating(block);

            document.getElementById('heartBeatingStop')
                .addEventListener('click', obj.stop);
        });

    document.getElementById('CustomPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('CustomBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);

            document.getElementById('CustomStop')
                .addEventListener('click', customAnimation.stop);
        });


}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */

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
    let obj = {
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
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
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);

        },
        moveAndHide(element, duration, translation) {
            animaster().move(element, duration * 2 / 5, translation);
            const timeout = setTimeout(animaster().fadeOut, duration * 2 / 5, element, duration * 3 / 5);

            const obj = {
                stop() {
                    clearTimeout(timeout);
                    animaster().resetMoveAndHide(element);
                }
            }

            return obj;
        },
        showAndHide(element, duration) {
            animaster().fadeIn(element, duration / 3);
            setTimeout(animaster().fadeOut, duration * 2 / 3, element, duration / 3);
        },
        heartBeating(element) {

            const interval = setInterval(function () {
                animaster().scale(element, 500, 1.4);
                setTimeout(animaster().scale, 600, element, 500, 1);
            }, 1100)

            const obj = {
                stop() {
                    clearInterval(interval);
                }
            }

            return obj;
        },

        resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        },
        resetMoveAndHide(element) {
            element.style.transform = null;
            animaster().resetFadeOut(element)
        },

        addMove(duration, translation) {
            this._steps.push(
                {
                    name: 'move',
                    duration,
                    translation
                }
            );

            return this
        },
        addScale(duration, ratio) {
            this._steps.push(
                {
                    name: 'scale',
                    duration,
                    ratio
                }
            );

            return this
        },
        addFadeIn(duration) {
            this._steps.push(
                {
                    name: 'fadeIn',
                    duration
                }
            );

            return this
        },
        addFadeOut(duration) {
            this._steps.push(
                {
                    name: 'fadeOut',
                    duration
                }
            );

            return this
        },
        play(element) {
            console.log(this._steps)
            for (const step of this._steps) {
                switch (step.name) {
                    case 'move':
                        setTimeout(this.move, this.lastDuration, element, step.duration, step.translation);
                        break
                    case 'scale':
                        setTimeout(this.scale, this.lastDuration, element, step.duration, step.ratio);
                        break
                    case 'fadeOut':
                        setTimeout(this.fadeOut, this.lastDuration, element, step.duration);
                        break
                    case 'fadeIn':
                        setTimeout(this.fadeIn, this.lastDuration, element, step.duration);
                        break
                }

                this.lastDuration += step.duration;
            }
        },
        _steps: [],
        lastDuration: 0
    };

    return obj;
}
