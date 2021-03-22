addListeners();

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
			element.classList.remove('hide');
			element.classList.add('show');
		},
		fadeOut(element, duration) {
			element.style.transitionDuration = `${duration}ms`;
			element.classList.remove('show');
			element.classList.add('hide');
		},
		moveAndHide(element, duration, translation) {
			element.style.transitionDuration = `${duration}ms`;
			element.style.transform = getTransform(translation, null);
			element.classList.remove('show');
			element.classList.add('hide');
		},
		showAndHide(element, duration, translation) {
			element.style.transitionDuration = `${duration}ms`;
			element.classList.remove('show');
			element.classList.add('hide');
		}
	}
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

