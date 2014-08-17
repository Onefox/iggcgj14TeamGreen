define([
], function() {
	return {
		init: function init() {
			var that = this;

			document.onkeydown = function onkeydown(e) {
				that.down(e);

				if (e.keyCode === 32) {
					e.preventDefault();
				}
			};

			document.onkeyup = function onkeyup(e) {
				that.up(e);
			};
		},

		emit: function emit(type, key) {
			if (window.game.scene && window.game.scene[type]) {
				window.game.scene[type](key);
			}
		},

		translate: function translate(type, code) {
			switch(code) {
				case 116:
					// F5
					return true;
				case 32:
					this.emit( type, 'space' );
					break;
				case 27:
					this.emit( type, 'esc' );
					break;
				case 13:
					this.emit( type, 'enter' );
					break;
				case 38:
				case 87:
					this.emit( type, 'up' );
					break;
				case 40:
				case 83:
					this.emit( type, 'down' );
					break;
				case 37:
				case 65:
					this.emit( type, 'left' );
					break;
				case 39:
				case 68:
					this.emit( type, 'right' );
					break;
				case 70:
					this.emit( type, 'switch' );
					break;
				case 74:
					this.emit( type, 'e_use' );
					break;
				case 75:
					this.emit( type, 'action2' );
					break;


				//Weapons
				/*case 49: this.emit( type, 1 ); break;
				case 50: this.emit( type, 2 ); break;
				case 51: this.emit( type, 3 ); break;
				case 52: this.emit( type, 4 ); break;
				case 53: this.emit( type, 5 ); break;
				case 54: this.emit( type, 6 ); break;*/
			}

			return false;
		},

		down: function down(evt) {
			evt = (evt) ? evt : ((event) ? event : null);

			return this.translate('down', evt.keyCode);

		},

		up: function up(evt) {
			evt = (evt) ? evt : ((event) ? event : null);

			return this.translate('up', evt.keyCode);
		}
	};
});