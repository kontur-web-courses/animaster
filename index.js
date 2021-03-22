addListeners();

function addListeners() {
    let ani = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            ani.fadeIn(block, 5000);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            ani.fadeOut(block, 5000);
        });
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            ani.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            ani.scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            ani.moveAndHide(block, 5000, {x: 100, y: 20});
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            ani.stealBeating = true;
            ani.heartBeating(block, ani);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener("click", function () {
            ani.stealBeating = false;
        })
}

function animaster() {
    return {
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        moveAndHide(element, duration, translation) {
            this.move(element, duration * 3 / 5, translation);
            setTimeout(this.fadeOut, duration * 3 / 5, element, duration * 2 / 5)
        },

        heartBeating(element, ani) {
            if (!ani.stealBeating) {
                return;
            }
            ani.scale(element, 450, 1.4);
            setTimeout(ani.scale, 500, element, 450, 1);
            setTimeout(ani.heartBeating, 1000, element, ani);
        },

        stealBeating: false,
    }
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
