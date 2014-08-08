define([
	"EasyStar",
	"helper/util"
], function(EasyStar, util) {
	return {
		easystar: null,
		grid: null,
		width: null,
		height: null,

		init: function init(width, height, objects) {
			var x,
				y,
				i;

			this.width = width;
			this.height = height;
			this.easystar = new EasyStar.js();
			this.grid = util.array2d(width, height);

			for (x = 0; x < this.height; x++) {
				for (y = 0; y < this.width; y++) {
					// warning: easystar uses this order: [y][x]
					this.grid[y][x] = objects[util.twoToOneDim(x, y, width)] > 0 ? 1 : 0;
				}
			}

			this.easystar.setGrid(this.grid);
			this.easystar.setAcceptableTiles([0]);
			this.easystar.setIterationsPerCalculation(1000);
			this.easystar.enableDiagonals();

			// debugging
			window.path = this;
		},

		setWalkable: function setWalkable(index, walkable) {
			var pos = util.oneToTwoDim(index, this.width, this.height);

			this.grid[pos.y][pos.x] = walkable ? 0 : 1;

			this.easystar.setGrid(this.grid);
		}
	};
});