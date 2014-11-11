var async = require('async');

module.exports = function(transforms) {

	function parseVersion(versionString) {
		return parseInt(versionString.substring(1));
	}

	function downgradeData(data, fromVersion, toVersion, preparedData) {
		for (var version = fromVersion; version > toVersion; version--) {
			var transformationCode = 'V' + version + 'toV' + (version-1);
			data = transforms['v' + version][transformationCode].transform(data, preparedData[transformationCode]);
		}
		return data;
	}

	function downgradeObject(id, data, fromVersion, toVersion, callback) {
		fromVersion = parseVersion(fromVersion);
		toVersion = parseVersion(toVersion);
		prepareDowngrade([id], fromVersion, toVersion, function(err, preparedData) {
			if (err) {
				return callback(err);
			}
			//console.log('preparedData', preparedData);
			var downgradedData = downgradeData(data, fromVersion, toVersion, preparedData);
			return callback(null, downgradedData);
		});
	}

	function getTransformFunctionForStream(fromVersion, toVersion, callback) {
		fromVersion = parseVersion(fromVersion);
		toVersion = parseVersion(toVersion);
		prepareDowngrade(null, fromVersion, toVersion, function(err, preparedData) {
			if(err) {
				return callback(err);
			}
			return callback(null, function(data) {
				return downgradeData(data, fromVersion, toVersion, preparedData);
			});
		});

	}

	//function upgradeData(data, from, to) {
	//	//should call and upgrade functions for one instance using saved data
	//	return data;
	//}

	//ToDo: remove ids
	function prepareDowngrade(ids, fromVersion, toVersion, callback) { //ToDo: add mongo
		var tasks = {};
		for (var version = fromVersion; version > toVersion; version--) {
			var transformationCode = 'V' + version + 'toV' + (version-1);
			tasks[transformationCode] = createDowngradeTask(ids, version, transformationCode);
		}
		async.parallel(tasks, callback);
	}

	function createDowngradeTask(ids, _version, _transformationCode) {
		return function(cb) {
			transforms['v' + _version][_transformationCode].prepareDowngrade(ids, cb);
		};
	}

	//function prepareUpgrade(ids, fromVersion, toVersion, callback) {
	//	//should call all init upgrade initialize functions and save to status
	//}

	return {
		downgradeObject: downgradeObject,
		getTransformFunctionForStream: getTransformFunctionForStream
	};
};