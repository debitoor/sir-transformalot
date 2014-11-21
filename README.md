Sir Transformalot
=================

A utility for version transformation of data.

SETUP
=====
You should have `transforms` folder with file `*.js` that represents transform for your entity
Example of transforms file you can find [here](https://github.com/e-conomic/sir-transformalot/blob/master/test/testApp/transforms/entity.js)

Transform for single object
===========================
```js
transforms.entity.transformObject(id, data, fromVersion, toVersion, mongo, callback)
```
Transform for list with streams
===============================
```js
var transformStream = transforms.entity.getTransformStream('v3', req.params.version, mongo);
pump(db.getDataStream(), transformStream, JSONStream.stringify(), res, function(err) {
	if(err) {
		return next(err);
	};
});
```