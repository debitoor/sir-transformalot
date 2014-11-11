var entityConfig = {
	v2: {
		V1toV2: {
			transform: function(data, preparedData) {
				data.dataVersion = 2;
				data.dataFromInitForV1toV2 = preparedData[data.id].dataFromInitForV1toV2;
				return data;
			},
			prepareUpgrade: function(ids, callback) {
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
			transform: function(data, preparedData) {
				data.dataVersion = 1;
				data.dataFromInitForV2toV1 = preparedData[data.id].dataFromInitForV2toV1;
				return data;
			},
			prepareDowngrade: function(ids, callback) {
				setTimeout(function(){
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
	},
	v3: {
		V2toV3: {
			transform: function(data) {
				data.dataVersion = 3;
			},
			prepareUpgrade: function() {

			}
		},
		V3toV2: {
			transform: function(data, preparedData) {
				data.dataVersion = 2;
				delete data.fieldFromV3;
				data.dataFromInitForV3toV2 = preparedData[data.id].dataFromInitForV3toV2;
				return data;
			},
			prepareDowngrade: function(ids, callback) { //maybe optionalIds
				setTimeout(function(){
					var asyncDataFromDb = {
						1: {
							dataFromInitForV3toV2: 'yeap'
						},
						2: {
							dataFromInitForV3toV2: 'nice'
						}
					};
					return callback(null, asyncDataFromDb);
				}, 1);
			}
		}
	}
};

var transformalot = require('../../../index2');
module.exports = transformalot(entityConfig);