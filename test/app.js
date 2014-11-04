var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

var db = require('./utils/db');

app.get('/ping', function(req, res) {
	return res.json({
		status: 'ok'
	});
});

app.get('/entity/:id/:version', function(req, res) {
	return res.json(db.getEntityById(parseInt(req.params.id)));
});

app.get('/entities/:version', function(req, res) {
	res.header('content-type', 'application/json; charset=utf-8');
	return db.getDataStream().pipe(res);
});

app.post('/entity/:version', function(req, res) {
	return res.json({
		status: 'ok'
	});
});

server.listen(8983);
console.log('Starting test app on http://localhost:8983');