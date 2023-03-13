addListeners();

function animaster() {
    let moveAndHideTimeout;

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
        element.style.transform = getTransform(null, null);
    }

    return {
        _steps: [],
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');

            return element;
        },
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);

            return element;
        },
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);

            return element;
        },
        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');

            return element;        },
        moveAndHide: function (element, duration) {
            this.move(element, duration * 2 / 5, {x: 100, y: 20});
            moveAndHideTimeout = setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 2 / 5);
        },
        showAndHide: function (element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration * 2 / 3);
        },
        TimerId: null,
        resetMoveAndHide: function (element) {
            resetMoveAndScale(element);
            resetFadeOut(element);
            clearTimeout(moveAndHideTimeout);
        },
        heartBeating: function (element) {
            return {
                play: () => (TimerId = setInterval(() => {
                        this.scale(element, 500, 1.4);
                        setTimeout(() => this.scale(element, 500, 1), 500);
                    },
                    1000)),
                stop: () => {
                    clearInterval(TimerId)
                }
            }
        },

        addFadeIn: function (duration) {
            this._steps.push({
                name: "fadeIn",
                duration: duration,
            });

            return this;
        },

        addFadeOut: function (duration) {
            this._steps.push({
                name: "fadeOut",
                duration: duration
            });

            return this;
        },

        addScale: function (duration, ratio) {
            this._steps.push({
                name: "scale",
                duration: duration,
                ratio: ratio
            });

            return this;
        },

        addMove: function (duration, translation) {
            this._steps.push({
                name: "move",
                duration: duration,
                translation: translation
            });

            return this;
        },

        play: function (element) {
            let dur = 0;
            console.log(element);
            for (const step of this._steps) {
                setTimeout(() => {
                        switch (step.name) {
                            case "move":
                                this.move(element, step.duration, step.translation);
                                break;
                            case "scale":
                                this.scale(element, step.duration, step.ratio);
                                break;
                            case "fadeIn":
                                this.fadeIn(element, step.duration);
                                break;
                            case "fadeOut":
                                this.fadeOut(element, step.duration);
                                break;
                        }
                    }, dur
                )
                dur += step.duration;
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
            animaster().fadeOut(block, 5000);
        });

    let moveAndHideAnimaster;

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideAnimaster = animaster();
            moveAndHideAnimaster.moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).play();
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).stop();
        });

    document.getElementById('resetMoveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHideAnimaster.resetMoveAndHide(block);
        });

    document.getElementById('TestPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('TestBlock');
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(200, 1.3)
            console.log(customAnimation._steps);
            customAnimation.play(block);
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
