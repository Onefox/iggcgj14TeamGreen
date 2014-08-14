define([
	"helper/math",
	"proto/AnimationSprite",
	"proto/entities/Character",
	"proto/Framecounter",
	"proto/V2",
	"proto/entities/characters/Enemy",
	"proto/entities/bullets/Grenade",
], function(math, AnimationSprite, Character, Framecounter, V2, Enemy, Grenade) {
	var Wraith = function Wraith(x, y, id) {
		this.position = new V2(x, y);
		this.spawn = new V2(x, y);

		// current coordinates
		this.x = null;
		this.y = null;

		this.id = id;

		this.characterWidth = 63;
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

		this.loadImage('wraith.png');

		this.coolDown = new Date();

		this.frames = 3;

		this.alpha = 0.5;
	};

	Wraith.prototype = new Enemy();

	Wraith.prototype.updateThis = function updateThis(delta, map) {
		//this.drawFlag = true; //this.mode === this.MODES.aggro;


		if (this.mode !== this.MODES.normal) {
			this.alpha += delta / 200;
		} else {
			this.alpha -= delta / 200;
		}

		this.alpha = math.bound(this.alpha, 0, 1);

		if (this.alpha > 0) {
			this.drawFlag = true;
		} else {
			this.drawFlag = false;
		}
	};

	return Wraith;
});