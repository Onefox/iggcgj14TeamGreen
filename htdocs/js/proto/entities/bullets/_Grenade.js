function grenade(x ,y ,endX , endY) {
	this.position = new V2 (x ,y );
	this.destination = new V2(endX, endY);
	this.movement = this.destination.dif(this.position);
	this.speed = 1;
	this.fak = 1;
	this.timer = 600;

	this.sprite = new Sprite( 'img/grenade.png' );
	this.spriteAngle = 0;


	this.width = 10;
	this.height = 10;

}
grenade.prototype = new Entity();


grenade.prototype.update = function(delta, map) {
	this.timer -= delta;

	var t = this.destination.dif(this.position).length();
	var t1 = this.movement.length();
	this.fak = (t/(t1));

	this.position.add(this.movement.norm().prd(((delta+this.speed)*this.fak)));


//	var pos = this.position.grid( map.tileWidth, map.tileHeight );
//	map.checkCollision( pos.x, pos.y ) ||

	if( this.fak <= 0.05 ) {
		this.scene.add( new explosion(this.position.x,this.position.y, 80));
		this.scene.remove(this);

		for( var i = 0; i < this.scene.entities.length; i++ ) {
			if (this.scene.entities[i] instanceof victim) {
				var dist = this.getCenter().dif(this.scene.entities[i].getCenter()).length();
				if (dist < 140) {
					this.scene.entities[i].kill();
					i--;
				} else if (dist < 500) {
					this.scene.entities[i].setPanic(map.hero.position);
				}
			}
		}
	}
}


grenade.prototype.draw = function(ctx, view) {
	ctx.save();
	ctx.translate((this.position.x-view.getX()) - 16, (this.position.y-view.getY()) - 21);
	this.spriteAngle += (1/32)*Math.PI;
	ctx.rotate(this.spriteAngle);
	ctx.scale(1+this.fak,1+this.fak);

	if( view.collision( new Rect( this.position, this.position.sum( new V2( this.width, this.height )))))
		this.sprite.center( ctx, 0, 0);

	ctx.restore();
}

