addListeners();

function animaster(){
    this.moveAndHide = function (element, duration) {
        this.move(element, duration * 2 /5, {x:100, y:20});
        this.fadeOut(element, duration * 3 /5);
    }

    this.showAndHide = function (element, duration) {
        this.fadeIn(element, duration / 3);
        setTimeout(this.fadeOut, duration / 3, element, duration)
    }

    this.fadeIn = function (element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    this.resetFadeIn = function (element){
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    this.resetFadeOut = function (element){
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    this.resetMoveAndScale = function (element){
        element.style.transitionDuration = null;
        element.style.transform = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    this.fadeOut = function (element, duration) {
        element.style.transitionDuration =  `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }


    this.move = function (element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }
    this.scale = function (element, duration, ratio) {
        element.style.transitionDuration =  `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    this.heartBeating = function (element) {
        this.scale(element, 500, 1.4);
        setInterval(this.scale, 500, element, 500, 1)
        setInterval(this.scale, 1000, element, 500, 1.4)
    }

    return this;
}
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

    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 2000);
        });

    document.getElementById('moveAndHideStop')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 2000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block);
        })

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
