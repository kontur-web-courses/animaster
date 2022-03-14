addListeners();

function animaster() {

    function resetFadeIn(element) {
        element.style.fadeIn = null
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.fadeOut = null
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null
        element.style.transform = null
    }


    return {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn: function fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            return {fadeIn,
                resetFadeIn: function (element) {
                    resetFadeIn(element)
                }
            }
        },
        fadeOut: function fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');

            return {fadeOut,
                resetOut: function (element) {
                    resetFadeOut(element);
                }
            }
        },
        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move: function move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
            return {move,
                resetMove: function (element) {
                    setTimeout(() => resetMoveAndScale(element), 100)
                }
            }
        },
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale: function scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
            return {scale,
                resetScale: function (element) {
                    setTimeout(() => resetMoveAndScale(element), 100)
                }
            }
        },

        showAndHide: function showAndHide(element, duration) {
            this.fadeIn(element, duration / 3)
            setTimeout(() => this.fadeOut(element, duration / 3), duration / 3)
            return {showAndHide,
                resetShow: function (element) {
                    setTimeout(() => resetMoveAndScale(element), 100)
                    resetFadeOut(element)
                }
            }
        },

        moveAndHide: function moveAndHide(element, duration) {
            this.move(element, duration * 2 / 5, {x: 100, y: 20})
            let timer = setTimeout(() => this.fadeOut(element, duration * 3 / 5), 1000)
            return {moveAndHide,
                resetMoveAndHide: function (element) {
                    clearTimeout(timer)
                    resetFadeOut(element)
                    setTimeout(() => resetMoveAndScale(element), 100)
                }
            }
        },
    }
}

    function addListeners() {
        let moveAndHider;
        let scale;
        let move;
        let showAndHide;
        let fadeIn;
        let fadeOut;

        document.getElementById('fadeInPlay')
            .addEventListener('click', function () {
                const block = document.getElementById('fadeInBlock');
                fadeIn = animaster().fadeIn(block, 5000);
            });

        document.getElementById('fadeInReset')
            .addEventListener('click', function () {
                const block = document.getElementById('fadeInBlock');
                fadeIn.resetFadeIn(block);
            });

        document.getElementById('fadeOutPlay')
            .addEventListener('click', function () {
                const block = document.getElementById('fadeOutBlock');
                fadeOut = animaster().fadeOut(block, 5000);
            });

        document.getElementById('fadeOutReset')
            .addEventListener('click', function () {
                const block = document.getElementById('fadeOutBlock');
                fadeOut.resetOut(block)
            });

        document.getElementById('movePlay')
            .addEventListener('click', function () {
                const block = document.getElementById('moveBlock');
                move = animaster().move(block, 1000, {x: 100, y: 10});
            });

        document.getElementById('moveReset')
            .addEventListener('click', function () {
                const block = document.getElementById('moveBlock');
                move.resetMove(block);
            });
        document.getElementById('moveAndHidePlay')
            .addEventListener('click', function () {
                const block = document.getElementById('moveAndHideBlock');
                moveAndHider = animaster().moveAndHide(block, 1000);
            });
        document.getElementById('moveAndHideReset')
            .addEventListener('click', function () {
                const block = document.getElementById('moveAndHideBlock');
                moveAndHider.resetMoveAndHide(block);
            });

        document.getElementById('scalePlay')
            .addEventListener('click', function () {
                const block = document.getElementById('scaleBlock');
                scale =  animaster().scale(block, 1000, 1.25);
            });

        document.getElementById('scaleReset')
            .addEventListener('click', function () {
                const block = document.getElementById('scaleBlock');
                scale.resetScale(block);
            });


        document.getElementById('showAndHidePlay')
            .addEventListener('click', function () {
                const block = document.getElementById('showAndHideBlock');
                showAndHide = animaster().showAndHide(block, 1000);
            });

        document.getElementById('showAndHideReset')
            .addEventListener('click', function () {
                const block = document.getElementById('showAndHideBlock');
                showAndHide.resetShow(block);
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

