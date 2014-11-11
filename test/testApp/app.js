var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);

var db = require('./db');
var transforms = require('./transforms');


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
	transforms.entity.downgradeObject(parsedId, dataV3, 'v3', req.params.version, function(err, endVersionData) { //make options object
		return res.json(endVersionData);
	});
});

////Allan's version
//function getData() {
//	return function(req,res) {
//		var version = getVersionFromURL(req.url);
//		var dataV2 = db.getEntityById(parseInt(req.params.id));
//		var patch = transformalot.entity({from: 'v2', to: version});
//		return res.json(patch(dataV2));
//	};
//}
/////////////////////////

/*
 var transformStream = transforms.entity.getTransformStream('v3', req.params.version);
 return db.getDataStream().pipe(transformStream).pipe(res);
 */

app.get('/entities/:version(v1|v2|v3)', function(req, res, next) {
	res.header('content-type', 'application/json; charset=utf-8');
	transforms.entity.getTransformFunctionForStream('v3', req.params.version, function(err, transformationFunction) {
		return db.getDataStream({transform: transformationFunction}).pipe(res);
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

app.post('/entity/:version', dummyVersionValidator, function(req, res) {
	return res.json({
		status: 'ok'
	});
});

server.listen(8983);
console.log('Starting test app on http://localhost:8983');