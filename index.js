addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });
		
	document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
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
		
	document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000);
        });
		
	document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
	
	const heartPlay = document.getElementById('heartBeatingPlay');
	const heartPlayFunc = function () {
            const block = document.getElementById('heartBeatingBlock');
            return animaster().heartBeating(block);
        };
	
	heartPlay
        .addEventListener('click', function () {
            const func = heartPlayFunc();
			
			const stopBtn = document.getElementById('heartBeatingStop');
			stopBtn.addEventListener('click', function (){
                func.stop();
                heartPlay.removeEventListener('click', heartPlayFunc);
			});
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

function animaster() {
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
	
	/**
	 * Блок плавно скрывается.
	 * @param element — HTMLElement, который надо анимировать
	 * @param duration — Продолжительность анимации в миллисекундах
	 */
	function fadeOut(element, duration) {
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
	
	return {
		fadeIn: fadeIn,
		fadeOut: fadeOut,
		move: move,
		scale: scale,
		moveAndHide: function(element, duration) {
			move(element, 0.4 * duration, {x: 100, y: 20});
			fadeOut(element, 0.6 * duration);
		},
		showAndHide: function(element, duration) {
			fadeIn(element, duration / 3);
			setTimeout(() => fadeOut(element, duration / 3), duration / 3);
		},
		heartBeating: function(element) {
			let heartBeat = () => {
                scale(element, 500, 1.4);
                setTimeout(scale, 500, element, 500, 1)
            }
            heartBeat();
            let interval = setInterval(heartBeat, 1200);
            return {
                stop(){
                    clearInterval(interval);
                }
            }
		}
	};
}