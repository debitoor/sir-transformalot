var entityNeedingOptionsConfig = {
	v2: {
		V1toV2: {
			transform: function(data, preparedData, options) {
				if (options.someProperty !== 'propertyValue') {
					throw new Error('options was expected to be set');
				}

				data.dataVersion = 2;
				return data;
			},
			prepareTransform: function(id, mongo, options, callback) {
				if (options.someProperty !== 'propertyValue') {
					return callback(new Error('options was expected to be set'));
				}

				return callback(null);
			}
		},
		V2toV1: {
			transform: function(data, preparedData, options) {
				if (options.someProperty !== 'propertyValue') {
					throw new Error('options was expected to be set');
				}

				data.dataVersion = 1;
				return data;
			},
			prepareTransform: function(id, mongo, options, callback) {
				if (options.someProperty !== 'propertyValue') {
					return callback(new Error('options was expected to be set'));
				}

				return callback(null);
			}
		}
	}
};

var transformalot = require('../../../sir-transformalot');
module.exports = transformalot(entityNeedingOptionsConfig);
