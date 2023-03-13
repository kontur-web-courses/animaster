addListeners();

function addListeners() {
    let master = animaster();
    const heartBeatingBlock = document.getElementById('heartBeatingBlock');
    let heartBeating = master.heartBeating(heartBeatingBlock);
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            // master.fadeIn(block, 5000);
            master.addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            master.addMove(500, {x: 100, y:20}).play(block);
            // master.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            master.addScale(1000, 1.25).play(block);
            // master.scale(block, 1000, 1.25);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            // master.fadeOut(block, 5000);
            master.addFadeOut(5000).play(block);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            master.showAndHide(block, 5000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            master.moveAndHide(block, 1000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            heartBeating.works = true;
            heartBeating.play();
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeating.stop();
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            master.resetMoveAndHide(block);
        });
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            master.resetFadeIn(block);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            master.resetFadeOut(block);
        });
}


function animaster(){
    return {
        _steps: [],

        addMove(duration, translation){
            this._steps.push({
                method: this.move,
                name: 'move',
                duration: duration,
                translation: translation,
                ratio: null,
            })
            return this;
        },

        addScale(duration, ratio){
            this._steps.push({
                method: this.scale,
                name: 'scale',
                duration: duration,
                translation: null,
                ratio: ratio,
            })
            return this;
        },

        addFadeIn(duration){
            this._steps.push({
                method: this.fadeIn,
                name: 'fadeIn',
                duration: duration,
                translation: null,
                ratio: null,
            })
            return this;
        },

        addFadeOut(duration){
            this._steps.push({
                method: this.fadeOut,
                name: 'fadeOut',
                duration: duration,
                translation: null,
                ratio: null,
            })
            return this;
        },

        play(element){
            let wait = 0;
            for (let step of this._steps) {
                if (step.translation !== null) {
                    setTimeout(() => step.method(element, step.duration, step.translation), wait)
                } else if (step.ratio !== null) {
                    setTimeout(() => step.method(element, step.duration, step.ratio), wait)
                } else {
                    setTimeout(() => step.method(element, step.duration), wait)
                }
                wait += step.duration
            }
        },

        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration){
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        moveAndHide(element, duration) {
            this.move(element, 0.4 * duration, {x: 100, y: 20});
            this.fadeOut(element, 0.6 * duration);
        },

        heartBeating(element){
                return {
                    element : element,
                    works : true,

                    stop : function ()
                    {
                        this.works = false;
                        this.element.transformS
                    },
                    play : function ()
                    {
                        if (this.works)
                        {
                            this.element.style.transitionDuration =  `${500}ms`;
                            this.element.style.transform = getTransform(null, 1.5);
                            setTimeout(() => this.element.style.transform = getTransform(null, 1), 500);
                            setTimeout(() => this.play(), 1000);
                        }
                    }
                }

        },
        resetMoveAndHide(element) {
            element.style.transitionDuration =  `${0}ms`;
            element.style.transform = getTransform({x: 0, y: 0}, null);
            element.classList.remove('hide');
            element.classList.add('show');
        },
        resetFadeIn(element) {
            element.style.transitionDuration =  `${0}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },
        resetFadeOut(element) {
            element.style.transitionDuration =  `${0}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        showAndHide(element, duration){
            this.fadeIn(element, duration/3);
            setTimeout(() => this.fadeOut(element, duration/3), duration/3);
        }
    };
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
