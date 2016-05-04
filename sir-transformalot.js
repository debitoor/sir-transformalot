var async = require('async');
var through2 = require('through2');

module.exports = function(transforms) {

	function parseVersion(versionString) {
		return parseInt(versionString.substring(1));
	}

	function _transformReadyData(data, fromVersion, toVersion, preparedData, additionalData) {
		var version, transformationCode;
		if (fromVersion < toVersion) {
			for (version = fromVersion; version < toVersion; version++) {
				transformationCode = 'V' + version + 'toV' + (version + 1);
				data = transforms['v' + (version + 1)][transformationCode].transform(data, preparedData[transformationCode], additionalData);
			}
		} else if (fromVersion > toVersion) {
			for (version = fromVersion; version > toVersion; version--) {
				transformationCode = 'V' + version + 'toV' + (version - 1);
				data = transforms['v' + version][transformationCode].transform(data, preparedData[transformationCode], additionalData);
			}
		}
		return data;
	}

	function transformObject(id, data, fromVersion, toVersion, mongo, additionalData, callback) {
		if (typeof additionalData === 'function') {
			callback = additionalData;
			additionalData = null;
		}
		fromVersion = parseVersion(fromVersion);
		toVersion = parseVersion(toVersion);
		_prepareTransform([id], fromVersion, toVersion, mongo, additionalData, function(err, preparedData) {
			if (err) {
				return callback(err);
			}
			var transformedData = _transformReadyData(data, fromVersion, toVersion, preparedData, additionalData);
			return callback(null, transformedData);
		});
	}

	function getTransformStream(fromVersion, toVersion, mongo, additionalData) {
		fromVersion = parseVersion(fromVersion);
		toVersion = parseVersion(toVersion);
		var preparedDataSets = null;
		return through2.obj(function(obj, encoding, callback){
			var through = this;
			if(!preparedDataSets) {
				_prepareTransform(null, fromVersion, toVersion, mongo, additionalData, function(err, _preparedDataSets){
					preparedDataSets = _preparedDataSets;
					through.push(_transformReadyData(obj, fromVersion, toVersion, preparedDataSets, additionalData));
					callback();
				});
			} else {
				through.push(_transformReadyData(obj, fromVersion, toVersion, preparedDataSets, additionalData));
				callback();
			}
		});
	}

	function _prepareTransform(id, fromVersion, toVersion, mongo, additionalData, callback) {
		var version, transformationCode;
		var tasks = {};
		if (fromVersion < toVersion) {
			for (version = fromVersion; version < toVersion; version++) {
				transformationCode = 'V' + version + 'toV' + (version + 1);
				tasks[transformationCode] = createPrepareTransformTask(id, version + 1, transformationCode, mongo, additionalData);
			}
			async.parallel(tasks, callback);
		} else if (fromVersion > toVersion) {
			for (version = fromVersion; version > toVersion; version--) {
				transformationCode = 'V' + version + 'toV' + (version - 1);
				tasks[transformationCode] = createPrepareTransformTask(id, version, transformationCode, mongo, additionalData);
			}
			async.parallel(tasks, callback);
		} else {
			callback();
		}
	}

	function createPrepareTransformTask(id, _version, _transformationCode, mongo, additionalData) {
		var prepareTransform = transforms['v' + _version][_transformationCode].prepareTransform ||
			function (id, mongo, cb) {cb();};
		if (additionalData) {
			return prepareTransform.bind(null, id, mongo, additionalData);
		}
		return prepareTransform.bind(null, id, mongo);
	}

	return {
		transformObject: transformObject,
		getTransformStream: getTransformStream
	};
};
