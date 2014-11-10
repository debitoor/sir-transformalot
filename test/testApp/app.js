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
app.get('/entity/:id/:version(v1|v2|v3)', function(req, res) {
	var dataV3 = db.getEntityById(parseInt(req.params.id));
	var endVersionData = transforms.entity.downgradeData(dataV3, 'v3', req.params.version);
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
/////////////////////////

app.get('/entities/:version(v1|v2|v3)', function(req, res) {
	res.header('content-type', 'application/json; charset=utf-8');

	return db.getDataStream({transform: function(){}}).pipe(res);
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