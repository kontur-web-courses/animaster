addListeners();

function addListeners() {

    const {
        fadeIn,
        fadeInReset,
        fadeOut,
        fadeOutReset,
        move,
        scale,
        resetMoveAndScale,
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove,
        addScale,
        play
    } = animaster();

    document
        .getElementById('fadeInPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeInBlock');
            fadeIn(block, 5000);
        });

    document
        .getElementById('fadeInReset')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeInBlock');
            fadeInReset(block);
        });

    document
        .getElementById('fadeOutPlay')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeOutBlock');
            fadeOut(block, 5000);
        });

    document
        .getElementById('fadeOutReset')
        .addEventListener('click', function() {
            const block = document.getElementById('fadeOutBlock');
            fadeOutReset(block);
        });

    document.getElementById('movePlay').addEventListener('click', function() {
        const block = document.getElementById('moveBlock');
        move(block, 1000, { x: 100, y: 10 });
    });

    document.getElementById('scalePlay').addEventListener('click', function() {
        const block = document.getElementById('scaleBlock');
        scale(block, 1000, 1.25);
    });

    document
        .getElementById('moveReset')
        .addEventListener('click', function() {
            const block = document.getElementById('moveBlock');
            resetMoveAndScale(block);
        });
    document
        .getElementById('scaleReset')
        .addEventListener('click', function() {
            const block = document.getElementById('scaleBlock');
            resetMoveAndScale(block);
        });

    document
        .getElementById('moveAndHide')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide = moveAndHide(block, 1000);
        });

    document
        .getElementById('moveAndHideReset')
        .addEventListener('click', function() {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide.stop();
        });

    document
        .getElementById('showAndHide')
        .addEventListener('click', function() {
            const block = document.getElementById('showAndHideBlock');
            showAndHide(block, 1000);
        });

    document
        .getElementById('heartBeating')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating = heartBeating(block);
        });

    document
        .getElementById('heartBeatingStop')
        .addEventListener('click', function() {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating.stop();
        });
    //move как пример на первом, 8 задача
    document
        .getElementById('moveMove') //написать Id того блока который хотим сдвинуть
        .addEventListener('click', function() {
            const block = document.getElementById('moveBlock'); //кнопка
            animaster().addMove(500, { x: 20, y: 20 }).play(block);
        });



}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */

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

    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeInReset(element) {
        element.classList.remove('show');
        element.classList.add('hide');
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function fadeOutReset(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function move(element, duration, translation) {
        //element.style.transitionDuration = `${duration}ms`;                                     //9 задача
        //element.style.transform = getTransform(translation, null);
        animaster().addMove(duration, translation).play(element);
    }

    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function moveAndHide(element, duration) {
        const interval = duration * 0.4;

        move(element, interval, { x: 100, y: 20 });
        setTimeout(() => {
            fadeOut(element, duration * 0.6);
        }, interval);

        return {
            stop() {
                clearInterval(interval);
                clearTimeout(interval);
                move(element, 0, { x: 0, y: 0 });
                fadeOutReset(element);

            },
        };
    }

    function showAndHide(element, duration) {
        const interval = duration / 3;

        fadeIn(element, interval);
        setTimeout(() => {
            fadeOut(element, interval);
        }, interval * 2);
    }

    function heartBeating(element) {
        const interval = setInterval(() => {
            scale(element, 500, 1.4);
            setTimeout(() => scale(element, 500, 1), 500);
        }, 1000);

        return {
            stop() {
                clearInterval(interval);
            },
        };
    }
    //move как пример на кнопке, 8, 9 задача
    function addMove(duration, translation) {
        this._steps = {
            name: "move",
            transitionDuration: `${duration}ms`,
            transform: getTransform(translation, null)
        };
        return this;
    }

    function addScale(duration, ratio) {
        this._steps = {
            name: "scale",
            transitionDuration: `${duration}ms`,
            ratio: getTransform(null, ratio)
        };
        return this;
    }

    function play(element) {
        if (this._steps.name == "move") {
            element.style.transitionDuration = this._steps.transitionDuration;
            element.style.transform = this._steps.transform;
        }
    }

    /*

    function play(element) {
    	while(_steps.length!=0)
    	{
    		let step = _steps.step.shift();
	        if (this._steps.name == "move") {
	            element.style.transitionDuration = this._steps.transitionDuration;
	            element.style.transform = this._steps.transform;
	        }
	        if (this._steps.name == "scale") {
	            element.style.transitionDuration = this._steps.transitionDuration;
	            element.style.ratio = this._steps.ratio;
	        }
        }

    }*/



    return {
        fadeIn,
        fadeInReset,
        fadeOut,
        fadeOutReset,
        move,
        scale,
        resetMoveAndScale,
        moveAndHide,
        showAndHide,
        heartBeating,
        addMove,
        addScale,
        play
    };
}