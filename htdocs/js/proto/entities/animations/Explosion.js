function explosion(x, y) {
	this.width = 160;
	this.height = 160;

	this.position = new V2 (x - this.width / 2, y - this.height / 2);
	this.init('img/explosion.png', 5, 50);

	sound.play('sound/fx/granate/ogg/granate-explosion.ogg');

	this.ash = new Sprite('img/explosionDecal.png');
	this.op = new V2(x, y);
}

explosion.prototype =  new Animation();

explosion.prototype.update = function(delta, map) {
	this.f.update(delta);

	if(this.f.frame >= this.framecount) {
		this.scene.remove(this);

		var ctx = this.scene.map.below.getContext('2d');

		this.ash.center(ctx, this.op.x, this.op.y);
	}
};
