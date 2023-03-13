addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            fadeIn(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            scale(block, 1000, 1.25);
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
            let isMoveAndScale = true;
            return _createObject(this, {name: "move", duration: duration, extraParameters: translation});
        },
        addScale: function (duration, ratio) {
            let isMoveAndScale = true;
            return _createObject(this, {name: 'scale', duration: duration, extraParameters: ratio});
        },
        addFadeIn: function (duration) {
            let isFadeIn = true;
            return _createObject(this, {name: "fadeIn", duration: duration});
        },
        addFadeOut: function (duration) {
            let isFadeOut = false;
            return _createObject(this, {name: "fadeOut", duration: duration});

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
