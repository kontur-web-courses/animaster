function animaster() {
    return {
        move(element, duration, translation) {
            let reset = (element) => {
                element.style.transitionDuration = `0ms`;
                element.style.transform = getTransform({x: 0, y: 0}, null);
            }
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
            setTimeout(() => reset(element), duration);
        },

        fadeIn(element, duration) {
            let reset = (element) => {
                element.style.transitionDuration = `0ms`;
                element.classList.remove('show');
                element.classList.add('hide');
            }

            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            setTimeout(() => reset(element), duration);
        },

        fadeOut(element, duration) {
            let reset = (element) => {
                element.style.transitionDuration = `0ms`;
                element.classList.remove('hide');
                element.classList.add('show');
            }
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            setTimeout(() => reset(element), duration);
        },

        scale(element, duration, ratio) {
            let reset = (element) => {
                element.style.transitionDuration = `0ms`;
                element.style.transform = getTransform(null, 1);
            }
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
            setTimeout(() => reset(element), duration);
        },

        moveAndHide(element, duration) {
            this.move(element, duration * 2 / 5, {x: 100, y: 20});
            setTimeout(() => anime.fadeOut(element, duration), duration * 2 / 5);

        },
        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => anime.fadeOut(element, duration / 3), duration * 2 / 3);
        },
        hearthBeating(element) {
            let self = this;
            let intervalId = -1;
            return {
                stop() {
                    clearInterval(intervalId);
                },
                start() {
                    intervalId = setInterval(() => {
                        self.scale(element, 500, 1.4);
                        setTimeout(() => self.scale(element, 500, 1), 500);
                    }, 1000)
                }
            }
        }
    }
}

let anime = animaster();


addListeners();


function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anime.fadeIn(block, 5000);

        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            anime.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            anime.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anime.scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anime.moveAndHide(block, 1000);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anime.showAndHide(block, 1000);
        });

    const block = document.getElementById('heartBeatingBlock');
    let heartBeater = anime.hearthBeating(block);
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            heartBeater.start();
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeater.stop();
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


