var entityConfig = {
	v2: {
		V1toV2: {
			transform: function(data) {
				data.dataVersion = 2;
				return data;
			},
			initialize: function(callback) {
				var asyncDataFromDb = {
					1: {
						dataFromInitForV1toV2: 'yeap'
					},
					2: {
						dataFromInitForV1toV2: 'nice'
					}
				};

				return callback(null, asyncDataFromDb);
			}
		},
		V2toV1: {
			transform: function(data) {
				data.dataVersion = 1;
				return data;
			},
			initialize: function()  {

			}
		}
	},
	v3: {
		V2toV3: {
			transform: function(data) {
				data.dataVersion = 3;
			},
			initialize: function() {

			}
		},
		V3toV2: {
			transform: function(data) {
				data.dataVersion = 2;
				delete data.fieldFromV3;
				return data;
			},
			initialize: function( ) {

			}
		}
	}
};

var transformalot = require('../../../index2');
module.exports = transformalot(entityConfig);