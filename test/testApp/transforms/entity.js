var entityConfig = {
	v2: {
		V1toV2: {
			transform: function(data) {
				data.dataVersion = 2;
				return data;
			},
			initialize: function() {

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
			},
			initialize: function( ) {

			}
		}
	}
};
module.exports = entityConfig;