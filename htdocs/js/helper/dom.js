define([
], function() {
	var dom = {
		/*
		 * Return a node from a reference or an id
		 * @param {String || Object} node The id or class of the object to be returned
		 * @param {String || Object} optStartNode Node to begin search from
		 * @return {Object} The object
		 */
		get: function get(node, optStartNode) {
			var startNode = optStartNode ? optStartNode : document;

			// is classname or id
			if (typeof node === "string") {
				if (node[0] === "#") {
					node = startNode.getElementById(node.slice(1, node.length));
				} else {
					node = startNode.getElementsByClassName(node)[0];
				}
			}

			return node;
		},

		/*
		 * Append a dom-element to another dom-element
		 * @param {Object} parentNode The parent-element
		 * @param {Object} The object to be appended
		 * @return {Object} The parent-element
		 */
		append: function append(parentNode, appendix) {
			try {
				// get node
				parentNode = this.get(parentNode);

				// append child and return
				return parentNode.appendChild(appendix);
			} catch(e) {
				console.log("Can't append appendix: ", appendix);
			}
		},

		/*
		 * Remove child-elements
		 * @param {Object} node The element to be cleared
		 */
		clear: function clear(node) {
			// get node
			node = this.get(node);

			// for all childnodes
			while (node.hasChildNodes()) {
				// remove child
				node.removeChild(node.lastChild);
			}
		},

		/*
		 * Create an element
		 * @param {Object} element The dom-type of the element
		 * @param {String} type The type of the element, will be null if no additional type is needed
		 * @param {Object} parentNode The parent-element
		 * @param {Number} className The class-name of the element, will be null if no class shall be set
		 * @param {String} text The text to be enterd to the element, will be null if no text shall be set
		 * @return {Object} The element created
		 */
		create: function create(element, type, parentNode, className, text) {
			var node = document.createElement(element);

			//set id
			if (className !== null) {
				node.className = className;
			}

			// set type
			if (type !== null) {
				node.type = type;
			}

			// set text
			if (text !== null) {
				if (element === "input") {
					node.value = text;
				} else {
					node.innerHTML = text;
				}
			}

			// append
			node = this.append(parentNode, node);

			// return
			return node;
		},

		/*
		 * Remove an element
		 * @param {Object || String} node The element to be removed
		 */
		remove: function remove(node) {
			// get node
			node = this.get(node);

			// remove child
			document.body.removeChild(node);
		},

		/*
		 * Checks whether element is in the DOM.
		 * @param {String || Object} node The node
		 * @return {Boolean} The result
		 */
		isDefined: function isDefined(node) {
			return typeof this.get(node) === "undefined" ? false : true;
		},

		/*
		 * Checks if element has given class.
		 * @param {String || Object} node The node
		 * @param {String} name The name of the class
		 * @return {Boolean} The result
		 */
		hasClass: function hasClass(node, name) {
			//console.log(node, this.get(node));
			node = this.get(node);

			return node.className.indexOf(name) === -1 || !node ? false : true;
		},

		/*
		 * Adds a classname
		 * @param {String || Object} node The node
		 * @param {String} name The name of the class
		 */
		addClass: function remove(node, name) {
			node = this.get(node);

			if (node) {
				if (!this.hasClass(node, name)) {
					node.className += " " + name;
				}
			}
		},

		/*
		 * Removes the class from the dom-object
		 * @param {String || Object} node The node
		 * @param {String} name The name of the class
		 */
		removeClass: function remove(node, name) {
			//console.log(node, name);
			node = this.get(node);

			if (this.hasClass(node, name)) {
				node.className = node.className.replace(" " + name, "");
			}
		},

		/*
		 * Toggles the class
		 * @param {String || Object} node The node
		 * @param {String} name The name of the class
		 */
		toggleClass: function remove(node, name) {
			node = this.get(node);

			if (this.hasClass(node, name)) {
				this.removeClass(node, name);
			} else {
				this.addClass(node, name);
			}
		}
	};

	return dom;
});