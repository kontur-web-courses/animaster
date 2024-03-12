addListeners();

function addListeners() {
    const animasterObj = animaster();
    let stopHeartbeating = null;
    let resetMoveAndHide = null;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animasterObj.fadeIn(block, 5000);
        });
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animasterObj.resetFadein(block);
        });
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animasterObj.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animasterObj.scale(block, 1000, 1.25);
        });
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animasterObj.fadeOut(block, 5000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            resetMoveAndHide = animasterObj.moveAndHide(block, 5000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            resetMoveAndHide.reset();
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animasterObj.showAndHide(block, 5000);
        });
    document.getElementById('heartbeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartbeatingBlock');
            stopHeartbeating = animasterObj.heartbeating(block);
        });
    document.getElementById('heartbeatingStop')
        .addEventListener('click', function () {
            stopHeartbeating.stop();
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
    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
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
    function moveAndHide(element, duration) {
        const cancellationToken = {requested: false};
        move(element, duration * 2 / 5, {x: 100, y: 20});
        setTimeout(() => {
            if (cancellationToken.requested)
            {
                return;
            }
            fadeOut(element, duration * 3 / 5);
        }, duration * 2 / 5);

        return {
            reset()
            {
                cancellationToken.requested = true;
                resetMoveAndScale(element);
                resetFadeOut(element);
            }
        };
    }
    function showAndHide(element, duration){
        fadeIn(element, duration / 3);
        setTimeout(() => fadeOut(element,duration / 3), duration * 2 / 3);
    }

    function heartbeating(element){
        function heartbeatingInner(elem, flag) {
            scale(elem, 500, 1.4);
            if (flag.stopFlag)
            {
                return;
            }
            setTimeout(() => {
                scale(elem, 500, 1);
                setTimeout(() => heartbeatingInner(elem, flag), 500);
            },
            500)
            return () => flag.stop = true;
        }

        let flag = {stopFlag: false};
        heartbeatingInner(element, flag);
        return {
            stop() {
                flag.stopFlag = true;
            }
        }
    }

    function resetFadein(element){
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element){
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element){
        element.style.transitionDuration = null;
        element.style.transform = getTransform(null, null);        
    }

    return {
        scale : scale,
        move : move,
        fadeIn : fadeIn,
        fadeOut : fadeOut,
        moveAndHide: moveAndHide,
        showAndHide: showAndHide,
        heartbeating : heartbeating,
    }
}