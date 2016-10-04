Sir Transformalot [![npm version](https://badge.fury.io/js/sir-transformalot.svg)](https://badge.fury.io/js/sir-transformalot) [![Build Status](https://travis-ci.org/debitoor/sir-transformalot.svg?branch=master)](https://travis-ci.org/debitoor/sir-transformalot) [![Coverage Status](https://coveralls.io/repos/github/debitoor/sir-transformalot/badge.svg?branch=master)](https://coveralls.io/github/debitoor/sir-transformalot?branch=master) [![dependencies Status](https://david-dm.org/debitoor/sir-transformalot/status.svg)](https://david-dm.org/debitoor/sir-transformalot) [![devDependencies Status](https://david-dm.org/debitoor/sir-transformalot/dev-status.svg)](https://david-dm.org/debitoor/sir-transformalot?type=dev)
===================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

A utility for version transformation of data.

SETUP
=====
You should have `transforms` folder with file `*.js` that represents transform for your entity
Example of transforms file you can find [here](https://github.com/e-conomic/sir-transformalot/blob/master/test/testApp/transforms/entity.js)

Configure transform
==========================
```js
// entity.js
module.exports = {
	v2: {
		V1toV2: {
			transform(data, preparedData) {
				return data;
			},

			// optional
			prepareTransform(id, mongo, callback) {
				mongo.findOne({id}, callback);
			}
		}
	}
}
```
or if you send in the `options` argument:
```js
// entity.js
module.exports = {
	v2: {
		V1toV2: {
			transform(data, preparedData, options) {
				return data;
			},

			// optional
			prepareTransform(id, mongo, options, callback) {
				mongo.findOne({id}, callback);
			}
		}
	}
}
```

Transform for single object
===========================
The `options` argument is optional and allows you to send any additional data in to the transformation that you might need.
```js
transforms.entity.transformObject(id, data, fromVersion, toVersion, mongo, options, callback)
```
Transform for list with streams
===============================
The `options` argument is optional.
```js
var transformStream = transforms.entity.getTransformStream('v3', req.params.version, mongo, options);
pump(db.getDataStream(), transformStream, JSONStream.stringify(), res, function(err) {
	if(err) {
		return next(err);
	};
});
```
