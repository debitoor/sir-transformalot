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

app.get('/entity/:id/:version(v4|v3|v2|v1)', function(req, res, next) {
	var parsedId = parseInt(req.params.id);
	var dataV3 = db.getEntityById(parsedId);
	transforms.entity.transformObject(parsedId, dataV3, 'v3', req.params.version, 'mongo :p', function(err, endVersionData) { //make options object?
		if(err) {
			return next(err);
		}
		return res.json(endVersionData);
	});
});

app.get('/entities/:version(v4|v3|v2|v1)', function(req, res, next) {
	res.header('content-type', 'application/json; charset=utf-8');
	var mongo = "Yeap, this is mongo :P";
	var transformStream = transforms.entity.getTransformStream('v3', req.params.version, mongo);
	pump(db.getDataStream(), transformStream, JSONStream.stringify(), res, function(err) {
		if (err) {
			next(err);
		}
	});
});


app.post('/entity/:version(v4|v3|v2|v1)', function(req, res, next) {
	var parsedId = req.body.id;
	var dataVX = req.body;
	//upgradeData
	transforms.entity.transformObject(parsedId, dataVX, req.params.version, 'v3', 'mongo :p', function(err, endVersionData) {
		if(err) {
			return next(err);
		}
		if (endVersionData.dataVersion !== 3) {
			next(new Error("Oh no... it's not upgraded"));
		}
		//downgrade data
		transforms.entity.transformObject(parsedId, dataVX, 'v3', req.params.version, 'mongo :p', function(err, endVersionData) {
			if(err) {
				return next(err);
			}
			return res.json(endVersionData);
		});
	});
});

app.post('/entityNeedingAdditionalData/:version(v2|v1)', function(req, res, next) {
	var parsedId = req.body.id;
	var dataVX = req.body;
	var additionalData = {
		property1: req.body.additionalData
	};
	//upgradeData
	transforms.entityNeedingAdditionalData.transformObject(parsedId, dataVX, req.params.version, 'v2', 'mongo :p', additionalData, function(err, endVersionData) {
		if(err) {
			return next(err);
		}
		if (endVersionData.dataVersion !== 2) {
			next(new Error("Oh no... it's not upgraded"));
		}
		//downgrade data
		transforms.entityNeedingAdditionalData.transformObject(parsedId, dataVX, 'v2', req.params.version, 'mongo :p', additionalData, function(err, endVersionData) {
			if(err) {
				return next(err);
			}
			return res.json(endVersionData);
		});
	});
});

server.listen(8983);
console.log('Starting test app on http://localhost:8983');
