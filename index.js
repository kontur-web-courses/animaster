addListeners();

function animaster (){
    this._steps = []

    this.addMove = function (duration, translation){
        this._steps.push({
            func: this.move,
            res_func: this.resetMoveAndScale,
            duration,
            translation,
            start: function (element) {
                this.func(element, duration, translation);
            },
            res: function (element){
                this.res_func(element);
            }
        });

        return this;
    }

    this.addScale = function (duration, ratio){
        this._steps.push({
            func: this.scale,
            res_func: this.resetMoveAndScale,
            duration,
            ratio,
            start: function (element) {
                this.func(element, this.duration, this.ratio)
            },
            res: function (element) {
                this.res_func(element);
            }
        });

        return this;
    }

    this.addFadeIn = function (duration) {
        this._steps.push({
           func: this.fadeIn,
           res_func: this.resetFadeIn,
           duration,
           start: function (element) {
               this.func(element, this.duration);
           },
           res: function (element) {
               this.res_func(element);
           }
        });

        return this;
    }

    this.addDelay = function (duration) {
        this._steps.push({
            duration,
            start: function () {
            },
            res: function (){

            }
        })
    }

    this.addFadeOut = function (duration) {
        this._steps.push({
            func: this.fadeOut,
            res_func: this.resetFadeOut,
            duration,
            start: function (element) {
                this.func(element, this.duration);
            },
            res: function (element) {
                this.res_func(element);
            }
        });

        return this;
    }

    this.play = function (element, cycled= false) {
        let last_duration = 0;
        let full_duration = 0;
        let interval;
        for (const step of this._steps) {
            setTimeout(step.start.bind(step), last_duration, element);
            last_duration = step.duration;
            full_duration += step.duration;
        }

        if (cycled) {
            interval = setInterval(() => {
                let last_duration = 0;
                for (const step of this._steps) {
                    setTimeout(step.start.bind(step), last_duration, element);
                    last_duration = step.duration;
                }
            }, full_duration);
        }

        return {
            steps: this._steps,
            stop: function () {
                clearInterval(interval);
            },
            reset: function () {
                for (const step of this.steps) {
                    step.res.bind(step)(element);
                }
            }
        };
    }


    this.moveAndHide = function (duration) {
        this.addMove(duration * 2 /5, {x:100, y:20});
        this.addFadeOut(duration * 3 /5);
        return this;
    }

    this.showAndHide = function (duration) {
        this.addFadeIn(duration / 3);
        this.addDelay(duration / 3);
        this.addFadeOut(duration / 3);
        return this;
    }

    this.fadeIn = function (element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    this.resetFadeIn = function (element){
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    this.resetFadeOut = function (element){
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    this.resetMoveAndScale = function (element){
        element.style.transitionDuration = null;
        element.style.transform = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    this.fadeOut = function (element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    this.move = function (element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }
    this.scale = function (element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    this.heartBeating = function () {
        this.addScale(500, 1.4);
        this.addScale(500, 1);

        return this;
    }

    this.buildHandler = function (){
        const p = this.play.bind(this);
        return function (element){
            return p(element.target);
        }
    }

    return this;
}
function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });

    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const a = animaster().moveAndHide(2000).play(block);
            document.getElementById('moveAndHideReset')
                .addEventListener('click', a.reset.bind(a));
        });


    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(2000).play(block);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            hb = animaster().heartBeating(block).play(block, true);
            document.getElementById('heartBeatingStop')
                .addEventListener('click', hb.stop)
        })
    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();

    document
        .getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
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
