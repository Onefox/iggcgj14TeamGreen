define([
	"EasyStar",
	"helper/util"
], function(EasyStar, util) {
	return {
		easystar: null,
		grid: null,
		width: null,
		height: null,

		init: function init(width, height, tiles) {
			var x,
				y,
				i;

			this.width = width;
			this.height = height;
			this.easystar = new EasyStar.js();
			this.grid = util.array2d(width, height);

			for (x = 0; x < this.width; x++) {
				for (y = 0; y < this.width; y++) {
					this.grid[x][y] = tiles[util.twoToOneDim(x, y, width)] > 0 ? 1 : 0;
				}
			}

			this.easystar.setGrid(this.grid);

			console.log(this.grid);
			/*for (i = 0; i < tiles.length; i++) {
				if (tiles[i] !== 0) {
					this.setWalkable(i, false);
				}
			}*/
		},

		setWalkable: function setWalkable(index, walkable) {
			var pos = util.oneToTwoDim(index, this.width, this.height);

			//this.grid.setWalkableAt(pos.x, pos.y, walkable);
		}
	};
});