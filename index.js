addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block, false);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block, false);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y:10}).play(block, false);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block, false);
        });

    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, {x: 100, y: 20}, 1000);
        });

    document.getElementById('stopMoveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });

    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    document.getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            const heartBeating = animaster().heartBeating(block, 1000);

            document.getElementById('stopHeartBeating')
                .addEventListener('click', function () {
                    heartBeating.stop();
                });
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
    function resetFadeIn(element){
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element){
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element){
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {
        _steps: [],

        addMove: function (duration, transition) {
            this._steps.push({
                duration: duration,
                resetFunc: e => resetMoveAndScale(e),
                do: e => this.move(e, duration, transition)
            });
            return this;
        },
        addScale: function (duration, ratio) {
            this._steps.push({
                duration: duration,
                resetFunc: e => resetMoveAndScale(e),
                do: e => this.scale(e, duration, ratio)
            });
            return this;
        },
        addFadeIn: function (duration) {
            this._steps.push({
                duration: duration,
                resetFunc: e => resetFadeIn(e),
                do: e => this.fadeIn(e, duration)
            });
            return this;
        },
        addFadeOut: function (duration) {
            this._steps.push({
                duration: duration,
                resetFunc: e => resetFadeOut(e),
                do: e => this.fadeOut(e, duration)
            });
            return this;
        },
        addDelay: function (duration){
            this._steps.push({
                duration: duration,
                resetFunc: _ => {},
                do: _ => setTimeout(() => {}, duration)
            });
            return this;
        },

        play: function (element, cycled, steps = this._steps) {
            let duration = 0;
            this._steps.forEach(step => duration += step.duration)
            let isStopped = 0;
            function doCycle(){
                if (isStopped){
                    return;
                }
                steps.reduce((pr, step) => {
                    return pr.then(() => step.do(element));
                }, Promise.resolve());
            }
            doCycle();
            if (cycled){
                setInterval(doCycle, duration);
            }
            return {
                stop() {
                    isStopped = true;
                    clearInterval(doCycle);
                },
                reset() {
                    stop();
                    for(const step of steps){
                        if (step.resetFunc){
                            step.resetFunc(element);
                        }
                    }
                }
            }
        },
        buildHandler(){
            const steps = this._steps;
            const obj = this;
            return function (){
                obj.play(obj, false, steps);
            }
        },
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        moveAndHide: function (element, translation, duration) {
            const movingDuration = duration * 0.4;
            const hideDuration = duration * 0.6;
            animaster()
                .addMove(movingDuration, translation)
                .addFadeOut(hideDuration)
                .play(element, false);
        },
        resetMoveAndHide: function (element) {
            resetFadeOut(element);
            resetMoveAndScale(element);
        },
        showAndHide: function (element, duration) {
            const partDuration = duration / 3;
            animaster()
                .addFadeIn(partDuration)
                .addFadeOut(partDuration)
                .play(element, false);
        },
        heartBeating: function (element, duration) {
            const partDuration = duration / 2;

            const scaling = setInterval(() => {
                animaster().addScale(partDuration, 1.4)
                    .addScale(partDuration, 1)
                    .play(element, false)
            }, duration);
            return {
                stop: function () {
                    clearInterval(scaling);
                }
            }
        }
    }
}
