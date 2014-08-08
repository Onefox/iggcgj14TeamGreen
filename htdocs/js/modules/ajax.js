define([
], function() {
	return {
		load: function load(url, callback, postData) {
			var xmlHttp = new XMLHttpRequest();

			xmlHttp.open(((typeof postData == 'undefined') ? 'GET' : 'POST'), url, true);
			xmlHttp.setRequestHeader("Accept","text/plain");
			xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			xmlHttp.onreadystatechange = function onreadystatechange() {
				if (xmlHttp.readyState == 4) {
					callback(xmlHttp.responseText);
				}
			};

			xmlHttp.send(((typeof postData == 'undefined') ? null : postData));
		},

		json: function json(url, callback) {
			this.load(url, function(data) {
				callback( eval('('+data+')'));
			});
		}
	};
});