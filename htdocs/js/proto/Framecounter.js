define([
], function() {
	var Framecounter = function Framecounter(duration) {
		this.duration = duration;
		this.anitime = 0;
		this.frame = 0;
	};

	Framecounter.prototype.update = function update(delta) {
		this.anitime += delta;
		this.frame = Math.floor(this.anitime / this.duration);
	};

	Framecounter.prototype.reset = function reset() {
		this.anitime = 0;
		this.frame = 0;
	};

	return Framecounter;
});