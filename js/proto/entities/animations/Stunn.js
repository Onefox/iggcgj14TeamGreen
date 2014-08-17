define([
	"proto/entities/Animation",
	"proto/V2"
], function(Animation, V2) {
	var Stunn = function Stunn(x, y) {
		this.width = 90;
		this.height = 102;
		this.position = new V2 (x, y);
		this.init('effects/stunn.png', 10, true);
	};

	Stunn.prototype = new Animation(40);

	return Stunn;
});