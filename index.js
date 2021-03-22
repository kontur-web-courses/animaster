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
            return {
                stop: function () {
                    clearInterval(id1);
                    clearInterval(id2);
                }
            }
        },
        resetFadeIn: function (element) {
            element.classList.show = null;
        },
        resetFadeOut: function (element) {
            element.classList.hide = null;
            element.classList.add("show");
        },
        resetMoveAndHide: function (element) {
            this.resetFadeOut(element)
            element.style.transform = null;
        },
        _steps: [],
        addMove: function (duration, translation){
            this._steps.push({
                name: "move",
                duration: duration,
                translation: translation
            });
            return this;
        },
        addScale: function (duration, ratio){
            this._steps.push({
                name: "scale",
                duration: duration,
                ratio: ratio
            });
            return this;
        },
        addFadeIn : function (duration){
            this._steps.push({
                name: "fadeIn",
                duration: duration,
            });
            return this;
        },
        addFadeOut: function (duration){
            this._steps.push({
                name: "fadeOut",
                duration: duration
            });
            return this;
        },
        play: function (element){
            let timeout = 0
            for (let step of this._steps){
                switch (step.name) {
                    case 'move':
                        setTimeout(this.move, timeout, element, step.duration, step.translation);
                        break;
                    case 'scale':
                        setTimeout(this.scale, timeout, element, step.duration, step.ratio);
                        break;
                    case 'fadeIn':
                        setTimeout(this.fadeIn, timeout, element, step.duration);
                        break;
                    case 'fadeOut':
                        setTimeout(this.fadeOut, timeout, element, step.duration);
                        break;
                }
                timeout += step.duration;
            }
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
            am.addMove( 1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            am.addScale(1000, 1.25).play(block);
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
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            am.resetMoveAndHide(block)
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            am.showAndHide(block, 3000)
        });
    let hearthBeating;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            hearthBeating = am.heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            document.getElementById('heartBeatingBlock');
            hearthBeating.stop();
        });
    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            let newAm = animaster();
            newAm.addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1)
                .play(block);
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