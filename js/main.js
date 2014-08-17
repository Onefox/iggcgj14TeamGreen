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
	var imgList = ['player.png', 'elorzms.png', 'haunter.png', 'jerome.png', 'light.png', 'bottle.png', 'effects/bottle_break.png', 'lina.png', 'olaf.png', 'sprite_sheet_props.png', 'wraith.png', 'dog.png', 'ghost.png', 'effects/fear_0.png', 'effects/fear_1.png', 'effects/fear_2.png', 'effects/fear_3.png', 'keg.png', 'pot.png', 'effects/wall_destroy.png', 'water.png', 'effects/poof.png', "effects/stunn.png"];


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
			interval,
			timer1,
			timer2,
			timer3,
			x = 0,
			i = 50,
			key,
			next;


		window.teleTimeout = null;

		dom.get('loading').style.display = 'none';

		config.running = false;


		listener = window.addEventListener("keydown", function(e) {
			key = true;
		}, false);
		window.addEventListener("keyup", function(e) {
			key = false;
		}, false);
		var gamepad;

		interval = setInterval(function() {
			if (navigator.getGamepads) {
				gamepad = navigator.getGamepads()[0];
			} else {
				gamepad = false;
			}

			if (true){
				//console.log(navigator.getGamepads()[0].buttons[0]);
				i++;
				if (key || gamepad && (navigator.getGamepads()[0].buttons[0].pressed || navigator.getGamepads()[0].buttons[1].pressed
					|| navigator.getGamepads()[0].buttons[2].pressed || navigator.getGamepads()[0].buttons[3].pressed
					|| navigator.getGamepads()[0].buttons[4].pressed || navigator.getGamepads()[0].buttons[5].pressed
					|| navigator.getGamepads()[0].buttons[6].pressed || navigator.getGamepads()[0].buttons[7].pressed
					|| navigator.getGamepads()[0].buttons[8].pressed || navigator.getGamepads()[0].buttons[9].pressed
					|| navigator.getGamepads()[0].buttons[10].pressed || navigator.getGamepads()[0].buttons[11].pressed
					|| navigator.getGamepads()[0].buttons[12].pressed || navigator.getGamepads()[0].buttons[13].pressed
					|| navigator.getGamepads()[0].buttons[14].pressed || navigator.getGamepads()[0].buttons[15].pressed
					|| navigator.getGamepads()[0].buttons[16].pressed)) {

					if (i > 50) {
						i = 0;
						switch (x) {
						case 0:
							dom.addClass(dom.get("info"), "display-none");
							break;
						case 1:
							dom.addClass(dom.get("intro1"), "display-none");
							break;
						case 2:
							dom.addClass(dom.get("intro2"), "display-none");
							break;
						case 3:
							dom.addClass(dom.get("help1"), "display-none");
							break;
						case 4:
							dom.addClass(dom.get("help2"), "display-none");
							window.removeEventListener("keydown", listener, false);
							clearInterval(interval);
							config.running = true;
							break;
						}

						x++;
					}
				}
			}
		}, 10);


		window.fear = 0;
		window.foundBall = false;

		keyboard.init();
		game.init();
	});
});