addListeners();

let beatingFlag;

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            const animation = animaster().addFadeIn(5000).play(block);

            document.getElementById('fadeInReset')
                .addEventListener('click', function () {animation.reset();})
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            const animation = animaster().addFadeOut(5000).play(block);

            document.getElementById('fadeOutReset')
                .addEventListener('click', function () {animation.reset();})
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const animation = animaster().addMoveAndHide(5000, {x: 100, y: 20}).play(block);

            document.getElementById('moveAndHideReset')
                .addEventListener('click', function () {animation.reset();})
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            const animation = animaster().addShowAndHide(5000).play(block);

            document.getElementById('showAndHideReset')
                .addEventListener('click', function () {animation.reset();})
        });

    document.getElementById('showAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(5000).reset();
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).start();
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).stop();
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            const animation = animaster().addMove(1000, {x: 100, y: 20}).play(block);

            document.getElementById('moveReset')
                .addEventListener('click', function () {animation.reset();})
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            const animation = animaster().addScale(1000, 1.25).play(block);

            document.getElementById('scaleReset')
                .addEventListener('click', function () {animation.reset();})
        });
    document.getElementById('changeColor')
        .addEventListener('click', function () {
            const block = document.getElementById('changeColorBlock');
            const animation = animaster().addColorChange(1000, 'black').play(block);

            document.getElementById('scaleReset')
                .addEventListener('click', function () {animation.reset();})
        });

    const customAnimationPlayHandler = animaster()
        .addMove(200, {x: 40, y: 40})
        .addScale(800, 1.3)
        .addMove(200, {x: 80, y: 0})
        .addScale(800, 1)
        .addMove(200, {x: 40, y: -40})
        .addScale(800, 0.7)
        .addMove(200, {x: 0, y: 0})
        .addScale(800, 1)
        .buildHandler();

    document.getElementById('customAnimationPlay').addEventListener('click', customAnimationPlayHandler);

}

function animaster() {
    return {
        _steps: [],

        addMove: function(duration, translation) {
            this._steps.push({
                type: 'move',
                duration: duration,
                translation: translation
            });
            let res = this;
            res._steps = this._steps.slice(0)
            return res;
        },

        addScale: function (duration, ratio) {
            this._steps.push({
                type: 'scale',
                duration: duration,
                ratio: ratio
            });
            let res = this;
            res._steps = this._steps.slice(0)
            return res;
        },

        addFadeIn: function (duration) {
            this._steps.push({
                type: 'fadeIn',
                duration: duration
            });
            let res = this;
            res._steps = this._steps.slice(0)
            return res;
        },

        addFadeOut: function (duration) {
            this._steps.push({
                type: 'fadeOut',
                duration: duration
            });
            let res = this;
            res._steps = this._steps.slice(0)
            return res;
        },

        addDelay: function (duration) {
            this._steps.push({
                type: 'delay',
                duration: duration
            });
            let res = this;
            res._steps = this._steps.slice(0)
            return res;
        },

        addMoveAndHide: function (duration, translation) {
            this.addMove(duration * 2/5, translation)
                .addFadeOut(duration * 3/5);
            let res = this;
            res._steps = this._steps.slice(0)
            return res;
        },

        addShowAndHide: function (duration) {
            this.addFadeIn(duration * 1/3)
                .addDelay(duration * 1/3)
                .addFadeOut(duration * 1/3);
            let res = this;
            res._steps = this._steps.slice(0)
            return res;
        },
        
        addColorChange: function (duration, color) {
            this._steps.push({
                type: 'colorChange',
                duration: duration,
                color: color
            });
            let res = this;
            res._steps = this._steps.slice(0)
            return res;
        },

        buildHandler: function() {
            const self = this;
            return function() {
                const element = this;
                self.play(element);
            };
        },

        play: function(element) {
            let self = this;
            let delay = 0;
            let animations = [];

            this._steps.forEach(function(step) {
                let animation;
                setTimeout(function() {
                    switch (step.type) {
                        case 'move':
                            animation = self.move(element, step.duration, step.translation);
                            break;
                        case 'scale':
                            animation = self.scale(element, step.duration, step.ratio);
                            break;
                        case 'fadeIn':
                            animation = self.fadeIn(element, step.duration);
                            break;
                        case 'fadeOut':
                            animation = self.fadeOut(element, step.duration);
                            break;
                        case 'moveAndHide':
                            animation = self.moveAndHide(element, step.duration, step.translation);
                            break;
                        case 'showAndHide':
                            animation = self.showAndHide(element, step.duration);
                            break;
                        case 'colorChange':
                            animation = self.changeColor(element, step.duration, step.color);
                            break;
                    }

                    setTimeout(function () {
                        animation.start();
                        animations.push(animation);
                    })
                }, delay);

                delay += step.duration;
            });

            return {
                stop: function() {
                    animations.forEach(function(animation) {
                        if (animation.stop) animation.stop();
                    });
                },
                reset: function() {
                    animations.forEach(function(animation) {
                        if (animation.reset) animation.reset();
                    });
                }
            };
        },

        fadeIn: function(element, duration){
            return {
                start: function () {
                    element.style.transitionDuration =  `${duration}ms`;
                    element.classList.remove('hide');
                    element.classList.add('show');
                },

                reset: function () {
                    element.style.transitionDuration = null;
                    element.classList.remove('show');
                    element.classList.add('hide');
                }
            };
        },

        changeColor: function (element, duration, color) {
            return {
                prevColor: element.style.backgroundColor,
                start: function () {
                    element.style.transitionDuration =  `${duration}ms`;
                    element.style.backgroundColor = color;
                },

                reset: function () {
                    element.style.backgroundColor = prevColor;
                }
            };
        },

        fadeOut: function (element, duration) {
            return {
                start: function () {
                    element.style.transitionDuration =  `${duration}ms`;
                    element.classList.remove('show');
                    element.classList.add('hide');
                },

                reset: function () {
                    element.style.transitionDuration = null;
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            }
        },

        move: function(element, duration, translation) {
            return {
                start: function () {
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = animaster().getTransform(translation, null);
                },

                reset: function () {
                    element.style.transitionDuration = null;
                    element.style.transform = animaster().getTransform({x: 0, y: 0}, null);
                }
            };
        },

        scale: function(element, duration, ratio) {
            return {
                start: function () {
                    element.style.transitionDuration =  `${duration}ms`;
                    element.style.transform = animaster().getTransform(null, ratio);
                },

                reset: function () {
                    element.style.transitionDuration = null;
                    element.style.transform = animaster().getTransform({x: 0, y: 0}, 1);
                }
            };
        },

        moveAndHide: function (element, duration, translation) {
            const moveAnimation = this.move(element, duration * 2/5, translation);
            const hideAnimation = this.fadeOut(element, duration * 3/5);

            return {
                start: function () {
                    moveAnimation.start();
                    hideAnimation.start();
                },
                reset: function () {
                    moveAnimation.reset();
                    hideAnimation.reset();
                }
            };
        },

        showAndHide: function (element, duration) {
            const fadeInAnimation = this.fadeIn(element, duration * 1 / 3);
            const fadeOutAnimation = this.fadeOut(element, duration * 1/3);
            return {
                start: function () {
                    fadeInAnimation.start()
                    setTimeout(() => fadeOutAnimation.start(), duration * 1 /3);
                },

                reset: function () {
                    fadeInAnimation.reset();
                    fadeOutAnimation.reset();
                }
            }
        },

        heartBeating: function (element) {
            const self = this;

            function beating() {
                self.scale(element, 500, 1.4).start();
                setTimeout(() => self.scale(element, 500, 1 / 1.4).start(), 500);
            }

            return {
                start: function () {
                    beatingFlag = setInterval(beating, 1000);
                },
                stop: function () {
                    clearInterval(beatingFlag);
                    beatingFlag = 0;
                }
            };
        },

        getTransform: function(translation, ratio){
            const result = [];
            if (translation) {
                result.push(`translate(${translation.x}px,${translation.y}px)`);
            }
            if (ratio) {
                result.push(`scale(${ratio})`);
            }
            return result.join(' ');
        }
    }
}
