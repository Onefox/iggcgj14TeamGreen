define([
	"proto/entities/Animation",
	"proto/V2"
], function(Animation, V2) {
	var Bottle = function Bottle(x, y) {
		this.width = 90;
		this.height = 90;
		this.position = new V2 (x, y);
		this.init('effects/bottle_break.png', 5);
	};

	Bottle.prototype = new Animation(40);

	return Bottle;
});