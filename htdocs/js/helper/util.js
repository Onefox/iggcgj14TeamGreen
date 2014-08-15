define([
	"engine/config"
], function(config) {
	var util = {
		doWhen: function doWhen(condition, callback) {
			if (condition()) {
				callback();
			} else {
				setTimeout(function() {
					doWhen(condition, callback);
				}, 20);
			}
		},

		array2d: function array2d(cols, rows) {
			var array = new Array(cols),
				x,
				y;

			// create second array
			for (i = 0; i < cols; i++) {
				array[i] = new Array(rows);
			}

			// set content of each cell to null
			for (x = 0; x < cols; x++) {
				for (y = 0; y < rows; y++) {
					array[x][y] = null;
				}
			}

			return array;
		},

		arrayRemove: function arrayRemove(arr, element) {
			var i = arr.indexOf(element);

			if (i > -1) {
				arr.splice(i, 1);
			}
		},

		oneToTwoDim: function oneToTwoDim(index, optWidth, optHeight) {
			var width = optWidth ? optWidth : window.game.scene.map.data.width,
				height = optHeight ? optHeight : window.game.scene.map.data.height,
				x = index % width;

			return {
				x: x,
				y: (index - x) / height
			};
		},

		twoToOneDim: function twoToOneDim(x, y, optWidth) {
			var width = optWidth ? optWidth : window.game.scene.map.data.width;

			return y * width + x;
		},

		tileCanBeThrown: function tileCanBeThrown(id) {
			var throwable = [106];

			return throwable.indexOf(id) !== -1;
		}
	};

	return util;
});