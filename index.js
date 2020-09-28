let heartBeatingId = 0;
let animator = animaster();
addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animator.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animator.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animator.move(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animator.scale(block, 1000, 1.25);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animator.moveAndHide(block, 2000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animator.resetMoveAndHide(block);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animator.showAndHide(block, 1000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeatingId = animator.heartBeating(block);
        });
            
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            clearInterval(heartBeatingId);
        });
    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            animator
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            animator.play(block);
        });
}

function animaster() {
    this._steps = []
    
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

    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    
    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }
    
    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function moveAndHide(element, duration) {
        move(element, duration * 2 / 5, {x: 100, y: 20});
        fadeOut(element, duration * 3 / 5);
    }

    function showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(fadeOut, duration / 3, element, duration / 3); 
    }

    function heartBeating(element) {
        let isIncrease = true;
        function beating() {
            isIncrease ? scale(element, 500, 1.4) : scale(element, 500, 1);
            isIncrease = !isIncrease;
        }
        return setInterval(beating, 500);
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }
    
    function resetMoveAndHide(element) {
        resetMoveAndScale(element);
        resetFadeOut(element);
    }
    
    function addMove(duration, translation) {
        this._steps.push({name: 'move', args: [duration, translation]});
        return this;
    }

    function addScale(duration, ratio) {
        this._steps.push({name: 'scale', args: [duration, ratio]});
        return this;
    }

    function addFadeIn(duration) {
        this._steps.push({name: 'fadeIn', args: [duration]});
        return this;
    }

    function addFadeOut(duration) {
        this._steps.push({name: 'fadeOut', args: [duration]});
        return this;
    }

    async function play(element){
        for(let stepAction of this._steps){
            stepAction.args.unshift(element);
            console.log(stepAction);
            this[stepAction.name].apply(this ,stepAction.args);
            await sleep(stepAction.args[1]);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    return {
        scale,
        move,
        fadeIn,
        fadeOut,
        moveAndHide,
        showAndHide,
        heartBeating,
        resetMoveAndHide,
        _steps,
        addMove,
        play,
        addScale,
        addFadeIn,
        addFadeOut
    };
}