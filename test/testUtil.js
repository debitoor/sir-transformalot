var request = require('request');

var baseURL = "http://localhost:8892/";

function getHttpFunction(method) {
	return function(endpoint, options, callback) {
		if (typeof options === "function") {
			callback = options;
			options = null;
		}
		return request[method](baseURL + endpoint, callback);
	}
}

module.exports = {
	get: getHttpFunction('get')
};