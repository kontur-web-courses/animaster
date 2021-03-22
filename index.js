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
            let newDuration = duration / 3;
            this.fadeIn(element, newDuration);
            this.fadeIn(element, newDuration);
            setTimeout(this.fadeOut, newDuration, element, newDuration);
        },
        moveAndHide: function (element, duration) {
            let moveDuration = duration / 5 * 2;
            let hideDuration = duration / 5 * 3;
            this.move(element, moveDuration, {x: 100, y: 20});
            this.fadeOut(element, hideDuration);
        },
        heartBeating: function (element) {
            let id1 = setInterval(this.scale, 500, element, 500, 1.4);
            let id2 = setInterval(this.scale, 1000, element, 500, 1);
            return {stop: function(){
                clearInterval(id1);
                clearInterval(id2);
                }}
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
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            am.moveAndHide(block, 5000)
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            am.showAndHide(block, 3000)
        });
    let hb;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            hb = am.heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            hb.stop();
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