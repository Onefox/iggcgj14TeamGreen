define([
	"modules/image"
], function(image) {
	var AnimationSprite = function AnimationSprite(img, frames) {
		this.img = image.getImage(img);
		this.h = this.img.height;
		this.w = this.img.width / frames;
		this.f = frames;
	};

	AnimationSprite.prototype.updateSprite = function updateSprite(img) {
		this.img = image.getImage(img);
	};

	AnimationSprite.prototype.draw = function draw(ctx, x, y, f) {
		if (!this.img) {
			return;
		}

		ctx.drawImage(this.img, f * this.w, 0, this.w, this.h, x, y, this.w, this.h);
	};

	AnimationSprite.prototype.center = function center(ctx, x, y, f) {
		if(!this.img) {
			return;
		}

		ctx.drawImage(this.img, f * this.w, 0, this.w, this.h, x - this.w/2, y - this.h/2, this.w, this.h);
	};

	return AnimationSprite;
});