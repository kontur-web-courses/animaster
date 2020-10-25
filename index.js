addListeners();

function addListeners() {
    const {fadeIn, move, scale, fadeOut, moveAndHide, showAndHide, heartBeating, addScale, addFadeIn, addFadeOut, buildHandler,backGroundChange} = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            block.fadeIn=animaster().addFadeIn( 5000).play(block);
        });
    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            block.fadeIn.reset();
        });
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            block.move = animaster().addMove(1000, {x: 20, y: 20}).addFadeOut(500).play(block);
        });
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            block.move.reset();
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            block.scale= animaster().addScale(1000, 1.25).play(block);
        });
    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            block.scale.reset();
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            block.fadeOut = animaster().addFadeOut(5000).play(block);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            block.fadeOut.reset();
        });

    // document.getElementById('moveAndHidePlay')
    //     .addEventListener('click', function () {
    //         const block = document.getElementById('moveAndHideBlock');
    //         block.moveAndHide = moveAndHide(block, 1000);
    //     });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide.reset();
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            showAndHide(block, 1000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating = heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating.stop();
        });
    document.getElementById('backGroundColorPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('backGroundColorBlock');
            block.background = backGroundChange(block)
        });
    // const customAnimation = animaster()
    //     .addMove(200, {x: 40, y: 40})
    //     .addScale(800, 1.3)
    //     .addMove(200, {x: 80, y: 0})
    //     .addScale(800, 1)
    //     .addMove(200, {x: 40, y: -40})
    //     .addScale(800, 0.7)
    //     .addMove(200, {x: 0, y: 0})
    //     .addScale(800, 1);
    // customAnimation.play(document.getElementById('moveAndHideBlock'));
    const worryAnimationHandler = animaster()
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .addMove(200, {x: 80, y: 0})
        .addMove(200, {x: 0, y: 0})
        .buildHandler();

    document
        .getElementById('moveAndHidePlay')
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

function animaster() {
    let _steps = []


    function buildHandler(){
        return ()=> {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide = this.play(block);
        }
    }
    function backGroundChange(element){
        setInterval(()=> {
            element.style.backgroundColor = '#333333'
            setTimeout(()=>element.style.backgroundColor = '#FFFFFF',500)
        },1000);


    }
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }


    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        if (element.style.transform.length > 13) {
            let position = element.style.transform.replace(/[^\d-]/g, ' ').trim().split(' ');
            element.style.transform = getTransform({x: +position[0], y: +position[4]}, ratio);
        } else {
            element.style.transform = getTransform(null, ratio);
        }

    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function moveAndHide(element, duration) {
        return animaster().addMove(duration * 0.4, {x: 100, y: 20}).addFadeOut(duration * 0.6).play(element)
        // return {
        //     reset() {
        //         resetMoveAndScale(element)
        //     }
        // }
    }

    function showAndHide(element, duration) {
        const interval = duration * 0.33;
        animaster().addFadeIn(interval).addDelay(interval).addFadeOut(interval).play(element)

        // fadeIn(element, interval)
        // setTimeout(() => fadeOut(element, interval), interval)
    }

    function heartBeating(element) {
           return animaster().addScale(500, 1.4).addScale(500, 1).play(element, true)


        // const interval = setInterval(() => {
        //     scale(element, 500, 1.4)
        //     setTimeout(() => scale(element, 500, 1), 500)
        // }, 1000);
        // return {
        //     stop() {
        //         clearInterval(interval);
        //     }
        // }
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
        resetFadeOut(element)
    }

    function addMove(duration, translation) {
        this._steps.push([this.move.name, duration, translation])
        return this;
    }

    function addScale(duration, ratio) {
        this._steps.push([this.scale.name, duration, ratio])
        return this;
    }

    function addFadeIn(duration) {
        this._steps.push([this.fadeIn.name, duration])
        return this;
    }

    function addFadeOut(duration) {
        this._steps.push([this.fadeOut.name, duration])
        return this;
    }

    function addDelay(duration) {
        this._steps.push(['delay', duration])
        return this;
    }

    function play(element, cycled) {
        let interval;
        let time;
        if (cycled === true)
            interval = setInterval(() => time=swichPlay(element),1000)
        else time=swichPlay(element)
        return {
            stop() {
                clearInterval(interval);
            },
            reset() {
                switch (element.id) {
                    case 'fadeInBlock':
                        setTimeout(()=>resetFadeIn(element),time);
                        break;
                    case 'fadeOutBlock':
                        setTimeout(()=>resetFadeOut(element),time);
                        break;
                    case 'scaleBlock':
                        setTimeout(()=>resetMoveAndScale(element),time);

                        break;
                    case 'moveBlock':
                        setTimeout(()=>resetMoveAndScale(element),time);

                        break;
                    case 'moveAndHideBlock':
                        setTimeout(()=>resetMoveAndScale(element),time);

                }
            }
        }
    }


    function swichPlay(element) {
        time=0;
        for (const step of _steps) {
            switch (step[0]) {
                case 'move':
                    setTimeout(() => move(element, step[1], step[2]), time)
                    translation = step[2];
                    time += step[1];
                    break;
                case 'scale':
                    setTimeout(() => scale(element, step[1], step[2]), time)
                    time += step[1];
                    break;
                case 'fadeIn':
                    setTimeout(() => fadeIn(element, step[1]), time)
                    time += step[1];
                    break;
                case 'fadeOut':
                    setTimeout(() => fadeOut(element, step[1]), time)
                    time += step[1];
                    break;
                case 'delay':
                    setTimeout(() => '', step[1])
                    time += step[1];
                    break;
            }

        }
        return time;
    }


    return {
        fadeIn,
        move,
        scale,
        fadeOut,
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove,
        addScale,
        addFadeIn,
        addFadeOut,
        play,
        addDelay,
        buildHandler,
        backGroundChange,
        _steps
    };
}
