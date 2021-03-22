function animaster() {
    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function moveAndHide(element, duration) {
        const moveDuration = 0.4 * duration;
        move(element, moveDuration, {x: 100, y: 20});
        setTimeout(() => fadeOut(element, duration - moveDuration), moveDuration);
    }

    function showAndHide(element, duration) {
        const phaseDuration = duration / 3;
        fadeIn(element, phaseDuration);
        setTimeout(() => fadeOut(element, phaseDuration),
            2 * phaseDuration);
    }

    function heartBeating(element) {
        const timerId = setInterval(() => {
            setTimeout(() => scale(element, 500, 1.4), 0);
            setTimeout(() => scale(element, 500, 1/1.4), 500);
        }, 1000);
        return {
            stop: function () {
                clearInterval(timerId);
            }
        }
    }

    return {
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        move: move,
        scale: scale,
        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        heartBeating: heartBeating
    }
}

addListeners();

function addListeners() {
    let heartBeat = undefined;
    const aniMaster = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            aniMaster.fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            aniMaster.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            aniMaster.scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            aniMaster.fadeOut(block, 5000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            aniMaster.moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            aniMaster.showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeat = aniMaster.heartBeating(block, 5000);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeat.stop();
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
