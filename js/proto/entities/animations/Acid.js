define([
	"proto/entities/Animation",
	"proto/V2"
], function(Animation, V2) {
	var Acid = function Acid(x, y) {
		this.width = 60;
		this.height = 150;
		//this.position = new V2 (x, y);
		this.init('water.png', 9);
	};

	Acid.prototype = new Animation(40);

	Acid.prototype.draw = function(ctx, view) {
		var player = window.game.scene.getChar('lina');
		var center = player.getCenter().dif( new V2( view.getX(), view.getY()));
		var pos = player.position;
		var angle = player.directionVec.norm().angle2() + Math.PI/2;

		ctx.save();
		//ctx.translate(pos.x - view.getX()-20, pos.y - view.getY());
		ctx.translate( center.x, center.y - 50 );
		ctx.rotate(angle);
		ctx.translate( 0, +15 );
		//ctx.rotate(player.directionVec.norm().angle2() + 270/180 * Math.PI);
		this.sprite.draw(ctx, -40, -200, this.f.frame);
		ctx.restore();


		/*var center = self.actor.getCenter().dif( new V2( viewport.getX(), viewport.getY()));
		var angle = center.angle( mouse ) + Math.PI/2;
		var frame = self.counter.frame > 2 ? (self.counter.frame-3)%6+3 : self.counter.frame;

		ctx.save();
		ctx.translate( center.x, center.y );
		ctx.rotate( angle );
		img.draw( ctx, -40, -220, frame );
		ctx.restore();*/
	};

	return Acid;
});