addListeners();

function addListeners() {
    const animasterObject = animaster();
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animasterObject.fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animasterObject.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animasterObject.moveAndHide(block, 1000, {x: 100, y: 20});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animasterObject.scale(block, 1000, 1.25);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animasterObject.fadeOut(block, 1000, 1.25);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animasterObject.showAndHide(block, 1000, 1.25);
        });
}

function animaster() {
    return {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.add('hide');
            element.classList.add('none');
        },


        showAndHide(element, duration) {
            const stageDurationInMs = duration / 3;
            this.fadeIn(element, stageDurationInMs);
            setTimeout(this.fadeOut, stageDurationInMs, element, stageDurationInMs);
        },

        /**
         * Функция, передвигающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param translation — объект с полями x и y, обозначающими смещение блока
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = this.getTransform(translation, null);
        },

        moveAndHide(element, duration, translation) {
            element.style.transitionDuration = `${duration / 5 * 2}ms`;
            element.style.transform = this.getTransform(translation, null);
            setTimeout(this.fadeOut, duration / 5 * 2, element, duration / 5 * 3)
        },

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = this.getTransform(null, ratio);
        },

        getTransform(translation, ratio) {
            const result = [];
            if (translation) {
                result.push(`translate(${translation.x}px,${translation.y}px)`);
            }
            if (ratio) {
                result.push(`scale(${ratio})`);
            }
            return result.join(' ');
        },
    }
}


