define([
	"helper/dom",
	"proto/V2"
], function(dom, V2) {
	var mouse = new V2(0, 0);

	/*window.oncontextmenu = function() {
		return false;
	};*/

	mouse.init = function init(game) {
		var that = this;
			canvas = dom.get('#shadow');

		canvas.onmousemove = function( ev ) {
			that.x = ev.clientX - canvas.offsetLeft;
			that.y = ev.clientY - canvas.offsetTop;
		};

		canvas.onclick = function( ev ) {
			if (game.scene.click) {
				game.scene.click(that);
			}
		};

		canvas.onmousedown = function( ev ) {
			if (game.scene.mousedown) {
				game.scene.mousedown(that);
			}
		};

		document.onmouseup = function( ev ) {
			if (game.scene.mouseup) {
				game.scene.mouseup(that);
			}
		};
	};

	return mouse;
});