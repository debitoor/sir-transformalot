var entityNeedingAdditionalDataConfig = {
	v2: {
		V1toV2: {
			transform: function(data, preparedData, additionalData) {
				if (additionalData.someProperty !== 'propertyValue') {
					throw new Error('additionalData was expected to be set');
				}

				data.dataVersion = 2;
				return data;
			},
			prepareTransform: function(id, mongo, additionalData, callback) {
				if (additionalData.someProperty !== 'propertyValue') {
					return callback(new Error('additionalData was expected to be set'));
				}

				return callback(null);
			}
		},
		V2toV1: {
			transform: function(data, preparedData, additionalData) {
				if (additionalData.someProperty !== 'propertyValue') {
					throw new Error('additionalData was expected to be set');
				}

				data.dataVersion = 1;
				return data;
			},
			prepareTransform: function(id, mongo, additionalData, callback) {
				if (additionalData.someProperty !== 'propertyValue') {
					return callback(new Error('additionalData was expected to be set'));
				}

				return callback(null);
			}
		}
	}
};

var transformalot = require('../../../sir-transformalot');
module.exports = transformalot(entityNeedingAdditionalDataConfig);
