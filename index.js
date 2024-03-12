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
            animaster().showAndHide(block, 1000, 1.25);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block, 1000);
        });
}



function animaster(){
    let _steps = [];
    return {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            //setTimeout(()=>{ this.resetFadeIn(element);}, duration);
        },

        resetFadeIn(element) {
            element.style.transitionDuration = null;
            element.classList.add('hide');
            element.classList.remove('show');
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

        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = this.getTransform(null, ratio);
        },

        /**
         * Блок плавно становится прозрачным.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut(element) {
            element.style.transitionDuration = null;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        /**
         * Блок плавно становится прозрачным.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        moveAndHide(element, duration) {
            this.move(element, 2 * duration / 5, {x: 100, y: 20});
            setTimeout(() => {
                this.fadeOut(element, 3 * duration / 5);
            }, 2 * duration / 5);
            //setTimeout(()=>{ this.resetMoveAndHide(element);}, duration);
        },

        resetMoveAndHide(element){
            this.resetFadeOut(element);
            this.move(element, 0, {x: 0, y: 0});
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

        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => {
                this.fadeOut(element, duration / 3);
            }, 2 * duration / 3);
        },

        heartBeating(element, duration) {
            const context = this;
            let doHeartBeat = true;
            function scaleUp() {
                context.scale(element, duration / 2, 1.4);
                if (doHeartBeat){
                    setTimeout(scaleDown, duration / 2);
                }
            }
            function scaleDown() {
                context.scale(element, duration / 2, 1);
                setTimeout(scaleUp, duration / 2);
            }
            scaleUp();
            
            stopObj = {
                stop() {
                    doHeartBeat = false;
                }
            };

            // setTimeout(stopObj.stop(), 5000);

            return stopObj;
        },

        addMove(duration, translation){
            this._steps.push({"name": 'Move', "duration": duration, "x": translation[x], "y": translation[y]});
            return this;
        },

        addScale(duration, ratio){
            this._steps.push({"name": 'Scale', "duration": duration, "ratio": ratio});
            return this;
        },

        addFadeIn(duration){
            this._steps.push({"name": 'fadeIn', "duration": duration});
            return this;
        },

        addFadeOut(duration){
            this._steps.push({"name": 'fadeOut', "duration": duration});
            return this;
        },

        play(element){
            for(action of _steps){
                if (action["name"] == 'Move'){
                    this.move(element, action["duration"], {x: action["x"], y:action["y"]});
                }
                else if (action["name"] == 'Scale'){
                    this.scale(element, action["duration"], action["ratio"]);
                }
                else if (action["name"] == 'fadeIn'){
                    this.fadeIn(element, action["duration"]);
                }
                else if (action["name"] == 'fadeOut'){
                    this.fadeOut(element, action["duration"]);
                }
            }
        }
    }
}
