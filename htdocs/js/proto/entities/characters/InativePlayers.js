define([
	"engine/path",
	"helper/math",
	"proto/AnimationSprite",
	"proto/entities/Character",
	"proto/Framecounter",
	"proto/V2"
], function(path, math, AnimationSprite, Character, Framecounter, V2) {
	var InactivePlayer = function InactivePlayer(x, y) {
		this.position = new V2(x, y);

		// current coordinates
		this.x = null;
		this.y = null;

		// collision-box
		this.width = 40;
		this.height = 60;
		this.name = 'lina';

		// sprite-size
		this.characterWidth = 60;
		this.characterHeight = 78;
		this.cooldown = 0;

		this.speed = 10;

		this.turn = 0;

		this.fear = null;

		// target of the Master
		this.target = new V2(0,0);

		this.spriteId = (1 + Math.random() * 5 | 0);

		//this.bloodSprites = new AnimationSprite('bloodStains.png', 4);

		this.c = new Framecounter(100);


		this.loadImage(this.name+'.png');
	};

	InactivePlayer.prototype = new Character();

	InactivePlayer.prototype.update = function update(delta, map) {

		if (this.movement.x || this.movement.y) {
			this.updateSprite(delta);
		} else {
			this.c.frame = 0;
		}

		//update cooldow
		if (this.cooldown > 0) {
			this.cooldown -= delta;
		}
		
		var movement = new V2(this.target.x, this.target.y).sub(this.position),
			hyp = movement.normFac();


		movement = movement.div(hyp);
		this.movement = movement.mul(this.speed);
		if (Math.abs(this.movement.x) > Math.abs(this.movement.y)) {
			if (this.movement.x > 0 ) {
				this.direction = 2;
			} else {
				this.direction = 1;
			}
		} else {
			if (this.movement.y > 0) {
				this.direction = 0;
			} else {
				this.direction = 3;
			}
		}

		// dont walk into character-sprite
		if (hyp > 60) {
			this.position.add(this.movement);
		} else {
			// stop animation
			this.movement.x = 0;
			this.movement.y = 0;
		}



	};

	InactivePlayer.prototype.checkCollision = function checkCollision(move, map) {
		var pos = this.position.sum(move),
			firstTileX = Math.floor(pos.x / map.tileWidth),
			lastTileX = Math.ceil((pos.x + this.width) / map.tileWidth),
			firstTileY = Math.floor(pos.y / map.tileHeight),
			lastTileY = Math.ceil((pos.y + this.height) / map.tileHeight),
			x,
			y;

		this.x = firstTileX;
		this.y = firstTileY;

		for (x = firstTileX; x < lastTileX; x++) {
			for(y = firstTileY; y < lastTileY; y++) {
				if (map.checkCollision(x, y)) {
					return true;
				}
			}
		}

		return false;
	};

	/**
	 * Set the position of the selectet Player
	 */
	InactivePlayer.prototype.setMasterPosition = function setMasterPosition(pos) {
		this.target = pos;
	};

	InactivePlayer.prototype.setPosition = function setPosition(pos) {
		this.position = pos;
	};


	/**
	 * Set the name
	 */
	InactivePlayer.prototype.setName = function setName(name) {
		//console.log(name);
		this.name = name;
		this.loadImage(name+'.png');
	};

	return InactivePlayer;
});