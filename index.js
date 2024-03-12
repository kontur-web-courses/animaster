function animaster() {
    let _steps = [];
    function addMove(duration, translation) {
        _steps.push({ operation: 'move', duration, translation });
        return this;
    }

    function addScale(duration, ratio){
        _steps.push({ operation: 'scale', duration, ratio});
        return this;
    }

    function addFadeOut(duration){
        _steps.push({ operation: 'fadeOut', duration});
        return this;
    }

    function addFadeIn(duration, translation) {
        _steps.push({ operation: 'fadeIn', duration, translation });
        return this;
    }

    function play(element) {
        _steps.forEach(step => {
            switch(step.operation){
                case 'move':
                    move(element, step.duration, step.translation);
                    break
                case 'scale':
                    scale(element, step.duration, step.ratio);
                    break
                case 'fadeOut':
                    fadeOut(element, step.duration)
                    break
                case 'fadeIn':
                    fadeIn(element, step.duration)
                    break
            }
            _steps = [];
        });
    }

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

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
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


    function showAndHide(element, totalDuration) {
        const fadeInDuration = totalDuration / 3; // Продолжительность появления
        const waitDuration = fadeInDuration; // Продолжительность ожидания
        const fadeOutDuration = fadeInDuration; // Продолжительность исчезания

        fadeIn(element, fadeInDuration);

        setTimeout(() => {
            setTimeout(() => {
                fadeOut(element, fadeOutDuration);
            }, waitDuration);
        }, fadeInDuration);
    }

    function moveAndHide(element, duration, translation) {
        let moveInterval;
        const moveDuration = duration * 0.4;
        const fadeOutDuration = duration * 0.6;

        move(element, moveDuration, translation);

        setTimeout(() => {
            fadeOut(element, fadeOutDuration);
        }, moveDuration);

        return {
            reset: function() {
                element.style.transitionDuration = '0s';
                element.style.transform = getTransform({ x: 0, y: 0 }, null);
                element.classList.remove('hide');
                element.classList.add('show');
            }
        };
    }

    function heartBeating(element, duration) {
        let scaleValue = 1;
        let interval = setInterval(function() {
            const ratio = scaleValue === 1 ? 1.4 : 1;
            scale(element, duration / 2, ratio);
            scaleValue = ratio;
        }, duration / 2);

        return {
            stop: function() {
                clearInterval(interval);
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

    return {
        addMove,
        addScale,
        addFadeOut,
        addFadeIn,
        play,
        fadeIn,
        fadeOut,
        move,
        scale,
        showAndHide,
        moveAndHide,
        heartBeating
    };
}

const animations = animaster();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animations.addFadeIn(5000).play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animations.addFadeOut(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animations.addMove(1000, { x: 100, y: 10 }).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animations.addScale(1000, 1.25).play(block);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animations.showAndHide(block, 1000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHidePlayAnimation = animations.moveAndHide(block, 1000, { x: 100, y: 20 });
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            moveAndHidePlayAnimation.reset();
        });
    document.getElementById('heartBeatingPlay').addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        heartBeatingAnimation = animations.heartBeating(block, 1000);

    });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeatingAnimation.stop();
        });

}

addListeners();
