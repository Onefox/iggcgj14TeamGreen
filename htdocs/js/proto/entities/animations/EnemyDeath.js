define([
	"proto/entities/Animation",
	"proto/V2"
], function(Animation, V2) {
	var EnemyDeath = function EnemyDeath(x, y) {
		this.width = 90;
		this.height = 102;
		this.position = new V2 (x, y);
		this.init('effects/poof.png', 6);
	};

	EnemyDeath.prototype = new Animation(40);

	return EnemyDeath;
});