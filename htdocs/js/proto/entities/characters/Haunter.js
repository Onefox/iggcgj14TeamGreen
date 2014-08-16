define([
	"helper/math",
	"proto/AnimationSprite",
	"proto/entities/Character",
	"proto/Framecounter",
	"proto/V2",
	"proto/entities/characters/Enemy",
	"proto/entities/characters/Player",
	"proto/entities/bullets/Grenade",
], function(math, AnimationSprite, Character, Framecounter, V2, Enemy, Player, Grenade) {
	var Haunter = function Haunter(x, y, id) {
		this.position = new V2(x, y);
		this.spawn = new V2(x, y);

		// current coordinates
		this.x = null;
		this.y = null;

		this.name = "haunter";

		this.id = id;

		this.characterWidth = 75;
		this.characterHeight = 102;

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

		this.loadImage('haunter.png');

		this.frames = 3;
	};

	Haunter.prototype = new Enemy();

	Haunter.prototype.updateThis = function updateThis(delta, map) {
		var i,
			entities = game.scene.entities;
			hitbox = this.getHibox();

		// check whether player hit the hunter -> stunn player
		for (i = 0; i < entities.length; i++){
			if (entities[i] instanceof Player) {
				if (entities[i].y > hitbox.p2.y) {
					break;
				}

				if (entities[i].getHibox().collision(hitbox)) {
					this.test = true;
					game.scene.player.setMode("stunned");

					// let enemy respawn
					this.kill();

					// ste fear
					//game.scene.player.setFear();
				}
			}
		}
	};

	return Haunter;
});