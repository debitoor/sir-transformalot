var async = require('async');
var through2 = require('through2');

module.exports = function(transforms) {

	function parseVersion(versionString) {
		return parseInt(versionString.substring(1));
	}

	function _downgradeReadyData(data, fromVersion, toVersion, preparedData) {
		for (var version = fromVersion; version > toVersion; version--) {
			var transformationCode = 'V' + version + 'toV' + (version-1);
			data = transforms['v' + version][transformationCode].transform(data, preparedData[transformationCode]);
		}
		return data;
	}

	function downgradeObject(id, data, fromVersion, toVersion, mongo, callback) {
		fromVersion = parseVersion(fromVersion);
		toVersion = parseVersion(toVersion);
		_prepareDowngrade([id], fromVersion, toVersion, mongo, function(err, preparedData) {
			if (err) {
				return callback(err);
			}
			var downgradedData = _downgradeReadyData(data, fromVersion, toVersion, preparedData);
			return callback(null, downgradedData);
		});
	}

	function getDowngradeStream(fromVersion, toVersion, mongo) {
		fromVersion = parseVersion(fromVersion);
		toVersion = parseVersion(toVersion);
		var preparedDataSets = null;
		return through2.obj(function(obj, encoding, callback){
			var through = this;
			if(!preparedDataSets) {
				_prepareDowngrade(null, fromVersion, toVersion, mongo, function(err, _preparedDataSets){
					preparedDataSets = _preparedDataSets;
					through.push(_downgradeReadyData(obj, fromVersion, toVersion, preparedDataSets));
					callback();
				});
			} else {
				through.push(_downgradeReadyData(obj, fromVersion, toVersion, preparedDataSets));
				callback();
			}
		});
	}

	function _prepareDowngrade(id, fromVersion, toVersion, mongo, callback) {
		var tasks = {};
		for (var version = fromVersion; version > toVersion; version--) {
			var transformationCode = 'V' + version + 'toV' + (version-1);
			tasks[transformationCode] = createDowngradeTask(id, version, transformationCode, mongo);
		}
		async.parallel(tasks, callback);
	}

	function createDowngradeTask(id, _version, _transformationCode, mongo) {
		return function(cb) {
			transforms['v' + _version][_transformationCode].prepareDowngrade(id, mongo, cb);
		};
	}

	//function prepareUpgrade(ids, fromVersion, toVersion, callback) {
	//	//should call all init upgrade initialize functions and save to status
	//}

	return {
		downgradeObject: downgradeObject,
		getDowngradeStream: getDowngradeStream
	};
};