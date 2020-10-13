function configureAnimations() {
    animaster()
        .fadeIn(5000)
        .bindAll('fadeIn');
    animaster()
        .fadeOut(5000)
        .bindAll('fadeOut');
    animaster()
        .move({x: 100, y: 10}, 1000)
        .bindAll('move');
    animaster()
        .scale(1.25, 1000)
        .bindAll('scale');
    let duration = 3000;
    animaster()
        .move({x: 100, y: 20}, 2 / 5 * duration, false)
        .fadeOut(3 / 5 * duration)
        .bindAll('moveAndHide');
    duration = 5000;
    animaster()
        .fadeIn(1 / 3 * duration)
        .wait(1 / 3 * duration)
        .fadeOut(1 / 3 * duration)
        .bindAll('showAndHide');
    duration = 1000;
    animaster()
        .scale(1.4, 0.5 * duration, false)
        .scale(1, 0.5 * duration, false)
        .cycle()
        .bindAll('heartBeating');
    duration = 5000;
    animaster()
        .rotate(360, 2000, false)
        .rotate(0, 0)
        .cycle()
        .bindAll('rotate');
}

function animaster() {
    return new Animation();
}

function getTransform(translation, ratio, rotation) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    if (rotation) {
        result.push(`rotate(${rotation}deg)`);
    }
    return result.join(' ');
}

class Animation {
    _steps = [];
    _element = null;
    _currentStepIndex = 0;
    _elementInitialState = null;
    _stopPended = false;
    _cycled = false;

    _addStep(duration, sync, operation, ...params) {
        const animation = new Animation();
        animation._steps = [...this._steps, {operation, sync, params: [duration, ...params]}];
        return animation;
    }

    fadeIn(duration, sync = true) {
        return this._addStep(duration, sync, Animator.fadeIn);
    }

    fadeOut(duration, sync = true) {
        return this._addStep(duration, sync, Animator.fadeOut);
    }

    move(offset, duration, sync = true) {
        return this._addStep(duration, sync, Animator.move, offset);
    }

    scale(ratio, duration, sync = true) {
        return this._addStep(duration, sync, Animator.scale, ratio);
    }
    
    rotate(degrees, duration, sync = true) {
        return this._addStep(duration, sync, Animator.rotate, degrees);
    }
    
    wait(duration) {
        return this._addStep(duration, false, () => {
        })
    }

    play() {
        this._stopPended = false;
        setTimeout(this._playNext.bind(this), 0);
    }

    _playNext() {
        if (this._stopPended)
            return;
        if (this._currentStepIndex >= this._steps.length) {
            if (!this._cycled)
                return;
            this._currentStepIndex = 0;
        }

        const currentStep = this._steps[this._currentStepIndex++];
        let stepTimeout = currentStep.sync ? 0 : currentStep.params[0];

        currentStep.operation(this._element, ...currentStep.params);
        setTimeout(this._playNext.bind(this), stepTimeout);
    }

    reset() {
        Animator.reset(this._element, this._elementInitialState);
        this._currentStepIndex = 0;
    }

    stop() {
        this._stopPended = true;
    }

    cycle() {
        this._cycled = true;
        return this;
    }

    applyTo(elementId) {
        this._element = document.getElementById(elementId);
        this._elementInitialState = {classList: this._element.classList.value};
        return this;
    }

    bindPlay(elementId, eventName = 'click') {
        const element = document.getElementById(elementId);
        element && element.addEventListener(eventName, this.play.bind(this));
        return this;
    }

    bindReset(elementId, eventName = 'click') {
        const element = document.getElementById(elementId);
        element && element.addEventListener(eventName, this.reset.bind(this));
        return this;
    }

    bindStop(elementId, eventName = 'click') {
        const element = document.getElementById(elementId);
        element && element.addEventListener(eventName, this.stop.bind(this));
        return this;
    }

    bindAll(animationName, block = 'Block', play = 'Play', stop = 'Stop', reset = 'Reset') {
        this.applyTo(animationName + block);
        this.bindPlay(animationName + play);
        this.bindStop(animationName + stop);
        this.bindReset(animationName + reset);
    }
}

const Animator = {
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

    move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    },

    scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    },

    reset(element, initialState) {
        element.style.transitionDuration = null;
        element.style.transform = null;
        element.classList.value = initialState.classList;
    },
    
    rotate(element, duration, rotation){
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, null, rotation);
    }
};

configureAnimations();