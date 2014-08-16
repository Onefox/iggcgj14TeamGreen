define([
], function() {
	var image = {
		sources: {},
		images: [],

		add: function add(imgList, callback) {
			var i,
				img,
				string,
				loadedImages = 0,
				onload = function onload() {
					loadedImages++;

					if (loadedImages === i) {
						callback();
					}
				};

			for (i = 0; i < imgList.length; i++) {
				this.sources[imgList[i]] = i;

				img = new Image();

				img.onload = onload;

				if (imgList[i].indexOf("img") === -1) {
					img.src = "img/" + imgList[i];
				} else {
					img.src = imgList[i];
				}

				this.images.push(img);
			}
		},

		getId: function getId(src) {
			var that = this;

			// may occur that picture isn't in our list yet
			if (this.sources[src] === null || this.sources[src] === "undefined") {
				console.log("Error: " + src + " does not exist.", this.sources, this.images);
			} else {
				return this.sources[src];
			}
		},

		getImage: function getImage(name) {
			return this.images[this.sources[name]];
		}
	};

	return image;
});