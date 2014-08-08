var sound = {
	sampels: [],

	mp3: function() {
		var audio = new Audio();
		return !!audio.canPlayType && audio.canPlayType('audio/mpeg') != "";
	},

	play: function( file ) {
		var self = this;

		if(this.mp3()) file = file.replace(/ogg/g, "mp3");

		if( !this.sampels[file] )
			this.sampels[file] = [];

		if( this.sampels[file].length ) {
			var sound = this.sampels[file].pop();
			sound.play();
			return sound;
		} else {
			var sound = new Audio( file );
			sound.onended = function() { self.sampels[file].push( this ); };
			sound.play();
			return sound;
		}
	},

	preload: function( file, times ) {
		var self = this;
		if(this.mp3()) file = file.replace(/ogg/g, "mp3");
		this.sampels[file] = [];

		for( var i = 0; i < times; i++ ) {
			var sound = new Audio( file );
			sound.onended = function() { self.sampels[file].push( this ); };
			self.sampels[file].push( sound );
		}
	}
}