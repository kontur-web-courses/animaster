configureAnimations();

function configureAnimations() {
    const animator = animaster();
    bind('fadeInPlay', () =>
        animator.fadeIn(getTarget('fadeInBlock'), 5000));
    bind('fadeOutPlay', () =>
        animator.fadeOut(getTarget('fadeOutBlock'), 5000));

    bind('movePlay', () =>
        animator.move(getTarget('moveBlock'), 1000, {x: 100, y: 10}));

    bind('scalePlay', () =>
        animator.scale(getTarget('scaleBlock'), 1000, 1.25));
    bind('moveAndHidePlay', () =>
        animator.moveAndHidePlay(
            getTarget('moveAndHideBlock'), 
            3000, 
            {x: 100, y: 20}));
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
        moveAndHidePlay(element, duration, translation) {
            this.move(element, duration * (2/5), translation);
            this.fadeOut(element, duration * (3/5));
        },
    };
}

function getTarget(elementId) {
    return document.getElementById(elementId);
}

function bind(elementId, callback) {
    document.getElementById(elementId).onclick = callback;
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
