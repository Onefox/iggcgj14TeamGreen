function splatter( pos, move ) {
	this.position = pos;
	this.init('img/bloodSplash.png', 8, 70);
	this.angle = move.angle2() + Math.PI / 2;

	//var blood =  new AnimationSprite('img/bloodStainsSmall.png', 5);
	var ctx = map.map.below.getContext('2d');

	for (var i = 0; i < (Math.random()*4)+2; i++) {
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.angle);
		blood.draw(ctx, Math.random() * 20 - 10, Math.random() * 30 + 5, (Math.random() * 5) | 0);
		ctx.restore();
	}
}

splatter.prototype =  new Animation();

splatter.prototype.draw = function(ctx, view) {
	ctx.save();
	ctx.translate(this.position.x - view.getX(), this.position.y - view.getY());
	ctx.rotate(this.angle);
	this.sprite.draw(ctx, -40, -125, this.f.frame);
	ctx.restore();
};