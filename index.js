addListeners();

let beatingFlag;

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000).start();
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000).reset();
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000).start();
        });

    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000).reset();
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000, {x: 100, y: 20});
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).start();
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).stop();
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10}).start();
        });

    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 0, y: 0}).reset();
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25).start();
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1).reset();
        });
}

function animaster() {
    return {
        fadeIn: function(element, duration){
            return {
                start: function () {
                    element.style.transitionDuration =  `${duration}ms`;
                    element.classList.remove('hide');
                    element.classList.add('show');
                },

                reset: function () {
                    element.style.transitionDuration = null;
                    element.classList.remove('show');
                    element.classList.add('hide');
                }
            };
        },

        fadeOut: function (element, duration) {
            return {
                start: function () {
                    element.style.transitionDuration =  `${duration}ms`;
                    element.classList.remove('show');
                    element.classList.add('hide');
                },

                reset: function () {
                    element.style.transitionDuration = null;
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            }
        },

        move: function(element, duration, translation) {
            return {
                start: function () {
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = animaster().getTransform(translation, null);
                },

                reset: function () {
                    element.style.transitionDuration = null;
                    element.style.transform = animaster().getTransform(translation, null);
                }
            };
        },

        scale: function(element, duration, ratio) {
            return {
                start: function () {
                    element.style.transitionDuration =  `${duration}ms`;
                    element.style.transform = animaster().getTransform(null, ratio);
                },

                reset: function () {
                    element.style.transitionDuration = null;
                    element.style.transform = animaster().getTransform(null, ratio);
                }
            };
        },

        moveAndHide: function (element, duration, translation) {
            this.move(element, duration * 2/5, translation).start();
            this.fadeOut(element, duration * 3/5).start();
        },

        showAndHide: function (element, duration) {
            this.fadeIn(element, duration * 1 / 3).start();
            setTimeout(() => this.fadeOut(element, duration * 1/3).start(), duration * 1 /3);
        },

        heartBeating: function (element) {
            const self = this;

            function beating() {
                self.scale(element, 500, 1.4).start();
                setTimeout(() => self.scale(element, 500, 1 / 1.4).start(), 500);
            }

            return {
                start: function () {
                    beatingFlag = setInterval(beating, 1000);
                },
                stop: function () {
                    clearInterval(beatingFlag);
                    beatingFlag = 0;
                }
            };
        },

        getTransform: function(translation, ratio){
            const result = [];
            if (translation) {
                result.push(`translate(${translation.x}px,${translation.y}px)`);
            }
            if (ratio) {
                result.push(`scale(${ratio})`);
            }
            return result.join(' ');
        }
    }
}
