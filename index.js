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
        _steps: [],

        play: function (element){
            let wait = 0;
            for (let step of this._steps){
                if (step.translation !== null) {
                    setTimeout(() => step.method(element, step.duration, step.translation), wait)
                } else if (step.ratio !== null){
                    setTimeout(() => step.method(element, step.duration, step.ratio), wait)
                } else {
                    setTimeout(() => step.method(element, step.duration), wait)
                }
                wait += step.duration
            }
        },

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

        addFadeIn: function (duration) {
            this._steps.push({
                method: this.fadeIn,
                name: 'fadeIn',
                duration: duration,
                translation: null,
                ratio: null,
                cycled: false
            })
            return this
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

        addFadeOut: function (duration) {
            this._steps.push({
                method: this.fadeOut,
                name: 'fadeOut',
                duration: duration,
                translation: null,
                ratio: null,
                cycled: false
            })
            return this
        },

        move: function move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
            return {move,
                resetMove: function (element) {
                    setTimeout(() => resetMoveAndScale(element), 100)
                }
            }
        },

        addMove: function (duration, translation) {
            this._steps.push({
                method: this.move,
                name: 'move',
                duration: duration,
                translation: translation,
                ratio: null,
                cycled: false
            })
            return this
        },

        scale: function scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
            return {scale,
                resetScale: function (element) {
                    setTimeout(() => resetMoveAndScale(element), 100)
                }
            }
        },

        addScale: function (duration, ratio) {
            this._steps.push({
                method: this.scale,
                name: 'scale',
                duration: duration,
                translation: null,
                ratio: ratio,
                cycled: false
            })
            return this
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

        heartBeating: function heartBeating(element, duration){
            let beating = setInterval(() => {
                this.scale(element, 0.5 * duration, 1.4)
                setTimeout(() =>  this.scale(element, 0.5 * duration, -1), 500)
            }, 1500)

            return {
                beating,

                stop: function (){
                    clearInterval(this.beating)
                }
            }
        }
    }
}

function addListeners() {
    let moveAndHider;
    let scale;
    let move;
    let showAndHide;
    let fadeIn;
    let fadeOut;
    let heartBeater;

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

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeater = animaster().heartBeating(block, 1000);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeater.stop();
        });

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');

            const customAnimation = animaster()
                .addFadeIn(500)
                .addMove(500, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(500, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1)
                .addFadeOut(500);
            customAnimation.play(block);
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