const entityCheckingCompatibility = {
	v2: {
		V1toV2: {
			transform: function(data, preparedData, options) {
				return data;
			}
		},
		V2toV1: {
			checkCompatibility: function(id, mongo, options, callback) {
				if (options.testDataNotCompatible) {
					return callback(new Error('Data incompatible with old version of endpoint, use new version'));
				}
				callback();
			},
			transform: function(data, preparedData, options) {
				return data;
			}
		}
	}
};

const transformalot = require('../../../sir-transformalot');
module.exports = transformalot(entityCheckingCompatibility);
