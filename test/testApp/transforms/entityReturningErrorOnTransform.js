var entityReturningErrorOnTransform = {
	v2: {
		V1toV2: {
			transform: function(data, preparedData, options) {
				if (data.badInputData) {
					return new Error('bad data V1toV2');
				}
				return data;
			}
		},
		V2toV1: {
			transform: function(data, preparedData, options) {
				if (data.badOutputData) {
					return new Error('bad data V2toV1');
				}
				return data;
			}
		}
	}
};

var transformalot = require('../../../sir-transformalot');
module.exports = transformalot(entityReturningErrorOnTransform);
