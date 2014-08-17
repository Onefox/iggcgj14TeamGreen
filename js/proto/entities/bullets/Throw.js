define([
	"proto/Entity",
	"proto/V2",
	"proto/Sprite",
	"proto/entities/characters/Enemy",
	"proto/Rect",
	"proto/entities/animations/WallBreak"
], function(Entity, V2, Sprite, Enemy, Rect, WallBreak) {
	var Throw = function Throw(x ,y, imgName, actor) {
		this.position = new V2 (x, y);
		this.destination = new V2(0, 0);
		this.imgName = imgName;
		this.movement = this.destination.dif(this.position);
		this.speed = 1;
		this.fak = 1;
		this.timer = 600;
		this.actor = actor;

		this.sprite = new Sprite(this.imgName);
		this.spriteAngle = 0;

		this.width = 45;
		this.height = 45;

		//console.log(x, y, imgName, actor);
	};

	Throw.prototype = new Entity();

	Throw.prototype.update = function(delta, map) {
		if (this.doThrow) {
			var t1 = 250,//this.movement.length(),
				t = this.destination.dif(this.position).length(),
				coord = {},
				dist,
				i;

			this.timer -= delta;
			this.fak = (t/(t1));

			this.fak = 0.4;

			this.position.add(this.movement.norm().prd(((delta + this.speed) * this.fak)));

			// check whether hit
			for (i = 0; i < this.scene.entities.length; i++ ) {
				if (this.scene.entities[i] instanceof Enemy) {
					//console.log('getroffen');
					dist = this.getCenter().dif(this.scene.entities[i].getCenter()).length();

					if (dist < 80) {
						this.scene.entities[i].kill();
						this.scene.remove(this);
						//console.log('getroffen');
					}
				}
			}

			// destination reached
			//console.log(Math.round(this.position.x), Math.round(this.destination.x), Math.round(this.position.y), Math.round(this.destination.y))
			if (Math.round(this.position.x) === Math.round(this.destination.x) && Math.round(this.position.y) === Math.round(this.destination.y)) {
				this.scene.remove(this);
				this.scene.add(new WallBreak(this.position.x - 34, this.position.y - 80));
			}

			// hit wall / object
			coord.x = Math.floor(this.position.x / game.scene.map.tileWidth);
			coord.y = Math.floor(this.position.y / game.scene.map.tileHeight);
			if (map.checkCollision(coord.x, coord.y)) {
				this.scene.remove(this);
				this.scene.add(new WallBreak(this.position.x - 34, this.position.y - 80));
			}
		} else {
			this.position.x = this.actor.position.x;
			this.position.y = this.actor.position.y;
		}
	};

	Throw.prototype.draw = function draw(ctx, view) {
		ctx.save();

		if (this.doThrow) {
			ctx.translate((this.position.x - view.getX()), (this.position.y - view.getY()));
		} else {
			//var player = ;
			//var pos = player.position;
			ctx.translate(window.game.scene.getChar("olaf").position.x - view.getX() + 19, window.game.scene.getChar("olaf").position.y - view.getY() - 30);
		}

		this.sprite.center(ctx, 0, 0);

		ctx.restore();
	};

	Throw.prototype.throwItem = function throwItem() {
		// get direction of player
		var direction = this.actor.direction,
			throwDistance = 6;

		this.doThrow = true;

		// calc destination tile
		switch (direction) {
		//down
		case 0:
			this.destination.x = this.actor.x;
			this.destination.y = this.actor.y + throwDistance;
			break;
		//left
		case 1:
			this.destination.x = this.actor.x - throwDistance;
			this.destination.y = this.actor.y;
			break;
		//right
		case 2:
			this.destination.x = this.actor.x + throwDistance;
			this.destination.y = this.actor.y;
			break;
		//down
		case 3:
			this.destination.x = this.actor.x;
			this.destination.y = this.actor.y - throwDistance;
			break;
		}

		this.destination.x *= game.scene.map.tileWidth;
		this.destination.y *= game.scene.map.tileHeight;
		this.destination.x = this.destination.x + 40;
		this.destination.y = this.destination.y + 8;
		this.position.x = this.actor.position.x + 20;
		this.position.y = this.actor.position.y - 20;

		this.movement = this.destination.dif(this.position);
	};

	return Throw;
});