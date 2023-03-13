addListeners();

function resetFade(toRemove, toAdd, element) {
    element.classList.remove(toRemove);
    element.classList.add(toAdd);
}

const duration = 5000;
const smallerDuration = 1000;

function animaster() {
    let resetMoveAndScale = function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    };
    let resetFadeOut = function resetFadeOut(element) {
        element.style.transitionDuration = null;
        resetFade('hide', 'show', element);
    };
    let resetFadeIn = function fadeIn(element) {
        element.style.transitionDuration = null;
        resetFade('show', 'hide', element);
    };

    return {
        'fadeIn': function fadeIn(element, duration) {
            const milisec = `${duration}ms`;
            element.style.transitionDuration = milisec;
            resetFade('hide', 'show', element);
        },
        'fadeOut': function fadeOut(element, duration) {
            const milisec = `${duration}ms`;
            element.style.transitionDuration = milisec;
            resetFade( 'show','hide', element);
        },
        'move': function move(element, duration, translation) {
            const milisec = `${duration}ms`;
            element.style.transitionDuration = milisec;
            element.style.transform = getTransform(translation, null);
        },
        'scale': function scale(element, duration, ratio) {
            const milisec = `${duration}ms`;
            element.style.transitionDuration = milisec;
            element.style.transform = getTransform(null, ratio);
        },
        'showAndHide': function scale(element, duration) {
            animaster()
                .addFadeIn((1/3) * duration)
                .addDelay((1/3) * duration)
                .addFadeOut((1/3) * duration)
                .Play(element);
        },
        'heartBeating': function heartBeating(element) {
            const duration = 500;
            let interval = animaster()
                .addScale(duration, 1.4)
                .addScale(duration, 1)
                .Play(element, true);
            return function stop() {
                clearInterval(interval);
            };
        },
        'moveAndHide': function moveAndHide(element, duration) {
            this.move(element, 2  * duration / 5, { x: 100, y: 20 });
            return animaster()
                .addMove(2  * duration / 5,
                    {
                        x: 100,
                        y: 10
                    })
                .addFadeOut(3  * duration / 5)
                .Play(element);
        },
        'resetMoveAndHide': function (element) {
            resetMoveAndScale(element);
            resetFadeOut(element);
        },
        'addMove': function addMove(duration, coordinates) {
            this.steps.push(
                {
                    name: 'move',
                    duration: duration,
                    coordinates: coordinates
                });
            return this;
        },
        'addFadeIn': function addScale(duration) {
            this.steps.push(
                {
                    name: 'fadeIn',
                    duration: duration
                });
            return this;
        },
        'addFadeOut': function addScale(duration) {
            this.steps.push(
                {
                    name: 'fadeOut',
                    duration: duration
                });
            return this;
        },
        'addScale': function addScale(duration, ratio) {
            this.steps.push(
                {
                    name: 'scale',
                    duration: duration,
                    ratio: ratio
                });
            return this;
        },
        'addDelay': function addScale(duration) {
            this.steps.push(
                {
                    name: 'delay',
                    duration: duration
                });
            return this;
        },
        'Play': function play(element, cycled = false) {
            if (cycled) {
                let play = () => {
                    let steps = this.steps;
                    let timeout = 0;
                    let timeouts = [];
                    for (let step of steps) {
                        if (step.name === "move") {
                            timeouts.push(setTimeout(() => this.move(element, step.duration, step.coordinates), timeout));
                        } else if (step.name === "scale"){
                            timeouts.push(setTimeout(() => this.scale(element, step.duration, step.ratio), timeout));
                        } else if (step.name === "fadeIn"){
                            timeouts.push(setTimeout(() => this.fadeIn(element, step.duration), timeout));
                        } else if (step.name === "fadeOut"){
                            timeouts.push(setTimeout(() => this.fadeOut(element, step.duration), timeout));
                        } else if (step.name === "delay"){
                            break;
                        }
                        timeout += step.duration;
                    }
                    return timeouts;
                }
                return setInterval(() => play(), smallerDuration);
            }
            let timeout = 0;
            let timeouts = [];
            while (this.steps.length > 0) {
                let current = this.steps.shift();
                if (current.name === "move") {
                    timeouts.push(setTimeout(() => this.move(element, current.duration, current.coordinates), timeout));
                } else if (current.name === "scale"){
                    timeouts.push(setTimeout(() => this.scale(element, current.duration, current.ratio), timeout));
                } else if (current.name === "fadeIn"){
                    timeouts.push(setTimeout(() => this.fadeIn(element, current.duration), timeout));
                } else if (current.name === "fadeOut"){
                    timeouts.push(setTimeout(() => this.fadeOut(element, current.duration), timeout));
                } else if (current.name === "delay"){
                    break;
                }
                timeout += current.duration;
            }
            return timeouts;
        },
        steps: []
    }
}
function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            animaster()
                .addFadeIn(duration)
                .Play(document
                    .getElementById('fadeInBlock'));
        });
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            animaster()
                .addMove(smallerDuration,
                    {
                        x: 100,
                        y: 10
                    })
                .Play(document
                    .getElementById('moveBlock'));
        });
    document
        .getElementById('scalePlay')
        .addEventListener('click', function () {
            animaster()
                .addScale(smallerDuration, 1.25)
                .Play(document
                    .getElementById('scaleBlock'));
        });
    document
        .getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            animaster()
                .addFadeOut(duration)
                .Play(document
                    .getElementById('fadeOut'));
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            animaster()
                .showAndHide(document
                    .getElementById('showAndHide'), duration);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            let stop = animaster()
                .heartBeating(document.getElementById('heartBeating'));
            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    document.getElementById('heartBeating');
                    stop();
                });
        });
    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let timer = animaster()
                .moveAndHide(block, duration);
            document.getElementById('resetMoveAndHide')
                .addEventListener('click', function () {
                    animaster()
                        .resetMoveAndHide(block);
                    for (let i of timer) {
                        clearTimeout(i);
                    }
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
