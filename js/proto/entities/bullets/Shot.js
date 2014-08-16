define([
	"engine/path",
	"modules/image",
	"proto/entities/characters/Enemy",
	"proto/Entity",
	"proto/Sprite",
	"proto/V2"
], function(path, image, Enemy, Entity, Sprite, V2) {
	var Shot = function Shot(x ,y, move) {
		this.position = new V2 (x - 5 , y - 5);
		this.movement = move;
		this.width = 8;
		this.height = 8;

		this.position.add(move.prd(50));

		this.sprite = new Sprite('laser.png');
		this.offset = new V2( 1, 1 );
	};

	Shot.prototype = new Entity();

	Shot.prototype.update = function(delta, map) {
		var entities,
			hitbox,
			tileId,
			pos,
			v,
			i;

		this.position.add(this.movement.prd(delta));
		pos = this.position.grid(map.tileWidth, map.tileHeight);

		tileId = map.checkCollision(pos.x, pos.y);

		if (tileId) {
			this.scene.remove(this);
			//this.scene.add( new bulletsplash( this.position, this.movement.prd(-1)));

			// hit a wall -> destroy
			if (typeof tileId === 'number') {
				map.damage[tileId] = map.damage[tileId] ? map.damage[tileId] + 1 : 1;

				if (map.damage[tileId] > 2) {
					map.removeObject(tileId, 2, true);
				}

				// update pf-grid
				//path.setWalkable(tileId, false);
			}
		} else {
				entities = this.scene.entities;
				hitbox = this.getHibox();

			for (i = 0; i < entities.length; i++){
				if (entities[i] instanceof Enemy) {
					if (entities[i].y > hitbox.p2.y) {
						break;
					}

					if (entities[i].getHibox().collision(hitbox)) {
						v = entities[i];
						this.scene.remove(this);
						//this.scene.add(new Splatter(this.position, this.movement));
						v.kill();
					}
				}
			}
		}
	};

	return Shot;
});