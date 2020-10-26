addListeners();

function addListeners() {
    const {} = animaster();

    document
        .getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            block.fadeIn = animaster()
                .addFadeIn(5000)
                .play(block);
        });

    document
        .getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            block.fadeIn.reset();
        });

    document
        .getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            block.fadeOut = animaster().addFadeOut(5000).play(block);
        });

    document
        .getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            block.fadeOut.reset();
        });

    document.getElementById('movePlay').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        block.move = animaster().addMove(1000, { x: 100, y: 10}).play(block);
    });

    document.getElementById('moveReset').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        block.move.reset();
    });

    document.getElementById('scalePlay').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        block.scale = animaster().addScale(1000, 1.25).play(block);
    });

    document.getElementById('scaleReset').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        block.scale.reset();
    });

    document
        .getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const interval = 1000 * 0.4;
            block.moveAndHide = animaster()
                .addMove(interval, { x: 100, y: 20 })
                .addFadeOut(1000 * 0.6)
                .play(block);
        });

    document
        .getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide.reset();
        });

    document
        .getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            const interval = 1000 / 3;
            animaster()
                .addFadeIn(interval)
                .addDelay(interval)
                .addFadeOut(interval)
                .play(block);
        });

    document
        .getElementById('heartBeating')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating = animaster()
                .addScale(500, 1.4)
                .addScale(500, 1)
                .play(block, true);
        });

    document
        .getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating.stop();
        });

    document
        .getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            animaster().addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1)
                .play(block);
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
    console.log(result);
    return result.join(' ');
}

function animaster() {
    let _steps = [];
    let _coordsAfterMove = undefined;
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function _resetFadeIn(element) {
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function _resetFadeOut(element) {
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
        _coordsAfterMove = translation;
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(_coordsAfterMove, ratio);
    }

    function _resetMoveAndScale(element) {
        element.style.transform = getTransform(null, 1);
    }

    function addMove(duration, translation) {
        _steps.push({ name: "move", position: translation, animationTime: duration });
        return this;
    }

    function addScale(duration, ratio) {
        _steps.push({ name: "scale", scaling: ratio, animationTime: duration });
        return this;
    }

    function addFadeIn(duration) {
        _steps.push({ name: "fadeIn", animationTime: duration });
        return this;
    }

    function addFadeOut(duration) {
        _steps.push({ name: "fadeOut", animationTime: duration });
        return this;
    }

    function addDelay(duration) {
        _steps.push({ name: "delay", animationTime: duration });
        return this;
    }

    function play(element, cycled = false) {
        let animations = this._steps;
        let interval = undefined;
        if (cycled)
            interval = setInterval(() => {
                _playAnimation(element, animations)
            }, 1000)
        else
            _playAnimation(element, animations)
        return {
            stop() {
                clearInterval(interval);
            },
            reset() {
                let fadeAnimations = getHideOrShowElement(animations);
                if (fadeAnimations.length !== 0) {
                    if (fadeAnimations[0].name === "fadeIn")
                        _resetFadeIn(element)
                    else
                        _resetFadeOut(element)
                }
                _resetMoveAndScale(element);
            }
        };

    }

    function getHideOrShowElement(animations) {
        return animations.filter(animation => animation.name === "fadeIn" || animation.name === "fadeOut");
    }

    function _playAnimation(element, animations) {
        let allAnimationTime = 0;
        for (let animation of animations) {
            switch(animation.name) {
                case "move":
                    setTimeout(move, allAnimationTime, element, animation.animationTime, animation.position);
                    allAnimationTime += animation.animationTime;
                    break;
                case "scale":
                    setTimeout(scale, allAnimationTime, element, animation.animationTime, animation.scaling);
                    allAnimationTime += animation.animationTime;
                    break;
                case "fadeIn":
                    setTimeout(fadeIn, allAnimationTime, element, animation.animationTime)
                    allAnimationTime += animation.animationTime;
                    break;
                case "fadeOut":
                    setTimeout(fadeOut, allAnimationTime, element, animation.animationTime);
                    allAnimationTime += animation.animationTime;
                    break;
                case "delay":
                    allAnimationTime += animation.animationTime;
                    break;
                default:
                    break;
            }
        }
    }

    return {
        _steps: _steps,
        fadeIn,
        fadeOut,
        move,
        scale,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        play,
        addDelay
    };
}
