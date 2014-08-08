define([
	"proto/Rect",
	"proto/V2"
], function(Rect, V2) {
	var View = function View(subject, width, height, map) {
		this.subject = subject;
		this.width = width;
		this.height = height;
		this.map = map;
	};

	View.prototype = new Rect(new V2(0, 0), new V2(0, 0));

	View.prototype.getX = function getX() {
		return this.p1.x;
	};

	View.prototype.getY = function getY() {
		return this.p1.y;
	};

	View.prototype.getWidth = function getWidth() {
		return this.width;
	};

	View.prototype.getHeight = function getHeight() {
		return this.height;
	};

	View.prototype.update = function update() {
		this.p1 = new V2(this.width / -2, this.height/ -2);

		this.p1.add(this.subject.position);

		if (this.p1.x < 0) {
			this.p1.x = 0;
		}

		if (this.p1.y < 0) {
			this.p1.y = 0;
		}

		this.p2 = this.p1.sum(new V2(this.width, this.height));

		if (this.p2.x > this.map.getWidth()) {
			this.p1.x = (this.p2.x = this.map.getWidth()) - this.width;
		}

		if (this.p2.y > this.map.getHeight()) {
			this.p1.y = (this.p2.y = this.map.getHeight()) - this.height;
		}
	};

	return View;
});