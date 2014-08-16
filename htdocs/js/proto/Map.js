define([
	"engine/config",
	"engine/path",
	"modules/image",
	"proto/entities/characters/Enemy",
	"proto/entities/characters/Ghost",
	"proto/entities/characters/Wraith",
	"proto/entities/characters/Haunter",
	"proto/entities/characters/Dog",
	"proto/V2",
	"helper/util",
	"proto/entities/characters/InativePlayers"
], function(config, path, image, Enemy, Ghost, Wraith, Haunter, Dog, V2, util, InactivePlayer) {
	var Map = function Map(data, scene) {
		this.data = data;

		this.width = 0;
		this.height = 0;

		this.tileWidth = 0;
		this.tileHeight = 0;

		// holds current damage for all object-tiles
		this.damage = null;

		// marks teleports (loads new json-level)
		this.teleport = [];

		this.below = null;
		this.above = null;

		// init
		this.init(data, scene);
	};

	Map.prototype.getWidth = function getWidth(){
		return this.width;
	};

	Map.prototype.getHeight = function getHeight(){
		return this.height;
	};

	Map.prototype.copyMap = function copyMap(ctx, view, layer) {
		var width = Math.min(layer.width, view.getWidth()),
			height = Math.min(layer.height, view.getHeight());

		ctx.drawImage(layer, view.getX(), view.getY(), width , height, 0, 0, width , height);
	};

	Map.prototype.drawBelow = function drawBelow(ctx, view) {
		this.copyMap(ctx, view, this.below);
	};

	Map.prototype.drawAbove = function drawAbove(ctx, view) {
		this.copyMap(ctx, view, this.above);
	};

	Map.prototype.checkCollision = function checkCollision(x, y) {
		var id;
		if (!this.data.layers[3]) {
			return false;
		}

		if (x < 0 || y < 0 || x >= this.data.width || y >= this.data.height) {
			return true;
		}

		id = (x | 0) + (y | 0) * this.data.width;

		return this.data.layers[3].data[id] > 0 ? id : false;
	};

	Map.prototype.drawTile = function drawTile(index, layer) {
		var ctx = layer < 5 ? this.below.getContext('2d') : this.above.getContext('2d'),
			tileset = this.data.tilesets[0],
			tile = this.data.layers[layer].data[index] - 1,
			x = index % this.data.width,
			y = (index - x) / this.data.width;

		if (tile > -1) {
			ctx.drawImage(image.getImage(tileset.image), (tile % tileset.width) * this.tileWidth, Math.floor(tile / tileset.width) * this.tileHeight, this.tileWidth, this.tileHeight, x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);

			// tile coordinates
			/*if (config.debug) {
				ctx.font = "8px Arial";
				ctx.fillStyle = "black";

				if (layer === 2) {
					ctx.fillStyle = "red";
				}

				ctx.textAlign = "center";
				ctx.fillText(x + " | " + y, x * this.tileWidth + 16, y * this.tileHeight + 18);
			}*/
		}
	};

	Map.prototype.redrawAt = function redrawAt(ctx, index, x, y) {
		var i;

		// redraw stuff that was cleared with clearRect
		for (i = 0; i < this.data.layers.length; i++) {
			if (this.data.layers[i].type === 'tilelayer') {
				this.drawTile(index, i);
			}
		}
	};

	Map.prototype.removeObject = function removeObject(index, layer) {
		var ctx = layer < 4 ? this.below.getContext('2d') : this.above.getContext('2d'),
			tileset = this.data.tilesets[0],
			tile = this.data.layers[layer].data[index] - 1,
			x = index % this.data.width,
			y = (index - x) / this.data.width,
			coord;

		// set id 0
		this.data.layers[layer].data[index] = 0;


		this.redrawAt(index);
		this.redrawAt(ctx, util.twoToOneDim(x, y), x, y, false);
	};

	Map.prototype.init = function init(data, scene) {
		var tw = this.tileWidth = this.data.tilewidth,
			th = this.tileHeight = this.data.tileheight,
			enemyId = 0,
			that = this,
			tileset,
			layer,
			img,
			i,
			j,
			x,
			y;

		this.width = this.data.width * tw;
		this.height = this.data.height * th;

		this.damage = new Array(this.data.width);

		this.below = document.createElement('canvas');
		this.above = document.createElement('canvas');
		this.below.width = this.above.width = this.width;
		this.below.height = this.above.height = this.height;

		// change tilesets
		for (i = 0; i < data.tilesets.length; i++) {
			data.tilesets[i].width = data.tilesets[i].imagewidth / tw;
			data.tilesets[i].image = data.tilesets[i].image.substring(data.tilesets[i].image.lastIndexOf('/') + 1, data.tilesets[i].length);
		}

		// tiles and entities
		for (i = 0; i < data.layers.length; i++ ) {
			if (data.layers[i].data) {
				layer = data.layers[i].data;

				for (x = 0; x < data.width; x++) {
					for (y = 0; y < data.height; y++) {
						this.drawTile(x + (y * data.width), i);
					}
				}
			} else {
				layer = data.layers[i].objects;

				for (j = 0; j < layer.length; j++) {

					switch (layer[j].name) {
						case 'player':
							if (!game.player) {
							scene.player.position.x = layer[j].x;
							scene.player.position.y = layer[j].y;
							scene.add(game.inactivePlayer = scene.inactivePlayer = new InactivePlayer(layer[j].x + 20, layer[j].y + 20));
							scene.add(game.inactivePlayer2 = scene.inactivePlayer2 = new InactivePlayer(scene.inactivePlayer.position.x + 20, scene.inactivePlayer.position.y + 20));
							scene.inactivePlayer2.setName('olaf');
							game.player = scene.player;
						}
							break;

						case 'tele':
							var string = layer[j].type;
							var startX = string.substring(string.indexOf("_") + 1, string.indexOf("|"));
							var startY = string.substring(string.indexOf("|") + 1, string.indexOf("+"));
							var endX = string.substring(string.indexOf("+") +1, string.lastIndexOf("|"));
							var endY = string.substring(string.lastIndexOf("|") + 1, string.length);

							this.teleport.push({
								scene: string.substring(0, string.indexOf("_")),
								startX: parseInt(startX, 10),
								startY: parseInt(startY, 10),
								endX: parseInt(endX, 10),
								endY: parseInt(endY, 10)
							});

							break;

						case 'wraith':
							scene.add(new Wraith(layer[j].x, layer[j].y, enemyId));
							enemyId++;
							break;

						case 'dog':
							scene.add(new Dog(layer[j].x, layer[j].y, enemyId));
							enemyId++;
							break;

						case 'haunter':
							scene.add(new Haunter(layer[j].x, layer[j].y, enemyId));
							enemyId++;
							break;

						case 'ghost':
							scene.add(new Ghost(layer[j].x, layer[j].y, enemyId));
							enemyId++;
							break;

						case 'ball':
							x = Math.floor(layer[j].x / this.tileWidth);
							y = Math.floor(layer[j].y / this.tileHeight);
							game.ball = new V2(x, y);
							game.ball.scene = 4;
							break;

						default:
							break;
					}

				}
				//scene.ui.setVictims(layer.length-1);
			}
		}

		// init pathfinding-grid with layer 2 (objects)
		//path.init(this.data.width, this.data.height, data.layers[2].data);
	};

	return Map;
});
