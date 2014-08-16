function bulletsplash(pos, move) {
	this.position = pos;
	this.init('bulletSplash.png', 5, 70);
	this.angle = move.angle2()  + Math.PI / 2;
}

bulletsplash.prototype = new Animation();

bulletsplash.prototype.draw = function(ctx, view) {
	ctx.save();
	ctx.translate(this.position.x - view.getX(), this.position.y - view.getY());
	ctx.rotate(this.angle);
	this.sprite.draw(ctx, -15, -30, this.f.frame);
	ctx.restore();
};