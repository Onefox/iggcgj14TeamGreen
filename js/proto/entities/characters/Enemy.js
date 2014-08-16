define([
	"engine/path",
	"helper/math",
	"proto/AnimationSprite",
	"proto/entities/Character",
	"proto/Framecounter",
	"proto/V2",
	"proto/entities/animations/EnemyDeath"
], function(path, math, AnimationSprite, Character, Framecounter, V2, EnemyDeath) {
	var Enemy = function Enemy(x, y, id) {
		this.position = new V2(x, y);
		this.spawn = new V2(x, y);


		// current coordinates
		this.x = null;
		this.y = null;

		this.id = id;

		// collision-box
		this.width = 40;
		this.height = 60;

		// sprite-size
		//this.characterWidth = 80;
		//this.characterHeight = 80;

		this.angle = Math.random() * Math.PI * 2;

		this.MODES = {
			normal: 'normal',
			panic: 'panic',
			aggro: 'aggro'
		};

		this.SPEEDS = {
			normal: 0.15 * Math.random() + 0.1,
			panic: 0.38,
			aggro: 2
		};

		this.mode = this.MODES.normal;
		this.speed = this.SPEEDS.normal;

		this.turn = 0;

		// source of mode (i.e. grenade destination/ explosion)
		this.source = new V2(0,0);

		this.minAggroDistance = 10;

		this.modeTime = 0;
		this.modeTimeMax = 10000;

		this.spriteId = (1 + Math.random() * 5 | 0);

		this.screamCooldown = 0;

		//this.bloodSprites = new AnimationSprite('bloodStains.png', 4);

		this.c = new Framecounter(100);

		this.loadImage('victim' + this.spriteId + '_panic.png');
		this.loadImage('enemy.png');
	};

	Enemy.prototype = new Character();

	Enemy.prototype.update = function update(delta, map) {
		var rnd = Math.random() * 10,
			angleBetween,
			correction = 0,
			angle = 0;
			i = 0;

		//console.log("TEST+ " +this.mode);

		this.updateSprite(delta);


		switch (this.mode) {


			case this.MODES.normal:
				if (rnd < 1 + (this.turn > 0) *3 ) {
					this.turn = 1;
					this.angle += delta * 0.005;
				} else if (rnd < 2 + (this.turn > 0) * 3 + (this.turn < 0) * 3 ) {
					this.turn = -1;
					this.angle -= delta * 0.005;
				}
				break;

			case this.MODES.panic:
				this.modeTime -= delta;

				if (this.modeTime <= 0) {
					this.loadImage('Enemy'+this.spriteId+'.png');
					this.speed = this.SPEEDS.normal;
					this.mode = this.MODES.normal;

					this.modeTime = this.modeTimeMax;
				} else {
					angleBetween = ((this.position.dif(this.source).dot(this.movement)) / (this.position.dif(this.source).normFac() * this.movement.normFac()));

					if (this.angle > angleBetween) {
						this.angle -= delta * 0.005;
					} else {
						this.angle += delta * 0.005;
					}
				}

				/*if (this.screamCooldown-- < 0 && ((Math.random() * 100 | 0) + 1) <= 1) {
					//sound.play('sound/fx/scream/ogg/scream0'+((Math.random()*5|0)+1)+'.ogg');
					this.screamCooldown = 150;
				}*/
				break;

			case this.MODES.aggro:
				var movement = new V2(this.source.x, this.source.y).sub(this.position),
					hyp = movement.normFac();

				// dont walk into character-sprite
				if (hyp > this.minAggroDistance) {
					movement = movement.div(hyp);
					this.movement = movement.mul(this.speed);

					if (!this.checkCollision(this.movement.prd(delta - this.speed), map)) {
						this.position.add(this.movement);
					}
				}
				break;
		}

		if (this.mode === this.MODES.normal || this.mode === this.MODES.panic) {
			do {
				angle = this.angle + correction;
				this.movement = math.rad_to_vector(angle, this.speed);
				correction = correction > 0 ? -correction - 0.3 : -correction + 0.3;
			} while (this.checkCollision(this.movement.prd(delta), map) && i++ < 10);

			this.angle = angle;
			this.position.add(this.movement.prd(delta));
		}

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


		if (this.updateThis) {
			this.updateThis(delta, map);
		}
	};

	Enemy.prototype.setMode = function setMode(mode, opt_posRef) {
		/*if (mode === this.mode) {
			return;
		}*/

		this.speed = this.SPEEDS[mode];
		this.mode = this.MODES[mode];

		if (opt_posRef) {
			this.source = opt_posRef;
		}

		switch (mode) {
			case this.MODES.panic:
				this.loadImage('victim' + this.spriteId + '_panic.png');
				break;
			case this.MODES.aggro:
				//this.calcPath();
				break;
		}
	};

	Enemy.prototype.respawn = function respawn() {
		//this.position.x = this.spawn.x;
		//this.position.y = this.spawn.y;
	};

	/*Enemy.prototype.calcPath = function calcPath() {
		var that = this;

		if (!this.x || ! this.y) {
			return;
		}

		path.easystar.findPath(this.x, this.y, window.game.scene.player.x, window.game.scene.player.y, function(path) {
			if (path) {
				if (path[2]) {
					that.nextTile = new V2(path[2].x * window.game.scene.map.tileWidth, path[0].y * window.game.scene.map.tileHeight);
				}
			}
		});
	};*/

	Enemy.prototype.checkCollision = function checkCollision(move, map) {
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

	Enemy.prototype.kill = function kill() {
		var pos = this.position.dif(this.offset),
			center = this.getCenter(),
			belowctx = this.scene.map.below.getContext('2d');

		this.scene.remove(this);

		//this.scene.ui.EnemyRemoved();
		//this.scene.add( new death( pos.x, pos.y  ));

		//this.bloodSprites.center(belowctx, center.x, center.y, (Math.random() * 3) | 0);

		this.scene.add(new EnemyDeath(this.getCenter().x - 40, this.getCenter().y - 110));
	};

	return Enemy;
});