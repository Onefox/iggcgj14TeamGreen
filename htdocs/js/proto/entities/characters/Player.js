define([
	"modules/mouse",
	"proto/entities/Character",
	"proto/entities/characters/Enemy",
	"proto/weapons/Rifle",
	"proto/V2"
], function(mouse, Character, Enemy, Rifle, V2) {
	var Player = function Player() {
		this.position = new V2(0, 0);
		this.movement = new V2(0, 0);
		this.width = 40;
		this.height = 60;
		this.color = 'black';
		this.speed = 0.3;

		// current coordinates
		this.x = 0;
		this.y = 0;

		this.weapons = [
			new Rifle(this)
		];

		this.setWeapon(0);
	};

	Player.prototype = new Character();

	Player.prototype.update = function update(delta, map) {
		var view = this.scene.view,
			dist,
			pos,
			i;

		if (this.movement.x || this.movement.y) {
			this.updateSprite(delta);
		} else {
			this.c.frame = 0;
		}

		this.checkCollision(this.movement.prd(delta), map);

		if (this.weapon) {
			this.weapon.update(delta);
		}

		pos = this.position.dif(new V2(view.getX(), view.getY())).dif(mouse);

		if (Math.abs(pos.x) > Math.abs(pos.y)) {
			if (pos.x > 0) {
				this.direction = 0;
			} else {
				this.direction = 1;
			}
		} else {
			if (pos.y > 0) {
				this.direction = 2;
			} else {
				this.direction = 3;
			}
		}



		window.game.scene.inactivePlayer.setMasterPosition(this.position);
		//window.game.scene.inactivePlayer.setMasterSpeed(this.speed);

		// player aggro when near
		for (i = 0; i < this.scene.entities.length; i++ ) {
			if (this.scene.entities[i] instanceof Enemy) {
				dist = this.getCenter().dif(this.scene.entities[i].getCenter()).length();

				if (dist < 400) {
					window.game.scene.entities[i].setMode('aggro', this.position);
				} else {
					window.game.scene.entities[i].setMode('normal', this.position);
				}
			}
		}

	};

	Player.prototype.down = function down(key) {


		if (key == 'left') {
			this.movement.x = -this.speed;
			//this.direction = 2;
		}

		if (key == 'right') {
			this.movement.x = this.speed;
			//this.direction = 3;
		}

		if (key == 'up') {
			this.movement.y = -this.speed;
			//this.direction = 1;
		}

		if (key == 'down') {
			this.movement.y = this.speed;
			//this.direction = 0;
		}

		if (key > 0 && key <= this.weapons.length) {
			this.setWeapon(key - 1);
		}
	};

	Player.prototype.up = function up ( key ) {
		if (key == 'left' && this.movement.x < 0) {
			this.movement.x = 0;
		}

		if (key == 'right' && this.movement.x > 0) {
			this.movement.x = 0;
		}

		if (key == 'up' && this.movement.y < 0) {
			this.movement.y = 0;
		}

		if (key == 'down' && this.movement.y > 0) {
			this.movement.y = 0;
		}

		//	if( this.movement.x < 0 ) this.direction = 2;
		//	if( this.movement.x > 0 ) this.direction = 3;
		//	if( this.movement.y < 0 ) this.direction = 1;
		//	if( this.movement.y > 0 ) this.direction = 0;
	};

	Player.prototype.setWeapon = function setWeapon(i) {
		this.weapon = this.weapons[i];

		this.loadImage( [
			'player.png',
			'heroThrower.png',
			'hero.png',
			'hero.png',
		][i]);
	};

	Player.prototype.checkCollision = function checkCollision(move, map) {
		var steps = Math.ceil(Math.max(Math.abs(move.x) / map.tileWidth, Math.abs(move.y) / map.tileHeight)),
			collision = {x: false, y: false},
			i;

		if (steps > 1) {
			move.div(steps);

			for (i = 0; i < steps && (move.x || move.y); i++) {
				this.checkCollisionStep(move, collision, map);

				if (collision.x) {
					move.x = 0;
				}

				if (collision.y) {
					move.y = 0;
				}
			}
		} else {
			this.checkCollisionStep(move, collision, map);
		}
	};

	Player.prototype.checkCollisionStep = function checkCollision(move, collision, map) {
		var pos = new V2(this.position.x, this.position.y),
			pxOffsetX,
			pxOffsetY,
			tileOffsetX,
			tileOffsetY,
			firstTileX,
			firstTileY,
			lastTileX,
			lastTileY,
			tileX,
			tileY;

		this.position.add(move);

		if (move.x) {
			pxOffsetX = (move.x > 0 ? this.width : 0);
			tileOffsetX = (move.x < 0 ? map.tileWidth : 0);

			firstTileY = Math.floor(pos.y / map.tileHeight);
			lastTileY = Math.ceil((pos.y + this.height) / map.tileHeight);
			tileX = Math.floor((pos.x + move.x + pxOffsetX) / map.tileWidth);

			for (tileY = firstTileY; tileY < lastTileY; tileY++) {
				if(map.checkCollision(tileX, tileY)) {
					collision.x = true;
					this.position.x = tileX * map.tileWidth - pxOffsetX + tileOffsetX;
					break;
				}
			}
		}

		if (move.y) {
			pxOffsetY = (move.y > 0 ? this.height : 0);
			tileOffsetY = (move.y < 0 ? map.tileHeight : 0);

			firstTileX = Math.floor(this.position.x / map.tileWidth);
			lastTileX = Math.ceil((this.position.x + this.width) / map.tileWidth);
			tileY = Math.floor((pos.y + move.y + pxOffsetY) / map.tileHeight);

			for (tileX = firstTileX; tileX < lastTileX; tileX++) {
				if (map.checkCollision(tileX, tileY)) {
					collision.y = true;
					this.position.y = tileY * map.tileHeight - pxOffsetY + tileOffsetY;
					break;
				}
			}
		}

		if (firstTileX) {
			this.x = firstTileX;
		}

		if (firstTileY) {
			this.y = firstTileY;
		}
	};

	Player.prototype.mousedown = function mousedown(pos) {
		if (this.weapon) {
			this.weapon.fire();
		}
	};

	Player.prototype.mouseup = function(pos) {
		if (this.weapon) {
			this.weapon.stop();
		}
	};

	return Player;
});