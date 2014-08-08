var backgroundsound = {
	mp3: function() {
		var audio = new Audio();
		return !!audio.canPlayType && audio.canPlayType('audio/mpeg') != "";
	},

	play: function( file ) {
		var self = this;
		var type = "ogg";

		if(this.mp3()) { 
			type = "mpeg";
			file = file.replace(/ogg/g, "mp3");
		}

		if(!this.element)
		{
			this.element = document.createElement('audio');
			this.element.setAttribute('src', file);
			this.element.setAttribute('loop', 1);
			this.element.setAttribute('type', "audio/"+type);
			this.element.play();
		} else {
			this.element.setAttribute("src", file);
			this.element.play();
		}
	}
}