define([
	"modules/image"
], function(image) {
	var Sprite = function Sprite(img) {
		this.img = image.getImage(img);
	};

	Sprite.prototype.draw = function draw(ctx, x, y) {
		if (!this.img) {
			return;
		}

		ctx.drawImage(this.img, x, y);
	};

	Sprite.prototype.center = function center(ctx, x, y) {
		if (!this.img) {
			return;
		}

		ctx.drawImage(this.img, x - this.img.width / 2, y - this.img.height / 2);
	};

	return Sprite;
});