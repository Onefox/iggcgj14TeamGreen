define([
	"proto/entities/Animation",
	"proto/entities/characters/Player",
	"engine/config",
	"engine/Map",
	"engine/View",
	"helper/util",
	"modules/ajax"
], function(Animation, Player, config, Map, View, util, ajax) {
	return function Scene() {
		this.entities = [];
		this.animations = [];
		this.player = null;
		this.view = null;
		this.map = null;

		this.click = function click(pos) {
			var i;

			for (i = 0; i < this.entities.length; i++) {
				if (this.entities[i].click) {
					this.entities[i].click(pos);
				}
			}
		};

		this.mousedown = function mousedown(pos) {
			var i;

			for (i = 0; i < this.entities.length; i++) {
				if (this.entities[i].mousedown) {
					this.entities[i].mousedown(pos);
				}
			}
		};

		this.mouseup = function mouseup (pos) {
			var i;

			for (i = 0; i < this.entities.length; i++) {
				if (this.entities[i].mouseup) {
					this.entities[i].mouseup(pos);
				}
			}
		};

		this.up = function up(pos) {
			var i;

			for (i = 0; i < this.entities.length; i++) {
				if (this.entities[i].up) {
					this.entities[i].up(pos);
				}
			}
		};

		this.down = function down(pos) {
			var i;

			for(i = 0; i < this.entities.length; i++) {
				if (this.entities[i].down) {
					this.entities[i].down(pos);
				}
			}
		};

		this.add = function add(entity) {
			if (entity.setScene) {
				entity.setScene(this);
			}

			if (entity instanceof Animation) {
				this.animations.push(entity);
			} else {
				this.entities.push(entity);
			}
		};

		this.remove = function remove(entity) {
			if (entity instanceof Animation) {
				util.arrayRemove(this.animations, entity);
			} else {
				util.arrayRemove(this.entities, entity);
			}
		};

		this.getSceneTimer = function getSceneTimer() {
			return this.sceneTimer;
		};

		this.setSceneTimer = function setSceneTimer(pTime) {
			this.sceneTimer = pTimer;
		};

		this.draw = function draw(ctx) {
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

		this.update = function update(delta) {
			var i;

			this.sceneTimer += delta;

			this.entities.sort(function(a, b) {
				if (typeof a.position != 'undefined' && typeof b.position != 'undefined') {
					return a.position.y - b.position.y;
				} else {
					return 0;
				}
			});

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

		this.init = function init(mapfile) {
			var that = this;

			ajax.json(mapfile, function(data) {
				that.sceneTimer = 0;

				that.add(that.player = new Player());

				that.map = new Map(data, that);
				that.add(that.view = new View(that.player, config.screenWidth, config.screenHeight, that.map));
			});
		};

	};
});


