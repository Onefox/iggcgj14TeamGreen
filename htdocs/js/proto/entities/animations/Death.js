function death(x ,y) {
	this.width = 80;
	this.height = 80;
	this.position = new V2 (x, y);
	this.init('img/death.png', 7, 70);

	var sfx = [
		'sound/fx/splatter/ogg/splatter01.ogg',
		'sound/fx/splatter/ogg/splatter02.ogg',
		'sound/fx/splatter/ogg/splatter03.ogg',
		'sound/fx/splatter/ogg/splatter04.ogg',
	][(Math.random() * 4)|0];

	sound.play(sfx);
}

death.prototype =  new Animation();