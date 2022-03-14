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
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });
    document.getElementById('hidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('hideBlock');
            animaster().fadeOut(block, 1000, 1.25);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let stop = animaster().moveAndHide(block, 1000, {x: 100, y: 20});
            document.getElementById('moveAndHideReset')
                .addEventListener('click', stop.reset)
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let stop = animaster().heartBeating(block);
            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    clearInterval(stop);
                })
        });
    document.getElementById('complexPlay')
        .addEventListener('click', function () {
            const customAnimation = animaster()
                .addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            const block = document.getElementById('complexBlock');
            customAnimation.play(block);
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
    function resetFadeIn(element) {
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = `${0}ms`;
        element.style.transform = getTransform(null, null);
    }

    return {
        _steps: [],

        addMove(duration, translation) {
            this._steps.push({
                name: "move",
                duration: duration,
                translation: translation
            });
            return this;
        },
        addScale(duration, ratio) {
            this._steps.push({
                name: "scale",
                duration: duration,
                ratio: ratio
            });
            return this;
        },
        addFadeIn(duration) {
            this._steps.push({
                name: "fadeIn",
                duration: duration,
            });
            return this;
        },
        addFadeOut(duration) {
            this._steps.push({
                name: "fadeOut",
                duration: duration,
            });
            return this;
        },
        addDelay(duration) {
            this._steps.push({
                name: "delay",
                duration: duration,
            })
        },
        play(element, cycled = false) {
            let start = {
                classList : element.classList,
                transitionDuration : element.style.transitionDuration,
                transform : element.style.transform,
                scale : element.style.scale
            }
            console.log(start);
            let sum = 0;
            let total = 0;
            for (let item of this._steps) {
                total += item.duration;
            }
                let pos = {x: 0, y: 0};
            let ratio = 1;
            console.log(this._steps);
            if (cycled) {
                let ss = setInterval(() =>  {
                    for (let item of this._steps) {
                        setTimeout(() => {
                            switch (item.name) {
                                case "move":
                                    pos.x = item.translation.x;
                                    pos.y = item.translation.y;
                                    element.style.transitionDuration = `${item.duration}ms`;
                                    element.style.transform = getTransform(pos, ratio);
                                    break;
                                case "scale":
                                    ratio = item.ratio
                                    element.style.transitionDuration = `${item.duration}ms`;
                                    element.style.transform = getTransform(pos, ratio);
                                    break;
                                case "fadeIn":
                                    this.fadeIn(element, item.duration);
                                    break;
                                case "fadeOut":
                                    this.fadeOut(element, item.duration);
                                    break;
                            }
                        }, sum)

                        sum += item.duration;
                    }
                }, total)
                return {
                    stop : clearInterval(ss),
                    reset: function () {
                        element.style.transitionDuration = start.transitionDuration;
                        element.style.scale = start.scale;
                        element.classList = start.scale;
                        element.style.transform = start.transform;
                    }
                };
            } else {
                for (let item of this._steps) {
                    setTimeout(() => {
                        switch (item.name) {
                            case "move":
                                pos.x = item.translation.x;
                                pos.y = item.translation.y;
                                element.style.transitionDuration = `${item.duration}ms`;
                                element.style.transform = getTransform(pos, ratio);
                                break;
                            case "scale":
                                ratio = item.ratio
                                element.style.transitionDuration = `${item.duration}ms`;
                                element.style.transform = getTransform(pos, ratio);
                                break;
                            case "fadeIn":
                                this.fadeIn(element, item.duration);
                                break;
                            case "fadeOut":
                                this.fadeOut(element, item.duration);
                                break;
                        }
                    }, sum)

                    sum += item.duration;
                }
                return {
                    stop : "",
                    reset: function () {
                        element.style.transitionDuration = start.transitionDuration;
                        element.style.scale = start.scale;
                        element.classList = start.classList;
                        element.style.transform = start.transform;
                    }
                };
            }

        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide(element, duration, translation) {
            this.addMove(duration,translation);
            this.addFadeOut(duration);
            return this.play(element);
        },
        showAndHide(element, duration) {
            this.addFadeIn(duration / 3);
            this.addDelay(duration * 2 / 3)
            this.addFadeOut(duration / 3);
            this.play(element);
        },
        heartBeating(element) {
            this.addScale(500, 1.4);
            this.addDelay(500);
            this.addScale(500, 1);
            this.play(element, true);
        }
    }

}

