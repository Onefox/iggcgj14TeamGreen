define([
	"engine/config",
	"modules/mouse",
	"proto/entities/Character",
	"proto/entities/characters/Enemy",
	"proto/entities/characters/InativePlayers",
	"proto/weapons/Flamethrower",
	"proto/V2",
	"helper/util",
	"helper/dom",
	"proto/entities/animations/Cry",
	"helper/math",
	"proto/entities/bullets/Throw",
	"proto/entities/animations/WallBreak"
], function(config, mouse, Character, Enemy, InativePlayer, Flamethrower, V2, util, dom, Cry, math, Throw, WallBreak) {
	var Player = function Player() {
		this.position = new V2(0, 0);
		this.movement = new V2(0, 0);
		this.directionVec = new V2(0,0);
		this.characterWidth = 60;
		this.characterHeight = 78;
		this.name = 'jerome';
		this.light = 0;
		this.stop = false;

		this.width = 40;
		this.height = 60;

		this.widthCol = 40;
		this.heightCol = 40;

		this.color = 'black';
		this.SPEEDS = {
			'boost': 0.3 * 1.5,
			'normal': 0.3
		};
		this.actionTimer = 0;
		this.ACTIONTIME = 3000;
		this.cooldown = null;


		this.MODES = {
			normal: 'normal',
			stunned: 'stunned'
		};

		this.mode = this.MODES.normal;
		this.speed = this.SPEEDS.normal;

		// current coordinates
		this.x = 0;
		this.y = 0;

		this.weapons = [
			new Flamethrower(this)
		];

		this.stunTimeout = 999;

		// item currently in hand of character
		this.carry = null;

		this.setWeapon(0);
		this.loadImage(this.name+'.png');
	};

	Player.prototype = new Character();

	Player.prototype.setMode = function setMode(mode) {
		this.mode = this.MODES[mode];

		if (this.mode === this.MODES.stunned) {
			this.stunTimeout = 1500;
		}
	};

	Player.prototype.update = function update(delta, map) {
		var view = this.scene.view,
			aggroDist,
			entity,
			dist,
			pos,
			i;

		// is stunned
		if (this.mode === this.MODES.stunned) {
			this.stunTimeout -= delta;

			// set mode back to normal
			if (this.stunTimeout <= 0) {
				this.setMode("normal");
			}
		}

		if (this.actionTimer > 0) {
			this.actionTimer -= delta;
			if (this.actionTimer < 0) {
				this.removeAction1();
			}
		}

		if (this.movement.x || this.movement.y) {
			this.updateSprite(delta);
		} else {
			this.c.frame = 0;
		}

		this.checkCollision(this.movement.prd(delta), map);

		if (this.weapon) {
			this.weapon.update(delta);
		}

		/*pos = this.position.dif(new V2(view.getX(), view.getY())).dif(mouse);

		if (Math.abs(pos.x) > Math.abs(pos.y)) {
			if (pos.x > 0) {
				this.direction = 1;
			} else {
				this.direction = 2;
			}
		} else {
			if (pos.y > 0) {
				this.direction = 3;
			} else {
				this.direction = 0;
			}
		}*/

		if (window.game.scene.inactivePlayer && window.game.scene.inactivePlayer2) {
			window.game.scene.inactivePlayer.setMasterPosition(this.position);

			window.game.scene.inactivePlayer2.setMasterPosition(window.game.scene.inactivePlayer.position);
		}

		//window.game.scene.inactivePlayer.setMasterSpeed(this.speed);

		// player aggro when near
		for (i = 0; i < this.scene.entities.length; i++ ) {
			entity = window.game.scene.entities[i];
			if (!entity) {
				continue;
			}
			switch (entity.name) {
				case "wraith":
					aggroDist = 200;
					break;
				default:
					aggroDist = 500;
					break;
			}


			if (entity instanceof Enemy) {
				dist = this.getCenter().dif(entity.getCenter()).length();

				// may be non-existent when scene changes
				if (entity.setMode) {
					if (dist < aggroDist) {
						entity.setMode('aggro', this.position);
					} else {
						entity.setMode('normal', this.position);
					}
				}
			}
		}

		this.updateGamepad();
	};

	Player.prototype.updateGamepad = function updateGamepad() {
		var that = this;

		if (!navigator.getGamepads) {
			return;
		}

		this.pad = navigator.getGamepads()[0];

		//console.log(this.pad);

		if (!this.pad) {
			return;
		}

		if (this.pad.axes[5] == -1) {
			this.down("left");
		} else {
			this.up("left");
		}

		if (this.pad.axes[5] == 1) {
			this.down("right");
		} else {
			this.up("right");
		}

		if (this.pad.axes[6] == -1) {
			this.down("up");
		} else {
			this.up("up");
		}

		if (this.pad.axes[6] == 1) {
			this.down("down");
		} else {
			this.up("down");
		}

		if (this.pad.buttons[5].pressed || this.pad.buttons[4].pressed) {
			if (this.timeout) {
				return;
			}

			this.down("switch");

			this.timeout = setTimeout(function() {
				clearTimeout(that.timeout);
				that.timeout = null;
			}, 200);
		} else {
			this.up("witch");
		}

		if (this.pad.buttons[0].pressed || this.pad.buttons[0].pressed) {
			if (this.timeout) {
				return;
			}

			this.down("e_use");

			this.timeout = setTimeout(function() {
				clearTimeout(that.timeout);
				that.timeout = null;
			}, 200);
		} else {
			this.up("e_use");
		}

		if (this.pad.buttons[1].pressed || this.pad.buttons[1].pressed) {
			if (this.timeout) {
				return;
			}

			this.down("action2");

			this.timeout = setTimeout(function() {
				clearTimeout(that.timeout);
				that.timeout = null;
			}, 200);
		} else {
			this.up("action2");
		}

		if (this.pad.buttons[3].pressed || this.pad.buttons[3].pressed) {
			window.location.reload();
		}
	};

	Player.prototype.down = function down(key) {
		if (this.mode === this.MODES.stunned || this.stop) {
			return;
		}

		if (key == 'space' && this.gameover) {
			window.location.reload();
		}

		if (key == 'left') {
			this.movement.x = -this.speed;
			//this.movement.y = 0;
			this.direction = 1;
			this.directionVec.x = this.movement.x;
			this.directionVec.y = this.movement.y;
		}

		if (key == 'right') {
			this.movement.x = this.speed;
			//this.movement.y = 0;
			this.direction = 2;
			this.directionVec.x = this.movement.x;
			this.directionVec.y = this.movement.y;
		}

		if (key == 'up') {
			this.movement.y = -this.speed;
			//this.movement.x = 0;
			this.direction = 3;
			this.directionVec.x = this.movement.x;
			this.directionVec.y = this.movement.y;
		}

		if (key == 'down') {
			this.movement.y = this.speed;
			//this.movement.x = 0;
			this.direction = 0;
			this.directionVec.x = this.movement.x;
			this.directionVec.y = this.movement.y;
		}

		if (key > 0 && key <= this.weapons.length) {
			this.setWeapon(key - 1);
		}
		if (key == 'switch') {
			//console.log("changePlayer");
			//player2 to player1 and player to player2  and player1 to player

			// remove old shadows
			window.game.scene.remove(window.game.scene.inactivePlayer);
			window.game.scene.remove(window.game.scene.inactivePlayer2);

			var inactivePlayerBuffer = window.game.scene.inactivePlayer;
			var inactivePlayerBuffer2 = window.game.scene.inactivePlayer2;
			var elem = dom.get('indicator');

			dom.removeClass(elem,this.name);
			dom.removeClass(elem, "choosen");

			// skill-div
			dom.removeClass(dom.get("skills"), this.name);

			window.game.scene.inactivePlayer = new InativePlayer(inactivePlayerBuffer2.position.x, inactivePlayerBuffer2.position.y);
			window.game.scene.inactivePlayer.setName(inactivePlayerBuffer2.name);

			window.game.scene.inactivePlayer2 = new InativePlayer(this.position.x, this.position.y);
			//console.log(this.name);
			//console.log("inactivePlayer");
			window.game.scene.inactivePlayer2.setName(this.name);

			this.removeAction1();

			this.setName(inactivePlayerBuffer.name);
			this.position.x = inactivePlayerBuffer.position.x;
			this.position.y = inactivePlayerBuffer.position.y;

			dom.addClass(elem, inactivePlayerBuffer.name);
			setTimeout(function() {
				dom.addClass(elem, "choosen");
			}, 40);

			// skill-div
			dom.addClass(dom.get("skills"), inactivePlayerBuffer.name);

			// add new shadows
			window.game.scene.add(window.game.scene.inactivePlayer);
			window.game.scene.add(window.game.scene.inactivePlayer2);

			game.player = game.scene.player;
			game.inactivePlayer = game.scene.inactivePlayer;
			game.inactivePlayer2 = game.scene.inactivePlayer2;
		}
		if (key == 'e_use') {
			this.action1();
		}
		if (key == 'action2') {
			this.action2();
		}
	};


	Player.prototype.action2Jerome = function action2Jerome() {
		var pos = this.position,
			index,
			index2,
			tile,
			i, z,
			firstTileX = Math.floor(pos.x / window.game.scene.map.tileWidth),
			firstTileY = Math.floor(pos.y / window.game.scene.map.tileHeight),
			x = firstTileX,
			y = firstTileY,
			targetX,
			direction,
			targetY;

		switch (this.direction) {
			case 0:
				firstTileY++;
				break;
			case 1:
				firstTileX--;
				break;
			case 2:
				firstTileX++;
				break;
			case 3:
				firstTileY--;
				break;
		}

		index = util.twoToOneDim(x, y);
		index2 = util.twoToOneDim(firstTileX, firstTileY);

		if (util.tileCanBeRoped(window.game.scene.map.data.layers[2].data[index]) || util.tileCanBeRoped(window.game.scene.map.data.layers[2].data[index2])) {
			//
			if (util.tileCanBeRoped(window.game.scene.map.data.layers[2].data[index2])) {
				index = index2;
				x = firstTileX;
				y = firstTileY;
			}
			// search for the next rope
			for (i = 1; i < 8;i++) {
				index2 = util.twoToOneDim(x + i, y);
				if (util.tileCanBeRoped(window.game.scene.map.data.layers[2].data[index2])) {
					targetX = x + i;
					targetY = y;
					direction = "right";
					for (z = 1; z < i; z++) {
						index2 = util.twoToOneDim(x+z, y);
						window.game.scene.map.data.layers[3].data[index2] = 0;
						window.game.scene.map.data.layers[2].data[index2] = 758;
						window.game.scene.map.drawTile(index2, 2);
						window.game.scene.map.drawTile(index2, 3);
					}
					index2 = util.twoToOneDim(x, y);
					window.game.scene.map.data.layers[2].data[index2] = 757;
					window.game.scene.map.drawTile(index2, 2);
					break;
				}
				index2 = util.twoToOneDim(x, y + i);
				if (util.tileCanBeRoped(window.game.scene.map.data.layers[2].data[index2])) {
					targetX = x;
					targetY = y + i;
					direction = "down";
					for (z = 1; z < i; z++) {
						index2 = util.twoToOneDim(x, y+z);
						window.game.scene.map.data.layers[3].data[index2] = 0;
						window.game.scene.map.data.layers[2].data[index2] = 759;
						window.game.scene.map.drawTile(index2, 2);
						window.game.scene.map.drawTile(index2, 3);
					}
					index2 = util.twoToOneDim(x, y);
					window.game.scene.map.data.layers[2].data[index2] = 709;
					window.game.scene.map.drawTile(index2, 2);
					break;
				}
				index2 = util.twoToOneDim(x, y - i);
				if (util.tileCanBeRoped(window.game.scene.map.data.layers[2].data[index2])) {
					targetX = x;
					targetY = y - i;
					direction = "up";
					for (z = 1; z < i; z++) {
						index2 = util.twoToOneDim(x, y-z);
						window.game.scene.map.data.layers[3].data[index2] = 0;
						window.game.scene.map.data.layers[2].data[index2] = 759;
						window.game.scene.map.drawTile(index2, 2);
						window.game.scene.map.drawTile(index2, 3);
					}
					index2 = util.twoToOneDim(x, y);
					window.game.scene.map.data.layers[2].data[index2] = 708;
					window.game.scene.map.drawTile(index2, 2);
					break;
				}
				index2 = util.twoToOneDim(x - i, y);
				if (util.tileCanBeRoped(window.game.scene.map.data.layers[2].data[index2])) {
					targetX = x - i;
					targetY = y;
					direction = "left";
					for (z = 1; z < i; z++) {
						index2 = util.twoToOneDim(x-z, y);
						window.game.scene.map.data.layers[3].data[index2] = 0;
						window.game.scene.map.data.layers[2].data[index2] = 758;
						window.game.scene.map.drawTile(index2, 2);
						window.game.scene.map.drawTile(index2, 3);
					}
					index2 = util.twoToOneDim(x, y);
					window.game.scene.map.data.layers[2].data[index2] = 710;
					window.game.scene.map.drawTile(index2, 2);
					break;
				}

			}
			// make target ropeplace
			index2 = util.twoToOneDim(targetX, targetY);
			if (util.tileCanBeRoped(window.game.scene.map.data.layers[2].data[index2])) {
				if (direction == "left") {
					window.game.scene.map.data.layers[2].data[index2] = 757;
				} else if (direction == "down") {
					window.game.scene.map.data.layers[2].data[index2] = 708;
				} else if (direction == "up") {
					window.game.scene.map.data.layers[2].data[index2] = 709;
				} else {
					window.game.scene.map.data.layers[2].data[index2] = 710;
				}
				window.game.scene.map.drawTile(index2, 2);
			}

			// remove objects and add rope putt new tiles in there

			//758 // rope right;

			// remove from map
			//window.game.scene.map.removeObject(index, 2);

			// add sprite over olafs head

		}
	};

	Player.prototype.action1Olaf = function action1Olaf() {
		var pos = this.position,
			center = this.getCenter(),
			index,
			tile,
			firstTileX = Math.floor(pos.x / window.game.scene.map.tileWidth),
			firstTileY = Math.floor(pos.y / window.game.scene.map.tileHeight);

		switch (this.direction) {
			case 0:
				firstTileY++;
				break;
			case 1:
				firstTileX--;
				break;
			case 2:
				firstTileX++;
				break;
			case 3:
				firstTileY--;
				break;
		}

		//console.log("x: " + firstTileX + " y: " + firstTileY);

		index = util.twoToOneDim(firstTileX, firstTileY);

		// already sth in the hand -> throw
		if (this.carry) {
			this.carry.throwItem();
			this.carry = null;
			return;
		}

		if (util.tileCanBeThrown(window.game.scene.map.data.layers[3].data[index])) {
			// sprite over olafs head
			tile = window.game.scene.map.data.layers[3].data[index];

			// remove from map
			window.game.scene.map.removeObject(index, 3);

			//console.log()
			this.carry = new Throw(center.x, center.y, util.getThrowName(tile), this);
			this.scene.add(this.carry);
		}
	};

	Player.prototype.action2Olaf = function action2Olaf() {
		var pos = this.position,
			center = this.getCenter(),
			index,
			tile,
			id,
			firstTileX = Math.floor(pos.x / window.game.scene.map.tileWidth),
			firstTileY = Math.floor(pos.y / window.game.scene.map.tileHeight);

		switch (this.direction) {
			case 0:
				firstTileY++;
				break;
			case 1:
				firstTileX--;
				break;
			case 2:
				firstTileX++;
				break;
			case 3:
				firstTileY--;
				break;
		}

		//console.log("x: " + firstTileX + " y: " + firstTileY);

		index = util.twoToOneDim(firstTileX, firstTileY);
		id = game.scene.map.data.layers[3].data[index];


		if (util.tileCanBeDestroyed(id)) {
			game.scene.map.removeObject(index, 3);

			index = util.twoToOneDim(firstTileX, firstTileY - 1);
			game.scene.map.removeObject(index, 3);

			this.scene.add(new WallBreak(this.getCenter().x - 34, this.getCenter().y - 140));
		}
	};

	Player.prototype.action1 = function action1() {
		this.actionTimer = this.ACTIONTIME;
		switch(this.name) {
			case 'olaf':
				this.action1Olaf();
				break;
			case 'jerome':
				this.light = 400;
				break;
			case 'lina':
				this.speed = this.SPEEDS.boost;
				window.game.scene.inactivePlayer.speed = this.speed*33;
				window.game.scene.inactivePlayer2.speed = this.speed*33;
				break;
			default:
				console.log('wrong name?');
				break;
		}
	};
	Player.prototype.removeAction1 = function removeAction1() {
		// TODO: Set cooldown!!
		switch(this.name) {
			case 'olaf':
				break;
			case 'jerome':
				this.light = 0;
				this.actionTimer = 0;
				break;
			case 'lina':
				this.speed = this.SPEEDS.normal;
				this.actionTimer = 0;
				window.game.scene.inactivePlayer.speed = this.speed*33;
				window.game.scene.inactivePlayer2.speed = this.speed*33;
				break;
			default:
				console.log('wrong name?');
				break;
		}
	};
	Player.prototype.action2 = function action2() {
		this.actionTimer = this.ACTIONTIME;
		switch(this.name) {
			case 'olaf':
				this.action2Olaf();
				break;
			case 'jerome':
				this.action2Jerome();
				break;
			case 'lina':
					this.weapon.fire();
				break;
			default:
				console.log('wrong name?');
				break;
		}
	};
	Player.prototype.removeAction2 = function removeAction2() {
		switch(this.name) {
			case 'olaf':
				break;
			case 'jerome':
				break;
			case 'lina':
				this.weapon.stop();

				break;
			default:
				console.log('wrong name?');
				break;
		}
	};

	Player.prototype.up = function up ( key ) {
		this.stop = false;
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

		if (key == 'action2') {
			this.removeAction2();
		}


		//	if( this.movement.x < 0 ) this.direction = 2;
		//	if( this.movement.x > 0 ) this.direction = 3;
		//	if( this.movement.y < 0 ) this.direction = 1;
		//	if( this.movement.y > 0 ) this.direction = 0;
	};

	Player.prototype.setWeapon = function setWeapon(i) {
		this.weapon = this.weapons[i];

		/*this.loadImage( [
			'jerome.png',
			'heroThrower.png',
			'hero.png',
			'hero.png',
		][i]);*/
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
			pxOffsetX = (move.x > 0 ? this.widthCol : 0);
			tileOffsetX = (move.x < 0 ? map.tileWidth : 0);

			firstTileY = Math.floor(pos.y / map.tileHeight);
			lastTileY = Math.ceil((pos.y + this.heightCol) / map.tileHeight);
			tileX = Math.floor((pos.x + move.x + pxOffsetX) / map.tileWidth);

			for (tileY = firstTileY; tileY < lastTileY; tileY++) {
				this.checkTeleport(map, tileX, tileY);

				if (map.checkCollision(tileX, tileY)) {
					collision.x = true;
					this.position.x = tileX * map.tileWidth - pxOffsetX + tileOffsetX;
					break;
				}
			}
		}

		if (move.y) {
			pxOffsetY = (move.y > 0 ? this.heightCol : 0);
			tileOffsetY = (move.y < 0 ? map.tileHeight : 0);

			firstTileX = Math.floor(this.position.x / map.tileWidth);
			lastTileX = Math.ceil((this.position.x + this.widthCol) / map.tileWidth);
			tileY = Math.floor((pos.y + move.y + pxOffsetY) / map.tileHeight);

			for (tileX = firstTileX; tileX < lastTileX; tileX++) {
				this.checkTeleport(map, tileX, tileY);

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

	Player.prototype.checkTeleport = function checkTeleport(map, tileX, tileY) {
		var i,
			that = this,
			name,
			carry,
			animations;


		if (window.teleTimeout !== null) {
			return;
		}

		// check whether used teleports
		for (i = 0; i < map.teleport.length; i++) {
			// found teleport
			if (map.teleport[i].x === tileX && map.teleport[i].y === tileY) {
				this.stop = true;
				name = game.player.name;
				animations = game.scene.animations;
				carry = game.scene.player.carry;

				if (carry) {
					game.scene.remove(game.scene.player.carry);
					game.scene.player.carry = null;
				}

				game.scene.remove(game.inactivePlayer);
				game.scene.remove(game.inactivePlayer2);
				// set scene
				game.scene = game.scenes[map.teleport[i].scene];
				game.scene.animations = animations;

				this.position.x = map.teleport[i].x * game.scene.map.tileWidth;
				this.position.y = (map.teleport[i].y + 2) * game.scene.map.tileHeight;

				game.scene.player.position.x = this.position.x;
				game.scene.player.position.y = this.position.y;

				game.player = game.scene.player;
				game.scene.add(game.scene.inactivePlayer = game.inactivePlayer);
				game.scene.add(game.scene.inactivePlayer2 = game.inactivePlayer2);

				game.scene.player.setName(name);

				game.scene.player.direction = 0;
				game.scene.inactivePlayer.direction = 0;
				game.scene.inactivePlayer2.direction = 0;

				window.teleTimeout = setTimeout(function() {
					clearTimeout(window.teleTimeout);
					window.teleTimeout = null;
				}, 1000);

				/*if (carry) {
					game.scene.player.carry = carry;
					game.scene.add(game.scene.player.carry, true);
				}*/

				//game.scene.inactivePlayer.position.y = game.scene.player.position.y - 40;
				//game.scene.inactivePlayer.position.y = game.scene.player.position.y - 80;
			}
		}


		//console.log(tileX, tileY);
		//console.log(game.ball.x, tileX, game.ball.y, tileY);

		// GOAL
		if (game.ball.x === tileX && game.ball.y === tileY) {
			config.running = false;

			dom.addClass(dom.get("victory"), "display");

			this.gameover = true;

			window.setTimeout(function() {
				window.location.reload();
			}, 5000);
		}

		//console.log(move.x, move.y);
	};

	Player.prototype.mousedown = function mousedown(pos) {

	};

	Player.prototype.mouseup = function(pos) {

	};
	/**
	 * Set the name
	 */
	Player.prototype.setName = function setName(name) {
		this.name = name;
		this.loadImage(name+'.png');
	};

	// set fear
	Player.prototype.setFear = function setFear() {
		var player = math.rand(0, 2),
			elem,
			obj,
			name;

		switch (player) {
		case 0:
			obj = game.player;
			break;
		case 1:
			obj = game.inactivePlayer;
			break;
		case 2:
			obj = game.inactivePlayer2;
			break;
		}

		// already stunned -> try again
		if (obj.fear) {
			this.setFear();
			return;
		}

		obj.fear = true;

		if (game.player.fear && game.inactivePlayer.fear && game.inactivePlayer2.fear) {
			config.running = false;

			// GAMEOVER
			dom.addClass(dom.get("gameover"), "display");

			this.gameover = true;

			window.setTimeout(function() {
				window.location.reload();
			}, 2000);
		}

		name = obj.name;

		elem = dom.get("fear " + name);

		dom.addClass(elem, "visible");

		window.game.scene.add(new Cry(name));
	};

	return Player;
});