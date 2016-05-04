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

				var asyncDataFromDb = {
					1: {
						dataFromInitForV1toV2: 'wat'
					},
					2: {
						dataFromInitForV1toV2: 'lol'
					}
				};

				return callback(null, asyncDataFromDb);
			}
		},
		V2toV1: {
			transform: function(data, preparedData, additionalData) {
				if (additionalData.someProperty !== 'propertyValue') {
					throw new Error(ADDITIONAL_DATA_NOT_SET_TEXT);
				}

				data.dataVersion = 1;
				data.dataFromInitForV2toV1 = preparedData[data.id].dataFromInitForV2toV1;
				return data;
			},
			prepareTransform: function(id, mongo, additionalData, callback) {
				if (additionalData.someProperty !== 'propertyValue') {
					return callback(new Error(ADDITIONAL_DATA_NOT_SET_TEXT));
				}

				setTimeout(function() {
					var asyncDataFromDb = {
						1: {
							dataFromInitForV2toV1: 'rly?'
						},
						2: {
							dataFromInitForV2toV1: 'indeed'
						}
					};
					return callback(null, asyncDataFromDb);
				}, 1);
			}
		}
	}
};

var transformalot = require('../../../sir-transformalot');
module.exports = transformalot(entityNeedingAdditionalDataConfig);
