var _ = require('lodash');
var es = require('event-stream');

function getDataArray(){
	return [
		{
			id: 1,
			dataVersion: 3,
			fieldFromV3: true
		},
		{
			id: 2,
			dataVersion: 3,
			fieldFromV3: true
		}
	];
}

module.exports = {
	getEntityById: function(id) {
		return _.find(getDataArray(), function(el) {return el.id === id;});
	},
	getDataStream: function() {
		return es.readArray(getDataArray());
	}
};