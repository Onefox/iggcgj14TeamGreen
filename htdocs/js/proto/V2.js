define([
], function() {
	var V2 = function V2(x, y) {
		this.x = x;
		this.y = y;
	};

	V2.prototype.sum = function sum(v) {
		return new V2(this.x + v.x, this.y + v.y);
	};

	V2.prototype.dif = function dif(v) {
		return new V2(this.x - v.x, this.y - v.y);
	};

	V2.prototype.add = function add(v) {
		this.x += v.x;
		this.y += v.y;

		return this;
	};

	V2.prototype.sub = function sub(v) {
		this.x -= v.x;
		this.y -= v.y;

		return this;
	};

	V2.prototype.prd = function prd(s) {
		return new V2(this.x * s, this.y * s);
	};

	V2.prototype.quo = function quo(s) {
		return new V2(this.x / s, this.y / s);
	};

	V2.prototype.mul = function mul(s) {
		this.x *= s;
		this.y *= s;

		return this;
	};

	V2.prototype.div = function div(s) {
		this.x /= s;
		this.y /= s;

		return this;
	};

	V2.prototype.angle = function angle(v) {
		return Math.atan2(v.y - this.y, v.x - this.x);
	};

	V2.prototype.angle2 = function angle2() {
		return Math.atan2(this.y, this.x);
	};

	V2.prototype.dist = function dist(v) {
		return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
	};

	V2.prototype.grid = function grid(w, h) {
		return new V2(Math.floor(this.x / w), Math.floor(this.y / h));
	};

	V2.prototype.invert = function invert() {
		this.x *= -1;
		this.y *= -1;
	};

	V2.prototype.length = function length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};

	V2.prototype.dot = function dot(v) {
		return this.x * v.x + this.y * v.y;
	};

	V2.prototype.norm = function norm() {
		factor = Math.sqrt(this.x * this.x + this.y * this.y);

		return this.quo(factor);
	};

	V2.prototype.normFac = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};

	return V2;
});