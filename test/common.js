var request = require('request');
var _ = require('lodash');
var chai = require('chai');
var attempt = require('attempt');
chai.config.includeStack = true;
global.expect = chai.expect;

var appStarted = false;

global.ensureApp = function() {

	before(function(done) {
		if (appStarted) {
			return done();
		}

		require('./app');
		attempt({
			interval: 300,
			retries: 4
		}, function() {
			console.log('Trying to reach app..');
			return request.get('http://localhost:8983/ping', this);
		}, function(err, results) {
			if (err) {
				console.log("failed to start app. Attempts: 5");
			}
			console.log('App is up and running!');
			return done(err, results);
		});
	});
};

global.getHttpFunction = function (methodType, headers) {
	return function (url, body, statusCode, callback, successCallback) {
		if (_.isFunction(body) || _.isNumber(body)) {
			successCallback = callback;
			callback = statusCode;
			statusCode = body;
			body = undefined;
		}
		if (_.isFunction(statusCode)) {
			successCallback = callback;
			callback = statusCode;
			statusCode = 200;
		}
		if (!_.isFunction(successCallback)) {
			successCallback = function (resp) {
				return callback(null, resp);
			};
		}
		if (!/^https?:\/\//.test(url)) {
			url = 'http://127.0.0.1:8983/' + url;
		}
		var location = new Error().stack.split('\n')[2];
		return request[methodType]({
			url: url,
			body: body,
			headers: headers,
			json: true,
			strictSSL: false
		}, function (err, resp) {
			if (err) {
				global.bodyReturned = null;
				global.responseReturned = null;
				return callback(err);
			}
			it('should return expected status code', function () {
				expect(resp.statusCode, {body: resp.body, stack: '\n\n' + location + '\n\n'}).to.equal(statusCode);
			});
			global.responseReturned = resp;
			global.bodyReturned = resp.body;
			return successCallback(resp);
		});
	};
};