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
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });
    
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000).start();
        });
    
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000).stop();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).start();
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).stop();
        });
}

const animasterBase = {
    fadeIn : function(element, duration, reverse) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove(reverse ? 'show' : 'hide');
        element.classList.add(reverse ? 'hide' : 'show');
    },
    move : function (element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    },
    scale: function(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }
}

function animaster() {
    const _animaster = {
        fadeIn : (element, duration) => animasterBase.fadeIn(element, duration, false),
        move : animasterBase.move,
        scale: animasterBase.scale,
        fadeOut: (element, duration) => animasterBase.fadeIn(element, duration, true),
        moveAndHide : (element, duration) => {
            return {
                start : () => {
                    animasterBase.move(element, 2 / 5 * duration, {x : 100, y : 20});
                    this.timerId = setTimeout(animasterBase.fadeIn, 2 / 5 * duration, element, 3 / 5 * duration, true);
                },
                stop : () => {
                    clearTimeout(this.timerId);
                    _animaster.resetMoveAndScale(element);
                    _animaster.resetFadeOut(element);
                }
            }
        },
        showAndHide : (element, duration) => {
            animasterBase.fadeIn(element, 1 / 3 * duration, false);
            setTimeout(animasterBase.fadeIn, 2 / 3 * duration, element, 1 / 3 * duration, true);
        },
        heartBeating : (element) => {
                return {
                    start : () => {
                        this.timerId = setTimeout(function tick() {
                            animasterBase.scale(element, 500, 1.4);
                            setTimeout(animasterBase.scale, 500, element, 500, 1);
                            this.timerId = setTimeout(tick, 1000)
                        }, 0);
                    },
                    stop : () => {
                        clearTimeout(this.timerId);
                        _animaster.resetMoveAndScale(element);
                        _animaster.resetFadeOut(element);
                    }
                };
        },
        resetFadeIn : (element) => {
            element.style.transitionDuration =  null;
            let classList = element.classList;
            classList.remove('show');
            if (!classList.contains('hide')) classList.add('hide');
        },
        resetFadeOut : (element) => {
            element.style.transitionDuration =  null;
            let classList = element.classList;
            classList.remove('hide');
            if (!classList.contains('show')) classList.add('show');
        },
        resetMoveAndScale : (element) => {
            element.style.transitionDuration = null;
            element.style.transform = null;
        }
    }
    return _animaster
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
