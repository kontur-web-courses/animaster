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
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 1000);
        });
    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            animaster().moveAndHide(block, 1000, {x: 100, y: 20});
        });
    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 1000);
        });
    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block);
        });
    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            animaster().heartBeating(block).stop();
        });
}


function animaster(){
    return {
        fadeIn: function(element, duration){
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        move: function(element, duration, translation){
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = this.getTransform(translation, null);
        },
        scale: function(element, duration, ratio){
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = this.getTransform(null, ratio);
            return element;
        },
        getTransform: function(translation, ratio){
            const result = [];
            if (translation) {
                result.push(`translate(${translation.x}px,${translation.y}px)`);
            }
            if (ratio) {
                result.push(`scale(${ratio})`);
            }
            return result.join(' ');
        },
        fadeOut: function(element, duration){
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide: function(element, duration, translation){
            this.move(element, duration * 2/5, translation)
            this.fadeOut(element, duration * 3/5, translation)
        },
        showAndHide: function (element, duration){
            this.fadeIn(element, duration * 1/3)
            setTimeout(() => this.fadeOut(element, duration * 1/3),
                duration * 1/3);
        },
        heartBeating: function (element){
            let beating = () => {
                this.scale(element, 500, 1.4)
                setTimeout(this.scale.bind(this, element, 500, 1 / 1.4), 500);
            }

            setInterval(beating, 1000);

            return {
                stop: function () {
                    clearTimeout(beating);
            }}
        }
    }
}
