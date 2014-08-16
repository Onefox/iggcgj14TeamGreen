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
	var Dog = function Dog(x, y, id) {
		this.position = new V2(x, y);
		this.spawn = new V2(x, y);

		this.name = "dog";

		// current coordinates
		this.x = null;
		this.y = null;

		this.id = id;

		this.characterWidth = 75;
		this.characterHeight = 102;

		this.speed = this.SPEEDS.normal;
		this.SPEEDS.aggro = 6;

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

		this.loadImage('dog.png');

		this.frames = 3;
	};

	Dog.prototype = new Enemy();

	Dog.prototype.updateThis = function updateThis(delta, map) {
		var i;

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

	return Dog;
});