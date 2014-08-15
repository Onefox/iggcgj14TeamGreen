define([
	"engine/config",
	"modules/image",
	"helper/dom",
	"proto/Rect",
	"proto/V2"
], function(config, image, dom, Rect, V2) {
	var View = function View(subject, width, height, map) {
		this.subject = subject;
		this.width = width;
		this.height = height;
		this.map = map;
		this.ctx = null;
		this.flicker = 1;

		this.img = image.getImage("light.png");

		this.init();
	};

	View.prototype = new Rect(new V2(0, 0), new V2(0, 0));

	View.prototype.init = function init() {
		var canvas = dom.get("#shadow");

		canvas.width = config.screenWidth;
		canvas.height = config.screenHeight;

		this.ctx = canvas.getContext('2d');
		this.ctx.fillStyle = 'black';
	};

	View.prototype.getX = function getX() {
		return this.p1.x;
	};

	View.prototype.getY = function getY() {
		return this.p1.y;
	};

	View.prototype.getWidth = function getWidth() {
		return this.width;
	};

	View.prototype.getHeight = function getHeight() {
		return this.height;
	};

	View.prototype.update = function update() {
		//var diff = game.scene.player.position.dif(game.scene.view.p1);

		this.p1 = new V2(this.width / -2, this.height/ -2);

		this.p1.add(this.subject.position);

		if (this.p1.x < 0) {
			this.p1.x = 0;
		}

		if (this.p1.y < 0) {
			this.p1.y = 0;
		}

		this.p2 = this.p1.sum(new V2(this.width, this.height));

		if (this.p2.x > this.map.getWidth()) {
			this.p1.x = (this.p2.x = this.map.getWidth()) - this.width;
		}

		if (this.p2.y > this.map.getHeight()) {
			this.p1.y = (this.p2.y = this.map.getHeight()) - this.height;
		}

		// camera changed (only when min max change?)
		//console.log(diff.x, config.screenWidth / 2, diff.y, config.screenHeight / 2)
		/*if (diff.x !== (config.screenWidth / 2) || diff.y !== (config.screenHeight / 2)) {
			if (game.scene.player.movement.x !== 0 || game.scene.player.movement.y !== 0) {
				this.drawLight();
				console.log('draw');
			}
		}*/

		// TODO if player not center redraw.
		//if (this.p1.x !== this.lastP1.x || this.p1.y !== this.lastP1.y || this.p2.x !== this.lastP2.x || this.p2.y !== this.lastP2.y) {
			//this.drawLight();

		/*	this.lastP1.x = this.p1.x;
			this.lastP1.y = this.p1.y;
			this.lastP2.x = this.p2.x;
			this.lastP2.y = this.p2.y;
		}*/
	};

	View.prototype.drawLight = function drawLight() {
		var pos = game.scene.getChar('jerome').position,
			width = 800,
			height = 600,
			x = ~~(pos.x - (width / 2) - this.getX()) + 30,
			y = ~~(pos.y - (height / 2) - this.getY()) + 25;


		if (game.frames % 2 === 0) {
			if (Math.random() > 0.5) {
				this.flicker = Math.abs(Math.sin(game.frames)) / 100 + 1;
			}
		}

		//this.ctx.rect(0, 0, config.screenWidth, config.screenHeight);
		this.ctx.fillRect(0, 0, config.screenWidth, config.screenHeight);
		this.ctx.clearRect(x + this.flicker , y + this.flicker, width, height);

		this.ctx.drawImage(this.img, x + this.flicker - game.scene.player.light, y + this.flicker - game.scene.player.light, this.flicker * (width + game.scene.player.light*2), this.flicker * (height + game.scene.player.light*2));
	};

	return View;
});