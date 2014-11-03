var request = require('request');
var _ = require('lodash');

global.ensureApp = function() {

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
			url = 'http://127.0.0.1:8893/' + url;
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
			expect(resp.statusCode, {body: resp.body, stack: '\n\n' + location + '\n\n'}).to.equal(statusCode);
			global.responseReturned = resp;
			global.bodyReturned = resp.body;
			return successCallback(resp);
		});
	};
};