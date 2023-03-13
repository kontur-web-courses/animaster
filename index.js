let heartBlock = null;

function animaster() {
    function moveAndHide(element, duration) {
        const initialPosition = element.getBoundingClientRect();
        const finalPosition = {
          left: initialPosition.left + 100,
          top: initialPosition.top + 20
        };
      
        const animation = element.animate([
          { transform: `translate(${0}px, ${0}px)`, opacity: 1 },
          { transform: `translate(${finalPosition.left - initialPosition.left}px, ${finalPosition.top - initialPosition.top}px)`, opacity: 1 },
          { transform: `translate(${finalPosition.left - initialPosition.left}px, ${finalPosition.top - initialPosition.top}px)`, opacity: 0 }
        ], {
          duration: duration,
          easing: "ease-in-out",
          fill: "forwards"
        });
      
        animation.onfinish = () => {
          element.style.opacity = 0;
        }
      }
      
      function showAndHide(element, duration) {      
        const animation = element.animate([
          { opacity: 0 },
          { opacity: 1 },
          { opacity: 1 },
          { opacity: 0 }
        ], {
          duration: duration,
          easing: "linear",
          fill: "forwards"
        });
      
        animation.onfinish = () => {
          element.style.opacity = 0;
        }
      }
      
      function heartBeating(element) { 
        const animation = element.animate([
          { transform: "scale(1)", offset: 0 },
          { transform: "scale(1.4)", offset: 0.5 },
          { transform: "scale(1)", offset: 1 }
        ], {
          duration: 500,
          iterations: Infinity,
          easing: "ease-in-out"
        });
      
        return {
          stop: () => {
            animation.cancel();
          }
        }
      }

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

    return {
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide, 
        heartBeating,
        delay: function(duration) {
            return new Promise(resolve => setTimeout(resolve, duration));
        },
        sequence: function(sequenceArray) {
            return new Promise(async function(resolve) {
                for (let i = 0; i < sequenceArray.length; i++) {
                    const animation = sequenceArray[i];
                    const delay = animation.delay || 0;
                    await animaster()[animation.name](animation.element, animation.duration, animation.amount)
                        .delay(delay);
                }
                resolve();
            });
        },
        parallel: function(parallelArray) {
            const promisesArray = parallelArray.map((animation) => animaster()[animation.name](animation.element, animation.duration, animation.amount)
                .delay(animation.delay || 0));
            return Promise.all(promisesArray);
        },
        buildHandler: function({duration = 0, delay = 0, amount = null, type = '', target}) {
            switch (type) {
                case 'fadeIn':
                case 'fadeOut':
                    return {
                        name: type,
                        duration,
                        delay,
                        element: target
                    };
                case 'move':
                case 'scale':
                    return {
                        name: type,
                        duration,
                        delay,
                        element: target,
                        amount
                    };
            }
        }
    };
}

document.getElementById('fadeInPlay')
    .addEventListener('click', function () {
        const block = document.getElementById('fadeInBlock');
        animaster().fadeIn(block, 1000);
    });

document.getElementById('fadeOutPlay')
    .addEventListener('click', function () {
        const block = document.getElementById('fadeInBlock');
        animaster().fadeOut(block, 1000);
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

document.getElementById('moveAndHidePlay')
.addEventListener('click', function () {
    const block = document.getElementById('moveAndHideBlock');
    animaster().moveAndHide(block, 1000);
});

document.getElementById('showAndHidePlay')
.addEventListener('click', function () {
    const block = document.getElementById('showAndHideBlock');
    animaster().showAndHide(block, 1000);
});

document.getElementById('heartBeatingPlay')
.addEventListener('click', function () {
    const block = document.getElementById('heartBeatingBlock');
    heartBlock = animaster().heartBeating(block);
});

document.getElementById('stop')
.addEventListener('click', function () {
    heartBlock.stop();
});
