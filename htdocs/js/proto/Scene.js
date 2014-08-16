define([
	"proto/entities/Animation",
	"proto/entities/characters/Player",
	"proto/entities/characters/InativePlayers",
	"proto/entities/bullets/Throw",
	"engine/config",
	"proto/Map",
	"engine/View",
	"helper/util",
	"modules/ajax"
], function(Animation, Player, InativePlayer, Throw, config, Map, View, util, ajax) {
	var Scene = function Scene() {
		this.entities = [];
		this.animations = [];
		this.player = null;
		this.view = null;
		this.map = null;
		this.inactivePlayer = null;
		this.inactivePlayer2 = null;
	};

	Scene.prototype.click = function click(pos) {
		var i;

		for (i = 0; i < this.entities.length; i++) {
			if (this.entities[i].click) {
				this.entities[i].click(pos);
			}
		}
	};

	Scene.prototype.getChar = function getChar(name) {
		if (this.player.name === name) {
			return this.player;
		} else if (this.inactivePlayer.name === name) {
			return this.inactivePlayer;
		} else if (this.inactivePlayer2.name === name) {
			return this.inactivePlayer2;
		}
	};

	Scene.prototype.mousedown = function mousedown(pos) {
		var i;

		for (i = 0; i < this.entities.length; i++) {
			if (this.entities[i].mousedown) {
				this.entities[i].mousedown(pos);
			}
		}
	};

	Scene.prototype.mouseup = function mouseup (pos) {
		var i;

		for (i = 0; i < this.entities.length; i++) {
			if (this.entities[i].mouseup) {
				this.entities[i].mouseup(pos);
			}
		}
	};

	Scene.prototype.up = function up(pos) {
		var i;

		for (i = 0; i < this.entities.length; i++) {
			if (this.entities[i].up) {
				this.entities[i].up(pos);
			}
		}
	};

	Scene.prototype.down = function down(pos) {
		var i;

		for(i = 0; i < this.entities.length; i++) {
			if (this.entities[i].down) {
				this.entities[i].down(pos);
			}
		}
	};

	Scene.prototype.add = function add(entity) {
		if (entity.setScene) {
			entity.setScene(this);
		}

		if (entity instanceof Animation) {
			this.animations.push(entity);
		} else {
			this.entities.push(entity);
		}
	};

	Scene.prototype.remove = function remove(entity) {
		if (entity instanceof Animation) {
			util.arrayRemove(this.animations, entity);
		} else {
			util.arrayRemove(this.entities, entity);
		}
	};

	Scene.prototype.getSceneTimer = function getSceneTimer() {
		return this.sceneTimer;
	};

	Scene.prototype.setSceneTimer = function setSceneTimer(pTime) {
		this.sceneTimer = pTimer;
	};

	Scene.prototype.draw = function draw(ctx) {
		var i;

		if (this.map) {
			this.map.drawBelow(ctx, this.view);

			for (i = 0; i < this.entities.length; i++ ) {
				if (this.entities[i].draw) {
					this.entities[i].draw(ctx, this.view);
				}
			}

			this.map.drawAbove(ctx, this.view);

			for (i = 0; i < this.animations.length; i++ ) {
				if (this.animations[i].draw) {
					this.animations[i].draw(ctx, this.view);
				}
			}
		}
	};

	Scene.prototype.update = function update(delta) {
		var i,
			item;

		this.sceneTimer += delta;

		this.entities.sort(function(a, b) {
			if (typeof a.position != 'undefined' && typeof b.position != 'undefined') {
				return a.position.y - b.position.y;
			} else {
				return 0;
			}
		});

		/*for (i = 0; i < this.entities.length; i++ ) {
			if (this.entities[i] instanceof Throw) {
				break;
			}
		}

		item = this.entities.splice(i, 0);
		this.entities.push(item);*/

		for (i = 0; i < this.entities.length; i++ ) {
			if (this.entities[i].update) {
				this.entities[i].update(delta, this.map);
			}
		}

		for (i = 0; i < this.animations.length; i++ ) {
			if (this.animations[i].update) {
				this.animations[i].update(delta, this.map);
			}
		}
	};

	Scene.prototype.init = function init(levelName, scene) {
		var mapfile = "data/" + levelName + scene + ".json",
			that = this;


		ajax.json(mapfile, function(data) {
			that.sceneTimer = 0;

			that.add(that.player = new Player());

			that.map = new Map(data, that);
			that.add(that.view = new View(that.player, config.screenWidth, config.screenHeight, that.map));

			// ugly hack to set scenes from here
			game.scenes[scene] = that;
			if (scene === 0) {
				// set first scene active
				game.scene = that;
			}
		});
	};

	return Scene;
});