addListeners();

function addListeners() {

    const customAnimation = animaster()
    .addMove(200, {x: 40, y: 40})
    .addScale(800, 1.3)
    .addMove(200, {x: 80, y: 0})
    .addScale(800, 1)
    .addMove(200, {x: 40, y: -40})
    .addScale(800, 0.7)
    .addMove(200, {x: 0, y: 0})
    .addScale(800, 1);

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            //customAnimation.play(block);
            animaster().addMove(1000, {x: 100, y: 10}).play(block);
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
            animaster().addMove(2000, {x : 100, y : 10}).addFadeOut(3000).play(block);
        });
    
    /*
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(5000, block).stop();
        });
    */

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().addFadeIn(5000 / 3).addDelay(5000 / 3).addFadeOut(5000 / 3).play(block);
        });
    
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().addScale(500, 1.4).addScale(500, 1).play(block, true);
        });

    /*
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).stop();
        });
    */
        
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

        addDelay(duration){
            this._steps.push({
                func : (() => {return;}).bind(Animaster),
                duration : duration
            });
            return this;
        }

        addMove(duration, translation){
            this._steps.push({
                func : this.move.bind(Animaster, duration, translation),
                duration : duration
            });
            return this;
        }

        addScale(duration, ratio){
            this._steps.push({
                func : this.scale.bind(Animaster, duration, ratio),
                duration : duration
            });
            return this;
        }

        addFadeIn(duration){
            this._steps.push({
                func : this.fadeIn.bind(Animaster, duration),
                duration : duration
            });
            return this;
        }

        addFadeOut(duration){
            this._steps.push({
                func : this.fadeOut.bind(Animaster, duration),
                duration : duration
            });
            return this;
        }

        play(element, cycled=false) {
            const _steps = this._steps;
            let timerId = setTimeout(function passCommand(idx) {
                if (idx < _steps.length) {
                    _steps[idx].func(element);
                    timerId = setTimeout(passCommand, 
                        _steps[idx].duration, 
                        cycled ? (idx + 1 ) % _steps.length : idx + 1);
                }
            }, 0, 0);

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
