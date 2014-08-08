function bombWeapon( actor ) {
	this.shooting = false;
	this.actor = actor;
	this.cooldown = 0;
	this.maxCooldown = 1000;
}

bombWeapon.prototype.update = function( delta ) {
	if( this.cooldown > 0 ) this.cooldown -= delta;

	if( this.shooting && this.cooldown <= 0 ) {
		var center = this.actor.getCenter();
		map.add( new bomb( center.x, center.y+10));
		this.cooldown = this.maxCooldown;
	}

	var status = this.cooldown / this.maxCooldown;
	//map.ui.setReloadStatus( status )
}

bombWeapon.prototype.fire = function() {
	this.shooting = true;
}

bombWeapon.prototype.stop = function() {
	this.shooting = false;
}