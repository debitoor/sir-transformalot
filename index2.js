var _ = require('lodash');
module.exports = function(transforms) {
	var _transforms = {};

	for (versionString in transforms) {
		_transforms[parseVersion(versionString)] = transforms[versionString];
	}



	function parseVersion(versionString) {
		return parseInt(versionString.substring(1));
	}


	function downgradeData(data, version) {
		//should call and downgrade functions for one instance using saved data
	}

	function upgradeData(data, version) {
		//should call and upgrade functions for one instance using saved data
	}

	//function prepareDowngrade(id, version) {
	//	//should call all init upgrade initialize functions and save to status
	//	//if id is not specified - call for all id's
	//}
	//
	//function prepareDowngrade(id, version) {
	//	//should call all init upgrade initialize functions and save to status
	//}

	return {
		//prepareDowngrade: prepareDowngrade,
		//prepareUpgrade: prepareDowngrade,
		downgradeData: downgradeData,
		upgradeData: upgradeData
	};
};