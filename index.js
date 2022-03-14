addListeners();

function addListeners() {
    const animaster_obj = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster_obj.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster_obj.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster_obj.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster_obj.moveAndHide(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster_obj.showAndHide(block, 1000);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster_obj.scale(block, 1000, 1.25);
        });

    const tmp = undefined;

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            this.tmp = animaster_obj.heartBeating(block);
            this.tmp.objHeartBeating();
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            this.tmp.stop(block);
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

function animaster() {

    return {

        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        moveAndHide(element, duration, translation) {
            this.move(element, duration / 5 * 2, translation);
            this.fadeOut(element, duration / 5 * 3);
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration / 3);
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        heartBeating(element) {
            const originalThis = this;
            return {
                timerFlag: true,
                objHeartBeating() {
                    let counter = 0;
                    function infiniteAnimate() {
                        if (counter === 0) {
                            this.scale(element, 500, 1.4);
                        } else {
                            this.scale(element, 500, 5 / 7)
                        }
                        counter = (counter + 1) % 2;
                        if (this.timerFlag)
                            setTimeout(infiniteAnimate.bind(originalThis), 500);
                    }
                    setTimeout(infiniteAnimate.bind(originalThis), 500);
                },
                stop() {
                    this.timerFlag = false;
                }
            }

        }
    }
}
