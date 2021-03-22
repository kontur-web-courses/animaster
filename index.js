addListeners();

function addListeners() {
    const animaster = get_animaster();
    
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster.fadeIn(block, 5000);
        });


    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster.move(block, 1000, { x: 100, y: 10 });
        });


    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster.moveAndHide(block, 1000, { x: 100, y: 20 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster.scale(block, 1000, 1.25);
        });


    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster.heartBeating(block, 500, 1.4);
        });

        document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            animaster.stopHeartBeating();
        });


    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster.showAndHide(block, 5000);
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

function get_animaster() {
    return {
        heartBeatingId1: undefined,
        heartBeatingId2: undefined,
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide: function (element, duration, translation) {
            element.style.transitionDuration = `${duration * 2 / 5}ms`;
            element.style.transform = getTransform(translation, null);
            setTimeout(() => {
                element.style.transitionDuration = `${duration * 3 / 5}ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }, duration * 2 / 5)
        },
        showAndHide: function (element, duration) {
            element.style.transitionDuration = `${duration / 3}ms`;
            element.classList.remove('hide');
            setTimeout(() => { element.classList.add('hide'); }, duration * 2 / 3);
        },
        heartBeating: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            this.heartBeatingId1 = setInterval(() => {
                element.style.transform = getTransform(null, ratio);
            }, 2 * duration);
            setTimeout(() => {
                this.heartBeatingId2 = setInterval(() => {
                    element.style.transform = getTransform(null, 1 / ratio);
                }, 2 * duration);
            }, duration);
        },
        stopHeartBeating: function() {
            clearInterval(this.heartBeatingId1);
            clearInterval(this.heartBeatingId2);
        }
    }
}
