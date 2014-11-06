var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);

var db = require('./db');
var transformalot = require('../../index2');
var transforms = require('./transforms');


app.use(bodyParser.json());

app.get('/ping', function(req, res) {
	return res.json({
		status: 'ok'
	});
});

var patchEntitySystem = transformalot(transforms.entity);

//Andrii's version
app.get('/entity/:id/:version', function(req, res) {
	var dataV2 = db.getEntityById(parseInt(req.params.id));
	var endVersionData = patchEntitySystem.downgrade(dataV2, req.params.version);
	return res.json(endVersionData);
});

////Allan's version
function getData() {
	return function(req,res) {
		var version = getVersionFromURL(req.url);
		var dataV2 = db.getEntityById(parseInt(req.params.id));
		var patch = transformalot.entity({from: 'v2', to: version});
		return res.json(patch(dataV2));
	};
}

app.get('/entity/:id/v3', getData());
app.get('/entity/:id/v2', getData());
app.get('/entity/:id/v1', getData());
/////////////////////////

app.get('/entities/:version', function(req, res) {
	res.header('content-type', 'application/json; charset=utf-8');

	return db.getDataStream({transform: patchEntitySystem.getTransform}).pipe(res);
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