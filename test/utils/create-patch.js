var xtend = require('xtend');

module.exports = function(templates, omits) {
	if (! Array.isArray(templates)) {
		templates = [templates];
	}

	omits = Array.isArray(omits) ? omits : [omits];

	var boilerplate = {
		version: 'v0',
		initialize: function(context, done) {// optional
			var err;
			done(err, context);
		},
		up: function(data, context) {
			return data;
		},
		down: function(data, context) {
			return data;
		},
		docs: {
			message: 'n/a'
		}
	};

	return templates.map(function(patch) {
		patch = xtend(boilerplate, patch);
		omits.forEach(function(omit) {
			delete patch[omit];
		});
		return patch;
	});
};
