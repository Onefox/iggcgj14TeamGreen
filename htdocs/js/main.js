require.config({
	baseUrl: 'js',
	paths: {
		EasyStar: 'libs/easystar-0.1.8.min'
	},
	shim: {
		EasyStar: {
			exports: 'EasyStar'
		}
	}
});

require([
	'engine/config',
	'engine/game',
	'helper/dom',
	'modules/image',
	'modules/keyboard',
], function(config, game, dom, image, keyboard) {
	var imgList = ['player.png', 'elorzms.png', 'haunter.png', 'jerome.png', 'light.png', 'bottle.png', 'effects/bottle_break.png', 'lina.png', 'olaf.png', 'sprite_sheet_props.png', 'wraith.png', 'dog.png', 'ghost.png', 'effects/fear_0.png', 'effects/fear_1.png', 'effects/fear_2.png', 'effects/fear_3.png', 'keg.png', 'pot.png', 'effects/wall_destroy.png'];

	// request-animation-frame-polyfill
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( callback, element ){
				window.setTimeout(callback, 25);
			};
	})();

	// creatresize-event-listener
	window.onresize = function() {
		var canvas = dom.get('#canvas');

		config.screenWidth = window.innerWidth;
		config.screenHeight = window.innerHeight;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		/*if (window.game.map) {
			window.game.map.below.width = window.game.map.above.width = window.game.map.width = config.screenWidth;
			window.game.map.below.height = window.game.map.above.height = window.game.map.height = config.screenHEight;
		}*/
	};

	// call resize-event once
	window.onresize();

	// preload images
	image.add(imgList, function() {
		var listener,
			interval;


		window.teleTimeout = null;

		dom.get('loading').style.display = 'none';

		config.running = false;

		window.setTimeout(function() {
			dom.addClass(dom.get("intro1"), "display-none");

			window.setTimeout(function() {
				dom.addClass(dom.get("intro2"), "display-none");

				listener = window.addEventListener("keydown", function(e) {
					if (e.keyCode === 32) {
						config.running = true;

						dom.addClass(dom.get("info"), "display-none");
						window.removeEventListener("keydown", listener, false);
					}
				}, false);

				/*if (navigator.getGamepads) {
					interval = setInterval(function() {
						if (navigator.getGamepads[0]){
							console.log(navigator.getGamepads()[0].buttons[0]);
							if (navigator.getGamepads()[0].buttons[0].pressed) {
								config.running = true;

								dom.addClass(dom.get("info"), "display-none");

								clearInterval(interval);
							}
						}
					}, 10);
				}*/
			}, 3400);
		}, 1800);

		keyboard.init();
		game.init();
	});
});