var express = require('express');
var http = require('http');
var db = require('./utils/db');
var bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);
app.use(bodyParser.json());

app.get('/ping', function(req, res) {
	return res.json({
		status: 'ok'
	});
});

var entityConfig = {
	v2: {V1toV2: {transform: function(){}, initialize: function(){}}, V2toV1: function(){}, initialize: function(){}},
	v3: {V2toV3: {transform: function(){}, initialize: function(){}}, V3toV2: function(){}, initialize: function(){}}
};
var patchSystem = transformalot.init(entityConfig);

//Andrii's version
app.get('/entity/:id/:versionTo', function(req, res) {
	var dataV2 = db.getEntityById(parseInt(req.params.id));
	var endVersionData = patchSystem.downgrade(dataV2, req.params.version);
	return res.json(endVersionData);
});

//Allan's version
function getData(version) {
	return function(req,res) {
		var version = getVersionFromURL(req.url);
		var dataV2 = db.getEntityById(parseInt(req.params.id));
		var patch = tansformalot.entity({from: 'v2', to: version});
		return res.json(patch(dataV2));
	}
}

app.get('/entity/:id/v3', getData());
app.get('/entity/:id/v2', getData());
app.get('/entity/:id/v1', getData());
/////////////////////////

app.get('/entities/:version', function(req, res) {
	res.header('content-type', 'application/json; charset=utf-8');
	return db.getDataStream().pipe(res);
});

app.post('/entity/:version', function(req, res) {
	if(req.params.version !== (req.body.version + '')) {
		res.statusCode = 400;
		return res.json({
			msg: 'data format mismatch'
		});
	}
	return res.json({
		status: 'ok'
	});
});

server.listen(8983);
console.log('Starting test app on http://localhost:8983');