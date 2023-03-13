addListeners();

function addListeners() {
    let anim = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim.fadeIn(block, 5000);
        });
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            anim.fadeOut(block, 5000);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            resetFadeOut(block);
        });

    let stopBeating;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stopBeating = anim.heartBeating(block, 1.4, 500);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (stopBeating)
                stopBeating.stop();
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            anim.addMove(1000, {x: 100, y: 10}).play(block);
        });
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            resetMove(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anim.scale(block, 1000, 1.25);
        });
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            resetScale(block);
        });

    let stopMoveAndHide;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.addMoveAndHide(1000, {x: 100, y: 10}).play(block);
            stopMoveAndHide = anim.moveAndHide(block, 1000, {x: 100, y: 20});
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            if (stopMoveAndHide) {
                stopMoveAndHide.stop();
                resetMoveAndHide(block, stop);
            }
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim.showAndHide(block, 1000);
        });
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

function resetMove(element) {
    element.style.transitionDuration = null;
    element.style.transform = getTransform({x: 0, y: 0}, null);
}

function resetScale(element) {
    element.style.transitionDuration = null;
    element.style.transform = getTransform(null, 1);
}

function resetMoveAndHide(element) {
    resetMove(element);
    resetFadeOut(element);
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
        _steps: this._steps = [],

        fadeIn: function fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut: function fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        heartBeating: function heartBeating(element, scale, duration) {
            const f = () => {
                this.scale(element, duration, scale);
                setTimeout(() => this.scale(element, duration, 1), duration);
            };
            f();
            const id = setInterval(f, duration * 2);

            return {
                stop: function stop() {
                    clearInterval(id);
                }
            };
        },
        move: function move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale: function scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide: function moveAndHide(element, duration, translation){
            this.move(element, duration * 2/5, translation);
            const id = setTimeout(() => this.fadeOut(element, duration * 3/5), duration * 2/5);
            return {
                stop: function () {
                    clearTimeout(id);
                }
            };
        },

        showAndHide: function showAndHide(element, duration){
            this.fadeIn(element, duration * 1/3);
            setTimeout(() => this.fadeOut(element, duration * 1/3), duration * 2/3);
        },

        delay: function delay(element, duration){
            setTimeout(() => {}, duration);
        },

        addMove: function addMove(duration, translation){
            this._steps.push({
                operation: 'move',
                duration,
                translation,
            });
            return this;
        },

        addScale: function addScale(duration, ratio){
            this._steps.push({
                operation: 'scale',
                duration,
                ratio,
            });
            return this;
        },

        addFadeIn: function addFadeIn(duration){
            this._steps.push({
                operation: 'fadeIn',
                duration,
            });
            return this;
        },

        addFadeOut: function addFadeOut(duration){
            this._steps.push({
                operation: 'fadeOut',
                duration,
            });
            return this;
        },

        addDelay: function addDelay(duration){
            this._steps.push({
                operation: 'delay',
                duration,
            });
            return this;
        },

        addMoveAndHide: function addMoveAndHide(duration, translation){
            this._steps.push({
                operation: 'moveAndHide',
                duration,
                translation,
            });
            return this;
        },

        play: function play(element){
            for (let step of this._steps){
                switch (step.operation){
                    case 'move':
                        this.move(element, step.duration, step.translation);
                        break;
                    case 'scale':
                        this.scale(element, step.duration, step.ratio)
                        break;
                    case 'fadeIn':
                        this.fadeIn(element, step.duration);
                        break;
                    case 'fadeOut':
                        this.fadeOut(element, step.duration)
                        break;
                    case 'delay':
                        this.delay(element, step.duration);
                        break;
                }
            }
        }
    }
}
