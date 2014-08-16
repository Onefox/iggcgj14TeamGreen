define([
	"proto/entities/Animation",
	"proto/V2"
], function(Animation, V2) {
	var WallBreak = function WallBreak(x, y) {
		this.width = 63;
		this.height = 102;
		this.position = new V2 (x, y);
		this.init('effects/wall_destroy.png', 10);
	};

	WallBreak.prototype = new Animation(40);

	return WallBreak;
});