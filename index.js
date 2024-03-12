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
            animaster().addMove(500, {x: 20, y:20}).play(block);
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
    
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeating = animaster().heartBeating(block, 5000);
        })
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heartBeating.stop();
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndHide(block);
        })

    document.getElementById('customAnimationPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customAnimationBlock');
            const customAnimation = animaster()
            .addMove(200, {x: 40, y: 40})
            .addScale(800, 1.3)
        customAnimation.play(block);
        })
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
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration){
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }


    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function showAndHide(element, duration){
        fadeIn(element, duration * 1/3);
        setTimeout(() => {
            fadeOut(element, duration * 1/3);
          }, 500);
    }

    function moveAndHide(element, duration) {
        const durationMoving = duration * 5 / 2;
        const durationHiding = duration * 5 / 3;
        move(element, durationMoving, {x: 100, y: 20});
        fadeOut(element, durationHiding);
    }

    function heartBeating(element){
        function heartBeatingInner(elem, flag) {
            scale(elem, 500, 1.4);
            if (flag.stopFlag)
            {
                return;
            }
            setTimeout(() => {
                scale(elem, 500, 1);
                setTimeout(() => heartBeatingInner(elem, flag), 500);
            },
            500)
            return () => flag.stop = true;
        }
    
        let flag = {stopFlag: false};
        heartBeatingInner(element, flag);
        return {
            stop() {
                flag.stopFlag = true;
            }
        }
    }
    
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function resetMoveAndHide(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
        resetFadeOut(element);
    }
    _steps = [];

    function addMove(duration, translation) {
        _steps.push({
            action: move,
            duration: duration,
            args: translation,
        })
        return this;
    }

    function addScale(duration, ratio) {
        _steps.push({
            action: scale,
            duration: duration,
            args: ratio,
        })
        return this;
    }

    function addFadeIn(){
        _steps.push({
            action: fadeIn,
            duration: duration
        })
        return this;
    }

    function addFadeOut(){
        _steps.push({
            action: fadeOut,
            duration: duration
        })
        return this;
    }

    

    function play(element) {
        _steps.forEach(step => {
            if (step.args) {
                setTimeout(() => step.action(element, step.duration, step.args), step.duration)
            } else {
                stepTimeout(() => step.action(element, step.duration), step.duration)
            }
        });
    }

    
    return {
        move,
        fadeIn,
        fadeOut,
        scale,
        showAndHide,
        moveAndHide,
        heartBeating,
        resetFadeOut,
        resetFadeIn,
        resetMoveAndScale,
        resetMoveAndHide,
        addMove,
        addFadeIn,
        addScale,
        addFadeOut,
        play,
        _steps
    };
}
