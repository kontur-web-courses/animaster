addListeners();

function addListeners() {
    let anim = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');

            anim.moveAndHide(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            anim.showAndHide(block, 1000);
        });

    let interval;
    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            if (interval === undefined) {
                const block = document.getElementById('scaleBlock');
                interval = anim.heartBeating(block);
            }
        });

    document.getElementById('scaleStop')
        .addEventListener('click', function () {
            if (interval === undefined)
                return;
            interval.stop();
            interval = undefined;
        });
}


function animaster() {
    return {
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        moveAndHide(element, duration) {
            const translation = { x: 100, y: 20 }
            let moveDurationCoef = 2 / 5;
            let moveDuration = duration * moveDurationCoef;
            this.move(element, moveDuration, translation);
            setTimeout(() => this.fadeOut(element, duration - moveDuration), moveDuration)
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        showAndHide(element, duration) {
            const delay = 1 / 3 * duration;
            this.fadeIn(element, delay);
            setTimeout(() => this.fadeOut(element, delay), delay);
        },

        heartBeating(element) {

            function beat(element) {
                const coef = 0.5;
                const duration = coef * 1000;
                let localScale = animaster().scale.bind(null, element, duration);
                localScale(1.4);
                setTimeout(() => localScale(1), duration);
            }

            return {
                interval: setInterval(() => beat(element), 1000),
                stop() { clearInterval(this.interval) }
            }
        }
    }
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
// function fadeIn(element, duration) {
//     element.style.transitionDuration = `${duration}ms`;
//     element.classList.remove('hide');
//     element.classList.add('show');
// }

/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */
// function move(element, duration, translation) {
//     element.style.transitionDuration = `${duration}ms`;
//     element.style.transform = getTransform(translation, null);
// }

/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */
// function scale(element, duration, ratio) {
//     element.style.transitionDuration = `${duration}ms`;
//     element.style.transform = getTransform(null, ratio);
// }

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
