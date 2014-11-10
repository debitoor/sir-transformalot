var afterAll = require('after-all');

function initializeAll(patches, callback) {
	var context = {};
	var next = afterAll(function(err, result) {
		if (err) {
			return callback(err);
		}
		return callback(null, context);
	});

	patches.forEach(function(patch) {
		var cb = next();
		if (typeof patch.initialize === 'function') {
			return patch.initialize(context, cb);
		}
		return cb();
	});
}

module.exports.initializeAll = initializeAll;
