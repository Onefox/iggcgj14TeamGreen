define([
	"modules/image",
	"proto/Entity",
	"proto/Framecounter",
	"proto/Rect",
	"proto/V2"
], function(image, Entity, Framecounter, Rect, V2) {
	var Character = function Character() {
		this.characterWidth = 90;
		this.characterHeight = 90;
		this.direction = 0;
		this.offset = null;
		this.c = new Framecounter(60);
		this.drawFlag = true;
		this.frames = 4;
		this.alpha = 1;
	};

	Character.prototype = new Entity();

	Character.prototype.updateSprite = function updateSprite(delta) {
		this.c.update(delta);
	};

	Character.prototype.loadImage = function loadImage(img) {
		this.img = image.getImage(img);
		this.offset = new V2((this.characterWidth - this.width) / 2, this.characterHeight - this.height + 40);
	};

	Character.prototype.draw = function draw(ctx, view) {
		var xOffset,
			imgBox,
			pos;

		if (!this.img || this.drawFlag === false) {
			return;
		}

		pos = this.position.dif(this.offset);
		imgBox = new Rect(pos, this.position.sum(new V2(this.characterWidth, this.characterHeight)));

		if (view.collision(imgBox)) {
			xOffset = 0;

			if (this.direction == 2 || this.direction == 3) {
				xOffset = +3;
			}

			//ctx.save();
			ctx.globalAlpha = this.alpha;
			ctx.drawImage(this.img, (this.c.frame % this.frames) * this.characterWidth, this.direction * this.characterHeight, this.characterWidth, this.characterHeight, pos.x - view.getX(), pos.y - view.getY(), this.characterWidth, this.characterHeight);
			//ctx.restore();
			ctx.globalAlpha = 1;

			//ctx.fillRect(pos.x - view.getX() + (this.characterWidth / 2), pos.y - view.getY() + (this.characterHeight / 2), this.widthCol, this.heightCol);
		}
	};

	return Character;
});