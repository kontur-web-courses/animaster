addListeners();

function addListeners() {
    const {fadeIn, move, scale, fadeOut, moveAndHide, showAndHide, heartBeating, resetFadeIn, resetFadeOut, resetMoveAndScale} = animaster();

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            move(block, 1000, {x: 100, y: 10});
            // setTimeout(() => {
            //     resetMoveAndScale(block)
            // }, 2000)
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            fadeOut(block, 5000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide(block, 5000, {x: 100, y: 20});
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndScale(block);
            resetFadeOut(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeat = heartBeating(block, 1000);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeat.stop();
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
    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function moveAndHide(element, duration, translation) {
        move(element, duration * 2 / 5, translation);
        setTimeout(() => fadeOut(element, 3 * duration / 5), duration * 2 / 5);
    }

    function showAndHide(element, duration) {
        const interval = duration / 3;
        fadeIn(element, interval)
        setTimeout(() => fadeOut(element, interval), interval * 2);
    }

    function heartBeating(element, duration) {
        return {
            stop() { clearInterval(this.beat) },
            beat: setInterval(() => {
                scale(element, duration / 2, 1.4);
                setTimeout(() => scale(element, duration / 2, 1), duration / 2);
            }, duration)
        }
    }

    function resetFadeIn(element) {
            fadeOut(element, 0);
            element.style.transitionDuration = null;
        }

    function resetFadeOut(element) {
            fadeIn(element, 0);
            element.style.transitionDuration = null;
        }

    function resetMoveAndScale(element) {
            element.style.transform = getTransform({x: 0, y: 0}, 1)
            element.style.transform = null;
        }
    
    function addMove(duration, translation) {
            return;
        }

    function play(element) {
            
        }

    _steps = [];

    return {fadeIn, move, scale, fadeOut, moveAndHide, showAndHide, heartBeating, resetFadeIn, resetFadeOut, resetMoveAndScale};
}
