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
        .addEventListener('click', function(){
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function(){
            const block = document.getElementById('moveAndHideBlock');
            animaster().move(block, 2000, {x: 100, y: 20});
            setTimeout(function(){
                animaster().fadeOut(block, 3000);
            }, 2000);
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function(){
            const block = document.getElementById('showAndHideBlock');
            animaster().fadeIn(block, 1000);
            setTimeout(function(){
                animaster().fadeOut(block, 1000);
            }, 2000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function(){
            const block = document.getElementById('heartBeatingBlock');
            setInterval(function(){
                animaster().scale(block, 500, 1.4);
                setTimeout(function(){
                    animaster().scale(block, 500, 1);
                }, 500);
            }, 1000)
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

function animaster(){
    return{
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
    };
}
