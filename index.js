addListeners();

function addListeners() {
    let fadeIn;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            fadeIn = animaster().fadeIn(block, 5000);
        });

    let move;
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            move = animaster().move(block, 1000, {x: 100, y: 10});
        });


    let scale;
    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            scale = animaster().scale(block, 1000, 1.25);
        });


    let fadeOut;
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            fadeOut = animaster().addFadeOut(1500).play(block);
        });
    document.getElementById('fadeOutReset')
        .addEventListener('click', function () {
            if (fadeOut) {
                fadeOut.reset();
                fadeOut = undefined;
            } else {
                alert("Анимация не запущена");
            }
        });

    let moveAndHide;
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            moveAndHide = animaster().moveAndHide(block, 3000, 1.25);
        });
    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            if (moveAndHide) {
                moveAndHide.stop();
            } else {
                alert("Анимация не запущена");
            }
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            if (moveAndHide) {
                moveAndHide.reset();
                moveAndHide = undefined;
            } else {
                alert("Анимация не запущена");
            }
        });

    let showAndHide;
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            showAndHide = animaster().showAndHide(block, 3000, 1.25);
        });
    document.getElementById('showAndHideStop')
        .addEventListener('click', function () {
            if (showAndHide) {
                showAndHide.stop();
            } else {
                alert("Анимация не запущена");
            }
        });
    document.getElementById('showAndHideReset')
        .addEventListener('click', function () {
            if (showAndHide) {
                showAndHide.reset();
                showAndHide = undefined;
            } else {
                alert("Анимация не запущена");
            }
        });

    let hearthBeating;
    document.getElementById('hearthBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('hearthBlock');
            hearthBeating = animaster().heartBeating(block);
        });
    document.getElementById('hearthBeatingStop')
        .addEventListener('click', function () {
            if (hearthBeating) {
                hearthBeating.stop();
            } else {
                alert("Анимация не запущена");
            }
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
    let getTransform = function (translation, ratio, rotateDeg) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio) {
            result.push(`scale(${ratio})`);
        }
        if (rotateDeg) {
            result.push(`rotate(${rotateDeg}deg)`);
        }
        return result.join(' ');
    };
    let resetFadeIn = function (element) {
        element.classList.remove('show');
        element.classList.add('hide');
        element.style.transitionDuration = null;
    };
    let resetFadeOut = function (element) {
        element.classList.remove('hide');
        element.classList.add('show');
        element.style.transitionDuration = null;
    };
    let resetMoveScaleAndSpin = function (element) {
        element.style.transitionDuration = null;
        element.style.transform = getTransform(null, 1, 0);
    };
    let _createObject = function (context, newStep) {
        const obj = {};
        for (let prop in context) {
            obj[prop] = context[prop];
        }
        obj._steps = JSON.parse(JSON.stringify(context._steps));
        obj._steps.push(newStep);
        return obj;
    };

    return {
        _steps: [],
        addMove: function (duration, translation) {
            isMoveAndScale = true;
            return _createObject(this, {name: "move", duration: duration, extraParameters: translation});
        },
        addScale: function (duration, ratio) {
            isMoveAndScale = true;
            return _createObject(this, {name: 'scale', duration: duration, extraParameters: ratio});
        },
        addFadeIn: function (duration) {
            isFadeIn = true;
            return _createObject(this, {name: "fadeIn", duration: duration});
        },
        addFadeOut: function (duration) {
            isFadeOut = false;
            return _createObject(this, {name: "fadeOut", duration: duration});
        },
        addDelay: function (duration) {
            return _createObject(this, {name: "delay", duration: duration});
        },
        addSpin: function (duration, deg) {
            return _createObject(this, {name: "spin", duration: duration, extraParameters: deg});
        },
        play: function (element, isCycled = false) {
            let isFadeIn = false,
                isFadeOut = false,
                isMoveScaleOrSpin = false,
                isPaused = false;

            function animationSwitch() {
                if (isPaused)
                    return false;
                if (i === this._steps.length) {
                    i = 0;
                    if (!isCycled) {
                        return false;
                    }
                }
                switch (this._steps[i].name) {
                    case 'move' : {
                        isMoveScaleOrSpin = true;
                        element.style.transitionDuration = `${this._steps[i].duration}ms`;
                        element.style.transform = getTransform(this._steps[i].extraParameters, null, null);
                        break;
                    }
                    case 'scale' : {
                        isMoveScaleOrSpin = true;
                        element.style.transitionDuration = `${this._steps[i].duration}ms`;
                        element.style.transform = getTransform(null, this._steps[i].extraParameters, null);
                        break;
                    }
                    case 'fadeIn' : {
                        isFadeIn = true;
                        element.style.transitionDuration = `${this._steps[i].duration}ms`;
                        element.classList.remove('hide');
                        element.classList.add('show');
                        break;
                    }
                    case 'fadeOut' : {
                        isFadeOut = true;
                        element.style.transitionDuration = `${this._steps[i].duration}ms`;
                        element.classList.remove('show');
                        element.classList.add('hide');
                        break;
                    }
                    case 'delay' : {
                        break;
                    }
                    case 'spin' : {
                        isMoveScaleOrSpin = true;
                        element.style.transitionDuration = `${this._steps[i].duration}ms`;
                        element.style.transform = getTransform(null, null, this._steps[i].extraParameters);
                        break;
                    }
                }
                return this._steps[i++].duration;
            }

            animationSwitch = animationSwitch.bind(this);

            let i = 0;
            let timer = setTimeout(function timeoutStart() {
                let duration = animationSwitch();
                if (isPaused || !duration) {
                    return;
                }
                setTimeout(timeoutStart, duration)
            }, animationSwitch());

            return {
                stop: function () {
                    isPaused = true;
                },
                reset: function () {
                    clearTimeout(timer);
                    if (isFadeIn) {
                        resetFadeIn(element);
                    }
                    if (isFadeOut) {
                        resetFadeOut(element);
                    }
                    if (isMoveAndScale) {
                        resetMoveScaleAndSpin(element);
                    }
                }
            }
        },
        buildHandler: function () {
            let play = this.play.bind(this);
            return function () {
                play(this);
            }
        },
        fadeIn: function (element, duration) {
            this.addFadeIn(duration).play(element);
        },
        fadeOut: function (element, duration) {
            this.addFadeOut(duration).play(element);
        },
        move: function (element, duration, translation) {
            this.addMove(duration, translation).play(element);
        },
        scale: function (element, duration, ratio) {
            this.addScale(duration, ratio).play(element);
        },
        moveAndHide: function (element, duration) {
            return this.addMove(duration * .4, {x: 100, y: 20}).addFadeOut(duration * .6).play(element);
        },
        showAndHide: function (element, duration) {
            return this.addFadeIn(duration / 3).addDelay(duration / 3).addFadeOut(duration / 3).play(element);
        },
        heartBeating: function (element) {
            return this.addScale(500, 1.4).addScale(500, 1).play(element, true);
        }
    };
}