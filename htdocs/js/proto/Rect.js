define([
	"proto/V2"
], function(V2) {
	var Rect = function Rect(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	};

	Rect.prototype.collision = function collision(r) {
		return this.p1.x < r.p2.x && this.p2.x > r.p1.x && this.p1.y < r.p2.y && this.p2.y > r.p1.y;
	};

	Rect.prototype.combine = function combine(r) {
		return new Rect(
			new V2( Math.min( this.p1.x, r.p1.x ), Math.min( this.p1.y, r.p1.y )),
			new V2( Math.max( this.p2.x, r.p2.x ), Math.max( this.p2.y, r.p2.y ))
		);
	};

	Rect.prototype.moved = function moved(v) {
		return new Rect(
			this.p1.sum(v),
			this.p2.sum(v)
		);
	};

	Rect.prototype.move = function move(v) {
		this.p1.add(v);
		this.p2.add(v);
	};

	Rect.prototype.grid = function grid(w, h) {
		this.p1.grid(w, h);
		this.p2.grid(w, h);
	};

	Rect.prototype.inside = function(v) {
		return this.p1.x < v.x && this.p2.x > v.x && this.p1.y < v.y && this.p2.y > v.y;
	};

	return Rect;
});