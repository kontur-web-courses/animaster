addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            heartBeat = animaster().heartBeating(block);
        });

    document.getElementById('stopPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            heartBeat.stop(block);
        });
}

function animaster() {
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

    function moveAndHide(element, duration) {
        this.move(element, duration * 0.4, {x: 100, y: 20});
        setTimeout(() => this.fadeOut(element, duration * 0.6), duration * 0.4);
    }

    function showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(() => fadeOut(element, duration / 3), duration / 3);
    }

    function heartBeating(element) {
        let active = true;
        const timerId = setInterval(function() {
            if (active) {
                scale(element, 500, 1.4);
                active = false;
            }
            else {
                active = true;
                scale(element, 500, 1)
            }
        }, 500);
        return {
            stop: () => clearInterval(timerId)
        }
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    return {
        _steps: [],
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        heartBeating: heartBeating,
        move: move,
        scale: scale,
        addMove: (duration, translation) => {
            this._steps.push([move, duration, translation]);
            return this;
        },
        play: (element) => {
            this._steps.forEach(step => step[0](element, ...step.slice(1)));
        },
        addScale: (duration, ratio) => {
            this._steps.push([scale, duration, ratio]);
            return this;
        },
        addFadeIn: (duration) => {
            this._steps.push([fadeIn, duration]);
            return this;
        },
        addFadeOut: (duration) => {
            this._steps.push([fadeOut, duration]);
            return this;
        }
    };
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