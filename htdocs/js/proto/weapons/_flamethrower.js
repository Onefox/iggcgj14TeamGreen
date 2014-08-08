function flamethrower( actor ) {
	var self = this;
	var img = new AnimationSprite('img/acid.png', 9 );
	self.shooting = false;
	self.actor = actor;
	self.cooldown = 0;

	self.ammo = self.ammoMax = 1500;
	self.reloadTime = 1500;
	self.reloading = false;
	self.counter = new Framecounter(80);

	function acid() {
		this.draw = function( ctx, view ) {
			if( self.shooting && self.cooldown <= 0  ) {
				var center = self.actor.getCenter().dif( new V2( view.getX(), view.getY()));
				var angle = center.angle( mouse ) + Math.PI/2;
				var frame = self.counter.frame > 2 ? (self.counter.frame-3)%6+3 : self.counter.frame;

				ctx.save();
				ctx.translate( center.x, center.y );
				ctx.rotate( angle );
				img.draw( ctx, -40, -220, frame );
				ctx.restore();
			}
		}
	}

	map.animations.push( new acid());
}

flamethrower.prototype.update = function( delta ) {
	if( this.cooldown > 0 ) this.cooldown -= delta;

	if( this.ammo < 1 ) {
		this.cooldown = this.reloadTime;
		this.ammo = this.ammoMax;
		this.reloading = true;
		this.counter.reset();
	} else if( this.shooting && this.cooldown <= 0 ) {
		this.counter.update(delta);
		this.reloading = false;
		this.ammo -= delta;
		var view = map.view;
		var entities = map.entities;
		var center = this.actor.getCenter();
		var shotangle = center.dif( new V2( view.getX(), view.getY())).angle( mouse );

		for( var i = 0; i < entities.length; i++ )
			if( entities[i] instanceof victim ) {
					var dist = center.dist( entities[i].getCenter());
					var vicangle = center.angle( entities[i].getCenter());
					var diff = Math.abs( vicangle - shotangle );

					if( dist < 230 && diff < .2 ) {
						entities[i].kill();
					} else if (dist < 400) {
						entities[i].setPanic(this.actor.position);
					}
				}
	}

	var status;
	if( this.reloading ) status = this.cooldown / this.reloadTime;
	else status = 1 - this.ammo / this.ammoMax;
	//map.ui.setReloadStatus( status );
}

flamethrower.prototype.fire = function() {
	this.shooting = true;
	sound.play('sound/fx/saeure/saeure.ogg');
}

flamethrower.prototype.stop = function() {
	this.shooting = false;
}
