define([
	"engine/config",
	"engine/path",
	"modules/image",
	"proto/entities/characters/Enemy",
	"helper/util"
], function(config, path, image, Enemy, util) {
	return function Map(data, scene){
		this.data = data;

		this.width = 0;
		this.height = 0;

		this.tileWidth = 0;
		this.tileHeight = 0;

		// holds current damage for all object-tiles
		this.damage = null;

		this.below = null;
		this.above = null;

		this.getWidth = function getWidth(){
			return this.width;
		};

		this.getHeight = function getHeight(){
			return this.height;
		};

		this.copyMap = function copyMap(ctx, view, layer) {
			var width = Math.min(layer.width, view.getWidth()),
				height = Math.min(layer.height, view.getHeight());

			ctx.drawImage(layer, view.getX(), view.getY(), width , height, 0, 0, width , height);
		};

		this.drawBelow = function drawBelow(ctx, view) {
			this.copyMap(ctx, view, this.below);
		};

		this.drawAbove = function drawAbove(ctx, view) {
			this.copyMap(ctx, view, this.above);
		};

		this.checkCollision = function checkCollision(x, y) {
			var id;

			if (!this.data.layers[2]) {
				return false;
			}

			if (x < 0 || y < 0 || x >= this.data.width || y >= this.data.height) {
				return true;
			}

			id = (x | 0) + (y | 0) * this.data.width;

			return this.data.layers[2].data[id] > 0 ? id : false;
		};

		this.drawTile = function drawTile(index, layer) {
			var ctx = layer < 3 ? this.below.getContext('2d') : this.above.getContext('2d'),
				tileset = this.data.tilesets[0],
				tile = this.data.layers[layer].data[index] - 1,
				x = index % this.data.width,
				y = (index - x) / this.data.width;


			if (tile > -1) {
				ctx.drawImage(image.getImage(tileset.image), (tile % tileset.width) * this.tileWidth, Math.floor(tile / tileset.width) * this.tileHeight, this.tileWidth, this.tileHeight, x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);

				// tile coordinates
				if (config.debug) {
					ctx.font = "8px Arial";
					ctx.fillStyle = "black";

					if (layer === 2) {
						ctx.fillStyle = "red";
					}

					ctx.textAlign = "center";
					ctx.fillText(x + " | " + y, x * this.tileWidth + 16, y * this.tileHeight + 18);
				}

			}
		};

		this.removeObject = function removeObject(index, layer) {
			var ctx = layer < 3 ? this.below.getContext('2d') : this.above.getContext('2d'),
				tileset = this.data.tilesets[0],
				tile = this.data.layers[layer].data[index] - 1,
				x = index % this.data.width,
				y = (index - x) / this.data.width,
				i;

			//ctx.clearRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);

			// redraw stuff that was cleared with clearRect
			for (i = 0; i < this.data.layers.length; i++) {
				if (data.layers[i].type === 'tilelayer') {
					this.drawTile(index, i);
				}
			}
		};

		this.init = function init(data, scene) {
			var tw = this.tileWidth = this.data.tilewidth,
				th = this.tileHeight = this.data.tileheight,
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

					for (x = 0; x < data.width; x++)
						for (y = 0; y < data.height; y++) {
							this.drawTile(x + (y * data.width), i);
						}
				} else {
					layer = data.layers[i].objects;

					for (j = 0; j < layer.length; j++) {
						if (layer[j].type != 'player') {
							scene.add(new Enemy(layer[j].x, layer[j].y));
						} else {
							scene.player.position.x = layer[j].x;
							scene.player.position.y = layer[j].y;
						}

					}
					//scene.ui.setVictims(layer.length-1);
				}
			}

			// init pathfinding-grid with layer 2 (objects)
			//path.init(this.data.width, this.data.height, data.layers[2].data);
		};

		// init
		this.init(data, scene);
	};
});
