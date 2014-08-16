define([
	"proto/AnimationSprite",
	"proto/Entity",
	"proto/Framecounter",
	"proto/Rect",
	"proto/V2"
], function(AnimationSprite, Entity, Framecounter, Rect, V2) {
	var Animation = function Animation(speed) {
		this.speed = speed;
	};

	Animation.prototype = new Entity();

	Animation.prototype.init = function init(sprite, frames, endless) {
		this.framecount = frames;
		this.f = new Framecounter(this.speed ? this.speed : 180);
		this.endless = endless;
		this.sprite =  new AnimationSprite(sprite, frames);
	};

	Animation.prototype.update = function update(delta, map) {

		this.f.update(delta);

		if (this.f.frame >= this.framecount && !this.endless) {
			game.scene.remove(this);
		} else if (this.f.frame >= this.framecount && this.endless){
			this.f.reset();
		}
	};

	Animation.prototype.draw = function draw(ctx, view) {
		if (view.collision(new Rect(this.position, this.position.sum(new V2(this.width, this.height))))) {
			this.sprite.draw(ctx, this.position.x - view.getX(), this.position.y - view.getY(), this.f.frame);
		}
	};

	return Animation;
});