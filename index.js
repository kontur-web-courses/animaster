addListeners();

function addListeners() {
    let heartBeatingObject;
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
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            customAnimation.play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 3000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHideReset(block, 3000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingObject = animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingObject.stop();
        });
}

/* let step = {
    name : null,
} */



function animaster() {
    let _resetFadeIn = function(element) {
        element.style.transitionDuration = null;
        element.classList.add('hide');
    };
    let _resetFadeOut = function(element) {
        element.style.transitionDuration = null;
        element.classList.add('show');
    };
    let _resetMoveAndScale = function(element) {
        element.style.transitionDuration = null;
        element.style.transform = getTransform({x : 0, y : 0}, 0);
    }
    let obj = {
        _steps : [],

        addMove : function(inDuration, inTranslation) {
            let step = {
                operationName : 'move',
                duration : inDuration,
                params : {
                    translation : inTranslation
                },
                run : function(element){
                    element.style.transitionDuration = `${this.duration}ms`;
                    element.style.transform = getTransform(this.params.translation, null);
                }
            };
            this._steps.push(step);
            return this;
        },
        addScale : function(duration, ratio) {
            let step = {
                operationName : "scale",
                duration,
                params : {
                    ratio,
                },
                run : function(element) {
                    element.style.transitionDuration =  `${duration}ms`;
                    element.style.transform = getTransform(null, ratio);
                }
            };
            this._steps.push(step);
            return this;
        },
        addFadeIn : function(duration) {
            let step = {
                operationName : "fadeIn",
                duration,
                params : {},
                run : function(element) {
                    element.style.transitionDuration =  `${duration}ms`;
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            };
            this._steps.push(step);
            return this;
        },
        addFadeOut : function(duration) {
            let step = {
                operationName : "fadeOut",
                duration,
                params : {},
                run : function(element) {
                    element.style.transitionDuration =  `${duration}ms`;
                    element.classList.remove('show');
                    element.classList.add('hide');
                }
            }
            this._steps.push(step);
            return this;
        },
        play : function(element){
            let timeout = 0;
            for(let e of this._steps){
                setTimeout(() => e.run(element), timeout);
                timeout += e.duration;
            }
        },
        move : function(element, duration, translation) {
            animaster().addMove(duration, translation).play(element);
        },
        fadeIn : function(element, duration) {
            animaster().addFadeIn(duration).play(element);
        },
        scale : function(element, duration, ratio) {
            animaster().addScale(duration, ratio).play(element);
        },
        fadeOut : function(element, duration) {
            animaster().addFadeOut(duration).play(element);
        },
        moveAndHide : function(element, duration) {
            this.move(element, 0.4 * duration, {x : 100, y: 20});
            setTimeout(() => this.fadeOut(element, 0.6 * duration), 0.4 * duration);
        }, 
        moveAndHideReset : function(element){
            _resetFadeOut(element);
            _resetMoveAndScale(element);
        },
        showAndHide : function(element, duration) {
            this.fadeIn(element, 1/3 * duration);
            setTimeout(() => this.fadeOut(element, 1/3 * duration), 2/3 * duration);
        },
        heartBeating : function(element) {
            let func = function(){
                animaster().scale(element, 500, 1.4);
                setTimeout(() => animaster().scale(element, 500, 1), 500);
            }
            let interval = setInterval(func, 1000);

            return {
                stop : () => {
                    clearInterval(interval);
                }
            };
        }
    };
    return obj;
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
