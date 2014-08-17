define([
	"engine/path",
	"helper/math",
	"proto/AnimationSprite",
	"proto/entities/Character",
	"proto/Framecounter",
	"proto/V2",
	"proto/entities/characters/Enemy",
	"proto/entities/characters/Player",
	"proto/entities/bullets/Grenade",
], function(path, math, AnimationSprite, Character, Framecounter, V2, Enemy, Player, Grenade) {
	var Ghost = function Ghost(x, y, id) {
		this.position = new V2(x, y);
		this.spawn = new V2(x, y);

		this.name = "ghost";

		// current coordinates
		this.x = null;
		this.y = null;

		this.is = id;

		// collision-box
		this.width = 40;
		this.height = 60;

		// sprite-size
		this.characterWidth = 75;
		this.characterHeight = 102;

		this.angle = Math.random() * Math.PI * 2;

		this.mode = this.MODES.normal;
		this.speed = this.SPEEDS.normal;

		this.minAggroDistance = 200;

		this.turn = 0;

		// source of mode (i.e. grenade destination/ explosion)
		this.source = new V2(0,0);

		//this.bloodSprites = new AnimationSprite('bloodStains.png', 4);

		this.c = new Framecounter(100);

		this.loadImage('ghost.png');

		this.coolDown = new Date();
	};

	Ghost.prototype = new Enemy();

	Ghost.prototype.getGoal = function getGoal(source, dist, angle) {
		return new V2(source.x + Math.sin(angle) * dist, source.y - Math.cos(angle) * dist);
	};

	Ghost.prototype.throwEntity = function throwEntity() {
		var center = this.getCenter(),
			dist = 0.8,
			len = game.scene.player.position.dist(center);
			v = new V2(game.scene.player.position.x - center.x, game.scene.player.position.y - center.y);

		len = len < 300 ? len : 300;

		v = v.norm();
		v = v.prd(len);
		v = v.add(center);

		if (game.lastUpdate - this.coolDown > (math.rand(2, 4) * 1000)) {
			this.coolDown = game.lastUpdate;
			this.scene.add(new Grenade(center.x - 18, center.y - 17, v.x, v.y, this));
		}
	};

	Ghost.prototype.updateThis = function updateThis(delta, map) {
		if (this.mode === this.MODES.aggro) {
			this.throwEntity();
		}

		// ghost only knows one direction -> overwrite here
		this.direction = 0;

		// set fear if player hit
		for (i = 0; i < this.scene.entities.length; i++ ) {
			if (this.scene.entities[i] instanceof Player) {
				dist = this.getCenter().dif(this.scene.entities[i].getCenter()).length();

				if (dist <= 30) {
					game.scene.player.setFear();

					this.kill();
				}
			}
		}
	};

	return Ghost;
});