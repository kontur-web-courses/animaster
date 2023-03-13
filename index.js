addListeners();

function animaster() {
    function resetFadeIn(element) {
        animaster().fadeOut(element, 0);
    }

    function resetFadeOut(element) {
        animaster().fadeIn(element, 0);
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = '0s';
        element.style.transform = getTransform({x: 0, y: 0}, 1);
    }

    return {
        fadeIn: (element, duration) => {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            },

        move: (element, duration, translation) => {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale: (element, duration, ratio) => {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);

        },

        fadeOut: (element, duration) => {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        moveAndHide: (element, duration) => {
            element.style.transitionDuration = `${duration * 0.4}ms`;
            element.style.transform = getTransform({x: 100, y: 20}, null);
            setTimeout(() => {
                element.style.transitionDuration = `${duration * 0.6}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
                },duration * 0.4)
        },

        showAndHide: (element, duration) => {
            element.style.transitionDuration = `${duration / 3}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            setTimeout(() => {
                element.style.transitionDuration = `${duration / 3}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            },duration / 3 * 2)
        },

        heartBeating: (element) => {
            let intervalId;
            return {
                start: () => intervalId = setInterval(() => {
                element.style.transitionDuration = `500ms`;
                element.style.transform = getTransform(null, 1.4);
                setTimeout(() => {
                    element.style.transitionDuration = `500ms`;
                    element.style.transform = getTransform(null,  1);
                }, 500)}, 1000),

                stop: () => {
                    clearInterval(intervalId);
                }
            }
        }
    }
}



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
            animaster().fadeOut(block, 1000);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });

    const block = document.getElementById('heartBeatingBlock');
    const heartBeating = animaster().heartBeating(block);

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            heartBeating.start();
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeating.stop();
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
