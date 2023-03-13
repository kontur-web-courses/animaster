addListeners();

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
    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOut');
            animaster().fadeOut(block, 5000);
        });
    document.getElementById('showAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('ShowAndHideBlock');
            animaster().showAndHide(block, 5000);
        });
    document.getElementById('moveAndHide')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 5000);
        });
}

function animaster() {
    return {
        'fadeIn': function fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        'fadeOut': function fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        'move': function move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        'scale': function scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        'showAndHide': function showAndHide(element, duration) {
            this.fadeIn(element, duration/2);
            setTimeout(() => this.fadeOut(element, duration/2), duration/2);
        },
        'moveAndHide': function moveAndHide(element, duration) {
            let moveTime = (2/5) * duration;
            let fadeOutTime = (3/5) * duration;
            this.move(element, moveTime, {x:100, y:10});
            setInterval(()=>this.fadeOut(element, fadeOutTime), moveTime);
        }
    }
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

