define([
	"helper/math",
	"proto/AnimationSprite",
	"proto/entities/Character",
	"proto/Framecounter",
	"proto/V2",
	"proto/entities/characters/Enemy",
	"proto/entities/bullets/Grenade",
], function(math, AnimationSprite, Character, Framecounter, V2, Enemy, Grenade) {
	var Dog = function Dog(x, y, id) {
		this.position = new V2(x, y);
		this.spawn = new V2(x, y);

		// current coordinates
		this.x = null;
		this.y = null;

		this.id = id;

		//this.characterWidth = 63;
		//this.characterHeight = 102;

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

		//this.frames = 3;
	};

	Dog.prototype = new Enemy();

	Dog.prototype.updateThis = function updateThis(delta, map) {
		var collision = this.checkCollision(this.movement.prd(delta - this.speed), map);

		if (collision) {
			// do damage, then dissapear
		}
	};

	return Dog;
});