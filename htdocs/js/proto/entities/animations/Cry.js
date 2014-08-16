define([
	"proto/entities/Animation"
], function(Animation) {
	var Cry = function Cry(name, move) {
		this.name = name;
		this.direction = window.game.scene.getChar(name).direction;
		this.init('effects/fear_'+this.direction+'.png', 4, true);
		//this.angle = move.angle2()  + Math.PI / 2;
	};

	Cry.prototype = new Animation();

	Cry.prototype.draw = function(ctx, view) {
		var player = window.game.scene.getChar(this.name);
		var pos = player.position;
		if (this.direction != player.direction) {
			this.direction = player.direction;
			this.sprite.updateSprite('effects/fear_'+this.direction+'.png');
		}
		var offsetY = 0;
		if (player.name === 'olaf') {
			offsetY = -5;
		}



		ctx.save();
		ctx.translate(pos.x - view.getX(), pos.y - view.getY());
		//ctx.rotate(this.angle);
		this.sprite.draw(ctx, -10, -60 +offsetY, this.f.frame);
		ctx.restore();
	};
	return Cry;
});
