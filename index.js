addListeners();

var stop = null;

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            stop = animaster().heartBeating(block, 1000);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            stop.stop();
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        });

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            const customAnimation = animaster()
                                        .addMove(1000, {x: 40, y: 40})
                                        .addMove(1000, {x: 80, y: 0})
                                        .addMove(1000, {x: 40, y: -40});
            customAnimation.play(block);
        });
}


function animaster() {
    var resetFadeIn = function(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    };
    var resetFadeOut = function(element){
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    };
    var resetMoveAndScale = function(element){
        element.style.transitionDuration = null;
        element.style.transform = null;
    };

    return {
        fadeIn: function (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut: function (element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale: function (element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide: function (element, duration) {
            this.move(element, duration * 0.4, {x: 100, y: 20});
            setTimeout(() => {this.fadeOut(element, duration * 0.6);}, duration * 0.4);
        },

        resetMoveAndHide: function (element) {
            resetFadeIn(element);
            resetMoveAndScale(element);
        },

        showAndHide: function (element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => {this.fadeOut(element, duration / 3);}, duration * 2 / 3);
        },

        heartBeating: function (element, duration) {
            var flag = true;
            setInterval(function (self) {
                if (!flag)
                    return;
                self.scale(element, duration / 2, 1.4);
                setTimeout(() => {self.scale(element, duration / 2, 1);}, duration / 2);
            }, duration, this)
            return {stop: () => {flag = false;}};
        },

        _steps: [],
        _durations: [0],

        _addStep: function(step, duration, ...args) {
            this._durations.push(this._durations.at(-1) + duration);
            this._steps.push((element) => setTimeout(() => step(element, duration, ...args), this._durations.at(-1)));
            return this;
        },

        play: function(element) {
            this._steps.forEach(function(e) { e(element); console.log('hui'); });
        },

        addMove: function(duration, translation) {
            this._addStep(this.move, duration, translation);
            return this;
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
