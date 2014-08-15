define([
	"proto/entities/Animation"
], function(Animation) {
	var Cry = function Cry(player, move) {
		this.player = player;
		this.direction = this.player.direction;
		this.init('effects/fear_'+this.direction+'.png', 4, true);
		//this.angle = move.angle2()  + Math.PI / 2;
	};

	Cry.prototype = new Animation();

	Cry.prototype.draw = function(ctx, view) {
		var pos = this.player.position;
		if (this.direction != this.player.direction) {
			this.direction = this.player.direction;
			this.sprite.updateSprite('effects/fear_'+this.direction+'.png');
		}
		var offsetY = 0;
		if (this.player.name === 'olaf') {
			offsetY = +16;
		}



		ctx.save();
		ctx.translate(pos.x - view.getX(), pos.y - view.getY());
		//ctx.rotate(this.angle);
		this.sprite.draw(ctx, -15, -40 +offsetY, this.f.frame);
		ctx.restore();
	};
	return Cry;
});
