define([
	"engine/path",
	"helper/math",
	"proto/AnimationSprite",
	"proto/entities/Character",
	"proto/Framecounter",
	"proto/V2",
	"proto/entities/characters/Enemy",
	"proto/entities/bullets/Grenade",
], function(path, math, AnimationSprite, Character, Framecounter, V2, Enemy, Grenade) {
	var Ghost = function Ghost(x, y) {
		this.position = new V2(x, y);

		// current coordinates
		this.x = null;
		this.y = null;

		// collision-box
		this.width = 40;
		this.height = 60;

		// sprite-size
		//this.characterWidth = 80;
		//this.characterHeight = 80;

		this.angle = Math.random() * Math.PI * 2;

		this.mode = this.MODES.normal;
		this.speed = this.SPEEDS.normal;

		this.turn = 0;

		// source of mode (i.e. grenade destination/ explosion)
		this.source = new V2(0,0);

		//this.bloodSprites = new AnimationSprite('bloodStains.png', 4);

		this.c = new Framecounter(100);

		this.loadImage('enemy.png');

		this.coolDown = new Date();
	};

	Ghost.prototype = new Enemy();

	Ghost.prototype.throwEntity = function throwEntity() {
		var center = this.getCenter(),
			dist = 0.8,
			len = game.scene.player.position.dist(center);
			v = new V2(0, 0);

		v.x = center.x + (game.scene.player.position.x - center.x) * dist;
		v.y = center.y + (game.scene.player.position.y - center.y) * dist;

		//console.log(len);

		if (game.lastUpdate - this.coolDown > (math.rand(2, 4) * 1000)) {
			this.coolDown = game.lastUpdate;
			this.scene.add(new Grenade(center.x - 18, center.y - 17, v.x, v.y));
		}
	};

	Ghost.prototype.updateThis = function updateThis(delta, map) {
		if (this.mode === this.MODES.aggro) {
			this.throwEntity();
		}
	};

	return Ghost;
});