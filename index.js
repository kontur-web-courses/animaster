addListeners();
const anim = animaster();
function addListeners() {
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            anim.addFadeOut(5000).play(block);
        });
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim.addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            anim.addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anim.addScale(1000, 1.25).play(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.addMove(5000 * 0.4, {x: 20, y: 100}).addFadeOut(5000 * 0.6).play(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim.showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            anim.heartBeating(block, 1000, 1.4);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            anim.heartBeating(block, 1000, 1.4).stop();
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.moveAndHideReset(block);
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
        _steps : [],
        intervalId : -1,
        scale: function(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeIn: function(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.add('show');
            element.classList.remove('hide');
        },
        fadeOut: function(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        move: function(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        moveAndHide: function(element, duration, translation) {
            this.move(element, duration * 0.4, translation);
            setTimeout(() => this.fadeOut(element, duration * 0.6), duration * 0.4);
        },
        showAndHide: function(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => this.fadeOut(element, duration / 3), duration * 2 / 3);
        },
        heartBeating: function(element, duration, ratio) {
            if (this.intervalId === -1) {
                    this.intervalId = setInterval(() => {
                        this.scale(element, duration / 2, ratio);
                        setTimeout(() => this.scale(element, duration / 2, 1), duration / 2);
                }, duration);
            }
            return {
                stop: function() {
                    clearInterval(this.intervalId);
                    this.intervalId = -1;
                }.bind(this),
            }
        },
        resetFadeIn: function(element) {
            element.style.transitionDuration = null;
            this.fadeOut(element);
        },
        resetFadeOut: function(element) {
            element.style.transitionDuration = null;
            this.fadeIn(element);
        },
        resetMoveAndScale: function(element) {
            element.style.transitionDuration = null;
            element.style.transform = null;
        },
        moveAndHideReset: function(element) {
            this.resetMoveAndScale(element);
            this.resetFadeOut(element);
        },
        addMove: function(duration, translation) {
            this._steps.push({
                name: 'move',
                duration: duration,
                translation: translation,
            });
            return this;
        },
        addFadeIn: function(duration) {
            this._steps.push({
                name: 'fadeIn',
                duration: duration,
            });
            return this;
        },
        addFadeOut: function(duration) {
            this._steps.push({
                name: 'fadeOut',
                duration: duration,
            });
            return this;
        },
        addScale: function(duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration: duration,
                ratio: ratio,
            });
            return this;
        },
        play: function(element) {
            for(const step of this._steps) {
                switch (step.name) {
                    case 'move':
                        this.move(element, step.duration, step.translation);
                        break;
                    case 'fadeIn':
                        this.fadeIn(element, step.duration);
                        break;
                    case 'fadeOut':
                        this.fadeOut(element, step.duration);
                        break;
                    case 'scale':
                        this.scale(element, step.duration, step.ratio);
                        break;
                }
            }
            this._steps = [];
        },
    }
}