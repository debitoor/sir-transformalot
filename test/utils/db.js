var _ = require('lodash');
var JSONStream = require('JSONStream');
var es = require('event-stream');

var data = [
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

module.exports = {
	getEntityById: function(id) {
		return _.find(data, function(el) {return el.id === id;});
	},
	getDataStream: function() {
		return es.readArray(data).pipe(JSONStream.stringify());
	}
};