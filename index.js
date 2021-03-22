addListeners();

function animaster() {

    return {
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        showAndHide: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        }
    }
}

function addListeners() {
    let am = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            am.fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            am.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            am.scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            am.fadeOut(block, 5000)
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            am.fadeOut(block, 3000)
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