var versions = require('./lib/versions');
var patches = require('./lib/prepareToTransform');

function transformFactory(transforms) {
	if (!Array.isArray(transforms)) {
		throw new Error('transforms should be an array');
	}
	transforms = versions.sort(transforms);

	if (transforms.length) {
		var latestVersion = transforms[transforms.length - 1].version;
	}

	return {
		upgradeData: function(target, callback) {
			// "go up from target to latest version"
			var range = versions.range(transforms, target, latestVersion);

			// initialize a transformation range and return a transformation
			// function that can do the actual transformation on data
			patches.initializeAll(range, function(err, context) {
				if (err) {
					return callback(err);
				}
				return callback(null, function(data) {
					if (!data) {
						throw new Error('Called with no data');
					}
					range.forEach(function(patch) {
						patch.upgradeData(data, context);
					});
					return data;
				});
			});
		},
		downgradeData: function(target, callback) {
			// "go down from latest version to target"
			var range = versions.range(transforms, latestVersion, target);

			// initialize a transformation range and return a transformation
			// function that can do the actual transformation on data
			patches.initializeAll(range, function(err, context) {
				if (err) {
					return callback(err);
				}
				return callback(null, function(data) {
					if (!data) {
						throw new Error('Called with no data');
					}
					range.forEach(function(patch) {
						patch.downgradeData(data, context);
					});
					return data;
				});
			});
		}
	};
}

module.exports = transformFactory;
