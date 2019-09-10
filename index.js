console.clear();

// SHIT EVERYTHING IS HAPPENING IN THIS FILE AND I AM NOT GOING OT CHANGE IT! 

import utils from './modules/utils.js';
import Grid from './modules/Grid.js';

// Random numbers ============================
// TODO add map and min max of arr to utils
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
var allNumbers = [48,47,71,37,61,50,29,50,55,23,72,48,45,42,60,50,36,52,50,56,63,50,53,33,46,67,63,30,100,42,32,64,60,46,97, 255, 85];
var average = allNumbers.reduce((a,b) => (a+b)) / allNumbers.length;
console.log(average, Math.min(...allNumbers), Math.max(...allNumbers));

function returnArrVal() {
	return allNumbers[utils.randomInt(0, allNumbers.length-1)];
}
function normaliseArrVal(val) {
	const arrMin = Math.min(...allNumbers);
	const arrMax = Math.max(...allNumbers);
	return val.map(arrMin, arrMax, 0, 1);
}

console.log(normaliseArrVal(returnArrVal()));



// ======================== setup canvas
const canvasCont = document.querySelector('#canvas');
const canvasEl = document.body.querySelector('canvas');
// setting dpr
const dpr = window.devicePixelRatio;
// get window dimensions & set canvas to fill window
function Dimensions() {
	this.width = (window.innerWidth);
	this.height = (window.innerHeight);
	this.centerX = this.width/2;
	this.centerY = this.height/2;
	
	this.setFullscreen = function(el) {
		el.width = this.width;
		el.height = this.height;
	}
	
	this.update = function() {
		this.width = (window.innerWidth);
		this.height = (window.innerHeight);
	}
}

let screenDim = new Dimensions();
screenDim.setFullscreen(canvasEl);
window.addEventListener("resize", function(e) {
	screenDim.update();
	screenDim.setFullscreen(canvasEl);
	init();
}, false);
const ctx = canvasEl.getContext('2d');
// set up canvas defaults
ctx.lineWidth = 0.0;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// ====================== call whatever you draw here
// set up consts
const FULLCIRCLE = utils.degToRad(360);

// implementation
let particles;
let raf = null;

// grids
const	tightGrid = new Grid('square', 'tight', false);
const	isoGrid = new Grid('iso', 'loose', false);
const	polarGrid = new Grid('polar', 'loose', false);
const regularGrid = new Grid('square', 'regular', false);
const gravityGrid = new Grid('square', 'loose', false);
const cardGrid = new Grid('custom', [[100, 40], [200, 40], [300, 40], [400, 40]]);

// building it
const options = {
	grid: new Grid('square', 'regular', false),
	toAnimate: false,
	screenEdge: false,
	toCollide: false,
	setColour: false,
	setSizeRandom: false,
	setSizeNumber: false,
	setSpeed: false,
	applyGravity: false,
	showCards: false,
	trails: false,
	raf: 1,

	setDefault: function() {
		this.grid = new Grid('iso', 'loose', false);
		this.toAnimate = false;
		this.screenEdge = false;
		this.toCollide = false;
		this.setColour = false;
		this.setSizeRandom = false;
		this.setSizeNumber = false;
		this.setSpeed = false;
		this.applyGravity = false;
		this.showCards = false;
		this.trails = false;
	},

	setAnimate: function() {
		this.grid = new Grid('iso', 'loose', false);
		this.toAnimate = true;
		this.screenEdge = true;
		this.toCollide = true;
		this.setColour = false;
		this.setSizeRandom = false;
		this.setSizeNumber = false;
		this.setSpeed = false;
		this.applyGravity = false;
		this.showCards = false;
		this.trails = false;
	}
}

Reveal.addEventListener('tightsquare', () => {
	options.setDefault();
	options.grid = tightGrid;
	showCanvas();
})
Reveal.addEventListener('isogrid', () => {
	options.setDefault();
	options.grid = isoGrid;
	showCanvas();
})
Reveal.addEventListener('polargrid', () => {
	options.setDefault();
	options.grid = polarGrid;
	showCanvas();
})
Reveal.addEventListener('regulargrid', () => {
	options.setDefault();
	options.grid = new Grid('square', 'regular', false);
	showCanvas();
})

Reveal.addEventListener('move', () => {
	options.setDefault();
	options.toAnimate = true;
	showCanvas();
})
Reveal.addEventListener('edge', () => {
	options.screenEdge = true;
	showCanvas();
})
Reveal.addEventListener('collide', () => {
	options.setAnimate();
	showCanvas();
})

Reveal.addEventListener('randsize', () => {
	options.setAnimate();
	options.setSizeRandom = true;
	showCanvas();
})
Reveal.addEventListener('numsize', () => {
	options.setAnimate();
	options.setSizeNumber = true;
	showCanvas();
})

Reveal.addEventListener('colour', () => {
	options.setAnimate();
	options.setSizeNumber = true;
	options.setColour = true;
	showCanvas();
})

Reveal.addEventListener('gravity', () => {
	options.grid = new Grid('square', 'loose', false);
	options.applyGravity = true;
	showCanvas();
})

Reveal.addEventListener('showcards', () => {
	options.grid = new Grid('square', 'loose', false);
	options.showCards = true;
	showCanvas();
})

Reveal.addEventListener('fourcards', () => {
	options.grid = cardGrid;
	showCanvas();
})

Reveal.addEventListener('trails', () => {
	options.grid = new Grid('custom', [[100, 40], [200, 40], [300, 40], [400, 40]]);
	options.trails = true;
	showCanvas();
})

// colours
const colours = ['hsla(273, 36%, 64%, 1)','hsla(346, 63%, 64%, 1)','hsla(5, 74%, 67%, 1)','hsla(38, 86%, 72%, 1)','hsla(131, 30%, 63%, 1)','hsla(179, 38%, 58%, 1)'];

function init() {
	particles = [];
	
	options.grid.coords.forEach( (el, i) => {

		// set colour
		let colour = `hsla(${i%360*10}, 62%, 66%, 1)`;
		if (options.setColour) {
			const colourNum = Math.floor(normaliseArrVal(returnArrVal())*6);
			colour = colours[colourNum];
		}

		// set size
		let size = 20;
		if (options.setSizeRandom) {
			size = Math.random()*30;
		}
		if (options.setSizeNumber) {
			size = normaliseArrVal(returnArrVal())*30;
		}

		particles.push(new Particle(el, size, colour));
	} )
	
}

function animate() {
	options.raf = requestAnimationFrame(animate);
	
	// clear canvas
	if (options.trails === false) {
		ctx.clearRect(0, 0, screenDim.width, screenDim.height);
	}
	particles.forEach((el, i) => {
		el.update();
		if (options.toCollide) {
			el.collision(particles);
		}
	});
}


// ===================== all draw functions -> ctx
function Particle(entity, radius, color) {
	this.entity = entity;
	this.radius = radius;
	this.color = color;

	const gravity = entity.createForce(0, 0.01);
	this.entity.setVelocity((Math.random()-0.5)*2, (Math.random()-0.5)*2);
	
	// update is rendering the shape on canvas, with movement, collision & colour change
	this.update = () => {
		// screen edge detection
		if (options.screenEdge) {
			if (options.applyGravity) {
				this.entity.applyForce(gravity);
				this.entity.accelerate();
				this.entity.velocity.limit(this.entity.topspeed);
			}
			
			this.entity.edgeBounce(this.radius);
		}
		// add velocity
		if (options.toAnimate) {
			this.entity.vector.add(this.entity.velocity);
		}

		this.entity.acceleration.scaleUp(0);

		if (options.showCards) {
			this.drawCard();
		} else {
			this.draw();
		}
	}
	
	this.collision = allParticles => {
		for (var i = 0; i < allParticles.length; i++) {
      if (allParticles[i] != this) {
        var other = allParticles[i];
        if (willCollide(this,other)) {
          this.entity.addCollisionResponse(other.entity);
        }
      }
    }
	}
	
	// draw should just be drawing the shape
	this.draw = () => {
		ctx.beginPath();
		ctx.fillStyle = 'hsla(33, 55%, 92%, 1)';
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 5.0;
		ctx.arc(this.entity.vector.x, this.entity.vector.y, this.radius, 0, FULLCIRCLE);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	}

	this.drawCard = () => {
		const card = new Path2D("M143.884,0.829l-33.578,34.167c-1.178,1.178-2.945,1.178-4.124,0l0,0c-1.178-1.178-1.178-2.946,0-4.124l0,0L129.01,7.309 c1.178-1.178,1.031-3.093-0.147-4.124c-1.178-1.031-3.093-1.031-4.124,0.147l0,0L94.695,34.701 c-1.178,1.178-2.945,1.178-4.124,0.147l0,0c-1.178-1.178-1.178-2.945-0.147-4.124l9.867-10.309H30.338 c-5.302,0-9.572,4.271-9.572,9.573v107.213l5.891-6.185c1.031-1.178,2.945-1.326,4.124-0.295c1.178,1.031,1.326,2.946,0.295,4.124 l-0.147,0.147l-28.129,29.16c-1.178,1.178-1.178,3.093,0,4.124s3.093,1.178,4.124,0l20.913-21.354c1.178-1.178,2.945-1.178,4.124,0 c1.178,1.178,1.178,2.945,0,4.124l0,0L0.884,183.445c-1.178,1.178-1.178,3.093,0,4.124c1.178,1.178,3.093,1.178,4.124,0 l33.578-34.167c1.178-1.178,2.945-1.178,4.124,0c1.178,1.178,1.178,2.946,0,4.124l0,0l-22.68,23.563 c-1.178,1.178-1.178,2.946,0,4.124l0,0c0.589,0.589,1.325,0.884,2.062,0.884s1.62-0.294,2.062-0.884l32.841-34.167 c0.884-1.326,2.798-1.62,4.124-0.736c1.326,0.883,1.62,2.798,0.736,4.124c-0.147,0.294-0.294,0.442-0.589,0.589l-9.867,10.309 h67.303c5.302,0,9.573-4.271,9.573-9.573l0,0V51.343l-5.891,6.038c-1.031,1.178-2.945,1.326-4.124,0.295 c-1.178-1.031-1.325-2.946-0.294-4.124l0.147-0.147l28.129-29.16c1.178-1.178,1.178-3.093,0-4.124c-1.178-1.178-3.093-1.178-4.124,0 l0,0l-21.06,21.207c-1.178,1.178-2.946,1.178-4.124,0c-1.178-1.178-1.178-2.945,0-4.124l0,0l31.221-32.252 c1.178-1.178,1.178-3.093,0-4.124S145.062-0.349,143.884,0.829z M55.374,47.353h48.747c1.62,0,2.946,1.326,2.946,2.946 c0,1.62-1.326,2.945-2.946,2.945H55.374c-1.62,0-2.945-1.326-2.945-2.945C52.429,48.679,53.754,47.353,55.374,47.353z M96.401,137.246H43.825c-1.62,0-2.945-1.325-2.945-2.945s1.325-2.945,2.945-2.945h52.576c1.62,0,2.945,1.325,2.945,2.945 S98.021,137.246,96.401,137.246z M98.083,87.13c0,0.147,0,0.147,0,0.294c-0.736,8.542-7.953,17.378-21.943,26.803 c-1.031,0.589-2.209,0.589-3.24,0c-14.138-9.425-21.207-18.114-21.943-26.803c0-0.147,0-0.147,0-0.294v-2.209 c0-0.147,0-0.147,0-0.295c0.736-8.542,6.627-12.959,11.929-13.401c0.736,0,1.473-0.147,2.209-0.147 c3.534-0.147,6.921,1.178,9.572,3.535c2.504-2.356,6.038-3.682,9.425-3.535c0.589,0,1.326,0,2.062,0.147 c5.302,0.442,11.34,4.86,11.929,13.401c0,0.147,0,0.147,0,0.295V87.13z");
		ctx.translate(this.entity.vector.x-75, this.entity.vector.y-94);
		ctx.lineWidth = 2.0;
		ctx.fillStyle = 'hsla(33, 55%, 92%, 1)';
		ctx.strokeStyle = this.color;
		ctx.stroke(card);
		ctx.fill(card);
		ctx.resetTransform();
	}
}

// ======================== utility functions
// see utils
function distance(x1,y1,x2,y2) {
  var x = x1 - x2;
  var y = y1 - y2;
  return Math.sqrt( x * x + y * y);
}
function willCollide(b1,b2) {
  var dMax = b1.radius + b2.radius;
  var d = distance(b1.entity.vector.x+b1.entity.velocity.x, b1.entity.vector.y+b1.entity.velocity.y, b2.entity.vector.x+b2.entity.velocity.x, b2.entity.vector.y+b2.entity.velocity.y);
  return d < dMax;
}

function showCanvas() {
	init();
	canvasCont.style.display = 'block';
	raf = animate();
}

Reveal.addEventListener('showCanvas', () => {
	showCanvas();
})

Reveal.addEventListener('hideCanvas', () => {
	cancelAnimationFrame(options.raf);
	canvasCont.style.display = 'none';
})



