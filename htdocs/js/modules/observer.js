define([
	"proto/Observer"
], function(Observer) {
	var observerModel = {
		list: {},

		/*
		 * Returns a (new if non-existent) observer from our list.
		 * @return {String} name The name of the observer
		 */
		get: function get(name) {
			if (!this.list[name]) {
				this.list[name] = new Observer(name);
			}

			return this.list[name];
		},

		/*
		 * Removes observer from our list.
		 * @param {String} name The name of the observer
		 */
		remove: function remove(name) {
			delete this.list[name];
		}
	};

	return observerModel;
});