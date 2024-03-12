addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            const fadeInAnimaster = animaster()
                .addFadeIn(5000)
                .play(block);

            document.getElementById('fadeInReset')
                .addEventListener('click', fadeInAnimaster.reset);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            const fadeOutAnimaster = animaster()
                .addFadeOut(5000)
                .play(block);

            document.getElementById('fadeOutReset')
                .addEventListener('click', fadeOutAnimaster.reset);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster()
                .addFadeIn(1000 / 3)
                .addDelay(1000 / 3)
                .addFadeOut(1000 / 3)
                .play(block)
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            const moveAnimaster = animaster()
                .addMove(1000, {x: 100, y: 10})
                .addMove(1000, {x: 200, y: 0})
                .addMove(1000, {x: 300, y: -10})
                .addMove(1000, {x: 400, y: 0})
                .play(block);

            document.getElementById('moveReset')
                .addEventListener('click', moveAnimaster.reset);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            const scaleAnimaster = animaster()
                .addScale(1000, 1.25)
                .play(block);

            document.getElementById('scaleReset')
                .addEventListener('click', scaleAnimaster.reset);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            const heartbeatingAnimaster = animaster()
                .addScale(500, 1.4)
                .addScale(500, 1)
                .play(block, true);

            document.getElementById('heartBeatingStop')
                .addEventListener('click', heartbeatingAnimaster.stop);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const moveAndHideAnimaster = animaster()
                .addMove(400, {x: 100, y: 20})
                .addFadeOut(600)
                .play(block);

            document.getElementById('moveAndHideReset')
                .addEventListener('click', moveAndHideAnimaster.reset);
        });

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
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

        // region basic moves
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
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
        // endregion

        // region resets
        resetMoveAndScale(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
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
        // endregion

        // region add step
        addMove(duration, translation) {
            this._steps.push({
                name: 'move',
                duration: duration,

                func: this.move,
                args: [duration, translation],

                reset: this.resetMoveAndScale,
            })

            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration: duration,

                func: this.scale,
                args: [duration, ratio],

                reset: this.resetMoveAndScale,
            })

            return this;
        },

        addFadeIn(duration) {
            this._steps.push({
                name: 'fadeIn',
                duration: duration,

                func: this.fadeIn,
                args: [duration],

                reset: this.resetFadeIn,
            })

            return this;
        },

        addFadeOut(duration) {
            this._steps.push({
                name: 'fadeOut',
                duration: duration,

                func: this.fadeOut,
                args: [duration],

                reset: this.resetFadeOut,
            })

            return this;
        },

        addDelay(duration) {
            this._steps.push({
                name: 'delay',
                duration: duration,

                func: () => {
                },
                args: [duration],

                reset: () => {
                },
            })

            return this;
        },
        //endregion

        // region play
        playCycled(element) {
            let totalDuration = this._steps
                .map(step => step.duration)
                .reduce((d1, d2) => d1 + d2);

            let resets = this._steps
                .map(step => step.reset)
                .reverse()

            let id = setInterval(() => this.play(element), totalDuration);

            return {
                stop: function () {
                    clearInterval(id);
                },
                reset: function () {
                    for (const reset of resets) {
                        reset(element);
                    }
                }
            };
        },

        play(element, cycled = false) {
            if (cycled) {
                return this.playCycled(element);
            }

            let timeouts = [];
            let resets = this._steps
                .map(step => step.reset)
                .reverse()

            let accumulated = 0;
            for (let step of this._steps) {
                let args = step.args.toSpliced(0, 0, element)

                let timeout = setTimeout(() => {
                    step.func.apply(this, args)
                }, accumulated);

                timeouts.push(timeout);
                accumulated += step.duration;
            }

            return {
                stop() {
                    for (const timeout of timeouts) {
                        clearTimeout(timeout);
                    }
                },
                reset() {
                    for (const reset of resets) {
                        reset(element);
                    }
                }
            }
        },
        //endregion

        buildHandler: function () {
            let anim = this;
            return function () {
                return anim.play(this);
            };
        },
    }
}