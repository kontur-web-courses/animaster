addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
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
    
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });
    
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000).stop();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).stop();
        });
}



function animaster() {
    class Animaster{
        constructor(){
            this._steps = [];
        }

        fadeOut(duration, element){
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        }

        fadeIn(element, duration){
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        }

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        }

        scale (element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        }

        moveAndHide(element, duration){
            class MoveAndHider extends Animaster {
                constructor() {
                    super();
                    this.move(element, 2 / 5 * duration, {x : 100, y : 20});
                    this.timerId = setTimeout(this.fadeIn, 2 / 5 * duration, element, 3 / 5 * duration);
                }

                stop() {
                    clearTimeout(this.timerId);
                    this.resetMoveAndScale(element);
                    this.resetFadeOut(element);
                }
            }
            return new MoveAndHider();
        }

        showAndHide(element, duration){
            this.fadeIn(element, 1 / 3 * duration);
            setTimeout(this.fadeOut, 2 / 3 * duration, element, 1 / 3 * duration);
        }

        ///&????
        heartBeating (element){
            let scale = this.scale;
            let resetMoveAndScale = this.resetMoveAndScale;
            let resetFadeOut = this.resetFadeOut;
            let timerId = setInterval(function tick() {
                scale(element, 500, 1.4);
                setTimeout(scale, 500, element, 500, 1);
            }, 1000);
            return {
                    stop : () => {
                        clearInterval(timerId);
                        timerId = null;
                        resetMoveAndScale(element);
                        resetFadeOut(element);
                    }
            };
        }


        addMove(duration, translation){
            this._steps.push(this.move.bind(Animaster, {
                'duration' : duration,
                'translation' : translation
            }));
            return this;
        }

        play(element) {
            for (let step of this._steps) {
                step(element);
            }
        }

        resetFadeIn(element) {
            element.style.transitionDuration =  null;
            let classList = element.classList;
            classList.remove('show');
            if (!classList.contains('hide')) classList.add('hide');
        }

        resetFadeOut(element) {
            element.style.transitionDuration =  null;
            let classList = element.classList;
            classList.remove('hide');
            if (!classList.contains('show')) classList.add('show');
        }
        resetMoveAndScale(element){
            element.style.transitionDuration = null;
            element.style.transform = null;
        }

    }

    return new Animaster();
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
