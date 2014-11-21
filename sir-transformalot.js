var async = require('async');
var through2 = require('through2');

module.exports = function(transforms) {

	function parseVersion(versionString) {
		return parseInt(versionString.substring(1));
	}

	function _transformReadyData(data, fromVersion, toVersion, preparedData) {
		var version, transformationCode;
		if (fromVersion < toVersion) {
			for (version = fromVersion; version < toVersion; version++) {
				transformationCode = 'V' + version + 'toV' + (version + 1);
				data = transforms['v' + (version + 1)][transformationCode].transform(data, preparedData[transformationCode]);
			}
		} else if (fromVersion > toVersion) {
			for (version = fromVersion; version > toVersion; version--) {
				transformationCode = 'V' + version + 'toV' + (version - 1);
				data = transforms['v' + version][transformationCode].transform(data, preparedData[transformationCode]);
			}
		}
		return data;
	}

	function transformObject(id, data, fromVersion, toVersion, mongo, callback) {
		fromVersion = parseVersion(fromVersion);
		toVersion = parseVersion(toVersion);
		_prepareTransform([id], fromVersion, toVersion, mongo, function(err, preparedData) {
			if (err) {
				return callback(err);
			}
			var transformedData = _transformReadyData(data, fromVersion, toVersion, preparedData);
			return callback(null, transformedData);
		});
	}

	function getTransformStream(fromVersion, toVersion, mongo) {
		fromVersion = parseVersion(fromVersion);
		toVersion = parseVersion(toVersion);
		var preparedDataSets = null;
		return through2.obj(function(obj, encoding, callback){
			var through = this;
			if(!preparedDataSets) {
				_prepareTransform(null, fromVersion, toVersion, mongo, function(err, _preparedDataSets){
					preparedDataSets = _preparedDataSets;
					through.push(_transformReadyData(obj, fromVersion, toVersion, preparedDataSets));
					callback();
				});
			} else {
				through.push(_transformReadyData(obj, fromVersion, toVersion, preparedDataSets));
				callback();
			}
		});
	}

	function _prepareTransform(id, fromVersion, toVersion, mongo, callback) {
		var version, transformationCode;
		var tasks = {};
		if (fromVersion < toVersion) {
			for (version = fromVersion; version < toVersion; version++) {
				transformationCode = 'V' + version + 'toV' + (version + 1);
				tasks[transformationCode] = createPrepareTransformTask(id, version + 1, transformationCode, mongo);
			}
			async.parallel(tasks, callback);
		} else if (fromVersion > toVersion) {
			for (version = fromVersion; version > toVersion; version--) {
				transformationCode = 'V' + version + 'toV' + (version - 1);
				tasks[transformationCode] = createPrepareTransformTask(id, version, transformationCode, mongo);
			}
			async.parallel(tasks, callback);
		} else {
			callback();
		}
	}

	function createPrepareTransformTask(id, _version, _transformationCode, mongo) {
		return function(cb) {
			transforms['v' + _version][_transformationCode].prepareTransform(id, mongo, cb);
		};
	}

	return {
		transformObject: transformObject,
		getTransformStream: getTransformStream
	};
};