addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            const a = animaster().addFadeIn(5000).play(block);
            document.getElementById('fadeInReset')
                .addEventListener('click', function () {
                    a.reset();
                });
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            const a = animaster().addFadeOut(5000).play(block);
            document.getElementById('fadeOutReset')
                .addEventListener('click', function () {
                    a.reset();
                });
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            const a = animaster().addMove(1000, {x: 100, y:10}).play(block);
            document.getElementById('moveReset')
                .addEventListener('click', function () {
                    a.reset();
                });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            const a = animaster().addScale(1000, 1.25).play(block);
            document.getElementById('scaleReset')
                .addEventListener('click', function () {
                    a.reset();
                });
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const a = animaster().moveAndHide(1000).play(block);
            document.getElementById('moveAndHideReset')
                .addEventListener('click', function () {
                    a.reset();
                });
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(1000).play(block);
        });

    document.getElementById('heartBeatPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatBlock');
            let a = animaster().heartBeating().play(block, true);
            document.getElementById('heartBeatStop')
                .addEventListener('click', function () {
                    a.stop();
                });
        });

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1).play(block);
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

class Step {
    constructor(name, duration, extra=undefined) {
        this.name = name;
        this.duration = duration;
        this.extra = extra;
    }
}

function animaster() {
    function addMove(duration, extra) {
        this._steps.push(new Step('move', duration, extra));
        return this;
    }

    function addScale(duration, extra) {
        this._steps.push(new Step('scale', duration, extra));
        return this;
    }

    function addFadeIn(duration) {
        this._steps.push(new Step('fadeIn', duration));
        return this;
    }

    function addFadeOut(duration) {
        this._steps.push(new Step('fadeOut', duration));
        return this;
    }

    function addDelay(duration) {
        this._steps.push(new Step('delay', duration));
        return this;
    }

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

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function moveAndHide(duration) {
        this.addMove(duration * 0.4, {x: 100, y: 20});
        this.addFadeOut(duration * 0.6);
        return this;
    }

    function showAndHide(duration) {
        this.addFadeIn(duration * (1 / 3));
        this.addDelay(duration * (1 / 3));
        this.addFadeOut(duration * (1 / 3));
        return this;
    }

    function heartBeating() {
        this._steps.push(new Step('scale', 500, 1.4));
        this._steps.push(new Step('scale', 500, 1));
        return this;
    }


    function play(element, cycled=false) {
        let totalDuration = 0;
        let shouldBeHidden = element.classList.contains('hide');
        let timeout = null;
        if (!cycled) {
            for (let i = 0; i < this._steps.length; i++) {
                let currentStep = this._steps[i]
                switch (currentStep.name) {
                    case 'move':
                        timeout = setTimeout(() => move(element, currentStep.duration, currentStep.extra), totalDuration);
                        break;
                    case 'fadeIn':
                        timeout = setTimeout(() => fadeIn(element, currentStep.duration), totalDuration);
                        break;
                    case 'fadeOut':
                        timeout = setTimeout(() => fadeOut(element, currentStep.duration), totalDuration);
                        break;
                    case 'scale':
                        timeout = setTimeout(() => scale(element, currentStep.duration, currentStep.extra), totalDuration);
                        break;
                    case 'delay':
                        timeout = setTimeout(() => setTimeout(() => {}, currentStep.duration), totalDuration);
                        break;
                }
                totalDuration += currentStep.duration;
            }
            return {
                reset() {
                    if (shouldBeHidden)
                        resetFadeIn(element);
                    else
                        resetFadeOut(element);
                    resetMoveAndScale(element);
                    if (timeout !== null)
                        clearTimeout(timeout);
                }};
        }
        this.play(element)
        let interval = setInterval(() => this.play(element), 1000);
        return {
            stop() {
                clearInterval(interval);
            }
        };
    }

    return {
        _steps: [],
        move,
        scale,
        fadeIn,
        fadeOut,
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove,
        addFadeIn,
        addFadeOut,
        addScale,
        addDelay,
        play
    }
}

