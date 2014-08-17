define([
	"engine/config",
	"engine/path",
	"proto/Scene",
	"helper/dom",
	"helper/util",
	"modules/mouse"
], function(config, path, Scene, dom, util, mouse) {
	var game = {
		frames: 0,
		fps: 0,

		scene: null,
		scenes: [],

		player: null,
		inactivePlayer: null,
		inactivePlayer2: null,

		lastUpdate: 0,

		display: null,
		displayCtx: null,
		buffer: null,
		bufferCtx: null,

		level: 0,
		levels: [
			{
				name: 'level1',
				scenes: 6
			}
		],

		scores: [],

		init: function init() {
			var that = this,
				scene,
				curLevel,
				i;

			curLevel = this.levels[this.level];

			for (i = 0; i < curLevel.scenes; i++) {
				scene = new Scene();
				scene = scene.init(curLevel.name, i);
			}

			this.display = dom.get('#canvas');
			this.displayCtx = this.display.getContext('2d');

			this.buffer = document.createElement('canvas');
			this.bufferCtx = this.buffer.getContext('2d');
			this.buffer.width = this.display.width;
			this.buffer.height = this.display.height;

			setInterval(function() {
				that.updateFramerate();
			}, 1000);

			this.lastUpdate = Date.now();
			this.loop();

			mouse.init(this);
		},

		updateFramerate: function updateFramerate() {
			this.fps = this.frames;
			this.frames = 0;

			if (config.debug) {
				dom.get('fps').innerHTML = this.fps;
			}
		},

		loop: function loop() {
			var now = Date.now(),
				that = this,
				delta = now - this.lastUpdate;

			if (config.running && delta < 250 && this.scene) {
				this.update(delta);
				this.draw();
			}

			this.lastUpdate = now;
			this.frames++;

			requestAnimFrame(function() {
				that.loop();
			});
		},

		update: function update(delta) {
			this.scene.update(delta);

			// ticker for path-finding
			if (path.easystar) {
				path.easystar.calculate();
			}
		},

		draw: function draw() {
			this.scene.draw(this.bufferCtx);
			this.displayCtx.drawImage(this.buffer, 0, 0);
		}
	};

	window.game = game;

	return game;
});