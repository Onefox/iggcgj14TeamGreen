define([
	"engine/config",
	"helper/util",
	"proto/V2"
], function(config,util, V2) {
	var math = {
		round: function round(x, n) {
			// do only for 1- 14 decimal places
			if (n < 1 || n > 14) {
				return false;
			} else {
				var e = Math.pow(10, n),
					k = (Math.round(x * e) / e).toString();

				if (k.indexOf('.') === -1) {
					k += '.';
				}

				k = k + e.toString().substring(1);

				return k.substring(0, k.indexOf('.') + n + 1);
			}
		},

		rand: function rand(from, to) {
			return parseInt(Math.floor(Math.random() * (to - from + 1) + from), 10);
		},

		limit: function limit( v, m ) {
			return Math.min(m, Math.max(-m, v ));
		},

		deg_to_vector: function deg_to_vector(angle, length) {
			return rad_to_vector(angle * (Math.PI / 180), length);
		},

		rad_to_vector: function rad_to_vector(angle, length) {
			var x = Math.sin(angle) * length,
				y = -Math.cos(angle) * length;

			return new V2(x, y);
		},

		rad_to_deg: function rad_to_deg(rad) {
			return rad * (180 / Math.PI);
		},

		bound: function bound(num, min, max) {
			return Math.min(Math.max(num, min), max);
		}
	};

	return math;
});