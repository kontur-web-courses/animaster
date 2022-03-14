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
            anim._scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.moveAndHide(block, 5000);
        });
    document.getElementById('moveAndHideReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            anim.resetMoveAndHide(block);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            anim.showAndHide(block, 3000);
        });
    let heart;
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            heart = anim.heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            heart.stop();
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
    function fadeIn(element, duration, callBack) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
        setTimeout(callBack, duration);
    }
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }
    function fadeOut(element, duration, callBack) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
        setTimeout(callBack, duration);
    }
    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }
    function move(element, duration, translation, callBack) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
        setTimeout(callBack, duration);
    }
    function _scale(element, duration, ratio, callBack) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
        setTimeout(callBack, duration);
    }
    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }
    function moveAndHide(element, duration) {
        move(element, 2 * duration / 5, {x: 100, y: 20});
        fadeOut(element, 3 * duration / 5);
    }
    function resetMoveAndHide(element) {
        resetMoveAndScale(element);
        resetFadeOut(element);
    }
    function showAndHide(element, duration) {
        fadeIn(element, duration / 3);
        setTimeout(fadeOut, duration / 3, element, duration / 3);
    }
    function heartBeating(element) {
        let inter = setInterval(() =>
        {_scale(element, 500, 7/5); setTimeout(_scale, 500, element, 500, 5/7)}, 1000);
        let heart = {};
        heart.stop = () => {clearInterval(inter)};
        return heart;
    }
    function addMove(duration, translation){
        this._steps.push((element, i) => this.move(element, duration, translation,
            () => {if(i + 1 < this._steps.length) this._steps[i + 1](element, i + 1)}));
        return this;
    }
    function addScale(duration, ratio){
        this._steps.push((element, i) => this._scale(element, duration, ratio,
            () => {if(i + 1 < this._steps.length) this._steps[i + 1](element, i + 1)}));
        return this;
    }
    function addFadeIn(duration){
        this._steps.push((element, i) => this.fadeIn(element, duration,
            () => {if(i + 1 < this._steps.length) this._steps[i + 1](element, i + 1)}));
        return this;
    }
    function addFadeOut(duration){
        this._steps.push((element, i) => this.fadeOut(element, duration,
            () => {if(i + 1 < this._steps.length) this._steps[i + 1](element, i + 1)}));
        return this;
    }
    function play(element){
        if (this._steps.length === 0)
            return;
        this._steps[0](element, 0);
    }
    let res = {};
    res.fadeIn = fadeIn;
    res.fadeOut = fadeOut;
    res.move = move;
    res._scale = _scale;
    res.moveAndHide = moveAndHide;
    res.showAndHide = showAndHide;
    res.heartBeating = heartBeating;
    res.play = play;
    res.addMove = addMove;
    res.addScale = addScale;
    res.addFadeIn = addFadeIn;
    res.addFadeOut = addFadeOut;
    res._steps = [];
    res.resetMoveAndHide = resetMoveAndHide;
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
