var _ = require('lodash');
var JSONStream = require('JSONStream');
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
	getDataStream: function(options) {
		var transformFunction = (options && options.transform) ? options.transform : function(data) {return data;};
		return es.readArray(getDataArray()).pipe(es.mapSync(transformFunction)).pipe(JSONStream.stringify());
	}
};