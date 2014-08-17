define([
	"proto/Entity",
	"proto/V2",
	"proto/Sprite",
	"proto/entities/characters/Player",
	"proto/entities/animations/Bottle",
	"proto/Rect"
], function(Entity, V2, Sprite, Player, Bottle, Rect) {
	var Grenade = function Grenade(x ,y, endX , endY, actor) {
		this.position = new V2 (x, y);
		this.destination = new V2(endX, endY);
		this.movement = this.destination.dif(this.position);
		this.speed = 1;
		this.fak = 1;
		this.timer = 600;
		this.actor = actor;

		this.sprite = new Sprite('bottle.png');
		this.spriteAngle = 0;

		this.width = 45;
		this.height = 45;
	};

	Grenade.prototype = new Entity();

	Grenade.prototype.update = function(delta, map) {
		var t1 = this.movement.length(),
			t = this.destination.dif(this.position).length(),
			dist,
			coord = {},
			i;

		this.timer -= delta;
		this.fak = (t/(t1));

		this.position.add(this.movement.norm().prd(((delta + this.speed) * this.fak)));

		//var pos = this.position.grid( map.tileWidth, map.tileHeight );
		//map.checkCollision( pos.x, pos.y ) ||

		if (this.fak <= 0.05) {
			//this.scene.add(new Explosion(this.position.x,this.position.y, 80));
			this.scene.remove(this);

			for (i = 0; i < this.scene.entities.length; i++ ) {
				if (this.scene.entities[i] instanceof Player) {
					//console.log('getroffen');
					dist = this.getCenter().dif(this.scene.entities[i].getCenter()).length();

					if (dist < 50) {
						game.scene.player.setFear();

						// move ghost back to origin
						this.actor.position.x = this.actor.spawn.x;
						this.actor.position.y = this.actor.spawn.y;
					}

					this.scene.add(new Bottle(this.getCenter().x -90, this.getCenter().y - 100));
				}
			}
		}

			// hit wall / object
			coord.x = Math.floor(this.position.x / game.scene.map.tileWidth);
			coord.y = Math.floor(this.position.y / game.scene.map.tileHeight);
			if (map.checkCollision(coord.x, coord.y)) {
				this.scene.remove(this);
				this.scene.add(new Bottle(this.getCenter().x -90, this.getCenter().y - 100));
			}
	};

	Grenade.prototype.draw = function draw(ctx, view) {
		var v = new V2(this.width, this.height);

		ctx.save();
		ctx.translate((this.position.x - view.getX()) - 16, (this.position.y - view.getY()) - 21);
		this.spriteAngle += (1 / 32) * Math.PI;
		ctx.rotate(this.spriteAngle);
		ctx.scale(1 + this.fak, 1 + this.fak);

		if (view.collision(new Rect(this.position, this.position.sum(v)))) {
			this.sprite.center(ctx, 0, 0);
		}

		ctx.restore();
	};

	return Grenade;
});