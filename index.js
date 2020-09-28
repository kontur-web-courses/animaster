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
            animaster().move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.data_MoveAndHideAnimation = animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.data_MoveAndHideAnimation(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.data_heartAnimation = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.data_heartAnimation.stop();
        });
}

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    function resetMoveAndHide(element) {
        resetFadeOut(element);
        element.style.transform = null;
    }

    return {
        // _steps: [],
        // play(element) {
        //     let obj = this._steps.pop();
        //     this[obj.func](element, obj.duration, obj.translation);
        // },
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            let elem = element;
            let th = this;
            return resetFadeIn;
        },
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            return resetFadeOut;
        },
        //@param translation — объект с полями x и y, обозначающими смещение блока
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        // addMove(duration, translation) {
        //     this._steps.push({ func: 'move', duration, translation });
        // },
        //@param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        moveAndHide(element, duration) {
            this.move(element, duration * 3 / 5, { x: 100, y: 20 });
            this.fadeOut(element, duration * 2 / 5);
            return resetMoveAndHide;
        },
        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
        },
        heartBeating(element) {
            let stop = false;
            this.scale(element, 500, 1.4);
            setTimeout(() => this.scale(element, 500, 1), 500);
            let set1 = setInterval(() => {
                this.scale(element, 500, 1.4);
                setTimeout(() => this.scale(element, 500, 1), 500);
            }, 1000);
            return {
                stop() {
                    clearInterval(set1);
                }
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
}