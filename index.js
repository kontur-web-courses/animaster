addListeners();

function addListeners() {
    let objControllers = {};
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            objControllers['fadeIn'] = animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            objControllers['fadeIn'].reset();
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            objControllers['moveAndHide'] = animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            objControllers['moveAndHide'].reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            objControllers['showAndHide'] = animaster().showAndHide(block, 5000);
        });

    document.getElementById('showAndHideReset')
        .addEventListener('click', function () {
            objControllers['showAndHide'].reset();
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            objControllers['heartBeating'] = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            objControllers['heartBeating'].stop();
        });

    document.getElementById('heartBeatingReset')
        .addEventListener('click', function () {
            objControllers['heartBeating'].reset();
        });


    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            objControllers['fadeOut'] = animaster().fadeOut(block, 5000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            objControllers['fadeOut'].reset();
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            objControllers['move'] = animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            objControllers['move'].reset();
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            objControllers['scale'] = animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            objControllers['scale'].reset();
        });

    const customAnimation = animaster()
        .addMove(200, {x: 40, y: 40})
        .addScale(800, 1.3)
        .addMove(200, {x: 80, y: 0})
        .addScale(800, 1)
        .addMove(200, {x: 40, y: -40})
        .addScale(800, 0.7)
        .addMove(200, {x: 0, y: 0})
        .addScale(800, 1);
    document.getElementById('customPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
            objControllers['custom'] = customAnimation.play(block);
        });

    document.getElementById('customReset')
        .addEventListener('click', function () {
            objControllers['custom'].reset();
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
        _steps:  [],

        play: function (element, isCycled=false) {
            let stopRequested = false;

            const animationContext = {
                isCycled,
                isStopRequested: () => stopRequested,
            }

            const animationController = {
                _element: element,
                _elementTransform: element.style.transform,
                _elementHidden: element.classList.contains('hide'),
                stop: () => stopRequested = true,
                reset: function () {
                    this.stop()
                    this._element.style.transform = this._elementTransform;
                    this._element.classList.remove('show');
                    this._element.classList.remove('hide');
                    const visibilityClass = this._elementHidden ? 'hide' : 'show'
                    this._element.classList.add(visibilityClass)
                    this._element.style.transform = null;
                    this._element.style.transitionDuration = null;
                }
            }

            setTimeout(() => this._executeAnimation(element, 0, animationContext));
            return animationController;
        },

        _executeAnimation: function(element, stepIndex, animationContext) {
            if(animationContext.isStopRequested()) {
                return;
            }

            if(stepIndex >= this._steps.length) {
                if(!animationContext.isCycled) {
                    return;
                }

                stepIndex = 0;
            }

            const step = this._steps[stepIndex];
            step.action(element, step.duration, step.arg);
            setTimeout(() => {
                this._executeAnimation(element, ++stepIndex, animationContext)
            }, step.duration);
        },

        fadeIn: function (element, duration) {
            this.addFadeIn(duration);
            return this.play(element);
        },

        fadeOut: function(element, duration) {
            this.addFadeOut(duration);
            return this.play(element);
        },
        move: function (element, duration, translation) {
            this.addMove(duration, translation);
            return this.play(element);
        },

        scale: function (element, duration, ratio) {
            this.addScale(duration, ratio);
            return this.play(element);
        },

        _addAction: function (action, duration, arg) {
            this._steps.push({
                action,
                duration,
                arg
            });
        },

        addDelay: function(duration) {
            this._addAction(() => void 0, duration)
            return this;
        },

        addMove: function(duration, translation) {
            this._addAction(function (element, duration, translation) {
                element.style.transitionDuration = `${duration}ms`;
                element.style.transform = getTransform(translation, null);
            }, duration, translation);
            return this;
        },

        addScale: function (duration, ratio) {
            this._addAction(function (element, duration, ratio) {
                element.style.transitionDuration =  `${duration}ms`;
                element.style.transform = getTransform(null, ratio);
            }, duration, ratio);
            return this;
        },

        addFadeOut: function (duration) {
            this._addAction(function (element, duration) {
                element.style.transitionDuration = `${duration}ms`;
                element.classList.remove('show');
                element.classList.add('hide')
            }, duration);
            return this;
        },

        addFadeIn: function (duration) {
            this._addAction(function (element, duration) {
                element.style.transitionDuration =  `${duration}ms`;
                element.classList.remove('hide');
                element.classList.add('show');
            }, duration);
            return this;
        },

        moveAndHide: function (element, duration) {
            const moveTime = duration * 2 / 5;
            const fadeOutTime = duration * 3 /5;
            const translation = {x:100, y:20};
            this.addMove(moveTime, translation);
            this.addFadeOut(fadeOutTime);
            return this.play(element);
        },

        showAndHide: function (element, duration) {
            const segmentTime = duration / 3;
            this.addFadeIn(element, segmentTime);
            this.addDelay(segmentTime);
            this.addFadeOut(segmentTime);
            return this.play(element);
        },

        heartBeating: function (element) {
            const ratio = 1.4;
            const segmentTime = 500;
            this.addScale(segmentTime, ratio);
            this.addScale(segmentTime, 1 / ratio);
            return this.play(element, true);
        },
    }
}