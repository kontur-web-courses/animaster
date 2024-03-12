addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            animaster().reset();
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            animaster().reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('showAndHideReset')
        .addEventListener('click', function () {
            animaster().reset();
        });

    let stopObj;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopObj = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            stopObj.stop();
        });

    document.getElementById('heartBeatingReset')
        .addEventListener('click', function () {
            animaster().reset();
        });


    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            animaster().reset();
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            animaster().reset();
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            animaster().reset();
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

function animaster() {

    const _steps = []
    let _currentStep = 0;
    let _currentTimeout = null;

    const play = function (element) {
        if(_currentStep === 0) {
            return;
        }

        const step = _steps[_currentStep]
        step.action(element, step.duration, step.arg)
        _currentTimeout = setTimeout(() => play(element), step.duration);
    }

    const reset = () => clearTimeout(_currentTimeout);

    const fadeIn = function (element, duration) {
        addFadeIn(duration);
        play(element);
    };

    const fadeOut = function(element, duration) {
        addFadeOut(duration);
        play(element);
    };

    const move = function (element, duration, translation) {
        addMove(duration, translation);
        play(element);
    };

    const scale = function (element, duration, ratio) {
        addScale(duration, ratio);
        play(element);
    };

    const addAction = function (action, duration, arg) {
        _steps.push({
            action,
            duration,
            arg
        });
        _currentStep++;
    };

    const addWait = (duration) => addAction(() => void 0, duration)
    const addMove = function(duration, translation) {
        addAction(function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        }, duration, translation);
    };

    const addScale = function (duration, ratio) {
        addAction(function (element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        }, duration, ratio);
    };

    const addFadeOut = function (duration) {
        addAction(function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide')
        }, duration);
    };

    const addFadeIn = function (duration) {
        addAction(function (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        }, duration);
    };

    const moveAndHide = function (element, duration) {
        const moveTime = duration * 2 / 5;
        const fadeOutTime = duration * 3 /5;
        const translation = {x:100, y:20};
        addMove(moveTime, translation);
        addFadeOut(fadeOutTime);
        play(element);
    };

    const showAndHide = function (element, duration) {
        const segmentTime = duration / 3;
        addFadeIn(element, segmentTime);
        addWait(segmentTime);
        addFadeOut(segmentTime);
        play(element);
    };

    const heartBeating = function (element) {
        let beat = function () {
            const ratio = 1.4;
            const segmentTime = 500;
            addScale(segmentTime, ratio);
            addScale(segmentTime, 1 / ratio);
            addAction(beat, 0);
        };

        addAction(beat);
        play(element);
    };

    return {
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide,
        heartBeating,
    }
}