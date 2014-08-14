define([
	"proto/Sprite",
	"proto/V2"
], function(Sprite, V2) {
	var Carry = function Carry(actor) {
		var that = this;

		this.img = new Sprite('img/grenade.png');

		that.actor = actor;

		that.counter = new framecounter(80);


		scenes.map.animations.push(new this.Anmation());
	};


	Carry.prototype.Animation = function Animation() {
		this.draw = function draw(ctx, viewport) {
			var center = that.actor.getCenter().dif( new V2( viewport.getX(), viewport.getY()));
			var angle = center.angle( mouse ) + Math.PI/2;
			var frame = that.counter.frame > 2 ? (that.counter.frame-3)%6+3 : that.counter.frame;

			ctx.save();
			ctx.translate( center.x, center.y );
			ctx.rotate( angle );
			img.draw( ctx, -40, -220, frame );
			ctx.restore();
		};
	};

	return Carry;
});
