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
	var imgList = ['acid.png', 'active_weapo.png', 'blood.png', 'bloodSplash.png', 'bloodStains.png',
		'bomb.png', 'bulletSplash.png', 'creditsScreen.png', 'death.png', 'explosion.png',
		'explosionDecal.png', 'extremeExplosion.png', 'grenade.png', 'helpScreen.png',
		'hero.png', 'heroRifle.png', 'heroThrower.png', 'laser.png', 'levelCompleted.png',
		'loading.gif', 'pause.png', 'scoreScreen_background.png',
		'shadow.png', 'startScreen_background.png', 'startScreen_menu.png', 'startScreen_menu_mousover.png',
		'tileSpriteSheet.png', 'tileset.png', 'time.png', 'victim1.png', 'victim1_panic.png', 'victim2.png',
		'victim2_panic.png', 'victim3.png', 'victim3_panic.png', 'victim4.png', 'victim4_panic.png',
		'victim5.png', 'victim5_panic.png', 'victims.png', 'weapon_menu.png', 'enterNameScreen.png', 'bloodStainsSmall.png',
		'story01.png', 'story02.png', 'story03.png', 'story04.png', 'player.png', 'elorzms.png', 'enemy.png'];

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
		dom.get('loading').style.display = 'none';

		keyboard.init();
		game.init();
	});
});