addListeners();

function addListeners() {
    const anim = animaster();

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            anim.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            anim.move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            anim.scale(block, 1000, 1.25);
        });

    document.getElementById('customPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
            anim.addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 80})
                .addScale(800, 1)
                .addMove(200, {x: 120, y: 120})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            let a = anim.play(block);
            setTimeout(() => {
                a.reset()
            }, 1100);
        });
}

function toStep(callable, duration, ...args) {
    return function (element, waitTime) {
        let id = setTimeout(() => {
            callable(element, duration, ...args)
        }, waitTime)
        return { id: id, duration: duration };
    }
}

function animaster() {
    let _steps = [];
    let _ids = [];

    return {
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        addFadeIn: function (duration) {
            _steps.push(toStep(this.fadeIn, duration));
            return this;
        },
        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },
        addFadeOut: function (duration) {
            _steps.push(toStep(this.fadeOut, duration));
            return this;
        },
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        addMove: function (duration, translation) {
            _steps.push(toStep(this.move, duration, translation));
            return this;
        },
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        addScale: function (duration, ratio) {
            _steps.push(toStep(this.scale, duration, ratio));
            return this;
        },
        play: function (element) {
            setTimeout(() => {
                let waitTime = 0;
                for (let i = 0; i < _steps.length; i++) {
                    let res = _steps[i](element, waitTime);
                    waitTime += res.duration;
                    _ids.push(res.id)
                }
                _steps = [];
            }, 0);
            return {
                stop: 'lol;)',
                reset: function () {
                    for (let id of _ids) {
                        clearTimeout(id);
                    }
                    element.style.transform = getTransform(null, null);
                }
            }
        },
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
