module.exports = function(transforms) {

	function parseVersion(versionString) {
		return parseInt(versionString.substring(1));
	}

	function downgradeData(data, from, to) {
		from = parseVersion(from);
		to = parseVersion(to);
		//console.log('transforming data ', from, '  ', to, data);
		for (var version = from; version > to; version--) {
			//console.log('performing from ', version, 'to ', (version-1));
			data = transforms['v' + version]['V' + version + 'toV' + (version-1)].transform(data);
		}
		return data;
	}

	function getTransformFunctionForStream(from, to) {
		return function(data) {
			return downgradeData(data, from, to);
		};
	}

	function upgradeData(data, from, to) {
		//should call and upgrade functions for one instance using saved data
		return data;
	}

	function prepareDowngrade(ids, fromVersion, toVersion) {
		//should call all init upgrade initialize functions and save to status
		//if id is not specified - call for all id's
	}

	function prepareUpgrade(ids, fromVersion, toVersion) {
		//should call all init upgrade initialize functions and save to status
	}

	return {
		prepareDowngrade: prepareDowngrade,
		prepareUpgrade: prepareUpgrade,
		downgradeData: downgradeData,
		upgradeData: upgradeData,
		getTransformFunctionForStream: getTransformFunctionForStream
	};
};