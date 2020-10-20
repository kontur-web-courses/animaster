addListeners();

function animaster(){
    let animation = {
        _steps : [], 
    }

    function step(name, duration, translation, ratio) {
        return {
            name : name, 
            duration : duration, 
            translation : translation,
            ratio : ratio
        }
    }

    animation.move = function(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    animation.addMove = function(duration, translation) {
        this._steps.push(step('move', duration, translation, undefined));
        return this; 
    }

    animation.scale = function(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    animation.addScale = function(duration, ratio) {
        this._steps.push(step('scale', duration, undefined, ratio));
        return this;
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null; 
        element.style.transform = null; 
    }

    animation.fadeIn = function(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    animation.addFadeIn = function(duration) {
        this._steps.push(step('fadeIn', duration, undefined, undefined));
        return this;
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
    }

    animation.fadeOut = function(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    animation.addFadeOut = function(duration) {
        this._steps.push(step('fadeOut', duration, undefined, undefined));
        return this;
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null; 
        element.classList.remove('hide'); 
    }

    animation.moveAndHide = function(element, duration){
        element.style.transitionDuration = `${duration}ms`;
        this.move(element, duration * 0.4, {x: 100, y: 20});
        this.fadeOut(element, duration * 0.6)
        return {
            resetMoveAndHide() {
                resetMoveAndScale(element);
                resetFadeOut(element); 
            }
        };
    }

    animation.showAndHide = function(element, duration){
        element.style.transitionDuration = `${duration}ms`;
        this.fadeIn(element, duration / 3);
        setTimeout(this.fadeOut, duration / 3, element, duration / 3); 
    }

    animation.heartBeating = function(element) {
        let beating = setInterval(function() {
            animation.scale(element, 500, 1.4);
            setTimeout(animation.scale, 500, element, 500, 1);
        }, 1000);

        return {
            beating : beating,
            stop() {
                clearInterval(this.beating);
            }
        }
    }

    animation.play = function(element) {
        for (let animation of this._steps) {
            switch (animation.name) {
                case 'move':
                    this.move(element, animation.duration, animation.translation);
                    break;
                case 'scale':
                    this.scale(element, animation.duration, animation.ratio);
                    break; 
                case 'fadeIn': 
                    this.fadeIn(element, animation.duration);
                    break;
                case 'fadeOut': 
                    this.fadeOut(element, animation.duration);
                    break;
                default:
                    break;
            }
        }
    }

    return animation;
}

function addListeners() {
    let heartBeating;
    let moveAndHideObject; 

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().addFadeIn(5000).play(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(500, {x: 20, y: 20}).play(block);
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
            moveAndHideObject = animaster().moveAndHide(block, 1000);
        });

        document.getElementById('resetMoveAndHide')
        .addEventListener('click', function () {
            moveAndHideObject.resetMoveAndHide();
        });

        document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        }); 

        document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeating = animaster().heartBeating(block);
        });

        document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heartBeating.stop();
        });

        document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
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
