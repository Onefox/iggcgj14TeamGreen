define([
	"proto/Entity",
	"proto/V2",
	"proto/Sprite",
	"proto/entities/characters/Player",
	"proto/entities/animations/Bottle",
	"proto/Rect"
], function(Entity, V2, Sprite, Player, Bottle, Rect) {
	var Throw = function Throw(x ,y, imgName, actor) {
		this.position = new V2 (x, y);
		this.destination = new V2(0, 0);
		this.imgName = imgName;
		this.movement = this.destination.dif(this.position);
		this.speed = 1;
		this.fak = 1;
		this.timer = 600;
		this.actor = actor;

		this.sprite = new Sprite(this.imgName);
		this.spriteAngle = 0;

		this.width = 45;
		this.height = 45;

		console.log(x, y, imgName, actor);
	};

	Throw.prototype = new Entity();

	Throw.prototype.update = function(delta, map) {
		
	};

	Throw.prototype.draw = function draw(ctx, view) {
		var v = new V2(this.width, this.height);

		ctx.save();
		//ctx.translate((this.position.x - view.getX()) - 16, (this.position.y - view.getY()) - 21);
		ctx.translate(this.actor.position.x - view.getX(), this.actor.position.y - view.getY());
		//this.spriteAngle += (1 / 32) * Math.PI;
		//ctx.rotate(this.spriteAngle);
		//ctx.scale(1 + this.fak, 1 + this.fak);

		//if (view.collision(new Rect(this.position, this.position.sum(v)))) {
			this.sprite.center(ctx, 0, 0);
		//}

		ctx.restore();
	};

	return Throw;
});