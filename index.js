addListeners();

function resetFadeIn(element) {
	element.style.transitionDuration = null;
}

function resetFadeOut(element) {
	element.style.transitionDuration = null;
}

function resetMoveAndScale(element) {
	element.style.transitionDuration = null;
	element.style.transform = null;
}

function animaster() {
	return {
		scale(element, duration, ratio) {
			element.style.transitionDuration = `${duration}ms`;
			element.style.transform = getTransform(null, ratio);
		},
		move(element, duration, translation) {
			element.style.transitionDuration = `${duration}ms`;
			element.style.transform = getTransform(translation, null);
		},
		fadeIn(element, duration) {
			element.style.transitionDuration = `${duration}ms`;
			element.classList.remove("hide");
			element.classList.add("show");
		},
		fadeOut(element, duration) {
			element.style.transitionDuration = `${duration}ms`;
			element.classList.remove("show");
			element.classList.add("hide");
		},
		moveAndHide(element, duration, translation) {
			this.move(element, duration, translation);
			this.fadeOut(element, duration);
		},
		showAndHide(element, duration) {
			this.fadeIn(element, duration);
			setTimeout(this.fadeOut, duration, element, duration);
		},
		heartBeating(element) {
			let id1 = setInterval(this.scale, 500, element, 500, 1.4);
			let id2 = setInterval(this.scale, 1000, element, 500, 1);

			return {
				stop() {
					clearInterval(id1);
					clearInterval(id2);
				},
			};
		},
	};
}

function tick() {
	context.scale(element, duration, 1.4);
	setTimeout(context.scale, duration, element, duration, 0.5);
	setTimeout(tick, 3 * duration, element, duration);
}

function addListeners() {
	let ani = animaster();
	document
		.getElementById("fadeInPlay")
		.addEventListener("click", function () {
			const block = document.getElementById("fadeInBlock");
			ani.fadeIn(block, 4000);
		});

	document
		.getElementById("fadeOutPlay")
		.addEventListener("click", function () {
			const block = document.getElementById("fadeOutBlock");
			ani.fadeOut(block, 1000);
		});

	document.getElementById("movePlay").addEventListener("click", function () {
		const block = document.getElementById("moveBlock");
		ani.move(block, 1000, { x: 100, y: 10 });
	});

	document
		.getElementById("moveAndHide")
		.addEventListener("click", function () {
			const block = document.getElementById("moveAndHideBlock");
			ani.moveAndHide(block, 1000, { x: 100, y: 10 });
		});

	document
		.getElementById("moveAndHideReset")
		.addEventListener("click", function () {
			const block = document.getElementById("moveAndHideBlock");
			resetMoveAndScale(block);
		});

	document
		.getElementById("showAndHide")
		.addEventListener("click", function () {
			const block = document.getElementById("showAndHideBlock");
			ani.showAndHide(block, 1000);
		});

	let heart = null;

	document
		.getElementById("heartBeating")
		.addEventListener("click", function () {
			const block = document.getElementById("heartBeatingBlock");
			heart = ani.heartBeating(block);
		});

	document
		.getElementById("heartBeatingStop")
		.addEventListener("click", function () {
			if (heart !== null) heart.stop();
		});

	document.getElementById("scalePlay").addEventListener("click", function () {
		const block = document.getElementById("scaleBlock");
		ani.scale(block, 1000, 1.25);
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
	return result.join(" ");
}
