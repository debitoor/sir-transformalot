const async = require('async');
const through2 = require('through2');

module.exports = function(transforms) {

	function parseVersion(versionString) {
		return parseInt(versionString.substring(1));
	}

	function _transformReadyData(data, fromVersion, toVersion, preparedData, options) {
		let version, transformationCode;
		if (fromVersion < toVersion) {
			for (version = fromVersion; version < toVersion; version++) {
				transformationCode = 'V' + version + 'toV' + (version + 1);
				data = transforms['v' + (version + 1)][transformationCode].transform(data, preparedData[transformationCode], options);
			}
		} else if (fromVersion > toVersion) {
			for (version = fromVersion; version > toVersion; version--) {
				transformationCode = 'V' + version + 'toV' + (version - 1);
				data = transforms['v' + version][transformationCode].transform(data, preparedData[transformationCode], options);
			}
		}
		return data;
	}

	function transformObject(id, data, fromVersion, toVersion, mongo, options, callback) {
		if (typeof options === 'function') {
			callback = options;
			options = null;
		}
		fromVersion = parseVersion(fromVersion);
		toVersion = parseVersion(toVersion);
		_prepareTransform([id], fromVersion, toVersion, mongo, options, function(err, preparedData) {
			if (err) {
				return callback(err);
			}
			const transformedData = _transformReadyData(data, fromVersion, toVersion, preparedData, options);
			if (transformedData instanceof Error) {
				return callback(transformedData);
			}
			return callback(null, transformedData);
		});
	}

	function getTransformStream(fromVersion, toVersion, mongo, options) {
		fromVersion = parseVersion(fromVersion);
		toVersion = parseVersion(toVersion);
		let preparedDataSets = null;
		return through2.obj(function(obj, encoding, callback){
			const through = this;
			if(!preparedDataSets) {
				_prepareTransform(null, fromVersion, toVersion, mongo, options, function(err, _preparedDataSets){
					preparedDataSets = _preparedDataSets;
					through.push(_transformReadyData(obj, fromVersion, toVersion, preparedDataSets, options));
					callback();
				});
			} else {
				through.push(_transformReadyData(obj, fromVersion, toVersion, preparedDataSets, options));
				callback();
			}
		});
	}

	function _prepareTransform(id, fromVersion, toVersion, mongo, options, callback) {
		let version, transformationCode;
		const tasks = {};
		if (fromVersion < toVersion) {
			for (version = fromVersion; version < toVersion; version++) {
				transformationCode = 'V' + version + 'toV' + (version + 1);
				tasks[transformationCode] = createPrepareTransformTask(id, version + 1, transformationCode, mongo, options);
			}
			async.parallel(tasks, callback);
		} else if (fromVersion > toVersion) {
			for (version = fromVersion; version > toVersion; version--) {
				transformationCode = 'V' + version + 'toV' + (version - 1);
				tasks[transformationCode] = createPrepareTransformTask(id, version, transformationCode, mongo, options);
			}
			async.parallel(tasks, callback);
		} else {
			callback();
		}
	}

	function createPrepareTransformTask(id, _version, _transformationCode, mongo, options) {
		let prepareTransform = transforms['v' + _version][_transformationCode].prepareTransform;
		if (options) {
			prepareTransform = prepareTransform || function (id, mongo, options, cb) {cb();};
			return prepareTransform.bind(null, id, mongo, options);
		}
		prepareTransform = prepareTransform || function (id, mongo, cb) {cb();};
		return prepareTransform.bind(null, id, mongo);
	}

	function checkCompatibility(id, fromVersion, toVersion, mongo, options, callback) {
		if (typeof options === 'function') {
			callback = options;
			options = null;
		}
		fromVersion = parseVersion(fromVersion);
		toVersion = parseVersion(toVersion);
		let version, transformationCode;
		const tasks = {};
		if (fromVersion < toVersion) {
			for (version = fromVersion; version < toVersion; version++) {
				transformationCode = 'V' + version + 'toV' + (version + 1);
				tasks[transformationCode] = createCheckCompatibilityTask(id, version + 1, transformationCode, mongo, options);
			}
			async.parallel(tasks, callback);
		} else if (fromVersion > toVersion) {
			for (version = fromVersion; version > toVersion; version--) {
				transformationCode = 'V' + version + 'toV' + (version - 1);
				tasks[transformationCode] = createCheckCompatibilityTask(id, version, transformationCode, mongo, options);
			}
			async.parallel(tasks, callback);
		} else {
			callback();
		}
	}

	function createCheckCompatibilityTask(id, _version, _transformationCode, mongo, options) {
		const checkCompatibility = transforms['v' + _version][_transformationCode].checkCompatibility;
		if (!checkCompatibility) {
			return function(cb) {cb();};
		}
		if (options) {
			return checkCompatibility.bind(null, id, mongo, options);
		}
		return checkCompatibility.bind(null, id, mongo);
	}

	return {
		transformObject: transformObject,
		getTransformStream: getTransformStream,
		checkCompatibility: checkCompatibility
	};
};
