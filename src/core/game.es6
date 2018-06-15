import config from './../config/config.es6';
import screen from './../config/screen.es6';
import fonts from './../config/fonts.es6';

window.requestAnimFrame = ((() =>
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	((callback, element) => { window.setTimeout(callback, 25); })
))();

export default {
	frames: 0,
	fps: 25,

	scene: null,
	lastUpdate: 0,

	display: null,
	displayCtx: null,
	buffer: null,
	bufferCtx: null,

	scale: 1,

	resize() {
		const fw = window.innerWidth / screen.w;
		const fh = window.innerHeight / screen.h;

		this.scale = Math.min(fw, fh);

		this.display.width = screen.w * this.scale;
		this.display.height = screen.h * this.scale;
	},

	init(scene) {
		this.display = document.getElementById('gameframe');
		this.displayCtx = this.display.getContext('2d');

		if (screen.scale) this.resize();
		else {
			this.display.width = screen.w;
			this.display.height = screen.h;
		}

		this.buffer = document.createElement('canvas');
		this.bufferCtx = this.buffer.getContext('2d');
		this.buffer.width = screen.w;
		this.buffer.height = screen.h;

		const self = this;
		if (config.debug) setInterval(() => {
			self.updateFramerate();
		}, 1000);
		if (screen.scale) window.onresize = () => {
			self.resize();
		};

		this.scene = scene;
		this.lastUpdate = Date.now();
		this.loop();
	},

	updateFramerate() {
		this.fps = this.frames;
		this.frames = 0;
	},

	loop() {
		const now = Date.now();
		const delta = now - this.lastUpdate;

		if (delta < 250 && this.scene) {
			this.update(delta);
			this.draw();
		}

		this.lastUpdate = now;
		this.frames++;

		const self = this;
		requestAnimFrame(() => {
			self.loop();
		});
	},

	update(delta) {
		this.scene.update(delta);
	},

	draw() {
		this.scene.draw(this.bufferCtx);

		this.display.width = this.display.width;
		this.displayCtx.drawImage(this.buffer, 0, 0, screen.w * this.scale, screen.h * this.scale);

		if (config.debug) {
			fonts.frames.apply(this.displayCtx);
			this.displayCtx.fillText(this.fps, 15, 15);
		}
	}
};