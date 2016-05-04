var ADDITIONAL_DATA_NOT_SET_TEXT = 'additionalData was expected to be set';

var entityNeedingAdditionalDataConfig = {
	v2: {
		V1toV2: {
			transform: function(data, preparedData, additionalData) {
				if (additionalData.someProperty !== 'propertyValue') {
					throw new Error(ADDITIONAL_DATA_NOT_SET_TEXT);
				}

				data.dataVersion = 2;
				return data;
			},
			prepareTransform: function(id, mongo, additionalData, callback) {
				if (additionalData.someProperty !== 'propertyValue') {
					return callback(new Error(ADDITIONAL_DATA_NOT_SET_TEXT));
				}

				return callback(null);
			}
		},
		V2toV1: {
			transform: function(data, preparedData, additionalData) {
				if (additionalData.someProperty !== 'propertyValue') {
					throw new Error(ADDITIONAL_DATA_NOT_SET_TEXT);
				}

				data.dataVersion = 1;
				return data;
			},
			prepareTransform: function(id, mongo, additionalData, callback) {
				if (additionalData.someProperty !== 'propertyValue') {
					return callback(new Error(ADDITIONAL_DATA_NOT_SET_TEXT));
				}

				return callback(null);
			}
		}
	}
};

var transformalot = require('../../../sir-transformalot');
module.exports = transformalot(entityNeedingAdditionalDataConfig);
