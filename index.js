addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).Play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).Play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).Play(block);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOut');
            animaster().addFadeOut(5000).Play(block);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHide');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeating');
            let stop = animaster().heartBeating(block);
            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    const block = document.getElementById('heartBeating');
                    stop();
                });
        });
    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let timer = animaster().moveAndHide(block, 5000);
            document.getElementById('resetMoveAndHide')
                .addEventListener('click', function () {
                    animaster().resetMoveAndHide(block);
                    for (let i of timer) {
                        clearTimeout(i);
                    }
                });
        });
}

function animaster() {
    let resetMoveAndScale = function rsms(elment) {
        elment.style.transitionDuration = null;
        elment.style.transform = null;
    };
    let resetFadeOut = function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    };
    let resetFadeIn = function fadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    };
    return {
        'fadeIn': function fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        'fadeOut': function fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        'move': function move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        'scale': function scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        'showAndHide': function scale(element, duration) {
            animaster()
                .addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .Play(element);
        },
        'heartBeating': function heartBeating(element) {
            let beating = setInterval(() => {
                this.scale(element, 500, 1.4);
                setTimeout(() => this.scale(element, 500, 1), 500);
            }, 1000);
            return function stop() {
                clearInterval(beating);
            };
        },
        'moveAndHide': function moveAndHide(element, duration) {
            let moveTime = (2 / 5) * duration;
            let fadeOutTime = (3 / 5) * duration;
            this.move(element, moveTime,);
            return animaster()
                .addMove(moveTime, {x: 100, y: 10})
                .addFadeOut(fadeOutTime)
                .Play(element);
        },
        'resetMoveAndHide': function (element) {
            resetMoveAndScale(element);
            resetFadeOut(element);
        },
        'addMove': function addMove(duration, coordinates) {
            this._steps.push({name: 'move', duration: duration, coordinates: coordinates});
            return this;
        },
        'addFadeIn': function addScale(duration) {
            this._steps.push({name: 'fadeIn', duration: duration});
            return this;
        },
        'addFadeOut': function addScale(duration) {
            this._steps.push({name: 'fadeOut', duration: duration});
            return this;
        },
        'addScale': function addScale(duration, ratio) {
            this._steps.push({name: 'scale', duration: duration, ratio: ratio});
            return this;
        },
        'addDelay': function addScale(duration) {
            this._steps.push({name: 'delay', duration: duration});
            return this;
        },
        'Play': function play(element) {
            let timeout = 0;
            let timeouts = [];
            while (this._steps.length > 0) {
                let current = this._steps.shift();
                switch (current.name) {
                    case "move":
                        timeouts.push(setTimeout(() => this.move(element, current.duration, current.coordinates), timeout));
                        break;
                    case "scale":
                        timeouts.push(setTimeout(() => this.scale(element, current.duration, current.ratio), timeout));
                        break;
                    case "fadeIn":
                        timeouts.push(setTimeout(() => this.fadeIn(element, current.duration), timeout));
                        break;
                    case "fadeOut":
                        timeouts.push(setTimeout(() => this.fadeOut(element, current.duration), timeout));
                        break;
                    case "delay":
                        break;
                }
                timeout += current.duration;
            }
            return timeouts;
        },
        _steps: []
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

