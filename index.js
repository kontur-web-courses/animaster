addListeners();

function addListeners() {
    const anim = animaster();
    let heartBeat = null;
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            anim.fadeIn(block, 5000);
            // const customAnimation = anim
            //     .addMove(200, {x: 40, y: 40})
            //     .addScale(800, 1.3)
            //     .addMove(200, {x: 80, y: 0})
            //     .addScale(800, 1)
            //     .addMove(200, {x: 40, y: -40})
            //     .addScale(800, 0.7)
            //     .addMove(200, {x: 0, y: 0})
            //     .addScale(800, 1);
            // customAnimation.play(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            anim.fadeOut(block, 5000);
        })

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
    
    document.getElementById("moveAndHidePlay")
      .addEventListener("click", function () {
        const block = document.getElementById("moveAndHideBlock");
        anim.moveAndHide(block, 1000);
      });    

    document
      .getElementById("showAndHidePlay")
      .addEventListener("click", function () {
        const block = document.getElementById("showAndHideBlock");
        anim.showAndHide(block, 1000);
      }); 
    document
      .getElementById("heartBeatPlay")
      .addEventListener("click", function () {
        const block = document.getElementById("heartBeatBlock");
        heartBeat = anim.heartBeating(block);
    }); 
    document
      .getElementById("heartBeatStop")
      .addEventListener("click", function () {
        const block = document.getElementById("heartBeatBlock");
        heartBeat.stop();
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

function animaster () {
    function resetFadeIn (element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut (element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale (element, translation) {
        element.style.transitionDuration = null;
        element.style.transform = getTransform(translation, null)
    }

    return {
        _steps: [],

        fadeIn (element, duration) {
            
            console.log(element);

            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');

        },
        fadeOut (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },


        moveAndHide(element, duration){
            console.log(element);
            this.move(element, duration * 2 / 5, { x: 100, y: 20 });
            setTimeout(this.fadeOut.bind(this, element, duration), duration * 2 / 5);
        },

        showAndHide(element, duration){
            this.fadeIn(element, duration * 1 / 3);
            console.log("showed");
            setTimeout(this.fadeOut.bind(this, element, duration), duration * 2 / 3);
        },

        heartBeating(element){
            let f = () => {
              this.scale(element, 500, 1.4);
              setTimeout(this.scale.bind(this, element, 500, 1 / 1.4), 500);
            };
            
            let f1 = setInterval(f, 1000);

            const obj = {
                stop(){
                    console.log("STOP")
                    clearTimeout(f1);
                }
            }
            
            return obj;
        },

        addDelay(duration){
            this._steps.push([(element=null) => {}, duration])
            return this;
        },
            
        addMove(duration, translation) {
            console.log('Added move')
            this._steps.push([this.move, duration, translation]);
            return this;
        },

        addScale(duration, ratio) {
            console.log('Added scale')
            this._steps.push([this.scale, duration, ratio]);
            return this;
        },

        play(element) {
            let prevDur = 0;
            for (const step of this._steps.map(e => e)) {
                const awake = step[0].bind(...[this, element, ...step.slice(1)]);
                setTimeout(awake, prevDur);
                prevDur += step[1];
                this._steps = this._steps.slice(1);
            }
        }
    }
}
