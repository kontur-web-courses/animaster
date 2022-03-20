const blockByButton = {
    fadeInPlay: 'fadeInBlock',
    fadeInReset: 'fadeInBlock',
    fadeOutPlay: 'fadeOutBlock',
    fadeOutReset: 'fadeOutBlock',
    movePlay: 'moveBlock',
    moveReset: 'moveBlock',
    scalePlay: 'scaleBlock',
    scaleReset: 'scaleBlock',
    moveAndHidePlay: 'moveAndHideBlock',
    moveAndHideReset: 'moveAndHideBlock',
    showAndHidePlay: 'showAndHideBlock',
    heartBeatingPlay: 'heartBeatingBlock',
    heartBeatingStop: 'heartBeatingBlock'
};

const buttons = Object.fromEntries(Object.entries(blockByButton).map(([key, _]) => [key, document.getElementById(key)]));
const blocks = Object.fromEntries(Object.entries(blockByButton).map(([_, value]) => [value, document.getElementById(value)]));
const blockByButtonName = buttonName => blocks[blockByButton[buttonName]];

addListeners();

function addListeners() {
    const addClickEventListener = (buttonName, func) => buttons[buttonName].addEventListener('click', () => func(blockByButtonName(buttonName)));
    const addResetableClickEventListener = (startButtonName, resetButtonName, blockFunc) => {
        addClickEventListener(startButtonName, block => {
            const func = blockFunc(block);
            addClickEventListener(resetButtonName, () => func.reset());
        });
    };
    const heartPlay = buttons.heartBeatingPlay;

    addResetableClickEventListener('fadeInPlay', 'fadeInReset', block => animaster().fadeIn(block, 5000));
    addResetableClickEventListener('fadeOutPlay', 'fadeOutReset', block => animaster().fadeOut(block, 5000));
    addResetableClickEventListener('movePlay', 'moveReset', block => animaster().move(block, 1000, {
        x: 100,
        y: 10
    }));
    addResetableClickEventListener('scalePlay', 'scaleReset', block => animaster().scale(block, 1000, 1.25));
    addResetableClickEventListener('moveAndHidePlay', 'moveAndHideReset', block => animaster().moveAndHide(block, 1000));

    addClickEventListener('showAndHidePlay', block => animaster().showAndHide(block, 1000));
    addClickEventListener('heartBeatingPlay', block => {
        heartPlay.disabled = true;
        const func = animaster().heartBeating(block);
		addClickEventListener('heartBeatingStop', block => {
                func.stop();
                heartPlay.disabled = false;
            });
    });
}

function animaster() {
    function SimpleAnimation(name, duration) {
        this.name = name;
        this.start = _offsetInMs;
        this.duration = duration;
        this.execute = element => element;

        _offsetInMs += duration;
    }

    function FadeAnimation(duration, show) {
        SimpleAnimation.call(this, show ? 'FadeIn' : 'FadeOut', duration);
        this.show = show;
        this.execute = element => fadeInternal(element, this.show, this.duration);
    }

    function MoveAnimation(duration, coords) {
        SimpleAnimation.call(this, 'Move', duration);
        this.coords = coords;
        this.execute = element => move(element, this.duration, this.coords);
    }

    function ScaleAnimation(duration, ratio) {
        SimpleAnimation.call(this, 'Scale', duration);
        this.ratio = ratio;
        this.execute = element => scale(element, this.duration, this.ratio);
    }

    FadeAnimation.prototype = SimpleAnimation.prototype;
    MoveAnimation.prototype = SimpleAnimation.prototype;
    ScaleAnimation.prototype = SimpleAnimation.prototype;

    const setDuration = (element, duration = null) =>
        element.style.transitionDuration = duration === null ? null : `${duration}ms`;

    function fadeInternal(element, show, duration = null) {
        setDuration(element, duration);
        let classToAdd = 'show',
            classToRemove = 'hide';

        if (!show) {
            [classToAdd, classToRemove] = [classToRemove, classToAdd];
        }

        element.classList.remove(classToRemove);
        element.classList.add(classToAdd);
    }

    function resetInternal(element) {
        setDuration(element, null);
        element.style.transform = null;
    }

    function move(element, duration, translation) {
        setDuration(element, duration);
        element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
        setDuration(element, duration);
        element.style.transform = getTransform(null, ratio);
    }

    const resetFadeIn = element => fadeInternal(element, false);
    const resetFadeOut = element => fadeInternal(element, true);
    const resetMove = element => resetInternal(element);
    const resetScale = element => resetInternal(element);

    let _offsetInMs = 0;
    let _steps = [];

    function play(element, cycled = false) {
        const wasHidden = element.classList.contains('hide');

        const _stepsCopy = [..._steps];
        const loop = () => {
            for (const i of _stepsCopy) {
                setTimeout(() => i.execute(element), i.start);
            }
        };

        const returnObject = {
            reset() {
                if (wasHidden) {
                    resetFadeIn(element);
                } else {
                    resetFadeOut(element);
                }

                resetInternal(element);
            }
        };

        if (cycled) {
            const interval = setInterval(loop, _offsetInMs);
            returnObject.stop = () => clearInterval(interval);
        } else {
            loop();
        }

        _steps = [];
        return returnObject;
    }

    return {
        play,
        addFadeIn: function(duration) {
            _steps.push(new FadeAnimation(duration, true));
            return this;
        },
        addFadeOut: function(duration) {
            _steps.push(new FadeAnimation(duration, false));
            return this;
        },
        addMove: function(duration, translation) {
            _steps.push(new MoveAnimation(duration, translation));
            return this;
        },
        addScale: function(duration, ratio) {
            _steps.push(new ScaleAnimation(duration, ratio));
            return this;
        },
        addDelay: function(duration) {
            _steps.push(new SimpleAnimation('Do nothing', duration));
            return this;
        },
        fadeIn: function(element, duration) {
            return this.addFadeIn(duration).play(element);
        },
        fadeOut: function(element, duration) {
            return this.addFadeOut(duration).play(element);
        },
        move: function(element, duration, translation) {
            return this.addMove(duration, translation).play(element);
        },
        scale: function(element, duration, ratio) {
            return this.addScale(duration, ratio).play(element);
        },
        moveAndHide: function(element, duration) {
            const translation = {
                x: 100,
                y: 20
            };
            const moveDuration = 0.4 * duration;
            const fadeOutDuration = 0.6 * duration;

            return this.addMove(moveDuration, translation).addFadeOut(fadeOutDuration).play(element);
        },
        showAndHide: function(element, duration) {
            const singleOperationDuration = duration / 3;
            return this.addFadeIn(singleOperationDuration)
                .addDelay(singleOperationDuration)
                .addFadeOut(singleOperationDuration)
                .play(element);
        },
        heartBeating: function(element) {
            return this.addScale(500, 1.4).addScale(500, 1).play(element, true);
        }
    };
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