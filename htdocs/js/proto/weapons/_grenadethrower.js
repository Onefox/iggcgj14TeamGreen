function grenadeThrower( actor ) {
	this.shooting = false;
	this.actor = actor;
	this.cooldown = 0;
	this.maxCooldown = 1000;
}

grenadeThrower.prototype.update = function( delta ) {
	if( this.cooldown > 0 ) this.cooldown -= delta;

	if( this.shooting && this.cooldown <= 0 ) {
		var center = this.actor.getCenter();
		map.add( new grenade( center.x-18, center.y-17, mouse.x + map.view.getX(), mouse.y + map.view.getY()));
		this.cooldown = this.maxCooldown;
	}

	var status = this.cooldown / this.maxCooldown;
	//map.ui.setReloadStatus( status )
}

grenadeThrower.prototype.fire = function() {
	this.shooting = true;
}

grenadeThrower.prototype.stop = function() {
	this.shooting = false;
}