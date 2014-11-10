var _ = require('lodash');
module.exports = function(transforms) {
	var _transforms = {};

	//for (versionString in transforms) {
	//	_transforms[parseVersion(versionString)] = transforms[versionString];
	//}


	function parseVersion(versionString) {
		return parseInt(versionString.substring(1));
	}

	function stringifyVersion(version) {
		return 'v' + version;
	}


	function downgradeData(data, from, to) {
		from = parseVersion(from);
		to = parseVersion(to);
		console.log('transforming data ', from, '  ', to, data);
		for (var version = from; version > to; version--) {
			console.log('performing from ', from, 'to ', to);
			data = transforms['v' + version]['V' + version + 'toV' + (version-1)].transform(data);
		}
		return data;
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
		upgradeData: upgradeData
	};
};