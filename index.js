addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            let obj = animaster().fadeIn(block, 5000);
            document.getElementById('fadeInStop')
                .addEventListener('click', () => animaster().resetFadeIn(block));
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            let obj = animaster().fadeOut(block, 5000)
            document.getElementById('fadeOutStop')
                .addEventListener('click', () => animaster().resetFadeOut(block));
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            let obj = animaster().move(block, 1000, {x: 100, y: 10});
            document.getElementById('moveStop')
                .addEventListener('click', () => obj.resetMoveAndScale(block));
        });

    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();

    document.getElementById('moveScriptBlock')
        .addEventListener('click', worryAnimationHandler);

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            let obj = animaster().scale(block, 1000, 1.25);
            document.getElementById('scaleStop')
                .addEventListener('click', () => animaster().resetMoveAndScale(block));
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 2000);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 2000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let obj = animaster().heartBeating(block, true);
            document.getElementById('heartBeatingStop')
                .addEventListener('click', obj.stop);
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
    return {
        _steps: [],
        buildHandler: function(){
            let animaster = this;
            return  function() {
                animaster.play(this);
            }
        },
        play: function (element) {
            let stepNumber = 0
            const playStep = (stepNumber, steps) => {
                if (stepNumber >= steps.length || stepNumber < 0) return;
                steps[stepNumber].func(element)
                setTimeout(() => playStep(stepNumber + 1, steps), steps[stepNumber].duration)
            }
            playStep(stepNumber, this._steps)
            return {
                stop: function(){
                    stepNumber = -1
                },
                reset: function (){

                }
            }
        },
        addMove: function (duration, translation) {
            this._steps.push({func: (element) => this.move(element, duration, translation), duration: duration})
            return this
        },
        addScale: function (duration, ratio) {
            this._steps.push({func: (element) => this.scale(element, duration, ratio), duration: duration})
            return this
        },
        addFadeIn: function (duration) {
            this._steps.push({func: (element) => this.fadeIn(element, duration), duration: duration})
        },
        addFadeOut: function (duration) {
            this._steps.push({func: (element) => this.fadeOut(element, duration), duration: duration})
        },
        addMoveAndHide: function (duration) {
            this._steps.push({func: (element) => this.moveAndHide(element, duration)})
        },
        addShowAndHide: function (duration) {
            this._steps.push({func: (element) => this.showAndHide(element, duration)})
        },
        addHeartBeating: function (cycled) {
            this._steps.push({func: (element) => this.heartBeating(element, cycled)})
        },
        resetFadeIn: function (element) {
            element.style.transitionDuration = null
            element.classList.add('hide');
            element.classList.remove('show');
        },
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        resetFadeOut: function (element) {
            element.style.transitionDuration = null
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        resetMoveAndScale: function (element) {
            element.style.transitionDuration = null;
            element.style.transform = null
        },
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        moveAndHide: function (element, duration) {
            let timerId = setTimeout(() => {
                this.move(element, duration / 5 * 2, {x: 100, y: 20});
                timerId = setTimeout(() => this.fadeOut(element, duration / 5 * 3), duration / 5 * 2)
            })
        },
        showAndHide: function (element, duration) {
            let timerId = setTimeout(() => {
                this.fadeIn(element, duration / 3);
                timerId = setTimeout(() => this.fadeOut(element, duration / 3), duration * 2 / 3)
            }, 0)
        },
        heartBeating: function (element, cycled) {
            let timerId = 0
            if (cycled) {
                let a = () => {
                    this.scale(element, 500, 1.4);
                    timerId = setTimeout(b, 500)
                }
                let b = () => {
                    this.scale(element, 500, 1 / 1.4);
                    timerId = setTimeout(a, 500)
                }
                timerId = setTimeout(a, 0)
            } else {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1 / 1.4)
                    setTimeout(() => this.scale(element, 500, 1), 500)
                }, 500)
            }
            return {
                stop: function () {
                    clearTimeout(timerId)
                }
            }
        }
    }
}
