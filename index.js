addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y: 10}).addScale(1.2).play(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().addScale(1000, 1.25).play(block);
        });
    
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().addFadeOut(5000).play(block);
        });
    
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(5000, block);
        });
    
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(5000, block).stop();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(5000, block);
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

        fadeIn(duration, element){
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        }

        move(duration, translation, element) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        }

        scale (duration, ratio, element) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        }

        moveAndHide(duration, element){
            class MoveAndHider extends Animaster {
                constructor() {
                    super();
                    this.move(2 / 5 * duration, {x : 100, y : 20}, element);
                    this.timerId = setTimeout(this.fadeOut, 2 / 5 * duration, 3 / 5 * duration, element);
                }

                stop() {
                    clearTimeout(this.timerId);
                    this.resetMoveAndScale(element);
                    this.resetFadeOut(element);
                }
            }
            return new MoveAndHider();
        }

        showAndHide(duration, element){
            this.fadeIn(1 / 3 * duration, element);
            setTimeout(this.fadeOut, 2 / 3 * duration, 1 / 3 * duration, element);
        }

        ///&????
        heartBeating (element){
            let scale = this.scale;
            let resetMoveAndScale = this.resetMoveAndScale;
            let resetFadeOut = this.resetFadeOut;
            let timerId = setInterval(function tick() {
                scale(500, 1.4, element);
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
            this._steps.push(this.move.bind(Animaster, duration, translation));
            return this;
        }

        addScale(duration, ratio){
            this._steps.push(this.scale.bind(Animaster, duration, ratio));
            return this;
        }

        addFadeIn(duration){
            this._steps.push(this.fadeIn.bind(Animaster, duration));
            return this;
        }

        addFadeOut(duration){
            this._steps.push(this.fadeOut.bind(Animaster, duration));
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
