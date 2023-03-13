addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster(block).fadeIn(5000);
        });
    document.getElementById('unfadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('unfadeInBlock');
            animaster(block).fadeOut(5000);
        });
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster(block).move(1000, {x: 100, y: 10});
        });
    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster(block).scale(1000, 1.25);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const duration = 5000;
            const block = document.getElementById('moveAndHideBlock');
            const anim = animaster(block);
            anim.move(Math.trunc(duration * 2 / 5), {x: 150, y: 10});
            setTimeout(() => anim.fadeOut(Math.trunc(duration * 3 / 5)), Math.trunc(duration * 2 / 5));
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const duration = 3000;
            const block = document.getElementById('showAndHideBlock');
            const anim = animaster(block);
            anim.fadeIn(Math.trunc(duration / 3));
            setTimeout(() => anim.fadeOut(Math.trunc(duration / 3)), Math.trunc(duration * 2 / 3));
        });
    {
        const block = document.getElementById('heartBeatingBlock');
        const anim = animaster(block);
        document.getElementById('heartBeatingPlay')
            .addEventListener('click', function () {
                anim.heartBeating();
            });
        document.getElementById('heartBeatingStop')
            .addEventListener('click', function () {
                anim.stop();
            });
    }
}

function animaster (element) {
    return {
        element,
        intervals_ids: [],
        /**
         * Функция, передвигающая элемент
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move: function (duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn: function (duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut: function (duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale: function (duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        heartBeating: function () {
            const duration = 1000;
            const timeInt = 500;
            const ratio = 1.4;
            this.intervals_ids.push(setInterval(() => this.scale(duration, ratio), timeInt));
            this.intervals_ids.push(setInterval(() => this.scale(duration, 1), 2 * timeInt));
        },
        stop: function () {
            for (let id of this.intervals_ids) {
                clearInterval(id);
            }
        }
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
