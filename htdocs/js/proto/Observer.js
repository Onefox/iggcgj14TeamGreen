define([
], function() {
	var Observer = function () {
		this.stack = [];
	};

	Observer.prototype.subscribe = function subscribe(callback) {
		this.stack.push(callback);
	};

	Observer.prototype.publish = function publish(data) {
		var i;

		for (i = 0; i < this.stack.length; i++) {
			this.stack[i](data);
		}
	};

	return Observer;
});