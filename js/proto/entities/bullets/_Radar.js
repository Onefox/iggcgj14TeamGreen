function radar() {
	this.sprite = new Sprite('img/laser.png');
	
	this.destinationAngle = 0;
}

radar.prototype = new Entity();


radar.prototype.draw = function(ctx, view) {
	ctx.save();	
	
	ctx.translate(400,300);	
	ctx.rotate(this.destinationAngle);

	this.sprite.draw(ctx,400,300);
	
	ctx.restore();
}

radar.prototype.update = function(delta, map) {
	var shortest = -1;
	for( var i = 0; i < this.scene.entities.length; i++ ) {
		if( this.scene.entities[i] instanceof victim ) {
			if (shortest == -1 || this.scene.entities[i].position.dist(map.hero.position) < shortest) {
				this.destinationAngle =  (map.hero.position.angle(this.scene.entities[i].position));
			}
		}
	}	
	
	//console.log(this.destinationAngle)
}


