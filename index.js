addListeners();

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.add('show');
        element.classList.remove('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function resetMoveAndHide(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
        element.classList.add('show');
        element.classList.remove('hide');
    }

    return {
        _steps: [],
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            this.addFadeIn(duration).play(element);
        },
        fadeOut(element, duration) {
            this.addFadeOut(duration).play(element);
        },
        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            this.addMove(duration, translation).play(element);
        },
        addMove(duration, translation) {
            copy = {...this};
            copy._steps = [...this._steps];
            copy._steps.push({
                name: 'move',
                duration: duration,
                additional: {translation: translation}
            })
            return copy;
        },
        addScale(duration, ratio) {
            copy = {...this};
            copy._steps = [...this._steps];
            copy._steps.push({
               name: 'scale',
               duration: duration,
               additional: {ratio: ratio}
            });
            return copy;
        },
        addFadeIn(duration) {
            copy = {...this};
            copy._steps = [...this._steps];
            copy._steps.push({
                name: 'fadeIn',
                duration: duration,
                additional: null,
            });
            return copy;
        },
        addFadeOut(duration) {
            copy = {...this};
            copy._steps = [...this._steps];
            copy._steps.push({
                name: 'fadeOut',
                duration: duration,
                additional: null,
            });
            return copy;
        },
        addDelay(duration) {
            copy = {...this};
            copy._steps = [...this._steps];
            copy._steps.push({
                name: 'delay',
                duration: duration,
                additional: null,
            });
            return copy;
        },
        play(element, cycled=false) {
            let cycleDuration = this._steps.reduce((sum, current) => sum + current.duration, 0);
            let cycle = () => {
                let durationOffset = 0;
                for (let animation of this._steps) {
                    setTimeout(() => {

                        element.style.transitionDuration = `${animation.duration}ms`;
                        switch (animation['name']) {
                            case 'move':
                                element.style.transform = getTransform(animation['additional']['translation'], null);
                                break;
                            case 'scale':
                                element.style.transform = getTransform(null, animation.additional.ratio);
                                break;
                            case 'fadeIn':
                                element.classList.remove('hide');
                                element.classList.add('show');
                                break;
                            case 'fadeOut':
                                element.classList.remove('show');
                                element.classList.add('hide');
                                break;
                        }
                    }, durationOffset);
                    durationOffset += animation.duration;
                }
            };

            if (cycled) {
                const intervalId = setInterval(cycle, cycleDuration);
                return intervalId;
            } else {
                cycle();
            }
        },
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            this.addScale(duration, ratio).play(element);
        },
        moveAndHide(element, duration) {
            this.addMove(2 * duration / 5, {x: 100, y: 20})
                .addFadeOut(3 * duration / 5)
                .play(element);

            return {
                reset() {
                    resetMoveAndHide(element);
                },
            };
        },
        showAndHide(element, duration) {
            this.addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },
        heartBeating(element) {
            const intervalId = this.addScale(500, 1.4).addScale(500, 1).play(element, true);

           return {
               stop() {
                   clearInterval(intervalId);
               },
           };
        },
        buildHandler(blockName) {
            const block = document.getElementById(blockName);
            return this.play.bind(this, block);
        },
    }
}

function addListeners() {
    let animationObjects = {};

    document.getElementById('fadeInPlay')
        .addEventListener('click', animaster().addFadeIn(500).buildHandler('fadeInBlock'));

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

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animationObjects.moveAndHide = animaster().moveAndHide(block, 1000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            animationObjects.moveAndHide.reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animationObjects.heartBeating = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (animationObjects.heartBeating) {
                animationObjects.heartBeating.stop();
            }
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
