define([
	"proto/Rect",
	"proto/V2"
], function(Rect, V2) {
	var Entity = function Entity() {
		this.position = new V2(0, 0);
		this.movement = new V2(0, 0);

		this.scene = null;

		this.width = 10;
		this.height = 10;

		this.color = 'red';
	};

	Entity.prototype.setScene = function setScene(scene) {
		this.scene = scene;
	};

	/*Entity.prototype.draw = function draw(ctx, view) {
		ctx.fillStyle = this.color;

		if (view.collision(new Rect(this.position, this.position.sum(new V2(this.width, this.height))))) {
			ctx.fillRect(this.position.x - view.getX(), this.position.y - view.getY(), this.width, this.height);
		}
	};*/

	Entity.prototype.draw = function draw(ctx, view) {
		var pos = this.position.dif(this.offset);

		if (view.collision(new Rect(pos, this.position.sum(new V2(10, 10))))) {
			this.sprite.draw(ctx, pos.x - view.getX(), pos.y - view.getY());
		}
	};


	Entity.prototype.getCenter = function getCenter() {
		return this.position.sum(new V2(this.width / 2, this.height / 2));
	};

	Entity.prototype.getHibox = function getHibox() {
		return new Rect(this.position, this.position.sum(new V2(this.width, this.height)));
	};

	return Entity;
});