var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);

var db = require('./db');
var transforms = require('./transforms');
var JSONStream = require('JSONStream');
var pump = require('pump');

app.use(bodyParser.json());

app.get('/ping', function(req, res) {
	return res.json({
		status: 'ok'
	});
});

//Andrii's version
app.get('/entity/:id/:version(v3|v2|v1)', function(req, res) {
	var parsedId = parseInt(req.params.id);
	var dataV3 = db.getEntityById(parsedId);
	transforms.entity.transformObject(parsedId, dataV3, 'v3', req.params.version, 'mongo :p', function(err, endVersionData) { //make options object
		return res.json(endVersionData);
	});
});

app.get('/entities/:version(v3|v2|v1)', function(req, res, next) {
	res.header('content-type', 'application/json; charset=utf-8');
	var mongo = "Yeap, this is mongo :P";
	var transformStream = transforms.entity.getDowngradeStream('v3', req.params.version, mongo);
	pump(db.getDataStream(), transformStream, JSONStream.stringify(), res, function(err) {
		next(err);
	});
});

function dummyVersionValidator(req, res, next) {
	if(req.params.version !== (req.body.version + '')) {
		res.statusCode = 400;
		return res.json({
			msg: 'data format mismatch'
		});
	}
	next();
}

app.post('/entity/:version(v3|v2|v1)', dummyVersionValidator, function(req, res) {
	return res.json({
		status: 'ok'
	});
});

server.listen(8983);
console.log('Starting test app on http://localhost:8983');