addListeners();
let heartStopping;
function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            const customAnimation = animaster()
							.addMove(200, { x: 40, y: 40 })
							.addScale(800, 1.3)
							.addMove(200, { x: 80, y: 0 })
							.addScale(800, 1)
							.addMove(200, { x: 40, y: -40 })
							.addScale(800, 0.7)
							.addMove(200, { x: 0, y: 0 })
							.addScale(800, 1);
			customAnimation.play(block);
            //animaster().addFadeIn(5000).play(block);
            //animaster().fadeIn(block, 5000);
            //setTimeout(() => animaster().resetFadeIn(block), 1000);
            //setTimeout(() => animaster().resetFadeOut(block), 2000);
            //setTimeout(() => animaster().addFadeOut(5000).play(block), 1000);
        });
    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            //animaster().move(block, 1000, { x: 100, y: 10 })
            //setTimeout(() => animaster().resetMoveAndScale(block), 1000)
            animaster().addMove(200, { x: 40, y: 40 })
							.addScale(800, 1.3)
							.addMove(200, { x: 80, y: 0 })
							.addScale(800, 1)
							.addMove(200, { x: 40, y: -40 })
							.addScale(800, 0.7)
							.addMove(200, { x: 0, y: 0 })
							.addScale(800, 1).play(block);
        });
    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            //animaster().scale(block, 1000, 1.25)
            animaster().addScale(1000, 1.25).play(block);
        });
    document.getElementById('moveAndHidePlay').addEventListener('click', function () {
			const block = document.getElementById('moveAndHideBlock')
            animaster().moveAndHide(block, 1000, { x: 100, y: 20 });
		});
    document.getElementById('moveAndHideReset').addEventListener('click', function () {
			const block = document.getElementById('moveAndHideBlock')
            animaster().resetMoveAndHide(block);
		});
    document.getElementById('showAndHide').addEventListener('click', function () {
			const block = document.getElementById('showAndHideBlock');
			animaster().showAndHide(block, 1000);
		});
    document.getElementById('heartBeatingStart').addEventListener('click', function () {
			const block = document.getElementById('heartBeatingBlock');
			let object = animaster().heartBeating(block);
            heartStopping = object.stop.bind(object);
		});
    document.getElementById('heartBeatingStop').addEventListener('click', function () {
			const block = document.getElementById('heartBeatingBlock');
            heartStopping();
		});

}

function animaster(){
    return {
			_steps: [],
			fadeIn(element, duration) {
				element.style.transitionDuration = `${duration}ms`
				element.classList.remove('hide')
				element.classList.add('show')
			},
			fadeOut(element, duration) {
				element.style.transitionDuration = `${duration}ms`
				element.classList.remove('show')
				element.classList.add('hide')
			},
			move(element, duration, translation) {
				element.style.transitionDuration = `${duration}ms`
				element.style.transform = getTransform(translation, null)
			},
			scale(element, duration, ratio) {
				element.style.transitionDuration = `${duration}ms`
				element.style.transform = getTransform(null, ratio)
			},
			moveAndHide(element, duration, translation) {
				this.move(element, duration * 0.4, translation)
				setTimeout(() => this.fadeOut(element, duration * 0.6), duration * 0.4)
			},
			resetMoveAndHide(element) {
				this.resetFadeOut(element)
				this.resetMoveAndScale(element)
			},
			showAndHide(element, duration) {
				this.fadeIn(element, duration / 3)
				setTimeout(
					() => this.fadeOut(element, (duration * 1) / 3),
					(duration * 2) / 3
				)
			},
			heartBeating(element) {
				let interval = setInterval(() => {
					this.scale(element, 500, 1.4)
					setTimeout(() => this.scale(element, 500, 1), 500)
				}, 1000)
				return {
					stop() {
						clearInterval(interval)
					},
				}
			},
			resetFadeIn(element) {
				element.style.transitionDuration = '0ms'
				element.classList.remove('show')
				element.classList.add('hide')
			},
			resetFadeOut(element) {
				element.style.transitionDuration = '0ms'
				element.classList.remove('hide')
				element.classList.add('show')
			},
			resetMoveAndScale(element) {
				element.style.transitionDuration = '0ms'
				element.style.transform = null
			},
			addMove(duration, translation) {
				this._steps.push([duration, (element) => this.move(element, duration, translation)])
				return this;
			},
			addScale(duration, ratio) {
				this._steps.push([duration, (element) => this.scale(element, duration, ratio)])
				return this;
			},
			addFadeIn(duration) {
				this._steps.push([duration, (element) => this.fadeIn(element, duration)])
				return this;
			},
			addFadeOut(duration) {
				this._steps.push([duration, (element) => this.fadeOut(element, duration)])
				return this;
			},
			play(element) {
                let durationAll = 0;
				this._steps.forEach(step => {
                    setTimeout(() => step[1](element), durationAll);
                    durationAll += step[0];
				})
			},
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
