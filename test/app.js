var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

app.get('/ping', function(req, res) {
	return res.json({
		status: 'ok'
	});
});

app.get('/entity/:id/:version', function(req, res) {
	return res.json({
		status: 'ok'
	});
});

app.get('/entities/:version', function(req, res) {
	return res.json({
		status: 'ok'
	});
});

app.post('/entity/:version', function(req, res) {
	return res.json({
		status: 'ok'
	});
});

server.listen(8983);
console.log('Starting test app on http://localhost:8983');