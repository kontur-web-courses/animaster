addListeners();

function addListeners() {
    let Heart
    document.getElementById('fadeInPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {
                x: 100,
                y: 10
            });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function() {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('moveAndHide')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, {
                x: 100,
                y: 20
            });
        })
    document.getElementById('showAndHide')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000, {
                x: 100,
                y: 20
            });
        })
    document.getElementById('beating')
        .addEventListener('click', function() {
            const block = document.getElementById('beatingBlock');
            Heart = animaster().heartBeating(block);
        })
    document.getElementById('stopBeating')
        .addEventListener('click', function() {
            Heart.stop()
        })
}

function animaster() {
    return {
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');

        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');

        },
        moveAndHide(element, duration, angle) {
            this.move(element, duration * 2 / 5, angle);
            setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5);
        },
        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3)
            setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
        },
        heartBeating(element) {
            let id = setInterval(() => {
                setTimeout(() => this.scale(element, 500, 1.4), 0);
                setTimeout(() => this.scale(element, 500, 1), 510)
            }, 1000)
            return {
                stop() {
                    clearInterval(id)
                }
            }
        },
        resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.remove('show');
            element.classList.add('hide');
        }
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