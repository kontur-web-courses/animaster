addListeners();

function addListeners() {
    const MyAnimation = animaster()
    .addMove(200, {x: 40, y: 40})
    .addScale(800, 0.5)
    .addMove(200, {x: 40, y: -40})
    .addScale(800, 0.5)
    .addMove(200, {x: -40, y: -40})
    .addScale(800, 0.5)
    .addMove(200, {x: -40, y: 40})
    .addScale(800, 0.5)
    .addMove(200, {x: 0, y: 0})
    .buildHandler();
    
    const worryAnimationHandler = animaster()
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .addMove(200, {x: 80, y: 0})
    .addMove(200, {x: 0, y: 0})
    .buildHandler();
    
    document.getElementById('fadeInPlay') 
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
			animaster().fadeIn(block, 5000);
        });
	document.getElementById('fadeInReset')
        .addEventListener('click', function(){
            const block = document.getElementById('fadeInBlock')
            block.fadeIn.reset();
        });
		
    document.getElementById('movePlay') 
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().addMove(1000, {x: 100, y:10}).play(block);
        });
	document.getElementById('moveReset')
        .addEventListener('click', function(){
            const block = document.getElementById('moveBlock')
            block.move.reset();
        });
	
    document.getElementById('scalePlay') 
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
			animaster().addScale(1000, 1.25).play(block);
        });
	document.getElementById('scaleReset')
        .addEventListener('click', function(){
            const block = document.getElementById('scaleBlock')
            block.scale.reset();
        });
	
	document.getElementById('fadeOutPlay') 
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });
	document.getElementById('fadeOutReset')
        .addEventListener('click', function(){
            const block = document.getElementById('fadeOutBlock')
            block.fadeOut.reset();
        });
	
	document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            block.moveAndHide = animaster().moveAndHide(block, 5000);
        });

    document.getElementById('moveAndHideReset')
        .addEventListener('click', function(){
            const block = document.getElementById('moveAndHideBlock')
            block.moveAndHide.reset();
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            block.heartBeating.stop();
        });
		
    document.getElementById('worryAnimationBlock')
        .addEventListener('click', worryAnimationHandler);
        
    document.getElementById('MyAnimationBlock')
        .addEventListener('click', MyAnimation);
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
    let animation = [];

    function fadeIn(element, duration){
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }
	
	function resetFadeIn(element){
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function fadeOut(element, duration){
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('show');
        element.classList.add('hide');
    }
	
	function resetFadeOut(element){
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function move(element, duration, translation) {
		element.style.transitionDuration = `${duration}ms`;
		element.style.transform = getTransform(translation, null);
    }

    function scale(element, duration, ratio) {
		element.style.transitionDuration =  `${duration}ms`;
		element.style.transform = getTransform(null, ratio);
		
    }

    function moveAndHide(element, duration){
        let moveHide = animaster().addMove(duration*0.4,{x: 100, y: 20}).addFadeOut(duration*0.6).play(element);
        return{ reset(){ moveHide.reset();}}
    }

    function showAndHide(element, duration){
        animaster().addFadeIn(duration/3).addDelay(duration/3).addFadeOut(duration/3).play(element);
    }

    function heartBeating(element){
        animaster().addScale(500,1.4).addScale(500,1).play(element, true);
        return{ stop(){ animaster().play().stop();}}
    }

    function resetMoveAndScale(element){
        element.style.transitionDuration = null;
        element.style.transform = getTransform({ x: 0, y: 0 }, 1);
    }

    function addMove(duration, translation){
        this.animation.push({name: 'move', duration: duration, arg: translation});
        return this;
    }

    function addScale(duration, ratio){
        this.animation.push({name: 'scale', duration: duration, arg: ratio})
        return this;
    }

    function addFadeIn(duration){
        this.animation.push({name: 'fadeIn', duration: duration});
        return this;
    }

    function addFadeOut(duration){
        this.animation.push({name: 'fadeOut', duration: duration});
        return this;
    }

    function addDelay(duration){
        this.animation.push({name: 'delay', duration: duration});
        return this;
    }

    function play(element, cycled){
        timeout = 0;
        if (cycled)
            interval = setInterval(() => {play(element)}, 1000);

        animation.forEach((operation)=>{
            switch (operation.name){
                case 'move':
                    setTimeout(()=>move(element, operation.duration, operation.arg), timeout);
                    timeout += operation.duration;
                    break;
                case 'scale':
                    setTimeout(()=>scale(element, operation.duration, operation.arg), timeout);
                    timeout += operation.duration;
                    break;
                case 'fadeIn':
                    setTimeout(()=>fadeIn(element, operation.duration), timeout);
                    timeout += operation.duration;
                    break;
                case 'fadeOut':
                    setTimeout(()=>fadeOut(element, operation.duration), timeout);
                    timeout += operation.duration;
                    break;
                case 'delay':
                    setTimeout(()=>{element.style.transitionDuration = `${operation.duration}ms`;},timeout);
                    timeout += operation.duration;
                    break;
            }
        })

        return{
            stop(){
                clearInterval(interval);
            },
            reset(){
                resetMoveAndScale(element);
                if (animation.findIndex(a=> a.name === 'fadeOut') >=animation.findIndex(a=> a.name === 'fadeIn'))
                    resetFadeOut(element);
                else resetFadeIn(element);
            }
        }
    }

    
    function buildHandler() {
        return (el) => this.play(el.target)
    }
	
    return {animation, fadeIn, fadeOut, scale, move, moveAndHide, showAndHide, heartBeating, addMove, addScale, addFadeIn, addFadeOut, addDelay, play, buildHandler};
} 
