addListeners();

function addListeners() {
    let anim = animaster();
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

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.moveAndHide(block, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim.showAndHide(block, 3000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            anim.heartBeating(block);
        });
    document.getElementById('customPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('customBlock');
            anim.addMove(200, {x: 40, y: 40})
                .addScale(800, 1.3)
                .addMove(200, {x: 80, y: 0})
                .addScale(800, 1)
                .addMove(200, {x: 40, y: -40})
                .addScale(800, 0.7)
                .addMove(200, {x: 0, y: 0})
                .addScale(800, 1);
            anim.play(block);
        });
}

function animaster() {
    function fadeIn(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    function fadeOut(element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }
    function scale(element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }
    function moveAndHide(element, duration) {
        move(element, 2 * duration / 5, {x: 100, y: 20});
        fadeOut(element, 3 * duration / 5);
    }
    function showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(fadeOut, duration / 3, element, duration / 3);
    }
    function heartBeating(element) {
        let inter = setInterval(() =>
        {scale(element, 500, 5/7); setTimeout(scale, 500, element, 500, 7/5)}, 1000);
    }
    function addMove(duration, translation){
        this._steps.push((element) => this.move(element, duration, translation));
        return this;
    }
    function addScale(duration, ratio){
        this._steps.push((element) => this.scale(element, duration, ratio));
        return this;
    }
    function addFadeIn(duration){
        this._steps.push((element) => this.fadeIn(element, duration));
        return this;
    }
    function addFadeOut(duration){
        this._steps.push((element) => this.fadeOut(element, duration));
        return this;
    }
    function play(element){
        for (let step of this._steps){
            step(element);
        }
    }
    let res = {};
    res.fadeIn = fadeIn;
    res.fadeOut = fadeOut;
    res.move = move;
    res.scale = scale;
    res.moveAndHide = moveAndHide;
    res.showAndHide = showAndHide;
    res.heartBeating = heartBeating;
    res.play = play;
    res.addMove = addMove;
    res.addScale = addScale;
    res.addFadeIn = addFadeIn;
    res.addFadeOut = addFadeOut;
    res._steps = [];
    return res;
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
