addListeners();

function resetFadeIn(element) {
    element.style.transitionDuration = null
    element.classList.remove("show")
    element.classList.add("hide")
}

function resetFadeOut(element) {
    element.style.transitionDuration = null
    element.classList.remove("hide")
    element.classList.add("show")
}

function resetMoveAndScale(element) {
    element.style.transitionDuration = null
    element.style.transform = null
}

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
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
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 1000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndScale(block);
            resetFadeOut(block);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating = animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating.stop();
        });
    document.getElementById('heightChangePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heightChangeBlock');
            animaster().heightChange(block, 1000);
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

function animaster(){
    let _steps = [];
    function heightChange(element, duration){
        element.style.transitionDuration = `${duration}ms`;
        element.style.height = '0';
    }
    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function fadeOut(element, duration){
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    function moveAndHide(element, duration) {
        animaster().addMove(duration * 0.4, {x: 100, y: 20}).addFadeOut(duration * 0.6).play(element)
    }

    function showAndHide(element, duration) {
        const interval = duration / 3;
        animaster().addFadeIn(interval).addDelay(interval).addFadeOut(interval).play(element)
    }

    function heartBeating(element) {
        return animaster().addScale(500, 1.4).addScale(500, 1).play(element, true);
    }

    function addMove(duration, translation){
        this._steps.push([this.move, duration, translation])
        return this;
    }

    function addScale(duration, ratio){
        this._steps.push([this.scale, duration, ratio])
        return this;
    }

    function addFadeIn(duration){
        this._steps.push([this.fadeIn, duration])
        return this;
    }

    function addFadeOut(duration){
        this._steps.push([this.fadeOut, duration])
        return this;
    }

    function addDelay(duration) {
        this._steps.push(['delay', duration])
        return this;
    }

    function resetAnimations(element) {
        for (const step of _steps) {
            switch (step[0].name) {
                case 'move':
                case 'scale':
                    resetMoveAndScale(element)
                    break
                case 'fadeIn':
                    resetFadeIn(element)
                case 'fadeOut':
                    resetFadeOut(element)
            }
        }
    }

    function play(element, cycled = false){
        let animationDuration = 0;
        let interval;
        if(cycled == true) {
            interval = setInterval(() => {
                play(element, false)
            }, 1000);
        }
        else {
            for (let step of _steps) {
                if (step[0] !== 'delay') {
                    setTimeout(() => step[0](element, step[1], step[2], step[3]), animationDuration);
                    animationDuration += step[1];
                } else {
                    animationDuration += step[1];
                }
            }
        }

        return {
            stop() {
                clearInterval(interval);
            },
            reset: () => resetAnimations(element)
        }
    }

    function buildHandler() {
        return (e) => this.play(e.target)
    }

    return{
        _steps,
        move,
        heightChange,
        scale,
        fadeIn,
        fadeOut,
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        addDelay,
        play,
        buildHandler

    }
}