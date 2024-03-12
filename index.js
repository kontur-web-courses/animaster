addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            const animation = animaster().fadeIn(block, 5000);
            document.getElementById('fadeInReset').addEventListener('click', function () {
                animation.resetFadeIn(block);
            });
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            const animation = animaster().fadeOut(block, 5000);
            document.getElementById('fadeOutReset').addEventListener('click', function () {
                animation.resetFadeOut(block);
            });
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
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
            document.getElementById('moveReset').addEventListener('click', function () {
                customAnimation.resetMove(block);
            });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            const animation = animaster().scale(block, 1000, 1.25);
            document.getElementById('scaleReset').addEventListener('click', function () {
                animation.resetScale(block);
            });
        });

    document.getElementById('moveAndHidePlay').addEventListener('click', function () {
        const block = document.getElementById('moveAndHideBlock');
        const animation = animaster().moveAndHide(block, 5000);
        document.getElementById('moveAndHideReset').addEventListener('click', function () {
            animation.moveAndHideReset(block);
        });
    });
        
    document.getElementById('showAndHidePlay').addEventListener('click', function () {
       const block = document.getElementById('showAndHideBlock');
        animaster().showAndHide(block, 3000);
    });
        
    document.getElementById('heartBeatingPlay').addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        const animation = animaster().heartBeating(block);
        document.getElementById('heartBeatingStop').addEventListener('click', function () {
            animation.stop();
        });
    });
    
}

function animaster() {
    let _steps = [];

    function addMove(duration, translation) {
        _steps.push({
            type: 'move',
            duration: duration,
            translation: translation
        });
        return this;
    }

    function addFadeIn(duration) {
        _steps.push({
            type: 'fadeIn',
            duration: duration
        });
        return this;
    }

    function addScale(duration, ratio) {
        _steps.push({
            type: 'scale',
            duration: duration,
            ratio: ratio
        });
        return this;
    }

    function addFadeOut(duration) {
        _steps.push({
            type: 'fadeOut',
            duration: duration
        });
        return this;
    }

    function play(element) {
        let counter = 0;
        _steps.forEach(step => { 
            switch (step.type) {
                case 'move':
                    move(element, step.duration, step.translation);
                    break;
                case 'fadeIn':
                    fadeIn(element, step.duration);
                    break;
                case 'fadeOut':
                    fadeOut(element, step.duration);
                    break;
                case 'scale':
                    scale(element, step.duration, step.ratio);
                    break;
                default:
                    break;
            }
        });
    }
    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
        function resetFadeIn(element){
            element.style.transitionDuration =  null;
            element.classList.remove('show');
            element.classList.add('hide');
        }
        return {resetFadeIn};
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
        function resetFadeOut(element){
            element.style.transitionDuration =  null;
            element.classList.remove('hide');
            element.classList.add('show');
        }
        return {resetFadeOut};
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
        function resetMove(element){
            element.style.transitionDuration =  null;
            element.style.transform =  null;
        }

        return {resetMove};
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
        function resetScale(element){
            element.style.transitionDuration =  null;
            element.style.transform =  null;
        }
        return {resetScale};
    }

    function moveAndHide(element, duration) {
        const halfDuration = duration * 2 / 5;
        const moveDuration = `${halfDuration}ms`;
        const fadeOutDuration = `${duration - halfDuration}ms`;

        move(element, halfDuration, { x: 100, y: 20 });

        setTimeout(() => {
            fadeOut(element, duration - halfDuration);
        }, halfDuration);
        function moveAndHideReset(element){
            element.style.transitionDuration =  null;
            element.style.transform =  null;
            element.style.transitionDuration =  null;
            element.classList.remove('hide');
            element.classList.add('show');
        }
        return {moveAndHideReset};
    }

    function showAndHide(element, duration) {
        const stepDuration = duration / 3;

        fadeIn(element, stepDuration);

        setTimeout(() => {
            setTimeout(() => {
                fadeOut(element, stepDuration);
            }, stepDuration);
        }, stepDuration);
    }

    function heartBeating(element) {
        const scaleUpDuration = 500;
        const scaleDownDuration = 500;
        let timer = null;

        timer = setInterval(() => {
            scale(element, scaleUpDuration, 1.4);
            setTimeout(() => {
                scale(element, scaleDownDuration, 1);
            }, scaleUpDuration);
        }, scaleUpDuration + scaleDownDuration);

        return {
            stop: function () {
                clearInterval(timer);
            }
        };
    }
    return {
        addMove,
        addFadeIn,
        addScale,
        addFadeOut,
        play,
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide,
        heartBeating
        }
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
