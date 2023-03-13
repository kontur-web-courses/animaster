addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOut');
            animaster().fadeOut(block, 5000);
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
                    clearTimeout(timer);
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
            this.fadeIn(element, duration / 3);
            setTimeout(this.fadeOut, duration / 3, element, duration / 3);
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
            this.move(element, moveTime, {x: 100, y: 10});
            return setTimeout(() => this.fadeOut(element, fadeOutTime), moveTime);
        },
        'resetMoveAndHide': function (element) {
            resetMoveAndScale(element);
            resetFadeOut(element);
        }
        'addMove': function addMove(duration, coordinates) {
            this._steps.push({name: 'move', duration:duration, coordinates: coordinates});
            return this;
        },
        'Play':function play(element) {
            while(this._steps.length>0){
                let current=this._steps.shift();
                if (current.name==='move'){
                    this.move(element,current.duration,current.coordinates)
                }
            }
        },
        _steps:[]
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

